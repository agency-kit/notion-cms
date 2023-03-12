import {PageObjectResponse, DatabaseObjectResponse, RichTextItemResponse } from '@notionhq/client/build/src/api-endpoints'


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
  metadata?: {},
  routes: Array<string>,
  siteData: Record<string, Page>
}

export type PageContent = {
  name: string,
  authors: Array<string>,
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

export type Cover = { type: "external"; external: { url: TextRequest } } | { type: "file"; file: { url: string; expiry_time: string } } | null