import NotionCMS from '../dist/index.mjs'
import dotenv from 'dotenv'
import { setTimeout } from 'timers/promises';

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

// testCMS.walk(
//   (node) => console.log(node.path, 'node path')
// )

console.log(testCMS.routes, 'routs')

await testCMS.asyncWalk(
  async (node) => {
    const res = await setTimeout(1000, node.path)
    console.log(res)
  }
)

console.log('waited on walk')
