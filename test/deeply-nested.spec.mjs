import NotionCMS from '../dist/index.mjs'
import dotenv from 'dotenv'
import util from 'util'

const noMock = process.argv[2]

if (!noMock) {
  console.log('nocking')
  await import('./notion-api-mock.spec.mjs')
}

dotenv.config()

const testCMS = new NotionCMS({
  databaseId: '43a6b925-8c2d-49ef-9d40-95d09707160b',
  notionAPIKey: process.env.NOTION,
  draftMode: true,
  debug: true,
})

await testCMS.fetch()

// console.log(util.inspect(testCMS.queryByPath('/team/mordecai/blog/post-c')._ancestors, true, null, true), 'deeply nested')


