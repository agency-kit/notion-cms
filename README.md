# Notion CMS

turn notion into a full fledged CMS with this utility set.

## Install

``` npm install @agency-kit/notion-cms ```

## Why.

Notion API is great but provides tons of info you don't want to parse through if you are just trying to get a handful of posts. By using a standardized notion database structure we can provide lots of features that make pulling content from notion and using it in your site a breeze.

## the database structure 

See https://cooked-shovel-3c3.notion.site/Community-e9fce377adb1425da8ac3ef3acef2bc2

## Features 

- [x] Basic CMS
- [x] route generation for SSG
- [ ] Aliasable component mapping (using notion callouts)
- [x] tag grouping and filtering
- [ ] arbitrary notion properties handling
- [ ] Layout definitions and ability to add custom layouts
- [ ] custom paths
- [ ] style parsing from notion db
- [ ] automatic image optimization (unsplash images are massive by default)
- [ ] plugin system for custom transformations?
- [ ] minimal caching system (leverages api.AgencyKit.so)
- [ ] NetlifyForms (substrat) renderer - Vue only but possibly support any renderer in the future.

 ## Todos
- [ ] proper logging/debugging
- [ ] reactive getters?
- [ ] config, cli
- [ ] subset fetching?


## Usage

```javascript

// initialize
const myCoolCMS = new NotionCMS({
  databaseId: 'e4fcd5b3-1d6a-4afd-b951-10d56ce436ad',
  notionAPIKey: process.env.NOTION,
  // Other options
})

// Pull down all Notion content
myCoolCMS.fetch()

// Access the routes here:
console.log(myCoolCMS.routes)

// Access the page content here:
console.log(myCoolCMS.data)

// Get tagged collections this way or by passing a single tag:
const tagged = myCoolCMS.getTaggedCollection(['blog', 'programming'])

```