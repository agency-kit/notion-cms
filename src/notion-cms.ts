import { Client, isFullPage } from "@notionhq/client"
import {
  PageObjectResponse,
  SelectPropertyItemObjectResponse, CreatePageParameters, UserObjectResponse
} from '@notionhq/client/build/src/api-endpoints'
import { NotionBlocksHtmlParser } from '@notion-stuff/blocks-html-parser'
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
  PluginPassthrough,
  PageContent,
} from "./types"
import _ from 'lodash'
import fs from 'fs'
import path, { dirname } from 'path'
import { fileURLToPath } from 'url';
import { AsyncCallbackFn, AsyncWalkBuilder, WalkBuilder, WalkNode } from 'walkjs'
import { default as serializeJS } from 'serialize-javascript'
import { parse, stringify } from 'flatted';
import NotionPage from "./notion-page"

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

function _deserialize(serializedJavascript: string) {
  return eval?.('(' + serializedJavascript + ')');
}

function _replaceFuncs(key: string, value: any) {
  return typeof value === 'function' ?
    '__func__' + serializeJS(value) :
    value
}

function _reviveFuncs(key: string, value: any) {
  return typeof value === 'string' && value.startsWith('__func__') ?
    _deserialize(value.replace('__func__', '')) :
    value
}

function _filterAncestors(key: string, value: any) {
  if (key === '_ancestors') return '[ancestors ref]'
  return value
}

function JSONStringifyWithFunctions(obj: Object): string {
  return stringify(obj, _replaceFuncs)
}

function JSONParseWithFunctions(string: string): Object {
  return parse(string, _reviveFuncs)
}

function writeFile(path: string, contents: string): void {
  fs.mkdirSync(dirname(path), { recursive: true })
  fs.writeFileSync(path, contents);
}

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

interface FlatListItem {
  _key: string,
  [pid: string]: string
}

type FlatList = FlatListItem[]

export default class NotionCMS {
  cms: CMS
  cmsId: string
  notionClient: Client
  pull: Function
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
  }: Options = { databaseId: '', notionAPIKey: '', debug: false, rootUrl: '', draftMode: false }) {
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
      auth: notionAPIKey
    })
    this.pull = this.fetch // symmetry with `pull` without breaking current API
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

  get routes(): Array<string> {
    const routes = [] as Array<string>
    this.walk((node: PageContent) => { if (node.path) routes.push(node.path) })
    return routes
  }

  get toplevelDirectories() {
    if (_.isEmpty(this.cms.siteData)) return
    return Object.entries(this.cms.siteData)
  }

  async _runPlugins(
    context: PluginPassthrough,
    hook: Plugin['hook'])
    : Promise<PluginPassthrough> {
    if (!this.plugins?.length) return context
    let val = context
    for (const plugin of this.plugins.flat()) {
      if (plugin.hook === hook) {
        // pass in previous plugin output
        val = await plugin.exec(val)
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

  _isPageContentObject(node: WalkNode): boolean {
    return typeof node.key === 'string' && node?.key?.startsWith('/') &&
      ((typeof node?.parent?.key === 'string' && node?.parent?.key?.startsWith('/')) ||
        !node?.parent?.key)
  }

  _isTopLevelDir(response: PageObjectResponse): boolean {
    const parentPage = response?.properties['parent-page'] as PageObjectRelation
    return _.isEmpty(parentPage.relation)
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

  async _userLookup(name: string): Promise<string> {
    const usersList = await this.notionClient.users.list({})
    const theUser = _.filter(usersList.results, user => user.name === name)[0] as UserObjectResponse
    return theUser.id
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

  async _pullPageContent(id: string): Promise<string> {
    const pageContent = await this.limiter.schedule(
      async () => await this.notionClient.blocks.children.list({
        block_id: id,
        page_size: 100, // This is the max. TODO: Handle more blocks using pagination API.
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

  async _getPageContent(state: CMS): Promise<CMS> {
    let stateWithContent = _.cloneDeep(state)

    await new AsyncWalkBuilder()
      .withCallback({
        filters: [(node: WalkNode) => this._isPageContentObject(node)],
        nodeTypeFilters: ['object'],
        positionFilter: 'postWalk',
        callback: async (node: WalkNode) => {
          const content = await this._pullPageContent(node.val._notion.id)
          const imageUrl = content.match(COVER_IMAGE_REGEX)?.[1]
          _.assign(node.val, {
            content,
            coverImage: imageUrl,
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

  _getPageUpdate(entry: PageObjectResponse): Array<string | Page> {
    const tags = [] as Array<string>
    if (isFullPage(entry as PageObjectResponse)) {
      const name = this._getBlockName(entry)
      const route = name.slug.route

      const authorProp = entry.properties?.Author as PageObjectUser
      const authors = authorProp['people'].map(authorId => authorId.name as string)

      const coverImage = this._getCoverImage(entry as PageObjectResponse)
      const extractedTags = this._extractTags(entry as PageObjectResponse)
      extractedTags.forEach(tag => tags.push(tag))
      const otherProps = this._extractUnsteadyProps(entry.properties)

      return [
        route,
        {
          name,
          otherProps,
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
    const db = await this.limiter.schedule(
      async () => await this.notionClient.databases.query({ database_id: state.metadata.databaseId })
    )

    stateWithDb.siteData = this._notionListToTree(
      _(db.results)
        .filter(this._publishedFilter)
        .map(page => _.assign({}, {
          _key: this._getBlockName(page).slug.route,
          id: page.id,
          pid: this._getParentPageId(page),
          _notion: page
        }))
        .value()
    )

    new WalkBuilder()
      .withCallback({
        nodeTypeFilters: ['object'],
        callback: (node: WalkNode) => {
          if (!node.val?._notion) return
          // Main Content
          const [route, update] = this._getPageUpdate(node.val._notion as PageObjectResponse)
          _.assign(node.val, update)
          // set ancestors in node
          _.assign(node.val, {
            path: node.getPath(node => `${node.key}`).replace('siteData', ''),
            url: stateWithDb.metadata.rootUrl && path ?
              stateWithDb.metadata.rootUrl as string + path : ''
          })
          // Tag Groups
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
      cachedCMS = JSONParseWithFunctions(fs.readFileSync(this.localCacheUrl, 'utf-8')) as CMS
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

  _createParentProperty(): { parent: { type: string, database_id: string } } {
    return {
      parent: {
        type: "database_id",
        database_id: this.cms.metadata.databaseId
      },
    }
  }

  async push(): Promise<boolean> {
    new AsyncWalkBuilder()
      .withCallback({
        callback: async (node: WalkNode) => {
          const page = new NotionPage()
            .addParentDb({ id: this.cms.metadata.databaseId })
            .addParentPage({ id: node.val.pid })
            .addProps([
              { propName: 'authors', type: 'people', value: _.map(node.val.authors, this._userLookup) },
              { propName: 'tags', type: 'multiselect', value: [...node.val.tags] },
              { propName: 'title', value: node.val.title }
            ])
            .addContent(node.val.content)
          try {
            // Create if there, update if exists
            await this.notionClient.pages.create(page as CreatePageParameters)
          } catch (e) {
            throw new Error(page.name + ':' + e)
          }
        }
      })
      .withParallelizeAsyncCallbacks(true)
      .walk(this.cms.siteData)
    return true
  }

  async asyncWalk(cb: Function, path?: string) {
    const startPoint = path ? this.queryByPath(path) : this.cms.siteData
    await new AsyncWalkBuilder()
      .withCallback({
        nodeTypeFilters: ['object'],
        filters: [(node: WalkNode) => this._isPageContentObject(node)],
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
        filters: [(node: WalkNode) => this._isPageContentObject(node)],
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
      writeFile(path, JSON.stringify(this.cms, _filterAncestors))
    } else {
      writeFile(path, JSONStringifyWithFunctions(this.cms))
    }
  }

  async import(previousState: string): Promise<CMS> {
    const parsedPreviousState = JSONParseWithFunctions(previousState) as CMS
    const transformedPreviousState = await this._runPlugins(parsedPreviousState, 'import') as CMS
    return this.cms = transformedPreviousState
  }
}
