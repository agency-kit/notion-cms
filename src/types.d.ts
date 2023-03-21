import {PageObjectResponse, DatabaseObjectResponse, RichTextItemResponse, SelectPropertyResponse } from '@notionhq/client/build/src/api-endpoints'

declare global {
  interface String {
    route: string,
    slug: string
  }
}

export interface PageEntry {
  parentName: string,
  entry: PageObjectResponse
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
  transient?: Record<string, Transient>
  siteData: Record<string, Page>
}

export type Transient = {
  name: string,
  parentPage: string | undefined,
}

export interface pendingEntry {
  id: string,
  entry: Transient
}

export type PageContent = {
  name: string,
  authors?: Array<string>,
  tags: Array<string>,
  coverImage: URL,
  content: string,
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

export type Cover = { type: "external"; external: { url: TextRequest } } | { type: "file"; file: { url: string; expiry_time: string } } | null

export type RouteObject = [string, object]

