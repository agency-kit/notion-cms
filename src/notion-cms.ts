import { Client, isFullPage } from "@notionhq/client"
import {PageObjectResponse,
  DatabaseObjectResponse, 
  TextRichTextItemResponse, UserObjectResponse} from '@notionhq/client/build/src/api-endpoints'
import { NotionBlocksHtmlParser } from '@notion-stuff/blocks-html-parser'
import {Blocks} from '@notion-stuff/v4-types'
import type { PageEntry, CMS, PageContent, Page, Route, Cover, PageObjectTitle, PageObjectRelation, PageObjectUser} from "./types"
import _ from 'lodash'
import fs from 'fs'

const COVER_IMAGE_REGEX = /<figure notion-figure>[\s\S]+<img[^>]*src=['|"](https?:\/\/[^'|"]+)(?:['|"])/


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

  constructor(databaseID: string, notionAPIKey: string) {
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

  _isTopLevelDir (response: PageObjectResponse): boolean {
    const parentPage = response?.properties['parent-page'] as PageObjectRelation 
    return _.isEmpty(parentPage.relation)
  }
  
  _getBlockName(response: PageObjectResponse): string {
    const nameProp = response?.properties.name as PageObjectTitle 
    return nameProp.title[0]?.plain_text
  }

  async _getAuthorData(page: PageObjectResponse): Promise<Array<string>> {
    const authorProp = page.properties?.Author as PageObjectUser
    const authorIds = authorProp['people']
    let authors;
    if (authorIds?.length) {
      authors = await Promise.all(
        authorIds.map(async (author: UserObjectResponse) => await this.notionClient.users.retrieve({ user_id: author.id }))
      ).then(res => {
        if (res?.length) {
          return res.map(author => author.name as string)
        }
      })
      return authors || []
    }
    return []
  }

  _findKey(object: Record<string, object>, key: string): Record<string, object> | undefined {
    let value;
    Object.keys(object).some((k: string) => {
      if (k === key) {
        value = object[k];
        return true;
      }
      if (object[k] && typeof object[k] === 'object') {
        value = this._findKey(object[k] as Record<string, object>, key);
        return value !== undefined;
      }
    });
    return value;
  }

  async _getPageContent(subPage: PageObjectResponse | PageObjectRelation): Promise<PageContent> {
    let page;
    if ((subPage as PageObjectResponse)?.object === 'page') {
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
  
    // Fall back to the first image in the page if one exists.
    if (isFullPage(page as PageObjectResponse)) {
      const pageCoverProp = (page as PageObjectResponse)?.cover as Cover
      let coverImage;
      if (pageCoverProp && 'external' in pageCoverProp) {
        coverImage = pageCoverProp?.external?.url
      } else if (pageCoverProp?.file){
        coverImage = pageCoverProp?.file.url 
      } else {
       coverImage = parsed.match(COVER_IMAGE_REGEX)?.[1]
      }
  
      return {
        name: this._getBlockName(page as PageObjectResponse).slug,
        authors: await this._getAuthorData(page as PageObjectResponse),
        coverImage,
        content: parsed
      }
    } else return {
      name: '',
      authors: [],
      coverImage: new URL(''),
      content: ''
    }
  }

  async fetchCms(): Promise<CMS> {
    const db = await this.notionClient.databases.query({
      database_id: this.cmsId,
    });
  
    const pendingEntries = new Set<PageEntry>()
  
    const findInPending = (entry: PageObjectResponse, pendingEntries: Set<PageEntry>) => {
      let match
      pendingEntries.forEach(pendingEntry => {
        if (entry === pendingEntry.entry) {
          match = pendingEntry
        }
      })
      return match
    }
  
    const addSubPage = async (entry: PageObjectResponse): Promise<void> => {
      const parentPageProp = entry.properties['parent-page'] as PageObjectRelation
      const parent = parentPageProp.relation[0]
      // how to avoid this async call? It causes the process to take quite a long time.
      const parentPage = await this.notionClient.pages.retrieve({ page_id: parent.id })
      if (isFullPage(parentPage)) {
        const parentName = this._getBlockName(parentPage).slug.route
        const updateKey = this._findKey(this.cms.siteData, parentName)
    
        if (updateKey) {
          const content = await this._getPageContent(entry)
          if (!updateKey[content.name.route]) updateKey[content.name.route] = content
    
          const match = findInPending(entry, pendingEntries)
          if (match) pendingEntries.delete(match)
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
        const subPageProp = entry.properties['sub-page'] as PageObjectRelation
        if (subPageProp.relation.length) {
          for await (const subPage of subPageProp.relation as PageObjectRelation[]) {
            const content = await this._getPageContent(subPage)
            // @ts-ignore This one is annoying - it doesn't like the Route Type even thought it is correct. I am sure I am smarter than the TS compiler.
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