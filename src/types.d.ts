import {
  PageObjectResponse,
  RichTextItemResponse,
  SelectPropertyResponse
} from '@notionhq/client/build/src/api-endpoints'

declare global {
  interface String {
    route: string,
    slug: string
  }
}

export interface Options {
  databaseId: string,
  notionAPIKey: string,
  debug?: boolean,
  draftMode?: boolean,
  refreshTimeout?: number, // in ms
  localCacheDirectory?: string
  rootUrl?: string | URL | undefined // Used to generate full path links,
  limiter?: { schedule: Function },
  plugins?: Array<Plugin>
}

export interface CMS {
  stages: Array<string>,
  lastUpdateTimestamp?: number,
  metadata: {
    rootUrl?: string | URL | undefined,
    databaseId: string
  },
  routes: Array<string | Array>,
  tags: Array<string>,
  tagGroups: Record<string, Array<string>>
  siteData: Record<string, Page>
}

export type PageContent = {
  name?: string,
  path?: string,
  url?: string,
  _notion?: {
    id: string,
    last_edited_time: string,
  }
  authors?: Array<string>,
  tags?: Array<string>,
  coverImage?: string,
  content?: string,
  metaTitle?: string,
  metaDescription?: string
}

export type Route = {
  [key: string]: PageContent
}

export type Page = PageContent | (PageContent & Route)

// Directly stolen from PageObjectResponse Record Type in notionClient/API-endpoints.ts
export type PageObjectTitle = { type: "title"; title: Array<RichTextItemResponse>; id: string }

export type PageObjectRelation = { type: "relation"; relation: Array<{ id: string }>; id: string }

export type PageObjectUser = {
  type: "people"
  people: Array<PartialUserObjectResponse | UserObjectResponse>
  id: string
}

export type PageMultiSelect = {
  type: "multi_select"
  multi_select: Array<SelectPropertyResponse>
  id: string
}

export type PageRichText = {
  type: "rich_text";
  rich_text: Array<RichTextItemResponse>;
  id: string;
}

export type Cover = { type: "external"; external: { url: TextRequest } } | { type: "file"; file: { url: string; expiry_time: string } } | null

export type RouteObject = [string, object]

export interface Plugin {
  name: string,
  core: boolean,
  hook: 'pre-tree' | 'pre-parse' | 'post-parse' | 'post-tree'
  exec: (context: Blocks | string | CMS) => Blocks | string | CMS
}