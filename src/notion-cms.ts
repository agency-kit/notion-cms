import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { createHash } from 'node:crypto'
import { Client, LogLevel, collectPaginatedAPI, isFullBlock, isFullPage } from '@notionhq/client'
import type {
  BlockObjectResponse,
  PageObjectResponse,
  SelectPropertyItemObjectResponse,
} from '@notionhq/client/build/src/api-endpoints'
import type { Blocks } from '@notion-stuff/v4-types'
import _ from 'lodash'
import type { AsyncCallbackFn, WalkNode } from 'walkjs'
import { AsyncWalkBuilder, WalkBuilder } from 'walkjs'
import humanInterval from 'human-interval'
import { log, spinner } from '@clack/prompts'
import kleur from 'kleur'
import type {
  CMS,
  Content,
  Cover,
  ExtendedPageContent,
  FlatListItem,
  Options,
  Page,
  PageContent,
  PageMultiSelect,
  PageObjectRelation,
  PageObjectTitle,
  PageObjectUser,
  Plugin,
  PluginPassthrough,
  UnsafePlugin,
} from './types'
import {
  JSONParseWithFunctions,
  JSONStringifyWithFunctions,
  filterAncestors,
  routify,
  slugify,
  writeFile,
} from './utilities'
import NotionLogger from './notion-logger'
import renderer from './plugins/render'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const COVER_IMAGE_REGEX = /<figure notion-figure>[\s\S]+<img[^>]*src=['|"](https?:\/\/[^'|"]+)(?:['|"])/

const STEADY_PROPS = [
  'name',
  'Author',
  'Published',
  'Tags',
  'publishDate',
  'parent-page',
  'sub-page',
]

const clackSpinner = spinner()

export default class NotionCMS {
  cms: CMS
  cmsId: string
  notionClient: Client
  autoUpdate: boolean
  refreshTimeout: number | string
  draftMode: boolean
  defaultCacheFilename: string
  localCacheDirectory: string
  localCacheUrl: string
  debug: boolean | undefined
  limiter: { schedule: Function }
  plugins: Array<Plugin | UnsafePlugin> | undefined
  options: Options
  private timer: number
  private coreRenderer: UnsafePlugin
  private logger: NotionLogger
  pull: () => Promise<CMS>
  rootAlias: string
  withinRefreshTimeout: boolean
  quietMode: boolean

  constructor({
    databaseId,
    notionAPIKey,
    debug = false,
    draftMode = false,
    refreshTimeout = 0,
    autoUpdate = true,
    localCacheDirectory = './.notion-cms/',
    rootAlias = '',
    rootUrl = '',
    quiet = false,
    limiter = {
      schedule: (func: Function) => {
        const result = func() as unknown
        return Promise.resolve(result)
      },
    },
    plugins = [],
  }: Options = { databaseId: '', notionAPIKey: '' }) {
    this.timer = Date.now()
    this.options = {
      databaseId,
      notionAPIKey,
      debug,
      draftMode,
      refreshTimeout,
      autoUpdate,
      localCacheDirectory,
      rootUrl,
      rootAlias,
      limiter,
      plugins,
      quiet,
    }
    this.cms = {
      metadata: {
        options: this._documentOptions(this.options),
        databaseId,
        rootUrl: rootUrl || '',
        stats: {
          durationSeconds: 0,
          totalPages: 0,
        },
      },
      stages: [],
      routes: [],
      tags: [],
      tagGroups: {},
      siteData: {},
    }
    this.cmsId = this._produceCMSIdentifier(databaseId) // Can't have multiple instances that reference the same db.
    this.debug = debug
    this.logger = new NotionLogger({ debug: this.debug })

    this.notionClient = new Client({
      auth: notionAPIKey,
      logLevel: LogLevel.DEBUG,
      logger: this.logger.log.bind(this.logger),
    })
    this.autoUpdate = autoUpdate
    this.refreshTimeout
      = (refreshTimeout && _.isString(refreshTimeout))
        ? (humanInterval(refreshTimeout) || refreshTimeout)
        : (refreshTimeout || 0)
    this.draftMode = draftMode || false
    this.localCacheDirectory = localCacheDirectory
    this.defaultCacheFilename = `ncms-cache-${this.cmsId}.json`
    this.localCacheUrl = path.resolve(__dirname, this.localCacheDirectory + this.defaultCacheFilename)
    this.limiter = limiter
    this.limiter.schedule.bind(limiter)

    this.coreRenderer = renderer({ blockRenderers: {}, debug })
    this.coreRenderer.name = 'core-renderer'
    this.plugins = this._dedupePlugins([...plugins, this.coreRenderer])
    this.pull = this.fetch.bind(this)
    this.rootAlias = rootAlias
    this.withinRefreshTimeout = false
    this.quietMode = quiet
  }

  get data() {
    if (_.isEmpty(this.cms.siteData))
      return
    return this.cms.siteData
  }

  get routes(): Array<string> {
    const routes = [] as Array<string>
    this.walk((node: PageContent) => {
      if (node.path)
        routes.push(node.path)
    })
    return routes
  }

  _documentOptions(options: Options): string {
    let hex
    try {
      const tempOptions = _.cloneDeep(options)
      delete tempOptions.limiter
      const hasher = createHash('md5')
      // Detecting Function string differences needs
      // to be implemented using the JSONStringifyWithFunctions util.
      const json = JSON.stringify(tempOptions)
      hasher.update(json)
      hex = hasher.digest('hex')
    }
    catch (e) {
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      throw new Error(`Failed to document options object: ${e}`)
    }
    return hex
  }

  _produceCMSIdentifier(id: string): string {
    return id.slice(-4)
  }

  _dedupePlugins(plugins: Array<Plugin | UnsafePlugin>): Array<Plugin | UnsafePlugin> {
    const numParsePlugins = _.filter(plugins, { hook: 'parse' })
    if (numParsePlugins.length > 1)
      return _.initial(plugins)

    return plugins
  }

  _checkDuplicateParsePlugins(pluginsList: Array<Plugin | UnsafePlugin>): boolean {
    return _(pluginsList).filter(plugin => plugin.hook === 'parse').uniq().value().length > 1
  }

  async _runPlugins(
    context: PluginPassthrough,
    hook: Plugin['hook'] | 'parse'): Promise<PluginPassthrough> {
    if (!this.plugins?.length)
      return context
    if (this._checkDuplicateParsePlugins(this.plugins))
      throw new Error('Only one parse-capable plugin must be used. Use the default NotionCMS render plugin.')

    let val = context
    for (const plugin of this.plugins.flat()) {
      if (plugin.hook === hook || plugin.hook === '*') {
        // eslint-disable-next-line @typescript-eslint/await-thenable
        val = await plugin.exec(val, {
          debug: !!this.debug,
          localCacheDirectory: this.localCacheDirectory,
          notion: this.notionClient,
        })
      }
    }
    return val
  }

  _flatListToTree = (
    flatList: Partial<FlatListItem>[],
    idPath: keyof FlatListItem,
    parentIdPath: keyof FlatListItem,
    isRoot: (t: Partial<FlatListItem>) => boolean,
  ): Record<string, Page> => {
    const rootParents: Partial<FlatListItem>[] = []
    const map = {} as { [x: string]: Partial<FlatListItem> }
    const tree = {}
    for (const item of flatList)
      map[item[idPath] as string] = item

    for (const item of flatList) {
      const parentId = item[parentIdPath]
      if (isRoot(item)) {
        if (item._key === this.rootAlias)
          item._key = '/'
        rootParents.push(item)
      }
      else {
        const parentItem = map[parentId as string]
        parentItem[item._key as string] = item
      }
    }
    _.forEach(rootParents, (page) => {
      _.assign(tree, { [page._key as string]: page })
    })
    return tree
  }

  _notionListToTree(list: Partial<FlatListItem>[]): Record<string, Page> {
    return this._flatListToTree(list, 'id', 'pid', (node: Partial<FlatListItem>) => !node.pid)
  }

  static _isPageContentObject(node: WalkNode): boolean {
    return typeof node.key === 'string' && node?.key?.startsWith('/')
      && ((typeof node?.parent?.key === 'string' && node?.parent?.key?.startsWith('/'))
        || !node?.parent?.key || node?.parent?.key === 'siteData')
  }

  static _createCMSWalker(cb: (node: ExtendedPageContent) => void): WalkBuilder {
    return new WalkBuilder()
      .withCallback({
        filters: [(node: WalkNode) => NotionCMS._isPageContentObject(node)],
        nodeTypeFilters: ['object'],
        positionFilter: 'postWalk',
        callback: (node: WalkNode) => cb(node.val as ExtendedPageContent),
      })
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
    if (!cms.tagGroups[tag])
      cms.tagGroups[tag] = []
    cms.tagGroups[tag].push(path)
  }

  _buildTagGroups(tags: Array<string>, path: string, cms: CMS): void {
    _.forEach(tags, (tag) => {
      if (!_.includes(cms.tags, tag))
        cms.tags.push(tag)
      this._assignTagGroup(tag, path, cms)
    })
  }

  _getCoverImage(page: PageObjectResponse): string | undefined {
    const pageCoverProp = (page)?.cover as Cover
    let coverImage
    if (pageCoverProp && 'external' in pageCoverProp)
      coverImage = pageCoverProp?.external?.url

    else if (pageCoverProp?.file)
      coverImage = pageCoverProp?.file.url

    return coverImage
  }

  async _pullPageContent(id: string): Promise<BlockObjectResponse[] | undefined> {
    let pageContent
    try {
      pageContent = await this.limiter.schedule(
        async () => await collectPaginatedAPI(this.notionClient.blocks.children.list, {
          block_id: id,
        }),
      ) as BlockObjectResponse[]
    }
    catch (e) {
      if (this.debug)
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        console.error(`NotionCMS Error: ${e}`)
    }
    if (!pageContent)
      return
    for (const block of pageContent) {
      if (isFullBlock(block) && block.has_children)
        // @ts-expect-error children
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        block[block.type].children = (await this._pullPageContent(block.id))
    }
    return pageContent
  }

  async _parsePageContent(pageContent: BlockObjectResponse[]): Promise<Content> {
    const results = await this._runPlugins(pageContent as Blocks, 'pre-parse')
    const markdown: string = this.coreRenderer.parser.blocksToMarkdown(pageContent as Blocks)
    const plaintext: string = this.coreRenderer.parser.markdownToPlainText(markdown)
    const parsedBlocks = await this._runPlugins(results as Blocks, 'parse')
    const html = await this._runPlugins(parsedBlocks, 'post-parse') as string
    return {
      plaintext,
      markdown,
      html,
    }
  }

  async _getPageContent(state: CMS, cachedState?: CMS): Promise<CMS> {
    let stateWithContent = _.cloneDeep(state)

    await new AsyncWalkBuilder()
      .withCallback({
        filters: [(node: WalkNode) => NotionCMS._isPageContentObject(node)],
        nodeTypeFilters: ['object'],
        positionFilter: 'postWalk',
        callback: async (node: WalkNode) => {
          const pageContent = node.val as PageContent
          if (!pageContent || !pageContent?._notion?.id)
            return
          // Definitely grab content if there is no cache.
          if (pageContent._updateNeeded || !cachedState) {
            if (!this.quietMode && pageContent.path)
              clackSpinner.start(kleur.blue(`[ncms][updating]: ${pageContent.path}`))
            const blocks = await this._pullPageContent(pageContent._notion.id)
            if (!blocks)
              return
            const content = await this._parsePageContent(blocks)
            _.assign(pageContent, {
              content,
              ...(!pageContent.coverImage && { coverImage: content.html.match(COVER_IMAGE_REGEX)?.[1] }),
              _ancestors: this._gatherNodeAncestors(node),
            })
          }
          else if (cachedState && pageContent.path) {
            const cachedPage = this._queryByPath(pageContent.path, cachedState?.siteData)
            if (cachedPage) {
              _.assign(pageContent, {
                content: cachedPage.content,
                ...(!cachedPage.coverImage && { coverImage: cachedPage.content?.html.match(COVER_IMAGE_REGEX)?.[1] }),
                _ancestors: this._gatherNodeAncestors(node),
              })
              if (!this.quietMode && pageContent.path)
                clackSpinner.start(kleur.yellow(`[ncms][using cache]: ${pageContent.path}`))
            }
          }
          else {
            clackSpinner.stop(kleur.red('[ncms]: aborted due to fetch error.'))
            throw new Error(`ncms: error when updating page content. No page found for ${node.key || 'undetermined node key'}`)
          }

          _.assign(
            pageContent,
            await this._runPlugins(pageContent, 'during-tree') as Page)
          delete pageContent.otherProps
          // We only want access to ancestors for plugins, otherwise it creates circular ref headaches.
          delete pageContent._ancestors
          delete pageContent._updateNeeded
          // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
          clackSpinner.stop(kleur.blue(`[ncms]: updated@ ${pageContent.path}`))
        },
      })
      .withRootObjectCallbacks(false)
      .withParallelizeAsyncCallbacks(true)
      .walk(stateWithContent.siteData)

    stateWithContent.stages.push('content')
    stateWithContent = await this._runPlugins(stateWithContent, 'post-tree') as CMS
    return stateWithContent
  }

  _extractUnsteadyProps(properties: PageObjectResponse['properties']): PageObjectResponse['properties'] {
    return _(properties)
      .entries()
      .reject(([key]) => _.includes(STEADY_PROPS, key))
      .fromPairs().value()
  }

  _getPageUpdate(entry: PageObjectResponse): Page {
    const tags = [] as Array<string>
    if (isFullPage(entry)) {
      const name = this._getBlockName(entry)
      const authorProp = entry.properties?.Author as PageObjectUser
      const authors = authorProp.people.map(authorId => authorId.name as string)

      const coverImage = this._getCoverImage(entry)
      const extractedTags = this._extractTags(entry)
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
        },
      }
    }
    return {}
  }

  _publishedFilter = (e: PageObjectResponse) => {
    const publishProp = e.properties.Published as SelectPropertyItemObjectResponse
    return this.draftMode ? true : (publishProp.select && publishProp.select.name === 'Published')
  }

  _gatherNodeAncestors(node: WalkNode): Array<PageContent> {
    return _(node.ancestors).map((ancestor) => {
      if ((ancestor.val as PageContent)._notion)
        return ancestor.val as PageContent
      return false
    }).compact().value()
  }

  async _getDb(state: CMS, cachedState?: CMS): Promise<CMS | undefined> {
    let stateWithDb = _.cloneDeep(state)
    let db
    try {
      db = await this.limiter.schedule(
        async () => (await collectPaginatedAPI(
          this.notionClient.databases.query, { database_id: state.metadata.databaseId },
        )),
      ) as PageObjectResponse[]
    }
    catch (e) {
      if (this.debug)
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        console.error(`NotionCMS Error: ${e}`)
    }
    if (!db)
      return

    stateWithDb.metadata.stats.totalPages = db.length
    stateWithDb.siteData = this._notionListToTree(
      _(db)
        // @ts-expect-error filter
        .filter(this._publishedFilter)
        .map(page => _.assign({}, {
          _key: routify(this._getBlockName(page)),
          id: page.id,
          pid: this._getParentPageId(page),
          _notion: page, // this property is recycled to eventually house metadata.
        }))
        .value(),
    )

    if (_.isEmpty(stateWithDb.siteData))
      throw new Error('NotionCMS is empty. Did you mean to set `draftMode: true`?')

    new WalkBuilder()
      .withCallback({
        nodeTypeFilters: ['object'],
        callback: (node: WalkNode) => {
          const pageContent = node.val as PageContent
          if (!pageContent?._notion)
            return
          pageContent._updateNeeded = !this.withinRefreshTimeout
          const update = this._getPageUpdate(pageContent._notion as PageObjectResponse)
          _.assign(pageContent, update)
          _.assign(pageContent, {
            // Replace double // so that root aliasing works properly
            path: node.getPath(node => `${node.key as string}`)
              .replace('siteData', '')
              .replace('//', '/'),
            url: (stateWithDb.metadata.rootUrl && pageContent.path)
              ? (`${stateWithDb.metadata.rootUrl as string}${pageContent.path}`)
              : '',
          })
          if (cachedState && pageContent.path && !this.withinRefreshTimeout) {
            const cachedPage = this._queryByPath(pageContent.path, cachedState?.siteData)
            pageContent._updateNeeded = this.autoUpdate
              && (update._notion?.last_edited_time !== cachedPage?._notion?.last_edited_time)
          }
          if (node.key && typeof node.key === 'string' && pageContent.tags && pageContent.path)
            this._buildTagGroups(pageContent.tags, pageContent.path, stateWithDb)
        },
      })
      .withRootObjectCallbacks(false)
      .walk(stateWithDb)

    stateWithDb.stages.push('db')
    stateWithDb = await this._runPlugins(stateWithDb, 'pre-tree') as CMS
    return stateWithDb
  }

  async fetch(): Promise<CMS> {
    let cachedCMS, optionsHaveChanged
    if (fs.existsSync(this.localCacheUrl)) {
      try {
        cachedCMS = JSONParseWithFunctions(fs.readFileSync(this.localCacheUrl, 'utf-8')) as CMS
        optionsHaveChanged = cachedCMS.metadata.options !== this.cms.metadata.options
      }
      catch (e) {
        if (this.debug)
          console.error('Parsing cached CMS failed. Using API instead.')
      }
    }
    this.withinRefreshTimeout = Boolean(cachedCMS && ((cachedCMS.lastUpdateTimestamp
      && (Date.now() < cachedCMS.lastUpdateTimestamp + _.toNumber(this.refreshTimeout)))
        && !optionsHaveChanged))

    if (!this.quietMode)
      log.step(kleur.red('[ncms]: pulling your content from Notion...🛸'))
    try {
      const cmsOutput = await this._getDb(this.cms, cachedCMS)
      if (!cmsOutput)
        throw new Error('NotionCMS Error: DB fetch unsuccessful.')
      this.cms = cmsOutput

      this.cms = await this._getPageContent(this.cms, cachedCMS)
      this.cms.stages.push('complete')
      this.export()
      if (!this.quietMode)
        log.step(kleur.green('[ncms]: mission complete! 👽'))
    }
    catch (e) {
      if (!this.quietMode)
        clackSpinner.stop(kleur.red('[ncms]: Something went wrong. Mission aborted.'))
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      console.error(`ncms error: ${e}`)
    }

    this.cms.routes = this.routes
    this.cms.metadata.stats = {
      ...this.logger.stats,
      totalPages: this.cms.metadata.stats.totalPages,
      durationSeconds: (Date.now() - this.timer) / 1000,
    }
    if (this.debug)
      writeFile('debug/site-data.json', JSONStringifyWithFunctions(this.cms))
    return this.cms
  }

  async asyncWalk(cb: Function, path?: string) {
    const startPoint = path ? this.queryByPath(path) : this.cms.siteData
    await new AsyncWalkBuilder()
      .withCallback({
        nodeTypeFilters: ['object'],
        filters: [(node: WalkNode) => NotionCMS._isPageContentObject(node)],
        callback: (node: WalkNode) => cb(node.val) as AsyncCallbackFn,
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
        callback: (node: WalkNode) => cb(node.val) as unknown,
      })
      .withRootObjectCallbacks(false)
      .walk(startPoint)
  }

  getTaggedCollection(tags: string | Array<string>): Array<Page | undefined> {
    if (!_.isArray(tags))
      tags = [tags]
    const taggedPages = [] as Array<string>
    for (const tag of tags)
      taggedPages.push(...this.cms.tagGroups[tag])

    if (typeof this.cms.siteData !== 'string')
      return _(taggedPages).map(path => this.queryByPath(path)).uniq().value()

    return []
  }

  filterSubPages(pathOrPage: string | Page): Array<Page> {
    if (typeof pathOrPage === 'string')
      pathOrPage = this.queryByPath(pathOrPage)

    return _(pathOrPage)
      .entries()
      .filter(([key]) => key.startsWith('/'))
      .map(e => e[1]).value() as Page[]
  }

  rejectSubPages(pathOrPage: string | Page): Page {
    if (typeof pathOrPage === 'string')
      pathOrPage = this.queryByPath(pathOrPage)

    return _(pathOrPage)
      .entries()
      .reject(([key]) => key.startsWith('/'))
      .fromPairs().value() as Page
  }

  _queryByPath(path: string, siteData: Record<string, Page>): Page {
    const segments = path.split('/').slice(1)
    if (this.rootAlias && path !== '/')
      segments.unshift('') // This lets us access the root aliased page.
    let access: Page = siteData
    for (const segment of segments) {
      // @ts-expect-error-next-line
      access = access[`/${segment}`] as Page
    }
    return access
  }

  queryByPath(path: string): Page {
    return this._queryByPath(path, this.cms.siteData)
  }

  export({ pretty = false, path = this.localCacheUrl }:
  { pretty?: boolean; path?: string } = {}) {
    this.cms.lastUpdateTimestamp = Date.now()
    if (pretty) {
      // This drops Functions too, so only use for inspection
      writeFile(path, JSON.stringify(this.cms, filterAncestors))
    }
    else {
      writeFile(path, JSONStringifyWithFunctions(this.cms))
    }
  }

  async import(previousState: string, flatted?: boolean): Promise<CMS> {
    let parsedPreviousState
    try {
      if (flatted)
        parsedPreviousState = JSONParseWithFunctions(previousState) as CMS

      else
        parsedPreviousState = JSON.parse(previousState) as CMS
    }
    catch (e) {
      throw new Error(`Parsing input CMS failed.
                      Make sure your input follows the NotionCMS spec, uses a validator plugin or a transformation plugin.`)
    }
    const transformedPreviousState = await this._runPlugins(parsedPreviousState, 'import') as CMS
    return this.cms = transformedPreviousState
  }

  purgeCache(): boolean {
    try {
      fs.rmSync(this.localCacheUrl)
    }
    catch (e) {
      if (this.debug)
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        console.log(`ncms: error when attempting to clear cache: ${e}`)
      return false
    }
    if (this.debug)
      console.log('ncms: cache has been successfully cleared.')
    return true
  }
}
