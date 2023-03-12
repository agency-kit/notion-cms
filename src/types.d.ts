import {PageObjectResponse, DatabaseObjectResponse } from '@notionhq/client/build/src/api-endpoints'


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

export type Page = PageContent | PageContent & {
  [key: string]: PageContent
}

export type TitleDatabasePropertyConfigResponse = DatabaseObjectResponse['properties']['name']