import NotionCMS, { NotionBlocksParser, blocksRenderPlugin } from '../dist/index.mjs'
import { suite } from 'uvu';
import * as assert from 'uvu/assert';
import dotenv from 'dotenv'
import { removeCircular } from './test-utils.mjs'

import {
  expectedRoutes,
  expectedRejectedPageData,
  expectedTags,
  expectedSiteData,
  expectedTaggedCollection
} from './notion-api-mock.spec.mjs';

dotenv.config()

const databaseId = '610627a9-28b1-4477-b660-c00c5364435b'
const notionAPIKey = process.env.NOTION
let PluginsDefaultCMS,
  PluginsDefaultOtherCMS,
  PluginsCustomCMS,
  PluginsCustomFallbackCMS

// const noMock = process.argv[2]

// if (!noMock) {
//   await import('./notion-api-mock.spec.mjs')
// }

// Helper Function for parsing internal block rich text
const parseRichText = NotionBlocksParser.parseRichText

const PluginsDefault = suite('PluginsDefault')

PluginsDefault.before(async () => {
  PluginsDefaultCMS = new NotionCMS({
    databaseId,
    notionAPIKey,
    draftMode: true,
    // No Plugins - use default renderer plugin behind the scenes
  })
  await PluginsDefaultCMS.fetch()
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
  // Ignore content for now
  const filtered = structuredClone(PluginsDefaultCMS.cms.siteData)
  removeCircular(filtered)
  assert.equal(filtered, expectedSiteData)
})

const PluginsDefaultOther = suite('PluginsDefaultOther')

PluginsDefaultOther.before(async () => {
  PluginsDefaultOtherCMS = new NotionCMS({
    databaseId,
    notionAPIKey,
    draftMode: true,
    // Standin Plugin - use default renderer plugin behind the scenes
    plugins: [() => ({
      name: 'ncms-placeholder-plugin',
      hook: 'post-parse',
      exec: (block) => block
    })]
  })
  await PluginsDefaultOtherCMS.fetch()
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
  // Ignore content for now
  const filtered = structuredClone(PluginsDefaultOtherCMS.cms.siteData)
  removeCircular(filtered)
  assert.equal(filtered, expectedSiteData)
})

const PluginsCustom = suite('PluginsCustom')

PluginsCustom.before(async () => {
  PluginsCustomCMS = new NotionCMS({
    // Kitchen sink DB in community/tests
    databaseId: '21608fc7-c1c5-40a1-908f-9ade89585111',
    notionAPIKey,
    debug: true,
    // Should work with other plugin too
    plugins: [() => ({
      name: 'ncms-placeholder-plugin',
      hook: 'post-parse',
      exec: (block) => block
    }),
    // use custom renderer plugin behind the scenes
    blocksRenderPlugin({
      blockRenderers: {
        // AudioBlock: (block) => ``,
        // BulletedListItemBlock: (block) => ``,
        CalloutBlock: (block) => `<div ncms-test callout>${parseRichText(block.callout.rich_text)}</div ncms-test callout>`,
        // CodeBlock: (block) => ``,
        // EmbedBlock: (block) => ``,
        // FileBlock: (block) => ``,
        // HeadingBlock: (block) => ``,
        // ImageBlock: (block) => ``,
        // NumberedListItemBlock: (block) => ``,
        // ParagraphBlock: (block) => ``,
        // PDFBlock: (block) => ``,
        QuoteBlock: (block) => `<div ncms-test quote>${parseRichText(block.quote.rich_text)}</div ncms-test quote>`,
        // RichText: (block) => ``,
        // ToDoBlock: (block) => ``,
        // ToggleBlock: (block) => ``,
        // VideoBlock: (block) => ``,
      }
    })]
  })
  await PluginsCustomCMS.fetch()
  PluginsCustomCMS.export({ pretty: true, path: `${process.cwd()}/debug/custom.json` })
})

PluginsCustom('has custom render', () => {
  assert.equal(1, 1)
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
          CalloutBlock: (block) => null, // Nulls should invoke default renderer
          QuoteBlock: (block) => null, // Nulls should invoke default renderer
        }
      })]
  })
  await PluginsCustomFallbackCMS.fetch()
})


PluginsDefault.run();
PluginsDefaultOther.run();
PluginsCustom.run();
PluginsCustomFallback.run();
