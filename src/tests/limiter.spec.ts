// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { setTimeout } from 'node:timers/promises'
import Bottleneck from 'bottleneck'
import dotenv from 'dotenv'
import { suite } from 'uvu'
import * as assert from 'uvu/assert'
import NotionCMS from '../index'

import type { Content, PageContent } from '../types'
import {
  expectedRejectedPageData,
  expectedRoutes,
  expectedSiteData,
  expectedTagGroups,
  expectedTaggedCollection,
  expectedTags,
} from './notion-api-mock.spec'

dotenv.config()

export const TestLimiter = suite('TestLimiter')

const databaseId = '610627a9-28b1-4477-b660-c00c5364435b'

const limiter = new Bottleneck({
  maxConcurrent: 1,
  minTime: 333,
})

const testCMS = new NotionCMS({
  databaseId,
  notionAPIKey: process.env.NOTION,
  draftMode: true,
  limiter,
})

console.log('limiter test: purging cache')
testCMS.purgeCache()

await testCMS.fetch()

// temporarily ignore md and plaintext versions of content
function filterContent(content: Content) {
  delete content.plaintext
  delete content.markdown
  return content
}

testCMS.walk((node: PageContent) => filterContent(node.content))

// routes
// walk is used by routes so this is tested here implicitly
TestLimiter('routes', () => {
  assert.equal(testCMS.routes.sort(), expectedRoutes.sort())
})

// tags
TestLimiter('tags', () => {
  assert.equal(testCMS.cms.tags.sort(), expectedTags.sort())
})

// Tree structures
TestLimiter('siteData', () => {
  assert.equal(testCMS.cms.siteData, expectedSiteData)
})

// data getter
TestLimiter('data (getter)', () => {
  assert.equal(testCMS.cms.siteData, testCMS.data)
})

// taggedCollection
TestLimiter('taggedCollection', () => {
  const results = testCMS.getTaggedCollection(['notion', 'programming'])
  assert.equal(results, expectedTaggedCollection)
})

// query by path
TestLimiter('query by path', () => {
  const productB = testCMS.queryByPath('/products/category/product-b')
  assert.equal(productB.name, 'Product B')
  const category = testCMS.queryByPath('/products/category')
  assert.equal(category.name, 'Category')
})

// filter sub pages
TestLimiter('filter sub pages', () => {
  const category = testCMS.queryByPath('/products/category')
  const productsInCategory = testCMS.filterSubPages(category)
  const names = productsInCategory.map((product: PageContent) => product.name)
  assert.equal(names, ['Product B', 'Product A'])

  // Uncomment when fuzzy search is built
  // const categoryB = testCMS.queryByPath('/category')
  // const productsInCategoryB = testCMS.filterSubPages(categoryB)
  // const namesB = productsInCategoryB.map(product => product.name)
  // assert.equal(namesB, ['Product B', 'Product A'])
})

// reject sub pages
TestLimiter('reject sub pages', () => {
  const category = testCMS.queryByPath('/products/category')
  const categoryProps = testCMS.rejectSubPages(category)
  assert.equal(categoryProps, expectedRejectedPageData)

  // Uncomment when fuzzy search is built
  // const categoryB = testCMS.queryByPath('/category')
  // const categoryPropsB = testCMS.rejectSubPages(categoryB)
  // assert.equal(categoryPropsB, expectedRejectedPageData)
})

TestLimiter('walk from partial path', () => {
  const test = []
  testCMS.walk((node: PageContent) => test.push(node.name), '/products/category')
  assert.equal(test, ['Product B', 'Product A'])
})

TestLimiter('async walk from partial path', async () => {
  const test = []
  await testCMS.asyncWalk(async (node: PageContent) => await setTimeout(test.push(node.name), 300), '/products/category')
  assert.equal(test, ['Product B', 'Product A'])
})

TestLimiter('import', async () => {
  assert.equal(
    await testCMS.import(JSON.stringify({
      metadata: {
        databaseId,
        rootUrl: '',
      },
      stages: [
        'db',
        'content',
        'complete',
      ],
      routes: [],
      tags: expectedTags,
      tagGroups: expectedTagGroups,
      siteData: expectedSiteData,
    })),
    testCMS.cms,
  )
})

TestLimiter('import fails', async () => {
  try {
    await testCMS.import()
    assert.unreachable('should have thrown')
  }
  catch (err) {
    assert.instance(err, Error)
  }
})
