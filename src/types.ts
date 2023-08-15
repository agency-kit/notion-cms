import type {
  PageObjectResponse,
  PersonUserObjectResponse,
  RichTextItemResponse,
} from '@notionhq/client/build/src/api-endpoints'

import type { Blocks } from '@notion-stuff/v4-types'
import type { Client } from '@notionhq/client'
import type NotionBlocksParser from './notion-blocks-parser'

declare global {
  interface String {
    route: string
    slug: string
  }
}

export type Properties = Partial<PageObjectResponse['properties']>

export interface Options {
  databaseId: string
  notionAPIKey: string
  debug?: boolean
  draftMode?: boolean
  autoUpdate?: boolean
  refreshTimeout?: number | string // in ms or converted from human readable string
  localCacheDirectory?: string
  rootAlias?: string
  quiet?: boolean
  rootUrl?: string | URL | undefined // Used to generate full path links,
  limiter?: { schedule: Function }
  plugins?: Array<Plugin | UnsafePlugin>
}

export interface Stats {
  durationSeconds: number
  totalAPICalls: number
  succeededCalls: number
  failedCalls: number
  totalPages: number
}

export interface Content {
  plaintext: string
  markdown: string
  html: string
}

export interface CMS {
  stages: Array<string>
  lastUpdateTimestamp?: number
  metadata: {
    options?: string
    rootUrl?: string | URL | undefined
    databaseId: string
    stats: Partial<Stats>
  }
  routes: Array<string | Array<string>>
  tags: Array<string>
  tagGroups: Record<string, Array<string>>
  siteData: Record<string, Page>
}

export interface PageContent {
  _ancestors?: PageContent[]
  _updateNeeded?: boolean
  name?: string
  path?: string
  url?: string
  otherProps?: PageObjectResponse['properties']
  _notion?: {
    parent?: PageContent
    id: string
    last_edited_time: string
  }
  authors?: Array<string>
  slug?: string
  tags?: Array<string>
  coverImage?: string
  content?: Content
}

export interface Route {
  [key: string]: PageContent
}

export type ExtendedPageContent = PageContent & {
  [key: string]: unknown
}

export type Page = PageContent | (PageContent & Route) | ExtendedPageContent

// Directly stolen from PageObjectResponse Record Type in notionClient/API-endpoints.ts
export interface PageObjectTitle { type: 'title'; title: Array<RichTextItemResponse>; id: string }

export interface PageObjectRelation { type: 'relation'; relation: Array<{ id: string }>; id: string }

export interface PageObjectUser {
  type: 'people'
  people: Array<PersonUserObjectResponse>
  id: string
}

export interface PageMultiSelect {
  type: 'multi_select'
  multi_select: Array<{
    id: string
    name: string
    color: string
  }>
  id: string
}

export interface PageSelect {
  type: 'select'
  select: {
    id: string
    name: string
    color: string
  } | null
  id: string
}

export interface PageRichText {
  type: 'rich_text'
  rich_text: Array<RichTextItemResponse>
  id: string
}

export type Cover = { type: 'external'; external: { url: string } } | { type: 'file'; file: { url: string; expiry_time: string } } | null

export type RouteObject = [string, object]

export type PluginPassthrough = Blocks | CMS | Page | string

export interface PluginExecOptions {
  debug?: boolean
  localCacheDirectory?: string
  notion?: Client
}

export interface Plugin {
  name: string
  hook: 'import' | 'pre-tree' | 'pre-parse' | 'post-parse' | 'during-tree' | 'post-tree' | '*'
  exec: (context: PluginPassthrough, instanceOptions?: PluginExecOptions) => PluginPassthrough
}

export interface UnsafePlugin {
  parser: NotionBlocksParser
  name: string
  core: boolean
  hook: 'parse' | 'import' | 'pre-tree' | 'pre-parse' | 'post-parse' | 'during-tree' | 'post-tree' | '*'
  exec: (context: PluginPassthrough, instanceOptions?: PluginExecOptions) => PluginPassthrough
}

export interface FlatListItem {
  _key: string
  [pid: string]: string | Partial<FlatListItem> | unknown
}

export type FlatList = FlatListItem[]
