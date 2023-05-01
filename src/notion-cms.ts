import { Client, isFullPage, LogLevel } from "@notionhq/client"
import {
  ListBlockChildrenResponse,
  PageObjectResponse,
  SelectPropertyItemObjectResponse
} from '@notionhq/client/build/src/api-endpoints'
import { Blocks } from '@notion-stuff/v4-types'
import type {
  Cover,
  Options,
  CMS,
  Page,
  PageObjectTitle,
  PageObjectRelation,
  PageObjectUser,
  PageMultiSelect,
  Plugin,
  UnsafePlugin,
  PluginPassthrough,
  PageContent,
  FlatList,
  FlatListItem
} from "./types"
import _ from 'lodash'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url';
import { AsyncCallbackFn, AsyncWalkBuilder, WalkBuilder, WalkNode } from 'walkjs'
import {
  filterAncestors,
  JSONStringifyWithFunctions,
  JSONParseWithFunctions,
  writeFile,
  slugify,
  routify
} from './utilities'

import renderer from "./plugins/render"

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const COVER_IMAGE_REGEX = /<figure notion-figure>[\s\S]+<img[^>]*src=['|"](https?:\/\/[^'|"]+)(?:['|"])/

const STEADY_PROPS = [
  "name",
  "Author",
  "Published",
  "Tags",
  "publishDate",
  "parent-page",
  "sub-page"
]

export default class NotionCMS {
  cms: CMS
  cmsId: string
  notionClient: Client
  refreshTimeout: number
  draftMode: boolean
  defaultCacheFilename: string
  localCacheDirectory: string
  localCacheUrl: string
  debug: boolean | undefined
  limiter: { schedule: Function }
  plugins: Array<Plugin | UnsafePlugin> | undefined

  constructor({
    databaseId,
    notionAPIKey,
    debug = false,
    draftMode = false,
    refreshTimeout = 0,
    localCacheDirectory = './.notion-cms/',
    rootUrl = '',
    limiter = { schedule: (func: Function) => { const result = func(); return Promise.resolve(result) } },
    plugins = []
  }: Options = { databaseId: '', notionAPIKey: '' }) {
    this.cms = {
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
      auth: notionAPIKey,
      ...(debug && { logLevel: LogLevel.DEBUG }),
    })
    this.refreshTimeout = refreshTimeout || 0
    this.draftMode = draftMode || false
    this.localCacheDirectory = localCacheDirectory
    this.defaultCacheFilename = `cache.json`
    this.localCacheUrl = path.resolve(__dirname, this.localCacheDirectory + this.defaultCacheFilename)
    this.debug = debug
    this.limiter = limiter
    this.limiter.schedule.bind(limiter)

    const coreRenderer = renderer({ blockRenderers: {} })
    coreRenderer.name = 'core-renderer'
    this.plugins = this._dedupePlugins([...plugins, coreRenderer])
  }

  get data() {
    if (_.isEmpty(this.cms.siteData)) return
    return this.cms.siteData
  }

  get routes(): Array<string> {
    const routes = [] as Array<string>
    this.walk((node: PageContent) => { if (node.path) routes.push(node.path) })
    return routes
  }

  _dedupePlugins(plugins: Array<Plugin | UnsafePlugin>): Array<Plugin | UnsafePlugin> {
    // @ts-ignore
    const numParsePlugins = _.filter(plugins, { 'hook': 'parse' })
    if (numParsePlugins.length > 1) {
      return _.initial(plugins)
    }
    return plugins
  }

  _checkDuplicateParsePlugins(pluginsList: Array<Plugin | UnsafePlugin>): boolean {
    return _(pluginsList).filter(plugin => plugin.hook === 'parse').uniq().value().length > 1
  }

  async _runPlugins(
    context: PluginPassthrough,
    hook: Plugin['hook'] | 'parse')
    : Promise<PluginPassthrough> {
    if (!this.plugins?.length) return context
    if (this._checkDuplicateParsePlugins(this.plugins)) {
      throw new Error('Only one parse-capable plugin must be used. Use the default NotionCMS render plugin.')
    }
    let val = context
    for (const plugin of this.plugins.flat()) {
      if (plugin.hook === hook) {
        // pass in previous plugin output
        val = await plugin.exec(val, {
          debug: !!this.debug,
          localCacheDirectory: this.localCacheDirectory,
          notion: this.notionClient
        })
      }
    }
    return val
  }

  _flatListToTree = (
    flatList: FlatList,
    idPath: keyof FlatListItem,
    parentIdPath: keyof FlatListItem,
    isRoot: (t: FlatListItem) => boolean,
  ): Record<string, Page> => {
    const rootParents: FlatList = [];
    const map: any = {};
    const tree = {}
    for (const item of flatList) {
      map[item[idPath]] = item;
    }
    for (const item of flatList) {
      const parentId = item[parentIdPath];
      if (isRoot(item)) {
        rootParents.push(item);
      } else {
        const parentItem = map[parentId];
        parentItem[item._key] = item;
      }
    }
    _.forEach(rootParents, page => {
      _.assign(tree, { [page._key]: page })
    })
    return tree;
  };

  _notionListToTree(list: FlatList): Record<string, Page> {
    return this._flatListToTree(list, 'id', 'pid', (node: FlatListItem) => !node.pid)
  }

  static _isPageContentObject(node: WalkNode): boolean {
    return typeof node.key === 'string' && node?.key?.startsWith('/') &&
      ((typeof node?.parent?.key === 'string' && node?.parent?.key?.startsWith('/')) ||
        !node?.parent?.key)
  }

  _getParentPageId(response: PageObjectResponse): string {
    const parentPage = response?.properties['parent-page'] as PageObjectRelation
    return parentPage?.relation[0]?.id
  }

  _getBlockName(response: PageObjectResponse): string {
    const nameProp = response?.properties.name as PageObjectTitle
    return nameProp.title[0]?.plain_text
  }

  _extractTags(response: PageObjectResponse): Array<string> {
    const tagProp = response?.properties?.Tags as PageMultiSelect
    return tagProp.multi_select ? tagProp.multi_select.map(multiselect => multiselect.name) : []
  }

  _assignTagGroup(tag: string, path: string, cms: CMS): void {
    if (!cms.tagGroups[tag]) cms.tagGroups[tag] = []
    cms.tagGroups[tag].push(path)
  }

  _buildTagGroups(tags: Array<string>, path: string, cms: CMS): void {
    _.forEach(tags, tag => {
      if (!_.includes(cms.tags, tag)) cms.tags.push(tag)
      this._assignTagGroup(tag, path, cms)
    })
  }

  _getCoverImage(page: PageObjectResponse): string | undefined {
    const pageCoverProp = (page as PageObjectResponse)?.cover as Cover
    let coverImage;
    if (pageCoverProp && 'external' in pageCoverProp) {
      coverImage = pageCoverProp?.external?.url
    } else if (pageCoverProp?.file) {
      coverImage = pageCoverProp?.file.url
    }
    return coverImage
  }

  async _pullPageContent(id: string): Promise<ListBlockChildrenResponse> {
    let pageContent
    try {
      pageContent = await this.limiter.schedule(
        async () => await this.notionClient.blocks.children.list({
          block_id: id,
          page_size: 100, // This is the max. TODO: Handle more blocks using pagination API.
        })
      )
    } catch (e) {
      if (this.debug) console.error(`NotionCMS Error: ${e}`)
    }
    for (const block of pageContent.results) {
      if (block.has_children) {
        block[block.type].children = (await this._pullPageContent(block.id)).results
      }
    }
    return pageContent
  }

  async _parsePageContent(pageContent: ListBlockChildrenResponse): Promise<string> {
    const results = await this._runPlugins(pageContent.results as Blocks, 'pre-parse')
    const parsedBlocks = await this._runPlugins(results as Blocks, 'parse')
    const html = await this._runPlugins(parsedBlocks, 'post-parse') as string
    return html
  }

  async _getPageContent(state: CMS): Promise<CMS> {
    let stateWithContent = _.cloneDeep(state)

    await new AsyncWalkBuilder()
      .withCallback({
        filters: [(node: WalkNode) => NotionCMS._isPageContentObject(node)],
        nodeTypeFilters: ['object'],
        positionFilter: 'postWalk',
        callback: async (node: WalkNode) => {
          const blocks = await this._pullPageContent(node.val._notion.id)
          const content = await this._parsePageContent(blocks)
          _.assign(node.val, {
            content,
            ...(!node.val.coverImage && { coverImage: content.match(COVER_IMAGE_REGEX)?.[1] }),
            _ancestors: this._gatherNodeAncestors(node)
          })
          _.assign(
            node.val,
            await this._runPlugins(node.val, 'during-tree') as Page)
          delete node.val.otherProps
          // We only want access to ancestors for plugins, otherwise it creates circular ref headaches.
          delete node.val._ancestors
        }
      })
      .withRootObjectCallbacks(false)
      .withParallelizeAsyncCallbacks(true)
      .walk(stateWithContent.siteData)

    stateWithContent.stages.push('content')
    stateWithContent = await this._runPlugins(stateWithContent, 'post-tree') as CMS
    return stateWithContent
  }

  _extractUnsteadyProps(properties: PageObjectResponse['properties'])
    : PageObjectResponse['properties'] {
    return _(properties)
      .entries()
      .reject(([key]) => _.includes(STEADY_PROPS, key))
      .fromPairs().value()
  }

  _getPageUpdate(entry: PageObjectResponse): Page {
    const tags = [] as Array<string>
    if (isFullPage(entry as PageObjectResponse)) {
      const name = this._getBlockName(entry)
      const authorProp = entry.properties?.Author as PageObjectUser
      const authors = authorProp['people'].map(authorId => authorId.name as string)

      const coverImage = this._getCoverImage(entry as PageObjectResponse)
      const extractedTags = this._extractTags(entry as PageObjectResponse)
      extractedTags.forEach(tag => tags.push(tag))
      const otherProps = this._extractUnsteadyProps(entry.properties)

      return {
        name,
        otherProps,
        slug: slugify(name),
        authors,
        tags,
        coverImage,
        _notion: {
          id: entry.id,
          last_edited_time: entry.last_edited_time,
        }
      }
    }
    return {}
  }

  _publishedFilter = (e: PageObjectResponse) => {
    const publishProp = e.properties['Published'] as SelectPropertyItemObjectResponse
    return this.draftMode ? true : publishProp.select && publishProp.select.name === 'Published'
  }

  _gatherNodeAncestors(node: WalkNode): Array<PageContent> {
    return _(node.ancestors).map(ancestor => {
      if (ancestor.val._notion) return ancestor.val
    }).compact().value()
  }

  async _getDb(state: CMS): Promise<CMS> {
    let stateWithDb = _.cloneDeep(state)
    let db
    try {
      db = await this.limiter.schedule(
        async () => await this.notionClient.databases.query({ database_id: state.metadata.databaseId })
      )
    } catch (e) {
      if (this.debug) console.error(`NotionCMS Error: ${e}`)
    }
    stateWithDb.siteData = this._notionListToTree(
      _(db.results)
        .filter(this._publishedFilter)
        .map(page => _.assign({}, {
          _key: routify(this._getBlockName(page)),
          id: page.id,
          pid: this._getParentPageId(page),
          _notion: page
        }))
        .value()
    )

    if (_.isEmpty(stateWithDb.siteData)) {
      throw new Error('NotionCMS is empty. Did you mean to set `draftMode: true`?')
    }

    new WalkBuilder()
      .withCallback({
        nodeTypeFilters: ['object'],
        callback: (node: WalkNode) => {
          if (!node.val?._notion) return
          const update = this._getPageUpdate(node.val._notion as PageObjectResponse)
          _.assign(node.val, update)
          _.assign(node.val, {
            path: node.getPath(node => `${node.key}`).replace('siteData', ''),
            url: stateWithDb.metadata.rootUrl && path ?
              stateWithDb.metadata.rootUrl as string + path : ''
          })
          if (node.key && typeof node.key === 'string') {
            this._buildTagGroups(node.val.tags, node.val.path, stateWithDb)
          }
        }
      })
      .withRootObjectCallbacks(false)
      .walk(stateWithDb)

    stateWithDb.stages.push('db')
    stateWithDb = await this._runPlugins(stateWithDb, 'pre-tree') as CMS
    return stateWithDb
  }

  async fetch(): Promise<CMS> {
    let cachedCMS
    if (fs.existsSync(this.localCacheUrl)) {
      try {
        cachedCMS = JSONParseWithFunctions(fs.readFileSync(this.localCacheUrl, 'utf-8')) as CMS
      } catch (e) {
        if (this.debug) console.error('Parsing cached CMS failed. Using API instead.')
      }
    }
    // Use refresh time to see if we should return local env cache or fresh api calls from Notion
    if (cachedCMS && cachedCMS.lastUpdateTimestamp &&
      Date.now() < (cachedCMS.lastUpdateTimestamp + this.refreshTimeout)) {
      if (this.debug) console.log('using cache')
      this.cms = cachedCMS
    } else {
      if (this.debug) console.log('using API')
      if (!_.includes(this.cms.stages, 'db')) {
        this.cms = await this._getDb(this.cms)
      }
      if (!_.includes(this.cms.stages, 'content')) {
        this.cms = await this._getPageContent(this.cms)
        this.cms.stages.push('complete')
      }
      if (_.includes(this.cms.stages, 'complete')) {
        this.export()
      }
    }
    void this.routes
    if (this.debug) writeFile('debug/site-data.json', JSONStringifyWithFunctions(this.cms))
    return this.cms
  }

  async asyncWalk(cb: Function, path?: string) {
    const startPoint = path ? this.queryByPath(path) : this.cms.siteData
    await new AsyncWalkBuilder()
      .withCallback({
        nodeTypeFilters: ['object'],
        filters: [(node: WalkNode) => NotionCMS._isPageContentObject(node)],
        callback: (node: WalkNode) => cb(node.val) as AsyncCallbackFn
      })
      .withRootObjectCallbacks(false)
      .withParallelizeAsyncCallbacks(true)
      .walk(startPoint)
  }

  walk(cb: Function, path?: string) {
    const startPoint = path ? this.queryByPath(path) : this.cms.siteData
    new WalkBuilder()
      .withCallback({
        nodeTypeFilters: ['object'],
        filters: [(node: WalkNode) => NotionCMS._isPageContentObject(node)],
        callback: (node: WalkNode) => cb(node.val)
      })
      .withRootObjectCallbacks(false)
      .walk(startPoint)
  }

  getTaggedCollection(tags: string | Array<string>): Array<Page | undefined> {
    if (!_.isArray(tags)) tags = [tags]
    const taggedPages = [] as Array<string>
    for (const tag of tags) {
      taggedPages.push(...this.cms.tagGroups[tag])
    }
    if (typeof this.cms.siteData !== 'string') {
      return _(taggedPages).map(path => this.queryByPath(path)).uniq().value()
    }
    return []
  }

  filterSubPages(pathOrPage: string | Page): Array<Page> {
    if (typeof pathOrPage === 'string') {
      pathOrPage = this.queryByPath(pathOrPage) as Page
    }
    return _(pathOrPage)
      .entries()
      .filter(([key]) => key.startsWith('/'))
      .map(e => e[1]).value() as Page[]
  }

  rejectSubPages(pathOrPage: string | Page): Page {
    if (typeof pathOrPage === 'string') {
      pathOrPage = this.queryByPath(pathOrPage) as Page
    }
    return _(pathOrPage)
      .entries()
      .reject(([key]) => key.startsWith('/'))
      .fromPairs().value() as Page
  }

  queryByPath(path: string): Page {
    const segments = path.split('/').slice(1)
    //@ts-ignore-next-line
    let access: Page = this.cms.siteData
    for (const segment of segments) {
      //@ts-ignore-next-line
      access = access['/' + segment]
    }
    return access
  }

  export({ pretty = false, path = this.localCacheUrl }:
    { pretty?: boolean, path?: string } = {}) {
    this.cms.lastUpdateTimestamp = Date.now()
    if (pretty) {
      // This drops Functions too, so only use for inspection
      writeFile(path, JSON.stringify(this.cms, filterAncestors))
    } else {
      writeFile(path, JSONStringifyWithFunctions(this.cms))
    }
  }

  async import(previousState: string, flatted?: boolean): Promise<CMS> {
    let parsedPreviousState
    try {
      if (flatted) {
        parsedPreviousState = JSONParseWithFunctions(previousState) as CMS
      } else {
        parsedPreviousState = JSON.parse(previousState) as CMS
      }
    } catch (e) {
      throw new Error(`Parsing input CMS failed.
                      Make sure your input follows the NotionCMS spec, uses a validator plugin or a transformation plugin.`)
    }
    const transformedPreviousState = await this._runPlugins(parsedPreviousState, 'import') as CMS
    return this.cms = transformedPreviousState
  }
}
