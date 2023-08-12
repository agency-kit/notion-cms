import dotenv from 'dotenv'
import { suite } from 'uvu'
import * as assert from 'uvu/assert'
import nock from 'nock'
import NotionCMS from '../index'
import type { CMS, PluginPassthrough } from '../types'

dotenv.config()

export const TestNotionCMSCache = suite('TestNotionCMSCache')

const cachingDatabaseId = '1234' // this does not exist in notion

const baseUrl = 'https://api.notion.com/v1'

const cachingTestCMS: NotionCMS = new NotionCMS({
  databaseId: cachingDatabaseId,
  notionAPIKey: process.env.NOTION as string,
  draftMode: true,
})

cachingTestCMS.purgeCache()

const topLevelPageId = '456'
const topLevelPageId2 = '789'

TestNotionCMSCache('Unchanged since last edit time uses cache', async () => {
  nock(baseUrl)
    .post(`/databases/${cachingDatabaseId}/query`)
    .query(true)
    .reply(200, {
      object: 'list',
      results: [
        {
          object: 'page',
          id: topLevelPageId,
          created_time: '2023-04-09T06:03:00.000Z',
          last_edited_time: '2023-04-09T06:03:00.000Z',
          created_by: {
            object: 'user',
            id: '4e38fa57-609c-4beb-8e28-271b11cc81a3',
          },
          last_edited_by: {
            object: 'user',
            id: '4e38fa57-609c-4beb-8e28-271b11cc81a3',
          },
          properties: {
            name: {
              id: 'title',
              type: 'title',
              title: [
                {
                  type: 'text',
                  text: {
                    content: 'Page 1',
                    link: null,
                  },
                  annotations: {},
                  plain_text: 'Page 1',
                  href: null,
                },
              ],
            },
            Author: {
              id: 'SQeZ',
              type: 'people',
              people: [
                {
                  object: 'user',
                  id: '4e38fa57-609c-4beb-8e28-271b11cc81a3',
                  name: 'Jacob',
                  avatar_url: null,
                  type: 'person',
                  person: {
                    email: 'jacob@agencykit.so',
                  },
                },
              ],
            },
            Tags: {
              id: 'NNmP',
              type: 'multi_select',
              multi_select: [
                {
                  id: '098acfda-2fb1-4ecf-8737-c03b80b5cb18',
                  name: 'programming',
                  color: 'default',
                },
              ],
            },
          },
          cover: null,
          icon: null,
          archived: false,
          url: 'https://www.notion.so/Product-B-7fc90a1dca4d49ad91b5136c3d5a304d',
        },
        {
          object: 'page',
          id: topLevelPageId2,
          created_time: '2023-04-09T06:03:00.000Z',
          last_edited_time: '2023-04-09T06:03:00.000Z',
          created_by: {
            object: 'user',
            id: '4e38fa57-609c-4beb-8e28-271b11cc81a3',
          },
          last_edited_by: {
            object: 'user',
            id: '4e38fa57-609c-4beb-8e28-271b11cc81a3',
          },
          properties: {
            name: {
              id: 'title',
              type: 'title',
              title: [
                {
                  type: 'text',
                  text: {
                    content: 'Page 2',
                    link: null,
                  },
                  annotations: {},
                  plain_text: 'Page 2',
                  href: null,
                },
              ],
            },
            Author: {
              id: 'SQeZ',
              type: 'people',
              people: [
                {
                  object: 'user',
                  id: '4e38fa57-609c-4beb-8e28-271b11cc81a3',
                  name: 'Jacob',
                  avatar_url: null,
                  type: 'person',
                  person: {
                    email: 'jacob@agencykit.so',
                  },
                },
              ],
            },
            Tags: {
              id: 'NNmP',
              type: 'multi_select',
              multi_select: [
                {
                  id: '098acfda-2fb1-4ecf-8737-c03b80b5cb18',
                  name: 'programming',
                  color: 'default',
                },
              ],
            },
          },
          cover: null,
          icon: null,
          archived: false,
          url: 'https://www.notion.so/Product-B-7fc90a1dca4d49ad91b5136c3d5a304d',
        },
      ],
      next_cursor: null,
      has_more: false,
      type: 'page',
      page: {},
    })

  nock(baseUrl)
    .get(`/blocks/${topLevelPageId}/children`)
    .query(true)
    .reply(200, {
      object: 'list',
      results: [
        {
          object: 'block',
          id: '1c92a5ea-dfeb-4c8f-b662-cde078bb02ad',
          parent: {
            type: 'page_id',
            page_id: topLevelPageId,
          },
          created_time: '2023-04-22T04:34:00.000Z',
          last_edited_time: '2023-04-22T04:34:00.000Z',
          created_by: {
            object: 'user',
            id: '4e38fa57-609c-4beb-8e28-271b11cc81a3',
          },
          last_edited_by: {
            object: 'user',
            id: '4e38fa57-609c-4beb-8e28-271b11cc81a3',
          },
          has_children: false,
          archived: false,
          type: 'heading_1',
          heading_1: {
            rich_text: [
              {
                type: 'text',
                text: {
                  content: 'Block 1: Has not changed.',
                  link: null,
                },
                annotations: {},
                plain_text: 'Block 1: Has not changed.',
                href: null,
              },
            ],
            is_toggleable: false,
            color: 'default',
          },
        },
      ],
    })

  nock(baseUrl)
    .get(`/blocks/${topLevelPageId2}/children`)
    .query(true)
    .reply(200, {
      object: 'list',
      results: [
        {
          object: 'block',
          id: '1c92a5ea-dfeb-4c8f-b662-cde078bb02ad',
          parent: {
            type: 'page_id',
            page_id: topLevelPageId2,
          },
          created_time: '2023-04-22T04:34:00.000Z',
          last_edited_time: '2023-04-22T04:34:00.000Z',
          created_by: {
            object: 'user',
            id: '4e38fa57-609c-4beb-8e28-271b11cc81a3',
          },
          last_edited_by: {
            object: 'user',
            id: '4e38fa57-609c-4beb-8e28-271b11cc81a3',
          },
          has_children: false,
          archived: false,
          type: 'heading_1',
          heading_1: {
            rich_text: [
              {
                type: 'text',
                text: {
                  content: 'Block 2: Has not changed.',
                  link: null,
                },
                annotations: {},
                plain_text: 'Block 2: Has not changed.',
                href: null,
              },
            ],
            is_toggleable: false,
            color: 'default',
          },
        },
      ],
    })
  // Build the cache
  const cms: CMS = await cachingTestCMS.pull()

  assert.ok(cms.siteData['/page-1'].content?.plaintext === 'Block 1: Has not changed.')
  assert.ok(cms.siteData['/page-2'].content?.plaintext === 'Block 2: Has not changed.')

  // Change some data in only page 2
  nock(baseUrl)
    .post(`/databases/${cachingDatabaseId}/query`)
    .query(true)
    .reply(200, {
      object: 'list',
      results: [
        {
          object: 'page',
          id: topLevelPageId,
          created_time: '2023-04-09T06:03:00.000Z',
          last_edited_time: '2023-04-09T06:03:00.000Z',
          created_by: {
            object: 'user',
            id: '4e38fa57-609c-4beb-8e28-271b11cc81a3',
          },
          last_edited_by: {
            object: 'user',
            id: '4e38fa57-609c-4beb-8e28-271b11cc81a3',
          },
          properties: {
            name: {
              id: 'title',
              type: 'title',
              title: [
                {
                  type: 'text',
                  text: {
                    content: 'Page 1',
                    link: null,
                  },
                  annotations: {},
                  plain_text: 'Page 1',
                  href: null,
                },
              ],
            },
            Author: {
              id: 'SQeZ',
              type: 'people',
              people: [
                {
                  object: 'user',
                  id: '4e38fa57-609c-4beb-8e28-271b11cc81a3',
                  name: 'Jacob',
                  avatar_url: null,
                  type: 'person',
                  person: {
                    email: 'jacob@agencykit.so',
                  },
                },
              ],
            },
            Tags: {
              id: 'NNmP',
              type: 'multi_select',
              multi_select: [
                {
                  id: '098acfda-2fb1-4ecf-8737-c03b80b5cb18',
                  name: 'programming',
                  color: 'default',
                },
              ],
            },
          },
          cover: null,
          icon: null,
          archived: false,
          url: 'https://www.notion.so/Product-B-7fc90a1dca4d49ad91b5136c3d5a304d',
        },
        {
          object: 'page',
          id: topLevelPageId2,
          created_time: '2023-04-09T06:03:00.000Z',
          last_edited_time: '2023-04-09T06:16:00.000Z',
          created_by: {
            object: 'user',
            id: '4e38fa57-609c-4beb-8e28-271b11cc81a3',
          },
          last_edited_by: {
            object: 'user',
            id: '4e38fa57-609c-4beb-8e28-271b11cc81a3',
          },
          properties: {
            name: {
              id: 'title',
              type: 'title',
              title: [
                {
                  type: 'text',
                  text: {
                    content: 'Page 2',
                    link: null,
                  },
                  annotations: {},
                  plain_text: 'Page 2',
                  href: null,
                },
              ],
            },
            Author: {
              id: 'SQeZ',
              type: 'people',
              people: [
                {
                  object: 'user',
                  id: '4e38fa57-609c-4beb-8e28-271b11cc81a3',
                  name: 'Jacob',
                  avatar_url: null,
                  type: 'person',
                  person: {
                    email: 'jacob@agencykit.so',
                  },
                },
              ],
            },
            Tags: {
              id: 'NNmP',
              type: 'multi_select',
              multi_select: [
                {
                  id: '098acfda-2fb1-4ecf-8737-c03b80b5cb18',
                  name: 'programming',
                  color: 'default',
                },
              ],
            },
          },
          cover: null,
          icon: null,
          archived: false,
          url: 'https://www.notion.so/Product-B-7fc90a1dca4d49ad91b5136c3d5a304d',
        },
      ],
      next_cursor: null,
      has_more: false,
      type: 'page',
      page: {},
    })
  nock(baseUrl)
    .get(`/blocks/${topLevelPageId2}/children`)
    .query(true)
    .reply(200, {
      object: 'list',
      results: [
        {
          object: 'block',
          id: '1c92a5ea-dfeb-4c8f-b662-cde078bb02ad',
          parent: {
            type: 'page_id',
            page_id: topLevelPageId2,
          },
          created_time: '2023-04-22T04:34:00.000Z',
          last_edited_time: '2023-04-22T04:34:00.000Z',
          created_by: {
            object: 'user',
            id: '4e38fa57-609c-4beb-8e28-271b11cc81a3',
          },
          last_edited_by: {
            object: 'user',
            id: '4e38fa57-609c-4beb-8e28-271b11cc81a3',
          },
          has_children: false,
          archived: false,
          type: 'heading_1',
          heading_1: {
            rich_text: [
              {
                type: 'text',
                text: {
                  content: 'Block 2: Has changed.',
                  link: null,
                },
                annotations: {},
                plain_text: 'Block 2: Has changed.',
                href: null,
              },
            ],
            is_toggleable: false,
            color: 'default',
          },
        },
      ],
    })

  const cms2: CMS = await cachingTestCMS.pull()

  assert.ok(cms2.siteData['/page-1'].content?.plaintext === 'Block 1: Has not changed.')
  assert.ok(cms2.siteData['/page-2'].content?.plaintext === 'Block 2: Has changed.')
})

TestNotionCMSCache('Plugins run even when using cached state.', async () => {
  const databaseId = '610627a9-28b1-4477-b660-c00c5364435b'

  let counter = 0

  const testCMS: NotionCMS = new NotionCMS({
    databaseId,
    notionAPIKey: process.env.NOTION as string,
    draftMode: true,
    refreshTimeout: '1 minute',
    plugins: [
      {
        name: 'counter-plugin',
        hook: '*', // this will run every hook
        exec: (ctx: PluginPassthrough) => {
          counter++
          return ctx
        },
      },
    ],
  })
  console.log('caching test: purging cache')
  testCMS.purgeCache()
  await testCMS.pull()
  assert.equal(counter, 22)
})
