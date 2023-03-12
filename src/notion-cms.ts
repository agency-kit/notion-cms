import { Client, isFullPage } from "@notionhq/client"
import {PageObjectResponse,
  DatabaseObjectResponse, 
  TextRichTextItemResponse} from '@notionhq/client/build/src/api-endpoints'
import { NotionBlocksHtmlParser } from '@notion-stuff/blocks-html-parser'
import {Blocks} from '@notion-stuff/v4-types'
import type { PageEntry, CMS, PageContent, TitleDatabasePropertyConfigResponse} from "./types"
import _ from 'lodash'
import fs from 'fs'

Object.defineProperty(String.prototype, "slug", {
  get: function() {
    return _.kebabCase(this)
  }
})

Object.defineProperty(String.prototype, "route", {
  get: function(separator = "/") {
    return this.padStart(this.length + 1, separator)
  }
})

export default class NotionCMS {
  cms: CMS
  cmsId: string
  notionClient: Client
  parser: NotionBlocksHtmlParser

  constructor(databaseID, notionAPIKey) {
    this.cms = {
      metadata: {},
      routes: [],
      siteData: {}
    }
    this.cmsId = databaseID
    this.notionClient = new Client({
      auth: notionAPIKey
    })
    this.parser = NotionBlocksHtmlParser.getInstance()
  }

  _isTopLevelDir (response: DatabaseObjectResponse | PageObjectResponse): boolean {
    return _.isEmpty(response?.properties['parent-page']['relation'])
  }
  
  _getBlockName(response: DatabaseObjectResponse | PageObjectResponse): string {
    return ((response?.properties.name['title'] as TitleDatabasePropertyConfigResponse)['title'][0] as TextRichTextItemResponse)?.plain_text
  }

  async _getAuthorData(page: PageObjectResponse): Promise<Array<string>> {
    const authorIds = page.properties?.Author?.['people']
    let authors;
    if (authorIds?.length) {
      authors = await Promise.all(
        authorIds.map(async (author) => await this.notionClient.users.retrieve({ user_id: author.id }))
      ).then(res => {
        if (res?.length) {
          return res.map(author => author.name)
        }
      })
    }
    return authors
  }

  _findKey(object: object, key: string): object {
    let value;
    Object.keys(object).some(function (k) {
      if (k === key) {
        value = object[k];
        return true;
      }
      if (object[k] && typeof object[k] === 'object') {
        value = this._findKey(object[k], key);
        return value !== undefined;
      }
    });
    return value;
  }

  async _getPageContent(subPage: PageObjectResponse): Promise<PageContent> {
    let page;
    if (subPage.object === 'page') {
      page = subPage
    } else {
      page = await this.notionClient.pages.retrieve({
        page_id: subPage.id
      })
    }
  
    const pageContent = await this.notionClient.blocks.children.list({
      block_id: subPage.id,
      page_size: 50,
    })
  
    const parsed = this.parser.parse(pageContent.results as Blocks)
  
    const coverImageRegex = /<figure notion-figure>[\s\S]+<img[^>]*src=['|"](https?:\/\/[^'|"]+)(?:['|"])/
  
    // Fall back to the first image in the page if one exists.
  
    const coverImage = page && page?.cover?.external?.url || page?.cover?.file.url || parsed.match(coverImageRegex)?.[1]
  
    return {
      name: this._getBlockName(page).slug,
      authors: await this._getAuthorData(page),
      coverImage,
      content: parsed
    }
  }

  async fetchCms(): Promise<CMS> {
    const db = await this.notionClient.databases.query({
      database_id: this.cmsId,
    });
  
    const pendingEntries = new Set<PageEntry>()
  
    const findInPending = (entry, pendingEntries) => {
      let match
      pendingEntries.forEach(pendingEntry => {
        if (entry === pendingEntry.entry) {
          match = pendingEntry
        }
      })
      return match
    }
  
    const addSubPage = async (entry: PageObjectResponse): Promise<void> => {
      const parent = entry.properties['parent-page']['relation'][0]
      // how to avoid this async call? It causes the process to take quite a long time.
      const parentPage = await this.notionClient.pages.retrieve({ page_id: parent.id })
      if (isFullPage(parentPage)) {
        const parentName = this._getBlockName(parentPage).slug.route
        const updateKey = this._findKey(this.cms.siteData, parentName)
    
        if (updateKey) {
          const content = await this._getPageContent(entry)
          if (!updateKey[content.name.route]) updateKey[content.name.route] = content
    
          const match = findInPending(entry, pendingEntries)
          pendingEntries.delete(match)
        } else {
          let shouldAdd = true
          for (const pendingEntry of pendingEntries) {
            if (_.isEqual(entry, pendingEntry.entry)) {
              shouldAdd = false; break;
            };
          }
          if (shouldAdd) {
            pendingEntries.add({
              parentName,
              entry
            })
          }
        }
      }
    }
  
    for await (const entry of db.results as PageObjectResponse[]) {
      if (this._isTopLevelDir(entry)) {
        const content = await this._getPageContent(entry)
        const currentDir = this.cms.siteData[this._getBlockName(entry).slug.route] = { ...content }
        if (entry.properties['sub-page']['relation'].length) {
          for await (const subPage of entry.properties['sub-page']['relation']) {
            const content = await this._getPageContent(subPage)
            currentDir[content.name.route] = content
          }
        }
      } else {
        await addSubPage(entry)
      }
    }
    while (pendingEntries.size) {
      console.log('trigger while', pendingEntries.size)
      for await (const pendingEntry of pendingEntries) {
        console.log(pendingEntry.parentName)
        await addSubPage(pendingEntry.entry)
        fs.writeFileSync('debug/site-data.json', JSON.stringify(this.cms.siteData))
      }
    }
    console.log('complete')
    return this.cms
  }


}