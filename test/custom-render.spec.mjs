import NotionCMS, { NotionBlocksParser, blocksRenderPlugin } from '../dist/index.mjs'

import dotenv from 'dotenv'

dotenv.config()

const noMock = process.argv[2]

if (!noMock) {
  await import('./notion-api-mock.spec.mjs')
}

// Helper Function for parsing internal block rich text
const parseRichText = NotionBlocksParser.parseRichText

const testNCMS = new NotionCMS({
  databaseId: '610627a9-28b1-4477-b660-c00c5364435b',
  notionAPIKey: process.env.NOTION,
  draftMode: true,
  debug: true,
  plugins: [
    blocksRenderPlugin({
      blockRenderers: {
        CalloutBlock: (block) => {
          console.log('rendering callout')
          return `<h1 class="callout>${parseRichText(block.callout.rich_text)}</h1>`
        },
        QuoteBlock: (block) => {
          console.log('rendering quote')
          return `<div>QUOTH THE RAVEN NEVERMOE</div>`
        }
      }
    })
  ]
})

await testNCMS.fetch()

testNCMS.export({ pretty: true, path: `${process.cwd()}/debug/special.json` })
