// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { suite } from 'uvu'
import * as assert from 'uvu/assert'
import dotenv from 'dotenv'
import type { Block } from '@notion-stuff/v4-types'
import NotionCMS, { NotionBlocksParser, blocksRenderPlugin } from '../../dist/index.js'
import type { Content, PageContent } from '../types'

import {
  expectedKitchenSinkSiteData,
  expectedRoutes,
  expectedSiteData,
  expectedTags,
} from './notion-api-mock.spec'

dotenv.config()

// Kitchen sink database
const databaseId = '21608fc7-c1c5-40a1-908f-9ade89585111'
const notionAPIKey = process.env.NOTION

let PluginsDefaultCMS: NotionCMS,
  PluginsDefaultOtherCMS: NotionCMS,
  PluginsCustomCMS: NotionCMS,
  PluginsCustomFallbackCMS: NotionCMS

// Helper Function for parsing internal block rich text
// eslint-disable-next-line jest/unbound-method
const parseRichText = NotionBlocksParser.parseRichText

// temporarily ignore md and plaintext versions of content
function filterContent(content: Content) {
  delete content.plaintext
  delete content.markdown
  return content
}

export const PluginsDefault = suite('PluginsDefault')

PluginsDefault.before(async () => {
  PluginsDefaultCMS = new NotionCMS({
    databaseId: '610627a9-28b1-4477-b660-c00c5364435b',
    notionAPIKey,
    draftMode: true,
    // No Plugins - use default renderer plugin behind the scenes
  })
  await PluginsDefaultCMS.fetch()
  PluginsDefaultCMS.walk((node: PageContent) => filterContent(node.content))
})

// routes
// walk is used by routes so this is tested here implicitly
PluginsDefault('routes', () => {
  assert.equal(PluginsDefaultCMS.routes.sort(), expectedRoutes.sort())
})

// tags
PluginsDefault('tags', () => {
  assert.equal(PluginsDefaultCMS.cms.tags.sort(), expectedTags.sort())
})

// Tree structures
PluginsDefault('siteData', () => {
  assert.equal(PluginsDefaultCMS.cms.siteData, expectedSiteData)
})

export const PluginsDefaultOther = suite('PluginsDefaultOther')

PluginsDefaultOther.before(async () => {
  PluginsDefaultOtherCMS = new NotionCMS({
    databaseId: '610627a9-28b1-4477-b660-c00c5364435b',
    notionAPIKey,
    draftMode: true,
    // Standin Plugin - use default renderer plugin behind the scenes
    plugins: [() => ({
      name: 'ncms-placeholder-plugin',
      hook: 'post-parse',
      exec: (block: Block) => block,
    })],
  })
  await PluginsDefaultOtherCMS.fetch()
  PluginsDefaultOtherCMS.walk((node: PageContent) => filterContent(node.content))
})

// routes
// walk is used by routes so this is tested here implicitly
PluginsDefaultOther('routes', () => {
  assert.equal(PluginsDefaultOtherCMS.routes.sort(), expectedRoutes.sort())
})

// tags
PluginsDefaultOther('tags', () => {
  assert.equal(PluginsDefaultOtherCMS.cms.tags.sort(), expectedTags.sort())
})

// Tree structures
PluginsDefaultOther('siteData', () => {
  assert.equal(PluginsDefaultOtherCMS.cms.siteData, expectedSiteData)
})

export const PluginsCustom = suite('PluginsCustom')

PluginsCustom.before(async () => {
  PluginsCustomCMS = new NotionCMS({
    // Kitchen sink DB in community/tests
    databaseId,
    notionAPIKey,
    // Should work with other plugin too
    plugins: [() => ({
      name: 'ncms-placeholder-plugin',
      hook: 'post-parse',
      exec: (block: Block) => block,
    }),
    // use custom renderer plugin behind the scenes
    blocksRenderPlugin({
      blockRenderers: {
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions, @typescript-eslint/no-unsafe-member-access
        CalloutBlock: block => `<div ncms-test callout>${parseRichText(block.callout.rich_text)}</div ncms-test callout>\n\n`,
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions, @typescript-eslint/no-unsafe-member-access
        QuoteBlock: block => `<div ncms-test quote>${parseRichText(block.quote.rich_text)}</div ncms-test quote>\n\n`,
      },
    })],
  })
  await PluginsCustomCMS.fetch()
  PluginsCustomCMS.walk((node: PageContent) => filterContent(node.content))
})

PluginsCustom('Custom render correctly alters blocks', () => {
  assert.ok((PluginsCustomCMS.data['/kitchen-sink'] as PageContent)
    .content.html.match(/<div ncms-test callout>([.|\s\S]*)<\/div ncms-test callout>/g))
  assert.ok((PluginsCustomCMS.data['/kitchen-sink'] as PageContent)
    .content.html.match(/<div ncms-test quote>([.|\s\S]*)<\/div ncms-test quote>/g))
})

export const PluginsCustomFallback = suite('PluginsCustomFallback')

PluginsCustomFallback.before(async () => {
  PluginsCustomFallbackCMS = new NotionCMS({
    databaseId,
    notionAPIKey,
    draftMode: true,
    // Should work with other plugin too
    plugins: [
      // use custom renderer plugin behind the scenes
      blocksRenderPlugin({
        blockRenderers: {
          CalloutBlock: (block: Block) => null, // Nulls should invoke default renderer
          QuoteBlock: (block: Block) => null, // Nulls should invoke default renderer
        },
      })],
  })
  await PluginsCustomFallbackCMS.fetch()
  PluginsCustomFallbackCMS.walk((node: PageContent) => filterContent(node.content))
})

PluginsCustomFallback('Custom render correctly uses fallback block renderer ', () => {
  assert.equal((PluginsCustomFallbackCMS.cms.siteData['/kitchen-sink'] as PageContent)
    .content.html, (expectedKitchenSinkSiteData['/kitchen-sink'] as PageContent).content.html)
})
