import NotionCMS from '../dist/index.mjs'
import dotenv from 'dotenv'
import { test } from 'uvu';
import * as assert from 'uvu/assert';

const noMock = process.argv[2]

if (!noMock) {
  await import('./notion-api-mock.spec.mjs')
}

dotenv.config()

const testCMS = new NotionCMS({
  databaseId: 'e4fcd5b3-1d6a-4afd-b951-10d56ce436ad',
  notionAPIKey: process.env.NOTION,
  debug: true
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
    authors: ['Jacob'],
    tags: [],
    content: '',
    coverImage: undefined
  },
  '/team': {
    name: 'team',
    authors: [],
    tags: [],
    content: '',
    coverImage: undefined,
    '/mortimer': {
      name: 'mortimer',
      authors: [],
      tags: [],
      content: '',
      coverImage: undefined
    },
    '/jacob': {
      name: 'jacob',
      authors: [],
      tags: [],
      content: '',
      coverImage: undefined
    }
  },
  '/pricing': {
    name: 'pricing',
    authors: [],
    tags: [],
    content: '',
    coverImage: undefined
  },
  '/posts': {
    name: 'posts',
    authors: ['Jacob'],
    tags: [],
    content: '',
    coverImage: undefined,
    '/how-to-use-notion-cms': {
      name: 'how-to-use-notion-cms',
      authors: [],
      tags: ['blog', 'notion', 'javascript'],
      content: '',
      coverImage: undefined
    },
    '/how-to-build-a-blog-with-notion': {
      name: 'how-to-build-a-blog-with-notion',
      authors: [],
      tags: ['blog', 'notion'],
      content: '',
      coverImage: undefined
    }
  }
}

const expectedTaggedCollection = [
  {
    name: 'how-to-build-a-blog-with-notion',
    authors: [],
    tags: ['blog', 'notion'],
    coverImage: undefined,
    content: ''
  },
  {
    name: 'how-to-use-notion-cms',
    authors: [],
    tags: ['blog', 'notion', 'javascript'],
    coverImage: undefined,
    content: ''
  },
]

test('routes', () => {
  assert.equal(testCMS.routes.sort(), expectedRoutes.sort())
})

test('siteData', () => {
  // Ignore content for now
  const filtered = structuredClone(testCMS.cms.siteData)
  removeContent(filtered)
  assert.equal(filtered, expectedSiteData)
})

test('taggedCollection', () => {
  const results = testCMS.getTaggedCollection(['notion', 'javascript'])
  results.forEach(result => removeContent(result))
  assert.equal(results, expectedTaggedCollection)
})

test.run();
