import NotionCMS from '../dist/index.mjs'
import dotenv from 'dotenv'
import util from 'util'
import fs from 'fs'

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

console.log(util.inspect(testCMS.cms.siteData), 'deeply nested')

testCMS.export()

setTimeout(() => {
  const file = fs.readFileSync('./debug/site-data.json', 'utf-8')

  testCMS.import(file)

  console.log(util.inspect(testCMS.cms.siteData), 'deeply nested after import')

}, 10000)


testCMS.export({ pretty: true, path: './debug/jason.json' })