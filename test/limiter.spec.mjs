import Bottleneck from "bottleneck";
import NotionCMS from '../dist/index.mjs'
import dotenv from 'dotenv'
import { test } from 'uvu';
import * as assert from 'uvu/assert';
import { removeCircular } from "./test-utils.mjs";

import {
  expectedRoutes,
  expectedRejectedPageData,
  expectedSiteData,
  expectedTaggedCollection,
  expectedTags
} from './notion-api-mock.spec.mjs';

const noMock = process.argv[2]

if (!noMock) {
  await import('./notion-api-mock.spec.mjs')
}

dotenv.config()

const limiter = new Bottleneck({
  maxConcurrent: 1,
  minTime: 333
})

const testCMS = new NotionCMS({
  databaseId: '610627a9-28b1-4477-b660-c00c5364435b',
  notionAPIKey: process.env.NOTION,
  draftMode: true,
  debug: true,
  limiter
})

await testCMS.fetch()

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
  // Ignore content for now
  const filtered = structuredClone(testCMS.cms.siteData)
  removeCircular(filtered)
  assert.equal(filtered, expectedSiteData)
})

// taggedCollection
test('taggedCollection', () => {
  const results = testCMS.getTaggedCollection(['notion', 'programming'])
  results.forEach(result => removeCircular(result))
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

test.run();
