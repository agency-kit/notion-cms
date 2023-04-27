# _The_ Notion CMS
![welcome_gltch](/public/welcome_gltch.png)

Turn Notion into a full-fledged Headless CMS with this utility set.

🌲  Build a collection-based CMS tree from your Notion database.  
🎚️  Leverage database sub-items.  
⚙️   Geared for Static Site Generation.  
🗃️  Content Caching for super fast builds.  
🧩  Plugin ready with some powerful core plugins on the way.  
🦾  Tagging, filtering, path queries, and tree-walking utilities.  
⌨️   Totally Typesafe.

## Install

``` npm install @agency-kit/notion-cms ```   
```pnpm add @agency-kit/notion-cms```  
```yarn add @agency-kit/notion-cms```  

## Why.

Notion excels at managing content. It also has a great API and SDK. But why is it so challenging to _actually_ leverage Notion as a CMS (Content Management System) in production? 

Until recently there wasn't support for sub-pages (sub-items in a database) in Notion. So most existing Notion-as-a-cms solutions don't provide a way to leverage this new feature, which turns out to be crucial for building a collection-based CMS. Another barrier is that pulling content from Notion can be time consuming. Responses can take a few seconds at times, the API provides a lot of data to sift through, and multiple calls to different endpoints are required in order to go from CMS database to the content for each page. All of this together results in a less than excellent developer experience when using a static site generator that often makes requests on each build.

NotionCMS exists to address each of these issues and provide an excellent developer experience while using Notion as your Content Management System.

## the database structure

In order to make use of NotionCMS, you have to subscribe to a specific database structure. Its an extremely generic design that gives you all the things you need for basic sites but lends flexibility for types of content other than the standard web page, blog post etc.

See the structure in this template https://cooked-shovel-3c3.notion.site/Community-e9fce377adb1425da8ac3ef3acef2bc2

## Features 

- [x] Basic CMS
- [x] route generation for SSG
- [x] content caching
- [x] tag grouping and filtering
- [x] plugin system and core plugins
- [x] arbitrary notion properties handling
- [ ] optimized content caching
- [ ] custom paths

## Basic Usage

```javascript

// initialize
const myCoolCMS = new NotionCMS({
  databaseId: 'e4fcd5b3-1d6a-4afd-b951-10d56ce436ad',
  notionAPIKey: process.env.NOTION,
  // Other options
})

// Pull down all Notion content
await myCoolCMS.fetch()

// Access the routes here:
console.log(myCoolCMS.routes)

// Access the page content here:
console.log(myCoolCMS.data)

// Access paths like this:
const postA = myCoolCMS.data['/posts']['/how-to-build-a-blog-with-notion']
const postB = myCoolCMS.data['/posts']['/how-to-use-notion-cms']

```

## Advanced Usage

```javascript

const customPlugin = () => {
  return {
    name: 'my-custom-plugin',
    hook: 'pre-parse', // other option is 'post-parse'
    // list of blocks to transform.
    // If hook is post parse, its the string of html parsed from blocks
    exec: (blocksOrHtml) => {
      // do some transformations,
      const transformedBlocksOrHtml = someXform(blocksOrHtml)
      return transformedBlocksOrHtml
    }
  }
}

const myAdvancedCMS = new NotionCMS({
  databaseId: 'e4fcd5b3-1d6a-4afd-b951-10d56ce436ad',
  notionAPIKey: process.env.NOTION,
  rootUrl: 'https://mycoolsite.com',
  localCacheDirectory: './localcache/',
  refreshTimeout: 1000 * 60 * 60,
  plugins: [customPlugin()],
})

await myAdvancedCMS.fetch()

```

See actual plugins for more in depth examples.

## Some Helper methods

```javascript
// returns page reference
myCMS.queryByPath('/full/path/to/page')

// returns an array of only child pages of a page looked up using the key.
// This runs queryByPath under the hood so you can save a step
myCMS.filterSubPages('/full/path/to/page' /* or Page reference*/)

// returns page object without any children - just the content. Useful for serializing and sending a
// single pages data to the client.
myCoolCMS.rejectSubPages('/full/path/to/page' /* or Page reference*/)

// Get tagged collections this way or by passing a single tag:
const tagged = myCoolCMS.getTaggedCollection(['blog', 'programming'])

// walk the CMS from the root node and perform some operation for each node.
// the node parameter will be of type PageContent so you have access to all of the page data
myCoolCMS.walk(node => console.log(node), '/partial/path/to/start')

// for async callbacks
await myCoolCMS.asyncWalk(async node => await asynchronousFunc())
```
