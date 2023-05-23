import { setTimeout } from 'node:timers/promises'
import dotenv from 'dotenv'
import { test } from 'uvu'
import * as assert from 'uvu/assert'
import NotionCMS from '../dist/index.mjs'

import {
  expectedRejectedPageData,
  expectedRoutes,
  expectedSiteData,
  expectedTagGroups,
  expectedTaggedCollection,
  expectedTags,
} from './notion-api-mock.spec.mjs'

dotenv.config()

const databaseId = '610627a9-28b1-4477-b660-c00c5364435b'

const testCMS = new NotionCMS({
  databaseId,
  notionAPIKey: process.env.NOTION,
  draftMode: true,
})

await testCMS.fetch()

// temporarily ignore md and plaintext versions of content
function filterContent(content) {
  delete content.plaintext
  delete content.markdown
  return content
}

testCMS.walk(node => filterContent(node.content))

// routes
// walk is used by routes so this is tested here implicitly
test('routes', () => {
  assert.equal(testCMS.routes.sort(), expectedRoutes.sort())
})

// tags
test('tags', () => {
  assert.equal(testCMS.cms.tags.sort(), expectedTags.sort())
})

// Tree structures
test('siteData', () => {
  assert.equal(testCMS.cms.siteData, expectedSiteData)
})

// data getter
test('data (getter)', () => {
  assert.equal(testCMS.cms.siteData, testCMS.data)
})

// taggedCollection
test('taggedCollection', () => {
  const results = testCMS.getTaggedCollection(['notion', 'programming'])
  assert.equal(results, expectedTaggedCollection)
})

// query by path
test('query by path', () => {
  const productB = testCMS.queryByPath('/products/category/product-b')
  assert.equal(productB.name, 'Product B')
  const category = testCMS.queryByPath('/products/category')
  assert.equal(category.name, 'Category')
})

// filter sub pages
test('filter sub pages', () => {
  const category = testCMS.queryByPath('/products/category')
  const productsInCategory = testCMS.filterSubPages(category)
  const names = productsInCategory.map(product => product.name)
  assert.equal(names, ['Product B', 'Product A'])

  // Uncomment when fuzzy search is built
  // const categoryB = testCMS.queryByPath('/category')
  // const productsInCategoryB = testCMS.filterSubPages(categoryB)
  // const namesB = productsInCategoryB.map(product => product.name)
  // assert.equal(namesB, ['Product B', 'Product A'])
})

// reject sub pages
test('reject sub pages', () => {
  const category = testCMS.queryByPath('/products/category')
  const categoryProps = testCMS.rejectSubPages(category)
  assert.equal(categoryProps, expectedRejectedPageData)

  // Uncomment when fuzzy search is built
  // const categoryB = testCMS.queryByPath('/category')
  // const categoryPropsB = testCMS.rejectSubPages(categoryB)
  // assert.equal(categoryPropsB, expectedRejectedPageData)
})

test('walk from partial path', () => {
  const test = []
  testCMS.walk(node => test.push(node.name), '/products/category')
  assert.equal(test, ['Product B', 'Product A'])
})

test('async walk from partial path', async () => {
  const test = []
  await testCMS.asyncWalk(async node => await setTimeout(test.push(node.name), 300), '/products/category')
  assert.equal(test, ['Product B', 'Product A'])
})

test('import', async () => {
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

test('import fails', async () => {
  try {
    await testCMS.import()
    assert.unreachable('should have thrown')
  }
  catch (err) {
    assert.instance(err, Error)
  }
})

test.run()
