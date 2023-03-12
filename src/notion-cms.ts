import { Client, isFullPage } from "@notionhq/client"
import {PageObjectResponse, UserObjectResponse, GetPageResponse} from '@notionhq/client/build/src/api-endpoints'
import { NotionBlocksHtmlParser } from '@notion-stuff/blocks-html-parser'
import {Blocks} from '@notion-stuff/v4-types'
import type { PageEntry, CMS, PageContent, RouteObject, Cover, PageObjectTitle, PageObjectRelation, PageObjectUser} from "./types"
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

interface Options {
  databaseId: string,
  notionAPIKey: string,
}

export default class NotionCMS {
  cms: CMS
  cmsId: string
  notionClient: Client
  parser: NotionBlocksHtmlParser
  pendingEntries: Set<PageEntry>
  pageRetrievalCache: Record<string, GetPageResponse>

  constructor({databaseId, notionAPIKey}: Options = {databaseId : '', notionAPIKey: ''}) {
    this.cms = {
      metadata: {},
      routes: [],
      tags: [],
      tagGroups: {},
      siteData: {}
    }
    this.cmsId = databaseId
    this.notionClient = new Client({
      auth: notionAPIKey
    })
    this.parser = NotionBlocksHtmlParser.getInstance()
    this.pendingEntries = new Set<PageEntry>()
    this.pageRetrievalCache = {}
  }

  get data() {
    if (_.isEmpty(this.cms.siteData)) return
    return this.cms.siteData
  }

  get routes() {
    if (_.isEmpty(this.cms.siteData)) return
    if (this.toplevelDirectories) {
      this.cms.routes = []
      this.toplevelDirectories.forEach(tld => {
        this.cms.routes.push(this._genRoutes(tld))
      })
      return this.cms.routes = this.cms.routes.flat()
    }
  }

  get toplevelDirectories() {
    if (_.isEmpty(this.cms.siteData)) return
    return Object.entries(this.cms.siteData)
  }

  _genRoutes(directory: RouteObject): Array<string> {
    const results = []
    const routePart = directory[0]
    const routeChildren = _(directory[1]).pickBy((value, key) => _.startsWith(key, '/')).entries().value()
    if (!routeChildren.length) return [routePart]
    routeChildren.forEach(childDirectory => {
      const childRes = this._genRoutes(childDirectory)
      if (childRes.length) {
        childRes.forEach(res => results.push(routePart + res))
      } else {
        results.push(routePart + childRes)
      }
    })
    results.push(routePart)
    return results
  }

  _clearPageRetrievalCache(): void {
    this.pageRetrievalCache = {}
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
      page = await this._retrievePage(subPage.id)
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

  _findInPending(entry: PageObjectResponse, pendingEntries: Set<PageEntry>) {
    let match
    this.pendingEntries.forEach(pendingEntry => {
      if (entry === pendingEntry.entry) {
        match = pendingEntry
      }
    })
    return match
  }

  async _retrievePage(id: string): Promise<GetPageResponse> {
    let parentPage = this.pageRetrievalCache[id]
    // Check cache before making this call.
    if (!parentPage) {
      parentPage = await this.notionClient.pages.retrieve({ page_id: id })
      this.pageRetrievalCache[id] = parentPage
    }
    return parentPage
  }

  async _addSubPage(entry: PageObjectResponse): Promise<void> {
    const parentPageProp = entry.properties['parent-page'] as PageObjectRelation
    const parent = parentPageProp.relation[0]
    let parentPage = await this._retrievePage(parent.id)

    if (isFullPage(parentPage)) {
      const parentName = this._getBlockName(parentPage).slug.route
      const updateKey = this._findKey(this.cms.siteData, parentName)
  
      if (updateKey) {
        const content = await this._getPageContent(entry)
        if (!updateKey[content.name.route]) updateKey[content.name.route] = content
  
        const match = this._findInPending(entry, this.pendingEntries)
        if (match) this.pendingEntries.delete(match)
      } else {
        let shouldAdd = true
        for (const pendingEntry of this.pendingEntries) {
          if (_.isEqual(entry, pendingEntry.entry)) {
            shouldAdd = false; break;
          };
        }
        if (shouldAdd) {
          this.pendingEntries.add({
            parentName,
            entry
          })
        }
      }
    }
  }

  async fetch(): Promise<CMS> {
    // For now clear the cache anytime we re-run the fetch. In the future we want to make the cache clearing dynamically based on 
    // an AgencyKit API flag.
    this._clearPageRetrievalCache()
    const db = await this.notionClient.databases.query({
      database_id: this.cmsId,
    });
  
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
        await this._addSubPage(entry)
      }
    }

    while (this.pendingEntries.size) {
      console.log('trigger while', this.pendingEntries.size)
      for await (const pendingEntry of this.pendingEntries) {
        console.log(pendingEntry.parentName)
        await this._addSubPage(pendingEntry.entry)
        fs.writeFileSync('debug/site-data.json', JSON.stringify(this.cms.siteData))
      }
    }
    console.log('complete')
    return this.cms
  }
}