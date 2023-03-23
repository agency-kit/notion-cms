import Bottleneck from "bottleneck";
import NotionCMS from '../dist/index.mjs'
import dotenv from 'dotenv'
import { test } from 'uvu';
import * as assert from 'uvu/assert';
import { removeContent } from "./test-utils.mjs";

import { expectedRoutes, expectedSiteData, expectedTaggedCollection } from './notion-api-mock.spec.mjs';

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
  databaseId: 'e4fcd5b3-1d6a-4afd-b951-10d56ce436ad',
  notionAPIKey: process.env.NOTION,
  draftMode: true,
  debug: true,
  limiter
})

await testCMS.fetch()

test('routes', () => {
  assert.equal(testCMS.routes.sort(), expectedRoutes.sort())
})

test('siteData', () => {
  // Ignore content for now
  const filtered = structuredClone(testCMS.cms.siteData)
  removeContent(filtered, 'content')
  assert.equal(filtered, expectedSiteData)
})

test('taggedCollection', () => {
  const results = testCMS.getTaggedCollection(['notion', 'javascript'])
  results.forEach(result => removeContent(result, 'content'))
  assert.equal(results, expectedTaggedCollection)
})

test.run();
