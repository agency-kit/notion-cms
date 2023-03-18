import NotionCMS from '../dist/index.mjs'
import dotenv from 'dotenv'
import { suite  } from 'uvu';
import * as assert from 'uvu/assert';
import {removeContent} from './test-utils.mjs'

import { expectedRoutes, expectedTaggedCollection } from './notion-api-mock.spec.mjs';

const noMock = process.argv[2]

if (!noMock) {
  await import('./notion-api-mock.spec.mjs')
}

dotenv.config()

const startState = {
  metadata: {
    databaseId: "e4fcd5b3-1d6a-4afd-b951-10d56ce436ad",
    rootUrl: ""
  },
  stages: ["db", "content"], //Will only run pages
  routes: [],
  tags: [],
  tagGroups: {},
  transient: {
    '0148a891-e127-48ec-91d2-6213b9167593': {
      name: "/how-to-build-a-blog-with-notion",
      parentPage: "226956e8-075d-4f50-bf7f-2c683fd93032"
    },
    '5d002c2b-bbf5-409a-b26a-9995a059138f': {
      name: "/how-to-use-notion-cms",
      parentPage: "226956e8-075d-4f50-bf7f-2c683fd93032"
    },
    '226956e8-075d-4f50-bf7f-2c683fd93032': {
      name: "/posts"
    },
    'd400849b-afc2-4ffe-8150-83005a624192': {
      name: "/mortimer",
      parentPage: "b59e1887-7c2c-4566-afc9-a619271ad56d"
    },
    '0076e375-3bed-4aa1-97c2-2eea4d58fe93': {
      name: "/jacob",
      parentPage: "b59e1887-7c2c-4566-afc9-a619271ad56d"
    },
    '595bf484-5455-41ab-beea-9d1a9d363464': {
      name: "/pricing"
    },
   'b59e1887-7c2c-4566-afc9-a619271ad56d': {
      name: "/team"
    },
    '232177b4-31ac-4fdb-946b-cdd996add2d2': {
      name: "/about"
    }
  },
  siteData: {}
}

const afterPagesState =  {
  metadata: {
    databaseId: "e4fcd5b3-1d6a-4afd-b951-10d56ce436ad",
    rootUrl: ""
  },
  stages: ["db", "pages"],
  routes: [],
  tags: [],
  tagGroups: {},
  transient: {
    '0148a891-e127-48ec-91d2-6213b9167593': {
      name: "/how-to-build-a-blog-with-notion",
      parentPage: "226956e8-075d-4f50-bf7f-2c683fd93032"
    },
    '5d002c2b-bbf5-409a-b26a-9995a059138f': {
      name: "/how-to-use-notion-cms",
      parentPage: "226956e8-075d-4f50-bf7f-2c683fd93032"
    },
    '226956e8-075d-4f50-bf7f-2c683fd93032': {
      name: "/posts"
    },
    'd400849b-afc2-4ffe-8150-83005a624192': {
      name: "/mortimer",
      parentPage: "b59e1887-7c2c-4566-afc9-a619271ad56d"
    },
    '0076e375-3bed-4aa1-97c2-2eea4d58fe93': {
      name: "/jacob",
      parentPage: "b59e1887-7c2c-4566-afc9-a619271ad56d"
    },
    '595bf484-5455-41ab-beea-9d1a9d363464': {
      name: "/pricing"
    },
   'b59e1887-7c2c-4566-afc9-a619271ad56d': {
      name: "/team"
    },
    '232177b4-31ac-4fdb-946b-cdd996add2d2': {
      name: "/about"
    }
  },
  siteData: {
    '/posts': {
      authors: [
        "Jacob"
      ],
      '/how-to-build-a-blog-with-notion': {
        authors: [],
     },
     '/how-to-use-notion-cms': {
        authors: [],
      },
    },
    '/pricing': {
      authors: [],
    },
    '/team': {
      authors: [],
      '/mortimer': {
        authors: [],
      },
      '/jacob': {
        authors: [],
      },
    },
    '/about': {
      authors: [
        "Jacob"
      ],
    }
  }
}

const afterPagesStateJSON = {
  "metadata": {
    "databaseId": "e4fcd5b3-1d6a-4afd-b951-10d56ce436ad",
    "rootUrl": ""
  },
  "stages": [
    "db",
    "content", // Must match startState above
    "pages"
  ],
  "routes": [
    "/posts/how-to-build-a-blog-with-notion",
    "/posts/how-to-use-notion-cms",
    "/posts",
    "/pricing",
    "/team/mortimer",
    "/team/jacob",
    "/team",
    "/about"
  ],
  "tags": [],
  "tagGroups": {},
  "siteData": {
    "/posts": {
      "authors": [
        "Jacob"
      ],
      "/how-to-build-a-blog-with-notion": {
        "authors": [],
      },
      "/how-to-use-notion-cms": {
        "authors": [],
      },
    },
    "/pricing": {
      "authors": [],
    },
    "/team": {
      "authors": [],
      "/mortimer": {
        "authors": [],
      },
      "/jacob": {
        "authors": [],
      },
    },
    "/about": {
      "authors": [
        "Jacob"
      ],
    }
  }
}

const afterPullContentState =  {
  metadata: {
    databaseId: "e4fcd5b3-1d6a-4afd-b951-10d56ce436ad",
    rootUrl: ""
  },
  stages: ["db", "content", "pages"],
  routes: [
    "/posts/how-to-build-a-blog-with-notion",
    "/posts/how-to-use-notion-cms",
    "/posts",
    "/pricing",
    "/team/mortimer",
    "/team/jacob",
    "/team",
    "/about"
  ],
  tags: [
    "blog",
    "notion",
    "javascript"
  ],
  tagGroups: {
    blog: [
      "/how-to-build-a-blog-with-notion",
      "/how-to-use-notion-cms"
    ],
    notion: [
      "/how-to-build-a-blog-with-notion",
      "/how-to-use-notion-cms"
    ],
    javascript: [
      "/how-to-use-notion-cms"
    ]
  },
  transient: {
    '0148a891-e127-48ec-91d2-6213b9167593': {
      name: "/how-to-build-a-blog-with-notion",
      parentPage: "226956e8-075d-4f50-bf7f-2c683fd93032"
    },
    '5d002c2b-bbf5-409a-b26a-9995a059138f': {
      name: "/how-to-use-notion-cms",
      parentPage: "226956e8-075d-4f50-bf7f-2c683fd93032"
    },
    '226956e8-075d-4f50-bf7f-2c683fd93032': {
      name: "/posts"
    },
    'd400849b-afc2-4ffe-8150-83005a624192': {
      name: "/mortimer",
      parentPage: "b59e1887-7c2c-4566-afc9-a619271ad56d"
    },
    '0076e375-3bed-4aa1-97c2-2eea4d58fe93': {
      name: "/jacob",
      parentPage: "b59e1887-7c2c-4566-afc9-a619271ad56d"
    },
    '595bf484-5455-41ab-beea-9d1a9d363464': {
      name: "/pricing"
    },
   'b59e1887-7c2c-4566-afc9-a619271ad56d': {
      name: "/team"
    },
    '232177b4-31ac-4fdb-946b-cdd996add2d2': {
      name: "/about"
    }
  },
  siteData: {
    '/posts': {
      authors: [
        "Jacob"
      ],
      '/how-to-build-a-blog-with-notion': {
        authors: [],
        name: "how-to-build-a-blog-with-notion",
        tags: [
          "blog",
          "notion"
        ],
        content: "",
        coverImage: undefined
      },
     '/how-to-use-notion-cms': {
        authors: [],
        name: "how-to-use-notion-cms",
        tags: [
          "blog",
          "notion",
          "javascript"
        ],
        content: "",
        coverImage: undefined
      },
      name: "posts",
      tags: [],
      content: "",
      coverImage: undefined
    },
    '/pricing': {
      authors: [],
      name: "pricing",
      tags: [],
      content: "",
      coverImage: undefined
    },
    '/team': {
      authors: [],
      '/mortimer': {
        authors: [],
        name: "mortimer",
        tags: [],
        content: "",
        coverImage: undefined
      },
      '/jacob': {
        authors: [],
        name: "jacob",
        tags: [],
        content: "",
        coverImage: undefined
      },
      name: "team",
      tags: [],
      content: "",
      coverImage: undefined
    },
    '/about': {
      authors: [
        "Jacob"
      ],
      name: "about",
      tags: [],
      content: "",
      coverImage: undefined
    }
  }
}

const afterPullContentStateJSON = {
  "metadata": {
    "databaseId": "e4fcd5b3-1d6a-4afd-b951-10d56ce436ad",
    "rootUrl": ""
  },
  "stages": [
    "db",
    "pages",
    "content"
  ],
  "routes": [
    "/about",
    "/posts",
    "/posts/how-to-build-a-blog-with-notion",
    "/posts/how-to-use-notion-cms",
    "/pricing",
    "/team",
    "/team/jacob",
    "/team/mortimer"
  ],
  "tags": [
    "blog",
    "notion",
    "javascript"
  ],
  "tagGroups": {
    "blog": [
      "/how-to-build-a-blog-with-notion",
      "/how-to-use-notion-cms"
    ],
    "notion": [
      "/how-to-build-a-blog-with-notion",
      "/how-to-use-notion-cms"
    ],
    "javascript": [
      "/how-to-use-notion-cms"
    ]
  },
  "siteData": {
    "/posts": {
      "authors": [
        "Jacob"
      ],
      "/how-to-build-a-blog-with-notion": {
        "authors": [],
        "name": "how-to-build-a-blog-with-notion",
        "tags": [
          "blog",
          "notion"
        ],
        "content": ""
      },
      "/how-to-use-notion-cms": {
        "authors": [],
        "name": "how-to-use-notion-cms",
        "tags": [
          "blog",
          "notion",
          "javascript"
        ],
        "content": ""
      },
      "name": "posts",
      "tags": [],
      "content": ""
    },
    "/pricing": {
      "authors": [],
      "name": "pricing",
      "tags": [],
      "content": ""
    },
    "/team": {
      "authors": [],
      "/mortimer": {
        "authors": [],
        "name": "mortimer",
        "tags": [],
        "content": ""
      },
      "/jacob": {
        "authors": [],
        "name": "jacob",
        "tags": [],
        "content": ""
      },
      "name": "team",
      "tags": [],
      "content": ""
    },
    "/about": {
      "authors": [
        "Jacob"
      ],
      "name": "about",
      "tags": [],
      "content": ""
    }
  }
}

const pullPages = suite('pull-pages')

const pullPageContent = suite('pull-page-content')

let pullPagesCMS, pullPageContentCMS

pullPages.before(async () => {
   pullPagesCMS = new NotionCMS({
      databaseId: 'e4fcd5b3-1d6a-4afd-b951-10d56ce436ad',
      notionAPIKey: process.env.NOTION,
      debug: true
  }, JSON.stringify(startState))
  await pullPagesCMS.fetch()
})

pullPages('siteData', ()=>{
  const filtered = structuredClone(pullPagesCMS.cms.siteData)
  removeContent(filtered)
  assert.equal(filtered, afterPagesState.siteData)
})

pullPages('export JSON', ()=>{
  assert.equal(pullPagesCMS.export(), JSON.stringify(afterPagesStateJSON).replaceAll(' ', ''))
})

pullPageContent.before(async () => {
  pullPageContentCMS = new NotionCMS({
      databaseId: 'e4fcd5b3-1d6a-4afd-b951-10d56ce436ad',
      notionAPIKey: process.env.NOTION,
      debug: true
  }, JSON.stringify(afterPagesState))
  await pullPageContentCMS.fetch()
})

pullPageContent('routes', ()=>{
  assert.equal(pullPageContentCMS.routes.sort(), expectedRoutes.sort())
})

pullPageContent('siteData', ()=>{
  const filtered = structuredClone(pullPageContentCMS.cms.siteData)
  removeContent(filtered)
  assert.equal(filtered, afterPullContentState.siteData)
})

pullPageContent('taggedCollection', ()=>{
  const results = pullPageContentCMS.getTaggedCollection(['notion', 'javascript'])
  results.forEach(result => removeContent(result))
  assert.equal(results, expectedTaggedCollection)
})

pullPageContent('export JSON', ()=> {
  const filtered = structuredClone(pullPageContentCMS.cms)
  removeContent(filtered.siteData)
  // Export is just JSON stringify right now, just test that
  assert.equal(JSON.stringify(filtered), JSON.stringify(afterPullContentStateJSON).replaceAll(' ', ''))
})

pullPages.run()
pullPageContent.run()
