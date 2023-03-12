import NotionCMS from '../dist/index.js'
import dotenv from 'dotenv'
import { test } from 'uvu';
import * as assert from 'uvu/assert';

const noMock = process.argv[2]

if (!noMock) {
  await import('./notion-api-mock.spec.js')
}

dotenv.config()

const testCMS = new NotionCMS({
  databaseId: 'e4fcd5b3-1d6a-4afd-b951-10d56ce436ad',
  notionAPIKey: process.env.NOTION
})

await testCMS.fetch()

function removeContent(obj) {
  for (const prop in obj) {
    if (prop === 'content')
      // delete obj[prop];
      obj[prop] = ''
    else if (typeof obj[prop] === 'object')
      removeContent(obj[prop]);
  }
}

const expectedRoutes = [
  '/about',
  '/team',
  '/team/mortimer',
  '/team/jacob',
  '/pricing',
  '/posts',
  '/posts/how-to-use-notion-cms',
  '/posts/how-to-build-a-blog-with-notion'
]

const expectedSiteData = {
  '/about': {
    name: 'about',
    authors: ['Jacob Milhorn'],
    content: '',
    coverImage: undefined
  },
  '/team': {
    name: 'team',
    authors: [],
    content: '',
    coverImage: undefined,
    '/mortimer': {
      name: 'mortimer',
      authors: [],
      content: '',
      coverImage: undefined
    },
    '/jacob': {
      name: 'jacob',
      authors: [],
      content: '',
      coverImage: undefined
    }
  },
  '/pricing': {
    name: 'pricing',
    authors: [],
    content: '',
    coverImage: undefined
  },
  '/posts': {
    name: 'posts',
    authors: ['Jacob Milhorn'],
    content: '',
    coverImage: undefined,
    '/how-to-use-notion-cms': {
      name: 'how-to-use-notion-cms',
      authors: [],
      content: '',
      coverImage: undefined
    },
    '/how-to-build-a-blog-with-notion': {
      name: 'how-to-build-a-blog-with-notion',
      authors: [],
      content: '',
      coverImage: undefined
    }
  }
}

test('routes', () => {
  assert.equal(testCMS.routes.sort(), expectedRoutes.sort())
})

test('siteData', () => {
  // Ignore content for now
  const filtered = structuredClone(testCMS.cms.siteData)
  removeContent(filtered)
  assert.equal(filtered, expectedSiteData)
})

test.run();