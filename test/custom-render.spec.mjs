import { suite } from 'uvu'
import * as assert from 'uvu/assert'
import dotenv from 'dotenv'
import NotionCMS, { NotionBlocksParser, blocksRenderPlugin } from '../dist/index.mjs'

import {
  expectedKitchenSinkSiteData,
  expectedRoutes,
  expectedSiteData,
  expectedTags,
} from './notion-api-mock.spec.mjs'

dotenv.config()

// Kitchen sink database
const databaseId = '21608fc7-c1c5-40a1-908f-9ade89585111'
const notionAPIKey = process.env.NOTION

let PluginsDefaultCMS,
  PluginsDefaultOtherCMS,
  PluginsCustomCMS,
  PluginsCustomFallbackCMS

// Helper Function for parsing internal block rich text
const parseRichText = NotionBlocksParser.parseRichText

// temporarily ignore md and plaintext versions of content
function filterContent(content) {
  delete content.plaintext
  delete content.markdown
  return content
}

const PluginsDefault = suite('PluginsDefault')

PluginsDefault.before(async () => {
  PluginsDefaultCMS = new NotionCMS({
    databaseId: '610627a9-28b1-4477-b660-c00c5364435b',
    notionAPIKey,
    draftMode: true,
    // No Plugins - use default renderer plugin behind the scenes
  })
  await PluginsDefaultCMS.fetch()
  PluginsDefaultCMS.walk(node => filterContent(node.content))
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

const PluginsDefaultOther = suite('PluginsDefaultOther')

PluginsDefaultOther.before(async () => {
  PluginsDefaultOtherCMS = new NotionCMS({
    databaseId: '610627a9-28b1-4477-b660-c00c5364435b',
    notionAPIKey,
    draftMode: true,
    // Standin Plugin - use default renderer plugin behind the scenes
    plugins: [() => ({
      name: 'ncms-placeholder-plugin',
      hook: 'post-parse',
      exec: block => block,
    })],
  })
  await PluginsDefaultOtherCMS.fetch()
  PluginsDefaultOtherCMS.walk(node => filterContent(node.content))
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

const PluginsCustom = suite('PluginsCustom')

PluginsCustom.before(async () => {
  PluginsCustomCMS = new NotionCMS({
    // Kitchen sink DB in community/tests
    databaseId,
    notionAPIKey,
    // Should work with other plugin too
    plugins: [() => ({
      name: 'ncms-placeholder-plugin',
      hook: 'post-parse',
      exec: block => block,
    }),
    // use custom renderer plugin behind the scenes
    blocksRenderPlugin({
      blockRenderers: {
        CalloutBlock: block => `<div ncms-test callout>${parseRichText(block.callout.rich_text)}</div ncms-test callout>\n\n`,
        QuoteBlock: block => `<div ncms-test quote>${parseRichText(block.quote.rich_text)}</div ncms-test quote>\n\n`,
      },
    })],
  })
  await PluginsCustomCMS.fetch()
  PluginsCustomCMS.walk(node => filterContent(node.content))
})

PluginsCustom('Custom render correctly alters blocks', () => {
  assert.ok(PluginsCustomCMS.data['/kitchen-sink'].content.html.match(/<div ncms-test callout>([.|\s\S]*)<\/div ncms-test callout>/g))
  assert.ok(PluginsCustomCMS.data['/kitchen-sink'].content.html.match(/<div ncms-test quote>([.|\s\S]*)<\/div ncms-test quote>/g))
})

const PluginsCustomFallback = suite('PluginsCustomFallback')

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
          CalloutBlock: block => null, // Nulls should invoke default renderer
          QuoteBlock: block => null, // Nulls should invoke default renderer
        },
      })],
  })
  await PluginsCustomFallbackCMS.fetch()
  PluginsCustomFallbackCMS.walk(node => filterContent(node.content))
})

PluginsCustomFallback('Custom render correctly uses fallback block renderer ', () => {
  assert.equal(PluginsCustomFallbackCMS.cms.siteData['/kitchen-sink'].content.html, expectedKitchenSinkSiteData['/kitchen-sink'].content.html)
})

PluginsDefault.run()
PluginsDefaultOther.run()
PluginsCustom.run()
PluginsCustomFallback.run()
