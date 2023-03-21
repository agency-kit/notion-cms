import { Client, isFullPage } from "@notionhq/client"
import {PageObjectResponse, GetPageResponse} from '@notionhq/client/build/src/api-endpoints'
import { NotionBlocksHtmlParser } from '@notion-stuff/blocks-html-parser'
import {Blocks} from '@notion-stuff/v4-types'
import type { Cover, CMS, Page, PageContent, RouteObject, Transient, PageObjectTitle, PageObjectRelation, PageObjectUser, PageMultiSelect, pendingEntry} from "./types"
import _ from 'lodash'
import fs from 'fs'
import path, {dirname} from 'path'
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function writeFile(path: string, contents: string) {
  fs.mkdirSync(dirname(path), { recursive: true})
  fs.writeFileSync(path, contents);
}

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
  debug?: boolean,
  refreshTimeout?: number, // in ms
  localCacheDirectory?: string
  rootUrl?: string | URL | undefined // Used to generate full path links,
  limiter?: {schedule: Function} 
}

export default class NotionCMS {
  cms: CMS
  cmsId: string
  notionClient: Client
  parser: NotionBlocksHtmlParser
  pendingEntries: Set<pendingEntry>
  pageRetrievalCache: Record<string, GetPageResponse>
  refreshTimeout: number
  defaultCacheFilename: string
  localCacheDirectory: string
  localCacheUrl: string
  debug: boolean | undefined
  limiter: {schedule: Function} 

  constructor({
    databaseId,
    notionAPIKey,
    debug,
    refreshTimeout,
    localCacheDirectory,
    rootUrl,
    limiter
  }: Options = {databaseId : '', notionAPIKey: '', debug: false, rootUrl: ''}, previousState: string) {
    this.cms = previousState && this.import(previousState) || {
      metadata: {
        databaseId,
        rootUrl: rootUrl ? new URL(rootUrl) : ''
      },
      stages: [],
      routes: [],
      tags: [],
      tagGroups: {},
      transient: {},
      siteData: {}
    }
    this.cmsId = databaseId
    this.notionClient = new Client({
      auth: notionAPIKey
    })
    this.parser = NotionBlocksHtmlParser.getInstance()
    this.pendingEntries = new Set<pendingEntry>()
    this.pageRetrievalCache = {}
    this.refreshTimeout = refreshTimeout || 0
    this.localCacheDirectory = localCacheDirectory || './.notion-cms/'
    this.defaultCacheFilename = `cache.json`
    this.localCacheUrl = path.resolve(__dirname, this.localCacheDirectory + this.defaultCacheFilename)
    this.debug = debug
    this.limiter = limiter || {schedule: (func: Function) => {const result = func(); return Promise.resolve(result)}}

    this.limiter.schedule.bind(limiter)
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

  _isTopLevelDir(response: PageObjectResponse): boolean {
    const parentPage = response?.properties['parent-page'] as PageObjectRelation 
    return _.isEmpty(parentPage.relation)
  }
  
  _getBlockName(response: PageObjectResponse): string {
    const nameProp = response?.properties.name as PageObjectTitle 
    return nameProp.title[0]?.plain_text
  }

  _extractTags(response: PageObjectResponse): Array<string> {
    const tagProp = response?.properties?.Tags as PageMultiSelect
    return tagProp.multi_select.map(multiselect => multiselect.name)
  }

  _assignTagGroup(tag: string, route: string, cms: CMS): void {
    if (!cms.tagGroups[tag]) cms.tagGroups[tag] = []
    cms.tagGroups[tag].push(route)
  }

  _findByKey(object: Record<string, Page>, key: string): Record<string, Page> | undefined {
    let value;
    Object.keys(object).some((k: string) => {
      if (k === key) {
        value = object[k];
        return true;
      }
      if (object[k] && typeof object[k] === 'object') {
        value = this._findByKey(object[k] as Record<string, Page>, key);
        return value !== undefined;
      }
    });
    return value;
  }

  _getCoverImage(page: PageObjectResponse, source: string): URL {
    const pageCoverProp = (page as PageObjectResponse)?.cover as Cover
    let coverImage;
    if (pageCoverProp && 'external' in pageCoverProp) {
      coverImage = pageCoverProp?.external?.url
    } else if (pageCoverProp?.file){
      coverImage = pageCoverProp?.file.url
    } else {
     coverImage = source.match(COVER_IMAGE_REGEX)?.[1]
    }
    return coverImage
  }

  async _pullPageContent(id: string, cms: CMS): Promise<PageContent> {
    let page
    const tags = [] as Array<string>
    page = await this._retrievePage(id)
  
    const pageContent = await this.limiter.schedule(
      async () => await this.notionClient.blocks.children.list({
        block_id: id,
        page_size: 50,
      })
    )
    const name = this._getBlockName(page as PageObjectResponse).slug
    const parsed = this.parser.parse(pageContent.results as Blocks)

    // Fall back to the first image in the page if one exists.
    if (isFullPage(page as PageObjectResponse)) {
      const coverImage = this._getCoverImage(page as PageObjectResponse, parsed)
      const extractedTags = this._extractTags(page as PageObjectResponse)
      extractedTags.forEach(tag => {
        tags.push(tag)
        if (!_.includes(cms.tags, tag)) cms.tags.push(tag)
        this._assignTagGroup(tag, name.route, cms)
      })
      return {
        name,
        tags,
        coverImage,
        content: parsed
      }
    } else return {
      name: '',
      tags: [],
      coverImage: new URL(''),
      content: ''
    }
  }

  _findInPending(entry: Transient) {
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
      parentPage = await this.limiter.schedule(
        async () => await this.notionClient.pages.retrieve({ page_id: id })
      )
      this.pageRetrievalCache[id] = parentPage
    }
    return parentPage
  }

  async _addPage(entry: Transient, id:string, siteData: CMS['siteData']): Promise<void> {
    let page, name, authors, parentPage, parentName, updateObject;
    const parentId = entry.parentPage

    if (parentId){
      parentPage = await this._retrievePage(parentId)
    }
    page = await this._retrievePage(id)
    if (page && isFullPage(page)) {
      name = this._getBlockName(page).slug.route
      const authorProp = page.properties?.Author as PageObjectUser
      const authorIds = authorProp['people']
      authors = authorIds.map(authorId => authorId.name)
      entry['name'] = name
      if (parentPage && isFullPage(parentPage)) {
        parentName = this._getBlockName(parentPage).slug.route
        updateObject = this._findByKey(siteData, parentName)
      } else {
        updateObject = siteData
      }
    }

    if (updateObject && name) {
      if (!updateObject[name]) updateObject[name] = {authors} as Page
      const match = this._findInPending(entry)
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
          id,
          entry
        })
      }
    }
  }

  async _getAuthorData(authorIds: Array<string>): Promise<Array<string>> {
   let authors;
    if (authorIds?.length) {
      authors = await Promise.all(
        authorIds.map(async (authorId: string) => {
        return await this.limiter.schedule(
            async () => await this.notionClient.users.retrieve({ user_id: authorId })
          )
        })
      ).then(res => {
        if (res?.length) {
          return res.map(author => author.name as string)
        }
      })
      return authors || []
    }
    return []
  }

  async _getPageContent(state: CMS): Promise<CMS> {
    let stateWithContent = _.cloneDeep(state)
    if (!stateWithContent.transient) return stateWithContent
    for await (const [idx, entry] of Object.entries(stateWithContent.transient)) {
      let updateObject = this._findByKey(stateWithContent.siteData, entry.name) as Page
      const content = await this._pullPageContent(idx, stateWithContent)
      updateObject.name = content.name
      updateObject.tags = content.tags
      updateObject.coverImage = content.coverImage
      updateObject.content = content.content
    }
    stateWithContent.stages.push('content')
    return stateWithContent
  }

  async _getPages(state: CMS): Promise<CMS> {
    let stateWithPages = _.cloneDeep(state)
    if (!stateWithPages.transient) return stateWithPages
    for await (const [id, entry] of Object.entries(stateWithPages.transient)) {
      await this._addPage(entry, id, stateWithPages.siteData)
    }
    while (this.pendingEntries.size) {
      for await (const pendingEntry of this.pendingEntries) {
        await this._addPage(pendingEntry.entry, pendingEntry.id, stateWithPages.siteData)
      }
    }
    stateWithPages.stages.push('pages')
    return stateWithPages
  }

  async _getDb(state: CMS): Promise<CMS> {
    let stateWithDb = _.cloneDeep(state)
    if (!stateWithDb.transient) return stateWithDb
    const db = await this.limiter.schedule(
      async () => await this.notionClient.databases.query({database_id: state.metadata.databaseId})
    )
    for await (const entry of db.results as PageObjectResponse[]) {
      // Fetch page: parent-page relationship here and store in transient object.
      let transient = stateWithDb.transient[entry.id] = {name: '', parentPage: ''}
      const parentPage = entry.properties['parent-page'] as PageObjectRelation
      if (parentPage) transient['parentPage'] = parentPage.relation[0]?.id
    }
    stateWithDb.stages.push('db')
    return stateWithDb
  }

  async fetch(): Promise<CMS> {
    let cachedCMS
    if (fs.existsSync(this.localCacheUrl)) {
      cachedCMS = this.import(fs.readFileSync(this.localCacheUrl, 'utf-8'))
    }
    // Use refresh time to see if we should return local env cache or fresh api calls from Notion
    if (cachedCMS && cachedCMS.lastUpdateTimestamp &&
        Date.now() < (cachedCMS.lastUpdateTimestamp + this.refreshTimeout)) {
        if(this.debug) console.log('using cache')
        this.cms = cachedCMS
    } else {
      if(this.debug) console.log('using API')
      // For now clear the cache anytime we re-run the fetch. In the future we want to make the cache clearing dynamically based on 
      // an AgencyKit API flag.
      this._clearPageRetrievalCache()
      if (!_.includes(this.cms.stages, 'db')) {
        this.cms = await this._getDb(this.cms)
      }
      if (!_.includes(this.cms.stages, 'pages')) {
        this.cms = await this._getPages(this.cms)
      }
      if (!_.includes(this.cms.stages, 'content')) {
        this.cms = await this._getPageContent(this.cms)
        this.cms.stages.push('complete')
        delete this.cms['transient']
      }
      if (this.cms.stages, 'complete') {
        writeFile(this.localCacheUrl, this.export())
      }
    }
    void this.routes
    if (this.debug) writeFile('debug/site-data.json', JSON.stringify(this.cms))
    return this.cms
  }

  getTaggedCollection(tags: string | Array<string>): Array<Record<string, Page> | undefined> {
    if (!_.isArray(tags)) tags = [tags]
    const taggedPages = []
    for (const tag of tags) {
      taggedPages.push(...this.cms.tagGroups[tag])
    }
    return _(taggedPages).map(page => this._findByKey(this.cms.siteData, page)).uniq().value()
  }

  filterSubPages(page: Page) {
    return Object.entries(page)
      .filter(([key]) => key.startsWith('/'))
      .map(_.constant)
  }

  export() {
    this.cms.lastUpdateTimestamp = Date.now()
    return JSON.stringify(this.cms)
  }

  import(previousState: string): CMS {
    return JSON.parse(previousState)
  }
}
