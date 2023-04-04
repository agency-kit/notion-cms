import { Client, isFullPage } from "@notionhq/client"
import {
  PageObjectResponse,
  SelectPropertyItemObjectResponse
} from '@notionhq/client/build/src/api-endpoints'
import { NotionBlocksHtmlParser } from '@notion-stuff/blocks-html-parser'
import { Blocks } from '@notion-stuff/v4-types'
import type {
  Cover,
  Options,
  CMS,
  Page,
  RouteObject,
  PageObjectTitle,
  PageObjectRelation,
  PageObjectUser,
  PageMultiSelect,
  PageRichText,
  Plugin
} from "./types"
import _ from 'lodash'
import fs from 'fs'
import path, { dirname } from 'path'
import { fileURLToPath } from 'url';
import { WalkBuilder } from 'walkjs'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function writeFile(path: string, contents: string): void {
  fs.mkdirSync(dirname(path), { recursive: true })
  fs.writeFileSync(path, contents);
}

const COVER_IMAGE_REGEX = /<figure notion-figure>[\s\S]+<img[^>]*src=['|"](https?:\/\/[^'|"]+)(?:['|"])/

Object.defineProperty(String.prototype, "slug", {
  get: function () {
    return _.kebabCase(this)
  }
})

Object.defineProperty(String.prototype, "route", {
  get: function (separator = "/") {
    return this.padStart(this.length + 1, separator)
  }
})

export default class NotionCMS {
  cms: CMS
  cmsId: string
  notionClient: Client
  parser: NotionBlocksHtmlParser
  refreshTimeout: number
  draftMode: boolean
  defaultCacheFilename: string
  localCacheDirectory: string
  localCacheUrl: string
  debug: boolean | undefined
  limiter: { schedule: Function }
  plugins: Array<Plugin> | undefined

  constructor({
    databaseId,
    notionAPIKey,
    debug,
    draftMode,
    refreshTimeout,
    localCacheDirectory,
    rootUrl,
    limiter,
    plugins
  }: Options = { databaseId: '', notionAPIKey: '', debug: false, rootUrl: '', draftMode: false }, previousState: string) {
    this.cms = previousState && this.import(previousState) || {
      metadata: {
        databaseId,
        rootUrl: rootUrl || ''
      },
      stages: [],
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
    this.refreshTimeout = refreshTimeout || 0
    this.draftMode = draftMode || false
    this.localCacheDirectory = localCacheDirectory || './.notion-cms/'
    this.defaultCacheFilename = `cache.json`
    this.localCacheUrl = path.resolve(__dirname, this.localCacheDirectory + this.defaultCacheFilename)
    this.debug = debug
    this.limiter = limiter || { schedule: (func: Function) => { const result = func(); return Promise.resolve(result) } }
    this.plugins = plugins
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

  async _runPlugins(context: Blocks | CMS, hook: 'pre-tree' | 'pre-parse' | 'post-parse' | 'post-tree')
    : Promise<Blocks | string | CMS> {
    if (!this.plugins?.length) return context
    let val = context
    for (const plugin of this.plugins) {
      if (plugin.hook === hook) {
        // pass in previous plugin output
        val = await plugin.exec(val)
      }
    }
    return val
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

  _isTopLevelDir(response: PageObjectResponse): boolean {
    const parentPage = response?.properties['parent-page'] as PageObjectRelation
    return _.isEmpty(parentPage.relation)
  }

  _getParentPageId(response: PageObjectResponse): string {
    const parentPage = response?.properties['parent-page'] as PageObjectRelation
    return parentPage.relation[0].id
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

  _getCoverImage(page: PageObjectResponse): string {
    const pageCoverProp = (page as PageObjectResponse)?.cover as Cover
    let coverImage;
    if (pageCoverProp && 'external' in pageCoverProp) {
      coverImage = pageCoverProp?.external?.url
    } else if (pageCoverProp?.file) {
      coverImage = pageCoverProp?.file.url
    }
    return coverImage
  }

  async _pullPageContent(id: string): Promise<string> {
    const pageContent = await this.limiter.schedule(
      async () => await this.notionClient.blocks.children.list({
        block_id: id,
        page_size: 50,
      })
    )

    const results = await this._runPlugins(pageContent.results, 'pre-parse')
    const parsedBlocks = this.parser.parse(results as Blocks)
    const html = await this._runPlugins(parsedBlocks, 'post-parse') as string
    return html
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

  async _crawlRoutes(tree: Object, fn: Function): Promise<void> {
    for (const node of _.entries(tree)) {
      const [key, value] = node
      if (_.startsWith(key, '/')) {
        if (this.debug) console.log(key, 'currently updating')
        await fn(node)
        await this._crawlRoutes(value, fn)
      }
    }
  }

  async _getPageContent(state: CMS): Promise<CMS> {
    let stateWithContent = _.cloneDeep(state)
    // can this async recursion be more performant?
    await this._crawlRoutes(stateWithContent.siteData, async (node: Array<string | Page>) => {
      let content
      const [key, value] = node
      let updateObject =
        typeof key === 'string' ?
          this._findByKey(stateWithContent.siteData, key) as Page :
          undefined
      if (typeof value !== 'string' && value._notion) {
        content = await this._pullPageContent(value._notion.id)
      }
      if (updateObject) {
        const path = this._getFullPath(key as string)
        updateObject.path = path
        updateObject.url = this.cms.metadata.rootUrl && path ? this.cms.metadata.rootUrl + path : ''
        if (content) {
          updateObject.content = content
          // Add path to content - can't do it before because siteData doesn't exist.
          // In case there was no cover image property, lets fall back to the first image in the html 
          if (updateObject?.coverImage === undefined) {
            const imageUrl = content.match(COVER_IMAGE_REGEX)?.[1]
            updateObject.coverImage = imageUrl || undefined
          }
        }
      }
    })

    stateWithContent.stages.push('content')
    stateWithContent = await this._runPlugins(stateWithContent, 'post-tree') as CMS
    return stateWithContent
  }

  _getFullPath(key: string) {
    let path
    const matchNode = this._findByKey(this.cms.siteData, key)
    new WalkBuilder()
      .withGlobalFilter(node => typeof node?.key === 'string' && node?.key?.startsWith('/'))
      .withSimpleCallback(node => {
        if (node.val == matchNode) path = node.getPath(node => `${node.key}`)
      })
      .walk(this.cms.siteData)
    return path
  }

  _getPageUpdate(entry: PageObjectResponse, cms: CMS): Array<string | Page> {
    const tags = [] as Array<string>
    if (isFullPage(entry as PageObjectResponse)) {
      const name = this._getBlockName(entry)
      const route = name.slug.route

      const authorProp = entry.properties?.Author as PageObjectUser
      const authors = authorProp['people'].map(authorId => authorId.name)

      const metaTitleProp = entry.properties?.metaTitle as PageRichText
      const metaTitle = metaTitleProp?.rich_text[0]?.plain_text

      const metaDescriptionProp = entry.properties?.metaDescription as PageRichText
      const metaDescription = metaDescriptionProp?.rich_text[0]?.plain_text

      const coverImage = this._getCoverImage(entry as PageObjectResponse)
      const extractedTags = this._extractTags(entry as PageObjectResponse)
      extractedTags.forEach(tag => {
        tags.push(tag)
        if (!_.includes(cms.tags, tag)) cms.tags.push(tag)
        this._assignTagGroup(tag, name.slug.route, cms)
      })
      return [
        route,
        {
          name,
          metaTitle,
          metaDescription,
          slug: name.slug,
          authors,
          tags,
          coverImage,
          _notion: {
            id: entry.id,
            last_edited_time: entry.last_edited_time,
          }
        }]
    }
    return []
  }

  async _getDb(state: CMS): Promise<CMS> {
    let stateWithDb = _.cloneDeep(state)
    let entryPool = {} as { [x: string]: Object }
    const db = await this.limiter.schedule(
      async () => await this.notionClient.databases.query({ database_id: state.metadata.databaseId })
    )
    const publishedFilter = (e: PageObjectResponse) => {
      const publishProp = e.properties['Published'] as SelectPropertyItemObjectResponse
      return this.draftMode ? true : publishProp.select && publishProp.select.name === 'Published'
    }

    const tlds: PageObjectResponse[] = _(db.results).filter(this._isTopLevelDir).filter(publishedFilter).value()
    let subPages: PageObjectResponse[] = _.reject(db.results, this._isTopLevelDir).filter(publishedFilter)

    tlds.forEach(directory => {
      const [route, update] = this._getPageUpdate(directory, stateWithDb)
      if (typeof route === 'string') stateWithDb.siteData[route] = update as Page
    })

    do {
      for (const subPage of subPages) {
        let remove = false
        const [route, update] = this._getPageUpdate(subPage as PageObjectResponse, stateWithDb)
        const parentId = this._getParentPageId(subPage)
        const parent = _.find(db.results, result => result.id === parentId)
        const parentRoute = this._getBlockName(parent).slug.route
        const updateObject = this._findByKey(stateWithDb.siteData, parentRoute)
        if (typeof route === 'string') {
          if (updateObject) {
            updateObject[route] = update as Page
            remove = true
          } else {
            entryPool[route] = update
            for (const storedEntry of _.entries(entryPool)) {
              const [key, value] = storedEntry
              if (key === parentRoute) {
                _.assign(value, update)
                remove = true
              } else {
                const updateObject = this._findByKey(value as Record<string, Page>, parentRoute)
                if (updateObject) {
                  updateObject[route] = update as Page
                  remove = true
                }
              }
            }
          }
        }
        if (remove) subPages = _.pull(subPages, subPage)
      }
    } while (subPages.length)

    stateWithDb.stages.push('db')
    stateWithDb = await this._runPlugins(stateWithDb, 'pre-tree') as CMS
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
      if (this.debug) console.log('using cache')
      this.cms = cachedCMS
    } else {
      if (this.debug) console.log('using API')
      // For now clear the cache anytime we re-run the fetch. In the future we want to make the cache clearing dynamically based on 
      // an AgencyKit API flag.
      if (!_.includes(this.cms.stages, 'db')) {
        this.cms = await this._getDb(this.cms)
      }
      if (!_.includes(this.cms.stages, 'content')) {
        this.cms = await this._getPageContent(this.cms)
        this.cms.stages.push('complete')
      }
      if (_.includes(this.cms.stages, 'complete')) {
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

  filterSubPages(key: string | Page): Array<Page> {
    let page
    if (typeof key === 'string') {
      page = this._findByKey(this.cms.siteData, key)
    }
    return Object.entries(page || key)
      .filter(([key]) => key.startsWith('/'))
      .map(e => e[1])
  }

  queryByPath(path: string): Page {
    const segments = path.split('/').slice(1)
    let access: Page = this.cms.siteData
    for (const segment of segments) {
      //@ts-ignore-next-line
      access = access['/' + segment]
    }
    return access
  }

  export() {
    this.cms.lastUpdateTimestamp = Date.now()
    return JSON.stringify(this.cms)
  }

  import(previousState: string): CMS {
    return JSON.parse(previousState)
  }
}
