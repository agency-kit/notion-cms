import NotionCMS from '../dist/index.js'
import dotenv from 'dotenv'

dotenv.config()

const testCMS = new NotionCMS(
  'df3f51f5-daa7-4d28-90da-ece89281778d',
  process.env.NOTION
)

const cms = await testCMS.fetchCms()

console.log(cms, 'CMS OUTPUT')

console.log(testCMS.routes, 'ROTUES')