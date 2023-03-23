import nock from 'nock'

const notionDatabaseId = 'e4fcd5b3-1d6a-4afd-b951-10d56ce436ad'

const baseUrl = 'https://api.notion.com/v1'

const pageIds = [
  '0148a891-e127-48ec-91d2-6213b9167593',
  '5d002c2b-bbf5-409a-b26a-9995a059138f',
  '226956e8-075d-4f50-bf7f-2c683fd93032',
  'd400849b-afc2-4ffe-8150-83005a624192',
  '0076e375-3bed-4aa1-97c2-2eea4d58fe93',
  '595bf484-5455-41ab-beea-9d1a9d363464',
  'b59e1887-7c2c-4566-afc9-a619271ad56d',
  '232177b4-31ac-4fdb-946b-cdd996add2d2'
]

export const expectedRoutes = [
  '/about',
  '/team',
  '/team/mortimer',
  '/team/jacob',
  '/pricing',
  '/posts',
  '/posts/how-to-use-notion-cms',
  '/posts/how-to-build-a-blog-with-notion'
]

export const expectedSiteData = {
  '/about': {
    name: 'About',
    authors: ['Jacob'],
    tags: [],
    _notion: {
      id: "232177b4-31ac-4fdb-946b-cdd996add2d2",
      last_edited_time: "2023-03-12T20:54:00.000Z"
    },
    content: '',
    coverImage: undefined,
    slug: 'about'
  },
  '/team': {
    name: 'Team',
    authors: [],
    tags: [],
    _notion: {
      id: "b59e1887-7c2c-4566-afc9-a619271ad56d",
      last_edited_time: "2023-03-12T20:53:00.000Z"
    },
    content: '',
    coverImage: undefined,
    slug: 'team',
    '/mortimer': {
      name: 'Mortimer',
      authors: [],
      tags: [],
      _notion: {
        id: "d400849b-afc2-4ffe-8150-83005a624192",
        last_edited_time: "2023-03-12T20:46:00.000Z"
      },
      content: '',
      coverImage: undefined,
      slug: 'mortimer'
    },
    '/jacob': {
      name: 'Jacob',
      authors: [],
      tags: [],
      content: '',
      _notion: {
        id: "0076e375-3bed-4aa1-97c2-2eea4d58fe93",
        last_edited_time: "2023-03-12T20:45:00.000Z"
      },
      coverImage: undefined,
      slug: 'jacob'
    }
  },
  '/pricing': {
    name: 'Pricing',
    authors: [],
    tags: [],
    content: '',
    _notion: {
      id: "595bf484-5455-41ab-beea-9d1a9d363464",
      last_edited_time: "2023-03-12T20:55:00.000Z"
    },
    coverImage: undefined,
    slug: 'pricing'
  },
  '/posts': {
    name: 'Posts',
    authors: ['Jacob'],
    tags: [],
    _notion: {
      id: "226956e8-075d-4f50-bf7f-2c683fd93032",
      last_edited_time: "2023-03-12T20:33:00.000Z"
    },
    content: '',
    coverImage: undefined,
    slug: 'posts',
    '/how-to-use-notion-cms': {
      name: 'How to use Notion CMS',
      authors: [],
      tags: ['blog', 'notion', 'javascript'],
      _notion: {
        id: "5d002c2b-bbf5-409a-b26a-9995a059138f",
        last_edited_time: "2023-03-12T20:34:00.000Z"
      },
      content: '',
      coverImage: undefined,
      slug: 'how-to-use-notion-cms'
    },
    '/how-to-build-a-blog-with-notion': {
      name: 'How to build a blog with Notion',
      authors: [],
      tags: ['blog', 'notion'],
      _notion: {
        id: "0148a891-e127-48ec-91d2-6213b9167593",
        last_edited_time: "2023-03-12T20:36:00.000Z"
      },
      content: '',
      coverImage: undefined,
      slug: 'how-to-build-a-blog-with-notion'
    }
  }
}

export const expectedTaggedCollection = [
  {
    name: 'How to build a blog with Notion',
    authors: [],
    tags: ['blog', 'notion'],
    coverImage: undefined,
    _notion: {
      id: "0148a891-e127-48ec-91d2-6213b9167593",
      last_edited_time: "2023-03-12T20:36:00.000Z"
    },
    content: '',
    slug: 'how-to-build-a-blog-with-notion'
  },
  {
    name: 'How to use Notion CMS',
    authors: [],
    tags: ['blog', 'notion', 'javascript'],
    coverImage: undefined,
    _notion: {
      id: "5d002c2b-bbf5-409a-b26a-9995a059138f",
      last_edited_time: "2023-03-12T20:34:00.000Z"
    },
    content: '',
    slug: 'how-to-use-notion-cms'
  },
]


nock(baseUrl)
  .persist()
  .post('/databases/e4fcd5b3-1d6a-4afd-b951-10d56ce436ad/query')
  .reply(200, {
    "object": "list",
    "results": [
      {
        "object": "page",
        "id": "0148a891-e127-48ec-91d2-6213b9167593",
        "created_time": "2023-03-12T19:38:00.000Z",
        "last_edited_time": "2023-03-12T20:36:00.000Z",
        "created_by": {
          "object": "user",
          "id": "4e38fa57-609c-4beb-8e28-271b11cc81a3"
        },
        "last_edited_by": {
          "object": "user",
          "id": "4e38fa57-609c-4beb-8e28-271b11cc81a3"
        },
        "cover": null,
        "icon": null,
        "parent": {
          "type": "database_id",
          "database_id": "e4fcd5b3-1d6a-4afd-b951-10d56ce436ad"
        },
        "archived": false,
        "properties": {
          "metaDescription": {
            "id": "%3APsR",
            "type": "rich_text",
            "rich_text": []
          },
          "Layout": {
            "id": "%3B~c%40",
            "type": "select",
            "select": {
              "id": "d\\Or",
              "name": "Feldspar",
              "color": "pink"
            }
          },
          "parent-page": {
            "id": "%3FuXy",
            "type": "relation",
            "relation": [
              {
                "id": "226956e8-075d-4f50-bf7f-2c683fd93032"
              }
            ],
            "has_more": false
          },
          "sub-page": {
            "id": "%40KPB",
            "type": "relation",
            "relation": [],
            "has_more": false
          },
          "Tags": {
            "id": "NNmP",
            "type": "multi_select",
            "multi_select": [
              {
                "id": "39c42409-611d-45d5-accb-3b1d05917b3a",
                "name": "blog",
                "color": "gray"
              },
              {
                "id": "9d1eaabc-234f-4e1a-8812-06c286f863cd",
                "name": "notion",
                "color": "red"
              }
            ]
          },
          "canonicalUrl": {
            "id": "QQ%5DS",
            "type": "url",
            "url": null
          },
          "Author": {
            "id": "SQeZ",
            "type": "people",
            "people": []
          },
          "social": {
            "id": "UDl%5C",
            "type": "multi_select",
            "multi_select": []
          },
          "publishDate": {
            "id": "UzoS",
            "type": "date",
            "date": null
          },
          "Published": {
            "id": "frgL",
            "type": "select",
            "select": {
              "id": "dFFu",
              "name": "Draft",
              "color": "green"
            }
          },
          "postUrl": {
            "id": "gaK%3E",
            "type": "url",
            "url": null
          },
          "metaTitle": {
            "id": "qGkC",
            "type": "rich_text",
            "rich_text": []
          },
          "name": {
            "id": "title",
            "type": "title",
            "title": [
              {
                "type": "text",
                "text": {
                  "content": "How to build a blog with Notion",
                  "link": null
                },
                "annotations": {
                  "bold": false,
                  "italic": false,
                  "strikethrough": false,
                  "underline": false,
                  "code": false,
                  "color": "default"
                },
                "plain_text": "How to build a blog with Notion",
                "href": null
              }
            ]
          }
        },
        "url": "https://www.notion.so/How-to-build-a-blog-with-Notion-0148a891e12748ec91d26213b9167593"
      },
      {
        "object": "page",
        "id": "5d002c2b-bbf5-409a-b26a-9995a059138f",
        "created_time": "2023-03-12T19:37:00.000Z",
        "last_edited_time": "2023-03-12T20:34:00.000Z",
        "created_by": {
          "object": "user",
          "id": "4e38fa57-609c-4beb-8e28-271b11cc81a3"
        },
        "last_edited_by": {
          "object": "user",
          "id": "4e38fa57-609c-4beb-8e28-271b11cc81a3"
        },
        "cover": null,
        "icon": null,
        "parent": {
          "type": "database_id",
          "database_id": "e4fcd5b3-1d6a-4afd-b951-10d56ce436ad"
        },
        "archived": false,
        "properties": {
          "metaDescription": {
            "id": "%3APsR",
            "type": "rich_text",
            "rich_text": []
          },
          "Layout": {
            "id": "%3B~c%40",
            "type": "select",
            "select": {
              "id": "d\\Or",
              "name": "Feldspar",
              "color": "pink"
            }
          },
          "parent-page": {
            "id": "%3FuXy",
            "type": "relation",
            "relation": [
              {
                "id": "226956e8-075d-4f50-bf7f-2c683fd93032"
              }
            ],
            "has_more": false
          },
          "sub-page": {
            "id": "%40KPB",
            "type": "relation",
            "relation": [],
            "has_more": false
          },
          "Tags": {
            "id": "NNmP",
            "type": "multi_select",
            "multi_select": [
              {
                "id": "39c42409-611d-45d5-accb-3b1d05917b3a",
                "name": "blog",
                "color": "gray"
              },
              {
                "id": "9d1eaabc-234f-4e1a-8812-06c286f863cd",
                "name": "notion",
                "color": "red"
              },
              {
                "id": "165eef40-7a03-468a-882e-5516b4f63af8",
                "name": "javascript",
                "color": "green"
              }
            ]
          },
          "canonicalUrl": {
            "id": "QQ%5DS",
            "type": "url",
            "url": null
          },
          "Author": {
            "id": "SQeZ",
            "type": "people",
            "people": []
          },
          "social": {
            "id": "UDl%5C",
            "type": "multi_select",
            "multi_select": []
          },
          "publishDate": {
            "id": "UzoS",
            "type": "date",
            "date": null
          },
          "Published": {
            "id": "frgL",
            "type": "select",
            "select": {
              "id": "dFFu",
              "name": "Draft",
              "color": "green"
            }
          },
          "postUrl": {
            "id": "gaK%3E",
            "type": "url",
            "url": null
          },
          "metaTitle": {
            "id": "qGkC",
            "type": "rich_text",
            "rich_text": []
          },
          "name": {
            "id": "title",
            "type": "title",
            "title": [
              {
                "type": "text",
                "text": {
                  "content": "How to use Notion CMS",
                  "link": null
                },
                "annotations": {
                  "bold": false,
                  "italic": false,
                  "strikethrough": false,
                  "underline": false,
                  "code": false,
                  "color": "default"
                },
                "plain_text": "How to use Notion CMS",
                "href": null
              }
            ]
          }
        },
        "url": "https://www.notion.so/How-to-use-Notion-CMS-5d002c2bbbf5409ab26a9995a059138f"
      },
      {
        "object": "page",
        "id": "226956e8-075d-4f50-bf7f-2c683fd93032",
        "created_time": "2023-03-12T19:37:00.000Z",
        "last_edited_time": "2023-03-12T20:33:00.000Z",
        "created_by": {
          "object": "user",
          "id": "4e38fa57-609c-4beb-8e28-271b11cc81a3"
        },
        "last_edited_by": {
          "object": "user",
          "id": "4e38fa57-609c-4beb-8e28-271b11cc81a3"
        },
        "cover": null,
        "icon": null,
        "parent": {
          "type": "database_id",
          "database_id": "e4fcd5b3-1d6a-4afd-b951-10d56ce436ad"
        },
        "archived": false,
        "properties": {
          "metaDescription": {
            "id": "%3APsR",
            "type": "rich_text",
            "rich_text": []
          },
          "Layout": {
            "id": "%3B~c%40",
            "type": "select",
            "select": {
              "id": "d\\Or",
              "name": "Feldspar",
              "color": "pink"
            }
          },
          "parent-page": {
            "id": "%3FuXy",
            "type": "relation",
            "relation": [],
            "has_more": false
          },
          "sub-page": {
            "id": "%40KPB",
            "type": "relation",
            "relation": [
              {
                "id": "5d002c2b-bbf5-409a-b26a-9995a059138f"
              },
              {
                "id": "0148a891-e127-48ec-91d2-6213b9167593"
              }
            ],
            "has_more": false
          },
          "Tags": {
            "id": "NNmP",
            "type": "multi_select",
            "multi_select": []
          },
          "canonicalUrl": {
            "id": "QQ%5DS",
            "type": "url",
            "url": null
          },
          "Author": {
            "id": "SQeZ",
            "type": "people",
            "people": [
              {
                "object": "user",
                "id": "4e38fa57-609c-4beb-8e28-271b11cc81a3",
                "name": "Jacob",
                "avatar_url": null,
                "type": "person",
                "person": {
                  "email": "jacob@agencykit.so"
                }
              }
            ]
          },
          "social": {
            "id": "UDl%5C",
            "type": "multi_select",
            "multi_select": []
          },
          "publishDate": {
            "id": "UzoS",
            "type": "date",
            "date": null
          },
          "Published": {
            "id": "frgL",
            "type": "select",
            "select": {
              "id": "dFFu",
              "name": "Draft",
              "color": "green"
            }
          },
          "postUrl": {
            "id": "gaK%3E",
            "type": "url",
            "url": null
          },
          "metaTitle": {
            "id": "qGkC",
            "type": "rich_text",
            "rich_text": []
          },
          "name": {
            "id": "title",
            "type": "title",
            "title": [
              {
                "type": "text",
                "text": {
                  "content": "Posts",
                  "link": null
                },
                "annotations": {
                  "bold": false,
                  "italic": false,
                  "strikethrough": false,
                  "underline": false,
                  "code": false,
                  "color": "default"
                },
                "plain_text": "Posts",
                "href": null
              }
            ]
          }
        },
        "url": "https://www.notion.so/Posts-226956e8075d4f50bf7f2c683fd93032"
      },
      {
        "object": "page",
        "id": "d400849b-afc2-4ffe-8150-83005a624192",
        "created_time": "2023-03-12T19:37:00.000Z",
        "last_edited_time": "2023-03-12T20:46:00.000Z",
        "created_by": {
          "object": "user",
          "id": "4e38fa57-609c-4beb-8e28-271b11cc81a3"
        },
        "last_edited_by": {
          "object": "user",
          "id": "4e38fa57-609c-4beb-8e28-271b11cc81a3"
        },
        "cover": null,
        "icon": null,
        "parent": {
          "type": "database_id",
          "database_id": "e4fcd5b3-1d6a-4afd-b951-10d56ce436ad"
        },
        "archived": false,
        "properties": {
          "metaDescription": {
            "id": "%3APsR",
            "type": "rich_text",
            "rich_text": []
          },
          "Layout": {
            "id": "%3B~c%40",
            "type": "select",
            "select": {
              "id": "d\\Or",
              "name": "Feldspar",
              "color": "pink"
            }
          },
          "parent-page": {
            "id": "%3FuXy",
            "type": "relation",
            "relation": [
              {
                "id": "b59e1887-7c2c-4566-afc9-a619271ad56d"
              }
            ],
            "has_more": false
          },
          "sub-page": {
            "id": "%40KPB",
            "type": "relation",
            "relation": [],
            "has_more": false
          },
          "Tags": {
            "id": "NNmP",
            "type": "multi_select",
            "multi_select": []
          },
          "canonicalUrl": {
            "id": "QQ%5DS",
            "type": "url",
            "url": null
          },
          "Author": {
            "id": "SQeZ",
            "type": "people",
            "people": []
          },
          "social": {
            "id": "UDl%5C",
            "type": "multi_select",
            "multi_select": []
          },
          "publishDate": {
            "id": "UzoS",
            "type": "date",
            "date": null
          },
          "Published": {
            "id": "frgL",
            "type": "select",
            "select": {
              "id": "dFFu",
              "name": "Draft",
              "color": "green"
            }
          },
          "postUrl": {
            "id": "gaK%3E",
            "type": "url",
            "url": null
          },
          "metaTitle": {
            "id": "qGkC",
            "type": "rich_text",
            "rich_text": []
          },
          "name": {
            "id": "title",
            "type": "title",
            "title": [
              {
                "type": "text",
                "text": {
                  "content": "Mortimer",
                  "link": null
                },
                "annotations": {
                  "bold": false,
                  "italic": false,
                  "strikethrough": false,
                  "underline": false,
                  "code": false,
                  "color": "default"
                },
                "plain_text": "Mortimer",
                "href": null
              }
            ]
          }
        },
        "url": "https://www.notion.so/Mortimer-d400849bafc24ffe815083005a624192"
      },
      {
        "object": "page",
        "id": "0076e375-3bed-4aa1-97c2-2eea4d58fe93",
        "created_time": "2023-03-12T19:37:00.000Z",
        "last_edited_time": "2023-03-12T20:45:00.000Z",
        "created_by": {
          "object": "user",
          "id": "4e38fa57-609c-4beb-8e28-271b11cc81a3"
        },
        "last_edited_by": {
          "object": "user",
          "id": "4e38fa57-609c-4beb-8e28-271b11cc81a3"
        },
        "cover": null,
        "icon": null,
        "parent": {
          "type": "database_id",
          "database_id": "e4fcd5b3-1d6a-4afd-b951-10d56ce436ad"
        },
        "archived": false,
        "properties": {
          "metaDescription": {
            "id": "%3APsR",
            "type": "rich_text",
            "rich_text": []
          },
          "Layout": {
            "id": "%3B~c%40",
            "type": "select",
            "select": {
              "id": "d\\Or",
              "name": "Feldspar",
              "color": "pink"
            }
          },
          "parent-page": {
            "id": "%3FuXy",
            "type": "relation",
            "relation": [
              {
                "id": "b59e1887-7c2c-4566-afc9-a619271ad56d"
              }
            ],
            "has_more": false
          },
          "sub-page": {
            "id": "%40KPB",
            "type": "relation",
            "relation": [],
            "has_more": false
          },
          "Tags": {
            "id": "NNmP",
            "type": "multi_select",
            "multi_select": []
          },
          "canonicalUrl": {
            "id": "QQ%5DS",
            "type": "url",
            "url": null
          },
          "Author": {
            "id": "SQeZ",
            "type": "people",
            "people": []
          },
          "social": {
            "id": "UDl%5C",
            "type": "multi_select",
            "multi_select": []
          },
          "publishDate": {
            "id": "UzoS",
            "type": "date",
            "date": null
          },
          "Published": {
            "id": "frgL",
            "type": "select",
            "select": {
              "id": "dFFu",
              "name": "Draft",
              "color": "green"
            }
          },
          "postUrl": {
            "id": "gaK%3E",
            "type": "url",
            "url": null
          },
          "metaTitle": {
            "id": "qGkC",
            "type": "rich_text",
            "rich_text": []
          },
          "name": {
            "id": "title",
            "type": "title",
            "title": [
              {
                "type": "text",
                "text": {
                  "content": "Jacob",
                  "link": null
                },
                "annotations": {
                  "bold": false,
                  "italic": false,
                  "strikethrough": false,
                  "underline": false,
                  "code": false,
                  "color": "default"
                },
                "plain_text": "Jacob",
                "href": null
              }
            ]
          }
        },
        "url": "https://www.notion.so/Jacob-0076e3753bed4aa197c22eea4d58fe93"
      },
      {
        "object": "page",
        "id": "595bf484-5455-41ab-beea-9d1a9d363464",
        "created_time": "2023-03-12T19:37:00.000Z",
        "last_edited_time": "2023-03-12T20:55:00.000Z",
        "created_by": {
          "object": "user",
          "id": "4e38fa57-609c-4beb-8e28-271b11cc81a3"
        },
        "last_edited_by": {
          "object": "user",
          "id": "4e38fa57-609c-4beb-8e28-271b11cc81a3"
        },
        "cover": null,
        "icon": null,
        "parent": {
          "type": "database_id",
          "database_id": "e4fcd5b3-1d6a-4afd-b951-10d56ce436ad"
        },
        "archived": false,
        "properties": {
          "metaDescription": {
            "id": "%3APsR",
            "type": "rich_text",
            "rich_text": []
          },
          "Layout": {
            "id": "%3B~c%40",
            "type": "select",
            "select": {
              "id": "d\\Or",
              "name": "Feldspar",
              "color": "pink"
            }
          },
          "parent-page": {
            "id": "%3FuXy",
            "type": "relation",
            "relation": [],
            "has_more": false
          },
          "sub-page": {
            "id": "%40KPB",
            "type": "relation",
            "relation": [],
            "has_more": false
          },
          "Tags": {
            "id": "NNmP",
            "type": "multi_select",
            "multi_select": []
          },
          "canonicalUrl": {
            "id": "QQ%5DS",
            "type": "url",
            "url": null
          },
          "Author": {
            "id": "SQeZ",
            "type": "people",
            "people": []
          },
          "social": {
            "id": "UDl%5C",
            "type": "multi_select",
            "multi_select": []
          },
          "publishDate": {
            "id": "UzoS",
            "type": "date",
            "date": null
          },
          "Published": {
            "id": "frgL",
            "type": "select",
            "select": {
              "id": "dFFu",
              "name": "Draft",
              "color": "green"
            }
          },
          "postUrl": {
            "id": "gaK%3E",
            "type": "url",
            "url": null
          },
          "metaTitle": {
            "id": "qGkC",
            "type": "rich_text",
            "rich_text": []
          },
          "name": {
            "id": "title",
            "type": "title",
            "title": [
              {
                "type": "text",
                "text": {
                  "content": "Pricing",
                  "link": null
                },
                "annotations": {
                  "bold": false,
                  "italic": false,
                  "strikethrough": false,
                  "underline": false,
                  "code": false,
                  "color": "default"
                },
                "plain_text": "Pricing",
                "href": null
              }
            ]
          }
        },
        "url": "https://www.notion.so/Pricing-595bf484545541abbeea9d1a9d363464"
      },
      {
        "object": "page",
        "id": "b59e1887-7c2c-4566-afc9-a619271ad56d",
        "created_time": "2023-03-12T19:36:00.000Z",
        "last_edited_time": "2023-03-12T20:53:00.000Z",
        "created_by": {
          "object": "user",
          "id": "4e38fa57-609c-4beb-8e28-271b11cc81a3"
        },
        "last_edited_by": {
          "object": "user",
          "id": "4e38fa57-609c-4beb-8e28-271b11cc81a3"
        },
        "cover": null,
        "icon": null,
        "parent": {
          "type": "database_id",
          "database_id": "e4fcd5b3-1d6a-4afd-b951-10d56ce436ad"
        },
        "archived": false,
        "properties": {
          "metaDescription": {
            "id": "%3APsR",
            "type": "rich_text",
            "rich_text": []
          },
          "Layout": {
            "id": "%3B~c%40",
            "type": "select",
            "select": {
              "id": "d\\Or",
              "name": "Feldspar",
              "color": "pink"
            }
          },
          "parent-page": {
            "id": "%3FuXy",
            "type": "relation",
            "relation": [],
            "has_more": false
          },
          "sub-page": {
            "id": "%40KPB",
            "type": "relation",
            "relation": [
              {
                "id": "0076e375-3bed-4aa1-97c2-2eea4d58fe93"
              },
              {
                "id": "d400849b-afc2-4ffe-8150-83005a624192"
              }
            ],
            "has_more": false
          },
          "Tags": {
            "id": "NNmP",
            "type": "multi_select",
            "multi_select": []
          },
          "canonicalUrl": {
            "id": "QQ%5DS",
            "type": "url",
            "url": null
          },
          "Author": {
            "id": "SQeZ",
            "type": "people",
            "people": []
          },
          "social": {
            "id": "UDl%5C",
            "type": "multi_select",
            "multi_select": []
          },
          "publishDate": {
            "id": "UzoS",
            "type": "date",
            "date": null
          },
          "Published": {
            "id": "frgL",
            "type": "select",
            "select": {
              "id": "dFFu",
              "name": "Draft",
              "color": "green"
            }
          },
          "postUrl": {
            "id": "gaK%3E",
            "type": "url",
            "url": null
          },
          "metaTitle": {
            "id": "qGkC",
            "type": "rich_text",
            "rich_text": []
          },
          "name": {
            "id": "title",
            "type": "title",
            "title": [
              {
                "type": "text",
                "text": {
                  "content": "Team",
                  "link": null
                },
                "annotations": {
                  "bold": false,
                  "italic": false,
                  "strikethrough": false,
                  "underline": false,
                  "code": false,
                  "color": "default"
                },
                "plain_text": "Team",
                "href": null
              }
            ]
          }
        },
        "url": "https://www.notion.so/Team-b59e18877c2c4566afc9a619271ad56d"
      },
      {
        "object": "page",
        "id": "232177b4-31ac-4fdb-946b-cdd996add2d2",
        "created_time": "2023-03-12T19:33:00.000Z",
        "last_edited_time": "2023-03-12T20:54:00.000Z",
        "created_by": {
          "object": "user",
          "id": "4e38fa57-609c-4beb-8e28-271b11cc81a3"
        },
        "last_edited_by": {
          "object": "user",
          "id": "4e38fa57-609c-4beb-8e28-271b11cc81a3"
        },
        "cover": null,
        "icon": null,
        "parent": {
          "type": "database_id",
          "database_id": "e4fcd5b3-1d6a-4afd-b951-10d56ce436ad"
        },
        "archived": false,
        "properties": {
          "metaDescription": {
            "id": "%3APsR",
            "type": "rich_text",
            "rich_text": [
              {
                "type": "text",
                "text": {
                  "content": "Notion CMS is pretty neat.",
                  "link": null
                },
                "annotations": {
                  "bold": false,
                  "italic": false,
                  "strikethrough": false,
                  "underline": false,
                  "code": false,
                  "color": "default"
                },
                "plain_text": "Notion CMS is pretty neat.",
                "href": null
              }
            ]
          },
          "Layout": {
            "id": "%3B~c%40",
            "type": "select",
            "select": null
          },
          "parent-page": {
            "id": "%3FuXy",
            "type": "relation",
            "relation": [],
            "has_more": false
          },
          "sub-page": {
            "id": "%40KPB",
            "type": "relation",
            "relation": [],
            "has_more": false
          },
          "Tags": {
            "id": "NNmP",
            "type": "multi_select",
            "multi_select": []
          },
          "canonicalUrl": {
            "id": "QQ%5DS",
            "type": "url",
            "url": null
          },
          "Author": {
            "id": "SQeZ",
            "type": "people",
            "people": [
              {
                "object": "user",
                "id": "4e38fa57-609c-4beb-8e28-271b11cc81a3",
                "name": "Jacob",
                "avatar_url": null,
                "type": "person",
                "person": {
                  "email": "jacob@agencykit.so"
                }
              }
            ]
          },
          "social": {
            "id": "UDl%5C",
            "type": "multi_select",
            "multi_select": []
          },
          "publishDate": {
            "id": "UzoS",
            "type": "date",
            "date": {
              "start": "2023-03-12",
              "end": null,
              "time_zone": null
            }
          },
          "Published": {
            "id": "frgL",
            "type": "select",
            "select": {
              "id": "dFFu",
              "name": "Draft",
              "color": "green"
            }
          },
          "postUrl": {
            "id": "gaK%3E",
            "type": "url",
            "url": null
          },
          "metaTitle": {
            "id": "qGkC",
            "type": "rich_text",
            "rich_text": [
              {
                "type": "text",
                "text": {
                  "content": "About NotionCMS",
                  "link": null
                },
                "annotations": {
                  "bold": false,
                  "italic": false,
                  "strikethrough": false,
                  "underline": false,
                  "code": false,
                  "color": "default"
                },
                "plain_text": "About NotionCMS",
                "href": null
              }
            ]
          },
          "name": {
            "id": "title",
            "type": "title",
            "title": [
              {
                "type": "text",
                "text": {
                  "content": "About",
                  "link": null
                },
                "annotations": {
                  "bold": false,
                  "italic": false,
                  "strikethrough": false,
                  "underline": false,
                  "code": false,
                  "color": "default"
                },
                "plain_text": "About",
                "href": null
              }
            ]
          }
        },
        "url": "https://www.notion.so/About-232177b431ac4fdb946bcdd996add2d2"
      }
    ],
    "next_cursor": null,
    "has_more": false,
    "type": "page",
    "page": {}
  })

// Jacob User
nock(baseUrl)
  .persist()
  .get('/users/4e38fa57-609c-4beb-8e28-271b11cc81a3')
  .reply(200, {
    "object": "user",
    "id": "4e38fa57-609c-4beb-8e28-271b11cc81a3",
    "name": "Jacob",
    "avatar_url": null,
    "type": "person",
    "person": {
      "email": "jacob@agencykit.so"
    }
  })

// Page Queries

nock(baseUrl)
  .persist()
  .get(`/pages/${pageIds[0]}`)
  .reply(200, {
    "object": "page",
    "id": "0148a891-e127-48ec-91d2-6213b9167593",
    "created_time": "2023-03-12T19:38:00.000Z",
    "last_edited_time": "2023-03-12T20:36:00.000Z",
    "created_by": {
      "object": "user",
      "id": "4e38fa57-609c-4beb-8e28-271b11cc81a3"
    },
    "last_edited_by": {
      "object": "user",
      "id": "4e38fa57-609c-4beb-8e28-271b11cc81a3"
    },
    "cover": null,
    "icon": null,
    "parent": {
      "type": "database_id",
      "database_id": "e4fcd5b3-1d6a-4afd-b951-10d56ce436ad"
    },
    "archived": false,
    "properties": {
      "metaDescription": {
        "id": "%3APsR",
        "type": "rich_text",
        "rich_text": []
      },
      "Layout": {
        "id": "%3B~c%40",
        "type": "select",
        "select": {
          "id": "d\\Or",
          "name": "Feldspar",
          "color": "pink"
        }
      },
      "parent-page": {
        "id": "%3FuXy",
        "type": "relation",
        "relation": [
          {
            "id": "226956e8-075d-4f50-bf7f-2c683fd93032"
          }
        ],
        "has_more": false
      },
      "sub-page": {
        "id": "%40KPB",
        "type": "relation",
        "relation": [],
        "has_more": false
      },
      "Tags": {
        "id": "NNmP",
        "type": "multi_select",
        "multi_select": [
          {
            "id": "39c42409-611d-45d5-accb-3b1d05917b3a",
            "name": "blog",
            "color": "gray"
          },
          {
            "id": "9d1eaabc-234f-4e1a-8812-06c286f863cd",
            "name": "notion",
            "color": "red"
          }
        ]
      },
      "canonicalUrl": {
        "id": "QQ%5DS",
        "type": "url",
        "url": null
      },
      "Author": {
        "id": "SQeZ",
        "type": "people",
        "people": []
      },
      "social": {
        "id": "UDl%5C",
        "type": "multi_select",
        "multi_select": []
      },
      "publishDate": {
        "id": "UzoS",
        "type": "date",
        "date": null
      },
      "Published": {
        "id": "frgL",
        "type": "select",
        "select": {
          "id": "dFFu",
          "name": "Draft",
          "color": "green"
        }
      },
      "postUrl": {
        "id": "gaK%3E",
        "type": "url",
        "url": null
      },
      "metaTitle": {
        "id": "qGkC",
        "type": "rich_text",
        "rich_text": []
      },
      "name": {
        "id": "title",
        "type": "title",
        "title": [
          {
            "type": "text",
            "text": {
              "content": "How to build a blog with Notion",
              "link": null
            },
            "annotations": {
              "bold": false,
              "italic": false,
              "strikethrough": false,
              "underline": false,
              "code": false,
              "color": "default"
            },
            "plain_text": "How to build a blog with Notion",
            "href": null
          }
        ]
      }
    },
    "url": "https://www.notion.so/How-to-build-a-blog-with-Notion-0148a891e12748ec91d26213b9167593"
  })

nock(baseUrl)
  .persist()
  .get(`/pages/${pageIds[1]}`)
  .reply(200, {
    "object": "page",
    "id": "5d002c2b-bbf5-409a-b26a-9995a059138f",
    "created_time": "2023-03-12T19:37:00.000Z",
    "last_edited_time": "2023-03-12T20:34:00.000Z",
    "created_by": {
      "object": "user",
      "id": "4e38fa57-609c-4beb-8e28-271b11cc81a3"
    },
    "last_edited_by": {
      "object": "user",
      "id": "4e38fa57-609c-4beb-8e28-271b11cc81a3"
    },
    "cover": null,
    "icon": null,
    "parent": {
      "type": "database_id",
      "database_id": "e4fcd5b3-1d6a-4afd-b951-10d56ce436ad"
    },
    "archived": false,
    "properties": {
      "metaDescription": {
        "id": "%3APsR",
        "type": "rich_text",
        "rich_text": []
      },
      "Layout": {
        "id": "%3B~c%40",
        "type": "select",
        "select": {
          "id": "d\\Or",
          "name": "Feldspar",
          "color": "pink"
        }
      },
      "parent-page": {
        "id": "%3FuXy",
        "type": "relation",
        "relation": [
          {
            "id": "226956e8-075d-4f50-bf7f-2c683fd93032"
          }
        ],
        "has_more": false
      },
      "sub-page": {
        "id": "%40KPB",
        "type": "relation",
        "relation": [],
        "has_more": false
      },
      "Tags": {
        "id": "NNmP",
        "type": "multi_select",
        "multi_select": [
          {
            "id": "39c42409-611d-45d5-accb-3b1d05917b3a",
            "name": "blog",
            "color": "gray"
          },
          {
            "id": "9d1eaabc-234f-4e1a-8812-06c286f863cd",
            "name": "notion",
            "color": "red"
          },
          {
            "id": "165eef40-7a03-468a-882e-5516b4f63af8",
            "name": "javascript",
            "color": "green"
          }
        ]
      },
      "canonicalUrl": {
        "id": "QQ%5DS",
        "type": "url",
        "url": null
      },
      "Author": {
        "id": "SQeZ",
        "type": "people",
        "people": []
      },
      "social": {
        "id": "UDl%5C",
        "type": "multi_select",
        "multi_select": []
      },
      "publishDate": {
        "id": "UzoS",
        "type": "date",
        "date": null
      },
      "Published": {
        "id": "frgL",
        "type": "select",
        "select": {
          "id": "dFFu",
          "name": "Draft",
          "color": "green"
        }
      },
      "postUrl": {
        "id": "gaK%3E",
        "type": "url",
        "url": null
      },
      "metaTitle": {
        "id": "qGkC",
        "type": "rich_text",
        "rich_text": []
      },
      "name": {
        "id": "title",
        "type": "title",
        "title": [
          {
            "type": "text",
            "text": {
              "content": "How to use Notion CMS",
              "link": null
            },
            "annotations": {
              "bold": false,
              "italic": false,
              "strikethrough": false,
              "underline": false,
              "code": false,
              "color": "default"
            },
            "plain_text": "How to use Notion CMS",
            "href": null
          }
        ]
      }
    },
    "url": "https://www.notion.so/How-to-use-Notion-CMS-5d002c2bbbf5409ab26a9995a059138f"
  })

nock(baseUrl)
  .persist()
  .get(`/pages/${pageIds[2]}`)
  .reply(200, {
    "object": "page",
    "id": "226956e8-075d-4f50-bf7f-2c683fd93032",
    "created_time": "2023-03-12T19:37:00.000Z",
    "last_edited_time": "2023-03-12T20:33:00.000Z",
    "created_by": {
      "object": "user",
      "id": "4e38fa57-609c-4beb-8e28-271b11cc81a3"
    },
    "last_edited_by": {
      "object": "user",
      "id": "4e38fa57-609c-4beb-8e28-271b11cc81a3"
    },
    "cover": null,
    "icon": null,
    "parent": {
      "type": "database_id",
      "database_id": "e4fcd5b3-1d6a-4afd-b951-10d56ce436ad"
    },
    "archived": false,
    "properties": {
      "metaDescription": {
        "id": "%3APsR",
        "type": "rich_text",
        "rich_text": []
      },
      "Layout": {
        "id": "%3B~c%40",
        "type": "select",
        "select": {
          "id": "d\\Or",
          "name": "Feldspar",
          "color": "pink"
        }
      },
      "parent-page": {
        "id": "%3FuXy",
        "type": "relation",
        "relation": [],
        "has_more": false
      },
      "sub-page": {
        "id": "%40KPB",
        "type": "relation",
        "relation": [
          {
            "id": "5d002c2b-bbf5-409a-b26a-9995a059138f"
          },
          {
            "id": "0148a891-e127-48ec-91d2-6213b9167593"
          }
        ],
        "has_more": false
      },
      "Tags": {
        "id": "NNmP",
        "type": "multi_select",
        "multi_select": []
      },
      "canonicalUrl": {
        "id": "QQ%5DS",
        "type": "url",
        "url": null
      },
      "Author": {
        "id": "SQeZ",
        "type": "people",
        "people": [
          {
            "object": "user",
            "id": "4e38fa57-609c-4beb-8e28-271b11cc81a3",
            "name": "Jacob",
            "avatar_url": null,
            "type": "person",
            "person": {
              "email": "jacob@agencykit.so"
            }
          }
        ]
      },
      "social": {
        "id": "UDl%5C",
        "type": "multi_select",
        "multi_select": []
      },
      "publishDate": {
        "id": "UzoS",
        "type": "date",
        "date": null
      },
      "Published": {
        "id": "frgL",
        "type": "select",
        "select": {
          "id": "dFFu",
          "name": "Draft",
          "color": "green"
        }
      },
      "postUrl": {
        "id": "gaK%3E",
        "type": "url",
        "url": null
      },
      "metaTitle": {
        "id": "qGkC",
        "type": "rich_text",
        "rich_text": []
      },
      "name": {
        "id": "title",
        "type": "title",
        "title": [
          {
            "type": "text",
            "text": {
              "content": "Posts",
              "link": null
            },
            "annotations": {
              "bold": false,
              "italic": false,
              "strikethrough": false,
              "underline": false,
              "code": false,
              "color": "default"
            },
            "plain_text": "Posts",
            "href": null
          }
        ]
      }
    },
    "url": "https://www.notion.so/Posts-226956e8075d4f50bf7f2c683fd93032"
  })

nock(baseUrl)
  .persist()
  .get(`/pages/${pageIds[3]}`)
  .reply(200, {
    "object": "page",
    "id": "d400849b-afc2-4ffe-8150-83005a624192",
    "created_time": "2023-03-12T19:37:00.000Z",
    "last_edited_time": "2023-03-12T20:46:00.000Z",
    "created_by": {
      "object": "user",
      "id": "4e38fa57-609c-4beb-8e28-271b11cc81a3"
    },
    "last_edited_by": {
      "object": "user",
      "id": "4e38fa57-609c-4beb-8e28-271b11cc81a3"
    },
    "cover": null,
    "icon": null,
    "parent": {
      "type": "database_id",
      "database_id": "e4fcd5b3-1d6a-4afd-b951-10d56ce436ad"
    },
    "archived": false,
    "properties": {
      "metaDescription": {
        "id": "%3APsR",
        "type": "rich_text",
        "rich_text": []
      },
      "Layout": {
        "id": "%3B~c%40",
        "type": "select",
        "select": {
          "id": "d\\Or",
          "name": "Feldspar",
          "color": "pink"
        }
      },
      "parent-page": {
        "id": "%3FuXy",
        "type": "relation",
        "relation": [
          {
            "id": "b59e1887-7c2c-4566-afc9-a619271ad56d"
          }
        ],
        "has_more": false
      },
      "sub-page": {
        "id": "%40KPB",
        "type": "relation",
        "relation": [],
        "has_more": false
      },
      "Tags": {
        "id": "NNmP",
        "type": "multi_select",
        "multi_select": []
      },
      "canonicalUrl": {
        "id": "QQ%5DS",
        "type": "url",
        "url": null
      },
      "Author": {
        "id": "SQeZ",
        "type": "people",
        "people": []
      },
      "social": {
        "id": "UDl%5C",
        "type": "multi_select",
        "multi_select": []
      },
      "publishDate": {
        "id": "UzoS",
        "type": "date",
        "date": null
      },
      "Published": {
        "id": "frgL",
        "type": "select",
        "select": {
          "id": "dFFu",
          "name": "Draft",
          "color": "green"
        }
      },
      "postUrl": {
        "id": "gaK%3E",
        "type": "url",
        "url": null
      },
      "metaTitle": {
        "id": "qGkC",
        "type": "rich_text",
        "rich_text": []
      },
      "name": {
        "id": "title",
        "type": "title",
        "title": [
          {
            "type": "text",
            "text": {
              "content": "Mortimer",
              "link": null
            },
            "annotations": {
              "bold": false,
              "italic": false,
              "strikethrough": false,
              "underline": false,
              "code": false,
              "color": "default"
            },
            "plain_text": "Mortimer",
            "href": null
          }
        ]
      }
    },
    "url": "https://www.notion.so/Mortimer-d400849bafc24ffe815083005a624192"
  })

nock(baseUrl)
  .persist()
  .get(`/pages/${pageIds[4]}`)
  .reply(200, {
    "object": "page",
    "id": "0076e375-3bed-4aa1-97c2-2eea4d58fe93",
    "created_time": "2023-03-12T19:37:00.000Z",
    "last_edited_time": "2023-03-12T20:45:00.000Z",
    "created_by": {
      "object": "user",
      "id": "4e38fa57-609c-4beb-8e28-271b11cc81a3"
    },
    "last_edited_by": {
      "object": "user",
      "id": "4e38fa57-609c-4beb-8e28-271b11cc81a3"
    },
    "cover": null,
    "icon": null,
    "parent": {
      "type": "database_id",
      "database_id": "e4fcd5b3-1d6a-4afd-b951-10d56ce436ad"
    },
    "archived": false,
    "properties": {
      "metaDescription": {
        "id": "%3APsR",
        "type": "rich_text",
        "rich_text": []
      },
      "Layout": {
        "id": "%3B~c%40",
        "type": "select",
        "select": {
          "id": "d\\Or",
          "name": "Feldspar",
          "color": "pink"
        }
      },
      "parent-page": {
        "id": "%3FuXy",
        "type": "relation",
        "relation": [
          {
            "id": "b59e1887-7c2c-4566-afc9-a619271ad56d"
          }
        ],
        "has_more": false
      },
      "sub-page": {
        "id": "%40KPB",
        "type": "relation",
        "relation": [],
        "has_more": false
      },
      "Tags": {
        "id": "NNmP",
        "type": "multi_select",
        "multi_select": []
      },
      "canonicalUrl": {
        "id": "QQ%5DS",
        "type": "url",
        "url": null
      },
      "Author": {
        "id": "SQeZ",
        "type": "people",
        "people": []
      },
      "social": {
        "id": "UDl%5C",
        "type": "multi_select",
        "multi_select": []
      },
      "publishDate": {
        "id": "UzoS",
        "type": "date",
        "date": null
      },
      "Published": {
        "id": "frgL",
        "type": "select",
        "select": {
          "id": "dFFu",
          "name": "Draft",
          "color": "green"
        }
      },
      "postUrl": {
        "id": "gaK%3E",
        "type": "url",
        "url": null
      },
      "metaTitle": {
        "id": "qGkC",
        "type": "rich_text",
        "rich_text": []
      },
      "name": {
        "id": "title",
        "type": "title",
        "title": [
          {
            "type": "text",
            "text": {
              "content": "Jacob",
              "link": null
            },
            "annotations": {
              "bold": false,
              "italic": false,
              "strikethrough": false,
              "underline": false,
              "code": false,
              "color": "default"
            },
            "plain_text": "Jacob",
            "href": null
          }
        ]
      }
    },
    "url": "https://www.notion.so/Jacob-0076e3753bed4aa197c22eea4d58fe93"
  })

nock(baseUrl)
  .persist()
  .get(`/pages/${pageIds[5]}`)
  .reply(200, {
    "object": "page",
    "id": "595bf484-5455-41ab-beea-9d1a9d363464",
    "created_time": "2023-03-12T19:37:00.000Z",
    "last_edited_time": "2023-03-12T20:55:00.000Z",
    "created_by": {
      "object": "user",
      "id": "4e38fa57-609c-4beb-8e28-271b11cc81a3"
    },
    "last_edited_by": {
      "object": "user",
      "id": "4e38fa57-609c-4beb-8e28-271b11cc81a3"
    },
    "cover": null,
    "icon": null,
    "parent": {
      "type": "database_id",
      "database_id": "e4fcd5b3-1d6a-4afd-b951-10d56ce436ad"
    },
    "archived": false,
    "properties": {
      "metaDescription": {
        "id": "%3APsR",
        "type": "rich_text",
        "rich_text": []
      },
      "Layout": {
        "id": "%3B~c%40",
        "type": "select",
        "select": {
          "id": "d\\Or",
          "name": "Feldspar",
          "color": "pink"
        }
      },
      "parent-page": {
        "id": "%3FuXy",
        "type": "relation",
        "relation": [],
        "has_more": false
      },
      "sub-page": {
        "id": "%40KPB",
        "type": "relation",
        "relation": [],
        "has_more": false
      },
      "Tags": {
        "id": "NNmP",
        "type": "multi_select",
        "multi_select": []
      },
      "canonicalUrl": {
        "id": "QQ%5DS",
        "type": "url",
        "url": null
      },
      "Author": {
        "id": "SQeZ",
        "type": "people",
        "people": []
      },
      "social": {
        "id": "UDl%5C",
        "type": "multi_select",
        "multi_select": []
      },
      "publishDate": {
        "id": "UzoS",
        "type": "date",
        "date": null
      },
      "Published": {
        "id": "frgL",
        "type": "select",
        "select": {
          "id": "dFFu",
          "name": "Draft",
          "color": "green"
        }
      },
      "postUrl": {
        "id": "gaK%3E",
        "type": "url",
        "url": null
      },
      "metaTitle": {
        "id": "qGkC",
        "type": "rich_text",
        "rich_text": []
      },
      "name": {
        "id": "title",
        "type": "title",
        "title": [
          {
            "type": "text",
            "text": {
              "content": "Pricing",
              "link": null
            },
            "annotations": {
              "bold": false,
              "italic": false,
              "strikethrough": false,
              "underline": false,
              "code": false,
              "color": "default"
            },
            "plain_text": "Pricing",
            "href": null
          }
        ]
      }
    },
    "url": "https://www.notion.so/Pricing-595bf484545541abbeea9d1a9d363464"
  })

nock(baseUrl)
  .persist()
  .get(`/pages/${pageIds[6]}`)
  .reply(200, {
    "object": "page",
    "id": "b59e1887-7c2c-4566-afc9-a619271ad56d",
    "created_time": "2023-03-12T19:36:00.000Z",
    "last_edited_time": "2023-03-12T20:53:00.000Z",
    "created_by": {
      "object": "user",
      "id": "4e38fa57-609c-4beb-8e28-271b11cc81a3"
    },
    "last_edited_by": {
      "object": "user",
      "id": "4e38fa57-609c-4beb-8e28-271b11cc81a3"
    },
    "cover": null,
    "icon": null,
    "parent": {
      "type": "database_id",
      "database_id": "e4fcd5b3-1d6a-4afd-b951-10d56ce436ad"
    },
    "archived": false,
    "properties": {
      "metaDescription": {
        "id": "%3APsR",
        "type": "rich_text",
        "rich_text": []
      },
      "Layout": {
        "id": "%3B~c%40",
        "type": "select",
        "select": {
          "id": "d\\Or",
          "name": "Feldspar",
          "color": "pink"
        }
      },
      "parent-page": {
        "id": "%3FuXy",
        "type": "relation",
        "relation": [],
        "has_more": false
      },
      "sub-page": {
        "id": "%40KPB",
        "type": "relation",
        "relation": [
          {
            "id": "0076e375-3bed-4aa1-97c2-2eea4d58fe93"
          },
          {
            "id": "d400849b-afc2-4ffe-8150-83005a624192"
          }
        ],
        "has_more": false
      },
      "Tags": {
        "id": "NNmP",
        "type": "multi_select",
        "multi_select": []
      },
      "canonicalUrl": {
        "id": "QQ%5DS",
        "type": "url",
        "url": null
      },
      "Author": {
        "id": "SQeZ",
        "type": "people",
        "people": []
      },
      "social": {
        "id": "UDl%5C",
        "type": "multi_select",
        "multi_select": []
      },
      "publishDate": {
        "id": "UzoS",
        "type": "date",
        "date": null
      },
      "Published": {
        "id": "frgL",
        "type": "select",
        "select": {
          "id": "dFFu",
          "name": "Draft",
          "color": "green"
        }
      },
      "postUrl": {
        "id": "gaK%3E",
        "type": "url",
        "url": null
      },
      "metaTitle": {
        "id": "qGkC",
        "type": "rich_text",
        "rich_text": []
      },
      "name": {
        "id": "title",
        "type": "title",
        "title": [
          {
            "type": "text",
            "text": {
              "content": "Team",
              "link": null
            },
            "annotations": {
              "bold": false,
              "italic": false,
              "strikethrough": false,
              "underline": false,
              "code": false,
              "color": "default"
            },
            "plain_text": "Team",
            "href": null
          }
        ]
      }
    },
    "url": "https://www.notion.so/Team-b59e18877c2c4566afc9a619271ad56d"
  })

nock(baseUrl)
  .persist()
  .get(`/pages/${pageIds[7]}`)
  .reply(200, {
    "object": "page",
    "id": "232177b4-31ac-4fdb-946b-cdd996add2d2",
    "created_time": "2023-03-12T19:33:00.000Z",
    "last_edited_time": "2023-03-12T20:54:00.000Z",
    "created_by": {
      "object": "user",
      "id": "4e38fa57-609c-4beb-8e28-271b11cc81a3"
    },
    "last_edited_by": {
      "object": "user",
      "id": "4e38fa57-609c-4beb-8e28-271b11cc81a3"
    },
    "cover": null,
    "icon": null,
    "parent": {
      "type": "database_id",
      "database_id": "e4fcd5b3-1d6a-4afd-b951-10d56ce436ad"
    },
    "archived": false,
    "properties": {
      "metaDescription": {
        "id": "%3APsR",
        "type": "rich_text",
        "rich_text": [
          {
            "type": "text",
            "text": {
              "content": "Notion CMS is pretty neat.",
              "link": null
            },
            "annotations": {
              "bold": false,
              "italic": false,
              "strikethrough": false,
              "underline": false,
              "code": false,
              "color": "default"
            },
            "plain_text": "Notion CMS is pretty neat.",
            "href": null
          }
        ]
      },
      "Layout": {
        "id": "%3B~c%40",
        "type": "select",
        "select": null
      },
      "parent-page": {
        "id": "%3FuXy",
        "type": "relation",
        "relation": [],
        "has_more": false
      },
      "sub-page": {
        "id": "%40KPB",
        "type": "relation",
        "relation": [],
        "has_more": false
      },
      "Tags": {
        "id": "NNmP",
        "type": "multi_select",
        "multi_select": []
      },
      "canonicalUrl": {
        "id": "QQ%5DS",
        "type": "url",
        "url": null
      },
      "Author": {
        "id": "SQeZ",
        "type": "people",
        "people": [
          {
            "object": "user",
            "id": "4e38fa57-609c-4beb-8e28-271b11cc81a3",
            "name": "Jacob",
            "avatar_url": null,
            "type": "person",
            "person": {
              "email": "jacob@agencykit.so"
            }
          }
        ]
      },
      "social": {
        "id": "UDl%5C",
        "type": "multi_select",
        "multi_select": []
      },
      "publishDate": {
        "id": "UzoS",
        "type": "date",
        "date": {
          "start": "2023-03-12",
          "end": null,
          "time_zone": null
        }
      },
      "Published": {
        "id": "frgL",
        "type": "select",
        "select": {
          "id": "dFFu",
          "name": "Draft",
          "color": "green"
        }
      },
      "postUrl": {
        "id": "gaK%3E",
        "type": "url",
        "url": null
      },
      "metaTitle": {
        "id": "qGkC",
        "type": "rich_text",
        "rich_text": [
          {
            "type": "text",
            "text": {
              "content": "About NotionCMS",
              "link": null
            },
            "annotations": {
              "bold": false,
              "italic": false,
              "strikethrough": false,
              "underline": false,
              "code": false,
              "color": "default"
            },
            "plain_text": "About NotionCMS",
            "href": null
          }
        ]
      },
      "name": {
        "id": "title",
        "type": "title",
        "title": [
          {
            "type": "text",
            "text": {
              "content": "About",
              "link": null
            },
            "annotations": {
              "bold": false,
              "italic": false,
              "strikethrough": false,
              "underline": false,
              "code": false,
              "color": "default"
            },
            "plain_text": "About",
            "href": null
          }
        ]
      }
    },
    "url": "https://www.notion.so/About-232177b431ac4fdb946bcdd996add2d2"
  })

// Block Children Queries

nock(baseUrl)
  .persist()
  .get(`/blocks/${pageIds[0]}/children`)
  .query({ page_size: 50 })
  .reply(200, {
    "object": "list",
    "results": [
      {
        "object": "block",
        "id": "5258076c-b310-43f2-a62e-b078c3b6bf77",
        "parent": {
          "type": "page_id",
          "page_id": "0148a891-e127-48ec-91d2-6213b9167593"
        },
        "created_time": "2023-03-12T20:36:00.000Z",
        "last_edited_time": "2023-03-12T20:36:00.000Z",
        "created_by": {
          "object": "user",
          "id": "4e38fa57-609c-4beb-8e28-271b11cc81a3"
        },
        "last_edited_by": {
          "object": "user",
          "id": "4e38fa57-609c-4beb-8e28-271b11cc81a3"
        },
        "has_children": false,
        "archived": false,
        "type": "heading_1",
        "heading_1": {
          "rich_text": [
            {
              "type": "text",
              "text": {
                "content": "How to Build a Blog with Notion",
                "link": null
              },
              "annotations": {
                "bold": false,
                "italic": false,
                "strikethrough": false,
                "underline": false,
                "code": false,
                "color": "default"
              },
              "plain_text": "How to Build a Blog with Notion",
              "href": null
            }
          ],
          "is_toggleable": false,
          "color": "default"
        }
      },
      {
        "object": "block",
        "id": "2b9e051a-6358-4c9c-b838-11e8803a0a54",
        "parent": {
          "type": "page_id",
          "page_id": "0148a891-e127-48ec-91d2-6213b9167593"
        },
        "created_time": "2023-03-12T20:36:00.000Z",
        "last_edited_time": "2023-03-12T20:36:00.000Z",
        "created_by": {
          "object": "user",
          "id": "4e38fa57-609c-4beb-8e28-271b11cc81a3"
        },
        "last_edited_by": {
          "object": "user",
          "id": "4e38fa57-609c-4beb-8e28-271b11cc81a3"
        },
        "has_children": false,
        "archived": false,
        "type": "paragraph",
        "paragraph": {
          "rich_text": [
            {
              "type": "text",
              "text": {
                "content": "If you're looking to build a blog with Notion, you're in luck! NotionCMS is a great tool that lets you create and manage your blog using Notion. In this guide, we'll show you how to use NotionCMS along with vite-plugin-ssr to create a fast, responsive and SEO-friendly blog.",
                "link": null
              },
              "annotations": {
                "bold": false,
                "italic": false,
                "strikethrough": false,
                "underline": false,
                "code": false,
                "color": "default"
              },
              "plain_text": "If you're looking to build a blog with Notion, you're in luck! NotionCMS is a great tool that lets you create and manage your blog using Notion. In this guide, we'll show you how to use NotionCMS along with vite-plugin-ssr to create a fast, responsive and SEO-friendly blog.",
              "href": null
            }
          ],
          "color": "default"
        }
      },
      {
        "object": "block",
        "id": "a750bc16-c98b-43db-8ab8-dbae73223b7e",
        "parent": {
          "type": "page_id",
          "page_id": "0148a891-e127-48ec-91d2-6213b9167593"
        },
        "created_time": "2023-03-12T20:36:00.000Z",
        "last_edited_time": "2023-03-12T20:36:00.000Z",
        "created_by": {
          "object": "user",
          "id": "4e38fa57-609c-4beb-8e28-271b11cc81a3"
        },
        "last_edited_by": {
          "object": "user",
          "id": "4e38fa57-609c-4beb-8e28-271b11cc81a3"
        },
        "has_children": false,
        "archived": false,
        "type": "heading_2",
        "heading_2": {
          "rich_text": [
            {
              "type": "text",
              "text": {
                "content": "Step 1: Set up NotionCMS",
                "link": null
              },
              "annotations": {
                "bold": false,
                "italic": false,
                "strikethrough": false,
                "underline": false,
                "code": false,
                "color": "default"
              },
              "plain_text": "Step 1: Set up NotionCMS",
              "href": null
            }
          ],
          "is_toggleable": false,
          "color": "default"
        }
      },
      {
        "object": "block",
        "id": "5f9b9811-6121-410a-92af-8e3c75447d7d",
        "parent": {
          "type": "page_id",
          "page_id": "0148a891-e127-48ec-91d2-6213b9167593"
        },
        "created_time": "2023-03-12T20:36:00.000Z",
        "last_edited_time": "2023-03-12T20:36:00.000Z",
        "created_by": {
          "object": "user",
          "id": "4e38fa57-609c-4beb-8e28-271b11cc81a3"
        },
        "last_edited_by": {
          "object": "user",
          "id": "4e38fa57-609c-4beb-8e28-271b11cc81a3"
        },
        "has_children": false,
        "archived": false,
        "type": "paragraph",
        "paragraph": {
          "rich_text": [
            {
              "type": "text",
              "text": {
                "content": "First, you'll need to set up NotionCMS. You can find the instructions on how to do this on the ",
                "link": null
              },
              "annotations": {
                "bold": false,
                "italic": false,
                "strikethrough": false,
                "underline": false,
                "code": false,
                "color": "default"
              },
              "plain_text": "First, you'll need to set up NotionCMS. You can find the instructions on how to do this on the ",
              "href": null
            },
            {
              "type": "text",
              "text": {
                "content": "NotionCMS Github page",
                "link": {
                  "url": "https://github.com/agency-kit/notion-cms"
                }
              },
              "annotations": {
                "bold": false,
                "italic": false,
                "strikethrough": false,
                "underline": false,
                "code": false,
                "color": "default"
              },
              "plain_text": "NotionCMS Github page",
              "href": "https://github.com/agency-kit/notion-cms"
            },
            {
              "type": "text",
              "text": {
                "content": ". Once you have NotionCMS set up, you can move on to the next step.",
                "link": null
              },
              "annotations": {
                "bold": false,
                "italic": false,
                "strikethrough": false,
                "underline": false,
                "code": false,
                "color": "default"
              },
              "plain_text": ". Once you have NotionCMS set up, you can move on to the next step.",
              "href": null
            }
          ],
          "color": "default"
        }
      },
      {
        "object": "block",
        "id": "5065192e-33f8-42b6-809b-7c84a44623cc",
        "parent": {
          "type": "page_id",
          "page_id": "0148a891-e127-48ec-91d2-6213b9167593"
        },
        "created_time": "2023-03-12T20:36:00.000Z",
        "last_edited_time": "2023-03-12T20:36:00.000Z",
        "created_by": {
          "object": "user",
          "id": "4e38fa57-609c-4beb-8e28-271b11cc81a3"
        },
        "last_edited_by": {
          "object": "user",
          "id": "4e38fa57-609c-4beb-8e28-271b11cc81a3"
        },
        "has_children": false,
        "archived": false,
        "type": "heading_2",
        "heading_2": {
          "rich_text": [
            {
              "type": "text",
              "text": {
                "content": "Step 2: Install vite-plugin-ssr",
                "link": null
              },
              "annotations": {
                "bold": false,
                "italic": false,
                "strikethrough": false,
                "underline": false,
                "code": false,
                "color": "default"
              },
              "plain_text": "Step 2: Install vite-plugin-ssr",
              "href": null
            }
          ],
          "is_toggleable": false,
          "color": "default"
        }
      },
      {
        "object": "block",
        "id": "0db58224-86ff-4d19-9669-dc4fecbfff01",
        "parent": {
          "type": "page_id",
          "page_id": "0148a891-e127-48ec-91d2-6213b9167593"
        },
        "created_time": "2023-03-12T20:36:00.000Z",
        "last_edited_time": "2023-03-12T20:36:00.000Z",
        "created_by": {
          "object": "user",
          "id": "4e38fa57-609c-4beb-8e28-271b11cc81a3"
        },
        "last_edited_by": {
          "object": "user",
          "id": "4e38fa57-609c-4beb-8e28-271b11cc81a3"
        },
        "has_children": false,
        "archived": false,
        "type": "paragraph",
        "paragraph": {
          "rich_text": [
            {
              "type": "text",
              "text": {
                "content": "Next, you'll need to install vite-plugin-ssr. This is a plugin for Vite that will help you build your blog. You can find the installation instructions on the ",
                "link": null
              },
              "annotations": {
                "bold": false,
                "italic": false,
                "strikethrough": false,
                "underline": false,
                "code": false,
                "color": "default"
              },
              "plain_text": "Next, you'll need to install vite-plugin-ssr. This is a plugin for Vite that will help you build your blog. You can find the installation instructions on the ",
              "href": null
            },
            {
              "type": "text",
              "text": {
                "content": "vite-plugin-ssr Github page",
                "link": {
                  "url": "https://github.com/brillout/vite-plugin-ssr"
                }
              },
              "annotations": {
                "bold": false,
                "italic": false,
                "strikethrough": false,
                "underline": false,
                "code": false,
                "color": "default"
              },
              "plain_text": "vite-plugin-ssr Github page",
              "href": "https://github.com/brillout/vite-plugin-ssr"
            },
            {
              "type": "text",
              "text": {
                "content": ". Once you have vite-plugin-ssr installed, you can move on to the next step.",
                "link": null
              },
              "annotations": {
                "bold": false,
                "italic": false,
                "strikethrough": false,
                "underline": false,
                "code": false,
                "color": "default"
              },
              "plain_text": ". Once you have vite-plugin-ssr installed, you can move on to the next step.",
              "href": null
            }
          ],
          "color": "default"
        }
      },
      {
        "object": "block",
        "id": "68fcf3c4-5684-48fb-aa59-b034d0f93e97",
        "parent": {
          "type": "page_id",
          "page_id": "0148a891-e127-48ec-91d2-6213b9167593"
        },
        "created_time": "2023-03-12T20:36:00.000Z",
        "last_edited_time": "2023-03-12T20:36:00.000Z",
        "created_by": {
          "object": "user",
          "id": "4e38fa57-609c-4beb-8e28-271b11cc81a3"
        },
        "last_edited_by": {
          "object": "user",
          "id": "4e38fa57-609c-4beb-8e28-271b11cc81a3"
        },
        "has_children": false,
        "archived": false,
        "type": "heading_2",
        "heading_2": {
          "rich_text": [
            {
              "type": "text",
              "text": {
                "content": "Step 3: Create the Blog Pages in Notion",
                "link": null
              },
              "annotations": {
                "bold": false,
                "italic": false,
                "strikethrough": false,
                "underline": false,
                "code": false,
                "color": "default"
              },
              "plain_text": "Step 3: Create the Blog Pages in Notion",
              "href": null
            }
          ],
          "is_toggleable": false,
          "color": "default"
        }
      },
      {
        "object": "block",
        "id": "bbd212c8-5145-4956-a7df-18701199dd6c",
        "parent": {
          "type": "page_id",
          "page_id": "0148a891-e127-48ec-91d2-6213b9167593"
        },
        "created_time": "2023-03-12T20:36:00.000Z",
        "last_edited_time": "2023-03-12T20:36:00.000Z",
        "created_by": {
          "object": "user",
          "id": "4e38fa57-609c-4beb-8e28-271b11cc81a3"
        },
        "last_edited_by": {
          "object": "user",
          "id": "4e38fa57-609c-4beb-8e28-271b11cc81a3"
        },
        "has_children": false,
        "archived": false,
        "type": "paragraph",
        "paragraph": {
          "rich_text": [
            {
              "type": "text",
              "text": {
                "content": "Now it's time to create your blog pages in Notion. You'll need to create a database with the following properties:",
                "link": null
              },
              "annotations": {
                "bold": false,
                "italic": false,
                "strikethrough": false,
                "underline": false,
                "code": false,
                "color": "default"
              },
              "plain_text": "Now it's time to create your blog pages in Notion. You'll need to create a database with the following properties:",
              "href": null
            }
          ],
          "color": "default"
        }
      },
      {
        "object": "block",
        "id": "21fd431a-d5e2-4104-9467-ec1f2dde0744",
        "parent": {
          "type": "page_id",
          "page_id": "0148a891-e127-48ec-91d2-6213b9167593"
        },
        "created_time": "2023-03-12T20:36:00.000Z",
        "last_edited_time": "2023-03-12T20:36:00.000Z",
        "created_by": {
          "object": "user",
          "id": "4e38fa57-609c-4beb-8e28-271b11cc81a3"
        },
        "last_edited_by": {
          "object": "user",
          "id": "4e38fa57-609c-4beb-8e28-271b11cc81a3"
        },
        "has_children": false,
        "archived": false,
        "type": "bulleted_list_item",
        "bulleted_list_item": {
          "rich_text": [
            {
              "type": "text",
              "text": {
                "content": "Title (text)",
                "link": null
              },
              "annotations": {
                "bold": false,
                "italic": false,
                "strikethrough": false,
                "underline": false,
                "code": false,
                "color": "default"
              },
              "plain_text": "Title (text)",
              "href": null
            }
          ],
          "color": "default"
        }
      },
      {
        "object": "block",
        "id": "3334a922-fa12-4feb-b6e2-d02b3f74de12",
        "parent": {
          "type": "page_id",
          "page_id": "0148a891-e127-48ec-91d2-6213b9167593"
        },
        "created_time": "2023-03-12T20:36:00.000Z",
        "last_edited_time": "2023-03-12T20:36:00.000Z",
        "created_by": {
          "object": "user",
          "id": "4e38fa57-609c-4beb-8e28-271b11cc81a3"
        },
        "last_edited_by": {
          "object": "user",
          "id": "4e38fa57-609c-4beb-8e28-271b11cc81a3"
        },
        "has_children": false,
        "archived": false,
        "type": "bulleted_list_item",
        "bulleted_list_item": {
          "rich_text": [
            {
              "type": "text",
              "text": {
                "content": "Slug (text)",
                "link": null
              },
              "annotations": {
                "bold": false,
                "italic": false,
                "strikethrough": false,
                "underline": false,
                "code": false,
                "color": "default"
              },
              "plain_text": "Slug (text)",
              "href": null
            }
          ],
          "color": "default"
        }
      },
      {
        "object": "block",
        "id": "3987f187-d137-42c5-a25e-a28c63a29a65",
        "parent": {
          "type": "page_id",
          "page_id": "0148a891-e127-48ec-91d2-6213b9167593"
        },
        "created_time": "2023-03-12T20:36:00.000Z",
        "last_edited_time": "2023-03-12T20:36:00.000Z",
        "created_by": {
          "object": "user",
          "id": "4e38fa57-609c-4beb-8e28-271b11cc81a3"
        },
        "last_edited_by": {
          "object": "user",
          "id": "4e38fa57-609c-4beb-8e28-271b11cc81a3"
        },
        "has_children": false,
        "archived": false,
        "type": "bulleted_list_item",
        "bulleted_list_item": {
          "rich_text": [
            {
              "type": "text",
              "text": {
                "content": "Date (date)",
                "link": null
              },
              "annotations": {
                "bold": false,
                "italic": false,
                "strikethrough": false,
                "underline": false,
                "code": false,
                "color": "default"
              },
              "plain_text": "Date (date)",
              "href": null
            }
          ],
          "color": "default"
        }
      },
      {
        "object": "block",
        "id": "6674fbd4-955d-4166-9cd9-837c10c10b9b",
        "parent": {
          "type": "page_id",
          "page_id": "0148a891-e127-48ec-91d2-6213b9167593"
        },
        "created_time": "2023-03-12T20:36:00.000Z",
        "last_edited_time": "2023-03-12T20:36:00.000Z",
        "created_by": {
          "object": "user",
          "id": "4e38fa57-609c-4beb-8e28-271b11cc81a3"
        },
        "last_edited_by": {
          "object": "user",
          "id": "4e38fa57-609c-4beb-8e28-271b11cc81a3"
        },
        "has_children": false,
        "archived": false,
        "type": "bulleted_list_item",
        "bulleted_list_item": {
          "rich_text": [
            {
              "type": "text",
              "text": {
                "content": "Author (person)",
                "link": null
              },
              "annotations": {
                "bold": false,
                "italic": false,
                "strikethrough": false,
                "underline": false,
                "code": false,
                "color": "default"
              },
              "plain_text": "Author (person)",
              "href": null
            }
          ],
          "color": "default"
        }
      },
      {
        "object": "block",
        "id": "79596aea-190d-410f-8310-3db6740337cb",
        "parent": {
          "type": "page_id",
          "page_id": "0148a891-e127-48ec-91d2-6213b9167593"
        },
        "created_time": "2023-03-12T20:36:00.000Z",
        "last_edited_time": "2023-03-12T20:36:00.000Z",
        "created_by": {
          "object": "user",
          "id": "4e38fa57-609c-4beb-8e28-271b11cc81a3"
        },
        "last_edited_by": {
          "object": "user",
          "id": "4e38fa57-609c-4beb-8e28-271b11cc81a3"
        },
        "has_children": false,
        "archived": false,
        "type": "bulleted_list_item",
        "bulleted_list_item": {
          "rich_text": [
            {
              "type": "text",
              "text": {
                "content": "Tags (multi-select)",
                "link": null
              },
              "annotations": {
                "bold": false,
                "italic": false,
                "strikethrough": false,
                "underline": false,
                "code": false,
                "color": "default"
              },
              "plain_text": "Tags (multi-select)",
              "href": null
            }
          ],
          "color": "default"
        }
      },
      {
        "object": "block",
        "id": "de925d9c-460b-4105-a471-4e6db22e6015",
        "parent": {
          "type": "page_id",
          "page_id": "0148a891-e127-48ec-91d2-6213b9167593"
        },
        "created_time": "2023-03-12T20:36:00.000Z",
        "last_edited_time": "2023-03-12T20:36:00.000Z",
        "created_by": {
          "object": "user",
          "id": "4e38fa57-609c-4beb-8e28-271b11cc81a3"
        },
        "last_edited_by": {
          "object": "user",
          "id": "4e38fa57-609c-4beb-8e28-271b11cc81a3"
        },
        "has_children": false,
        "archived": false,
        "type": "paragraph",
        "paragraph": {
          "rich_text": [
            {
              "type": "text",
              "text": {
                "content": "Once you have your database set up, you can start creating your blog posts. Make sure to fill in all the necessary properties for each blog post.",
                "link": null
              },
              "annotations": {
                "bold": false,
                "italic": false,
                "strikethrough": false,
                "underline": false,
                "code": false,
                "color": "default"
              },
              "plain_text": "Once you have your database set up, you can start creating your blog posts. Make sure to fill in all the necessary properties for each blog post.",
              "href": null
            }
          ],
          "color": "default"
        }
      },
      {
        "object": "block",
        "id": "56fee734-0543-4c82-8f86-f99ce0459ef0",
        "parent": {
          "type": "page_id",
          "page_id": "0148a891-e127-48ec-91d2-6213b9167593"
        },
        "created_time": "2023-03-12T20:36:00.000Z",
        "last_edited_time": "2023-03-12T20:36:00.000Z",
        "created_by": {
          "object": "user",
          "id": "4e38fa57-609c-4beb-8e28-271b11cc81a3"
        },
        "last_edited_by": {
          "object": "user",
          "id": "4e38fa57-609c-4beb-8e28-271b11cc81a3"
        },
        "has_children": false,
        "archived": false,
        "type": "heading_2",
        "heading_2": {
          "rich_text": [
            {
              "type": "text",
              "text": {
                "content": "Step 4: Customize the Feldspar Layout",
                "link": null
              },
              "annotations": {
                "bold": false,
                "italic": false,
                "strikethrough": false,
                "underline": false,
                "code": false,
                "color": "default"
              },
              "plain_text": "Step 4: Customize the Feldspar Layout",
              "href": null
            }
          ],
          "is_toggleable": false,
          "color": "default"
        }
      },
      {
        "object": "block",
        "id": "e3747c7a-fecd-4d97-8408-92309f8daa45",
        "parent": {
          "type": "page_id",
          "page_id": "0148a891-e127-48ec-91d2-6213b9167593"
        },
        "created_time": "2023-03-12T20:36:00.000Z",
        "last_edited_time": "2023-03-12T20:36:00.000Z",
        "created_by": {
          "object": "user",
          "id": "4e38fa57-609c-4beb-8e28-271b11cc81a3"
        },
        "last_edited_by": {
          "object": "user",
          "id": "4e38fa57-609c-4beb-8e28-271b11cc81a3"
        },
        "has_children": false,
        "archived": false,
        "type": "paragraph",
        "paragraph": {
          "rich_text": [
            {
              "type": "text",
              "text": {
                "content": "If you want to use the Feldspar layout, you'll need to customize it to fit your needs. You can find the instructions on how to do this on the ",
                "link": null
              },
              "annotations": {
                "bold": false,
                "italic": false,
                "strikethrough": false,
                "underline": false,
                "code": false,
                "color": "default"
              },
              "plain_text": "If you want to use the Feldspar layout, you'll need to customize it to fit your needs. You can find the instructions on how to do this on the ",
              "href": null
            },
            {
              "type": "text",
              "text": {
                "content": "Feldspar Github page",
                "link": {
                  "url": "https://github.com/agency-kit/feldspar"
                }
              },
              "annotations": {
                "bold": false,
                "italic": false,
                "strikethrough": false,
                "underline": false,
                "code": false,
                "color": "default"
              },
              "plain_text": "Feldspar Github page",
              "href": "https://github.com/agency-kit/feldspar"
            },
            {
              "type": "text",
              "text": {
                "content": ". Once you have customized the layout, you can move on to the next step.",
                "link": null
              },
              "annotations": {
                "bold": false,
                "italic": false,
                "strikethrough": false,
                "underline": false,
                "code": false,
                "color": "default"
              },
              "plain_text": ". Once you have customized the layout, you can move on to the next step.",
              "href": null
            }
          ],
          "color": "default"
        }
      },
      {
        "object": "block",
        "id": "fcf20621-9c71-49aa-8461-044a5f9fc47c",
        "parent": {
          "type": "page_id",
          "page_id": "0148a891-e127-48ec-91d2-6213b9167593"
        },
        "created_time": "2023-03-12T20:36:00.000Z",
        "last_edited_time": "2023-03-12T20:36:00.000Z",
        "created_by": {
          "object": "user",
          "id": "4e38fa57-609c-4beb-8e28-271b11cc81a3"
        },
        "last_edited_by": {
          "object": "user",
          "id": "4e38fa57-609c-4beb-8e28-271b11cc81a3"
        },
        "has_children": false,
        "archived": false,
        "type": "heading_2",
        "heading_2": {
          "rich_text": [
            {
              "type": "text",
              "text": {
                "content": "Step 5: Build Your Blog",
                "link": null
              },
              "annotations": {
                "bold": false,
                "italic": false,
                "strikethrough": false,
                "underline": false,
                "code": false,
                "color": "default"
              },
              "plain_text": "Step 5: Build Your Blog",
              "href": null
            }
          ],
          "is_toggleable": false,
          "color": "default"
        }
      },
      {
        "object": "block",
        "id": "a75cc43b-eed5-4f7c-a917-3a6a897e3b9d",
        "parent": {
          "type": "page_id",
          "page_id": "0148a891-e127-48ec-91d2-6213b9167593"
        },
        "created_time": "2023-03-12T20:36:00.000Z",
        "last_edited_time": "2023-03-12T20:36:00.000Z",
        "created_by": {
          "object": "user",
          "id": "4e38fa57-609c-4beb-8e28-271b11cc81a3"
        },
        "last_edited_by": {
          "object": "user",
          "id": "4e38fa57-609c-4beb-8e28-271b11cc81a3"
        },
        "has_children": false,
        "archived": false,
        "type": "paragraph",
        "paragraph": {
          "rich_text": [
            {
              "type": "text",
              "text": {
                "content": "Now it's time to build your blog! Run the following command in your terminal:",
                "link": null
              },
              "annotations": {
                "bold": false,
                "italic": false,
                "strikethrough": false,
                "underline": false,
                "code": false,
                "color": "default"
              },
              "plain_text": "Now it's time to build your blog! Run the following command in your terminal:",
              "href": null
            }
          ],
          "color": "default"
        }
      },
      {
        "object": "block",
        "id": "cad7471c-0efc-42b9-aa32-0f5624c5e616",
        "parent": {
          "type": "page_id",
          "page_id": "0148a891-e127-48ec-91d2-6213b9167593"
        },
        "created_time": "2023-03-12T20:36:00.000Z",
        "last_edited_time": "2023-03-12T20:36:00.000Z",
        "created_by": {
          "object": "user",
          "id": "4e38fa57-609c-4beb-8e28-271b11cc81a3"
        },
        "last_edited_by": {
          "object": "user",
          "id": "4e38fa57-609c-4beb-8e28-271b11cc81a3"
        },
        "has_children": false,
        "archived": false,
        "type": "code",
        "code": {
          "caption": [],
          "rich_text": [
            {
              "type": "text",
              "text": {
                "content": "npm run build\n",
                "link": null
              },
              "annotations": {
                "bold": false,
                "italic": false,
                "strikethrough": false,
                "underline": false,
                "code": false,
                "color": "default"
              },
              "plain_text": "npm run build\n",
              "href": null
            }
          ],
          "language": "plain text"
        }
      },
      {
        "object": "block",
        "id": "e11eb872-089f-4985-8d7f-ee7d0a293c9e",
        "parent": {
          "type": "page_id",
          "page_id": "0148a891-e127-48ec-91d2-6213b9167593"
        },
        "created_time": "2023-03-12T20:36:00.000Z",
        "last_edited_time": "2023-03-12T20:36:00.000Z",
        "created_by": {
          "object": "user",
          "id": "4e38fa57-609c-4beb-8e28-271b11cc81a3"
        },
        "last_edited_by": {
          "object": "user",
          "id": "4e38fa57-609c-4beb-8e28-271b11cc81a3"
        },
        "has_children": false,
        "archived": false,
        "type": "paragraph",
        "paragraph": {
          "rich_text": [
            {
              "type": "text",
              "text": {
                "content": "This will build your blog using vite-plugin-ssr. Once the build is complete, you can run the following command to start the server:",
                "link": null
              },
              "annotations": {
                "bold": false,
                "italic": false,
                "strikethrough": false,
                "underline": false,
                "code": false,
                "color": "default"
              },
              "plain_text": "This will build your blog using vite-plugin-ssr. Once the build is complete, you can run the following command to start the server:",
              "href": null
            }
          ],
          "color": "default"
        }
      },
      {
        "object": "block",
        "id": "3ddedfcc-6b4c-4f47-93c3-2e32d926008a",
        "parent": {
          "type": "page_id",
          "page_id": "0148a891-e127-48ec-91d2-6213b9167593"
        },
        "created_time": "2023-03-12T20:36:00.000Z",
        "last_edited_time": "2023-03-12T20:36:00.000Z",
        "created_by": {
          "object": "user",
          "id": "4e38fa57-609c-4beb-8e28-271b11cc81a3"
        },
        "last_edited_by": {
          "object": "user",
          "id": "4e38fa57-609c-4beb-8e28-271b11cc81a3"
        },
        "has_children": false,
        "archived": false,
        "type": "code",
        "code": {
          "caption": [],
          "rich_text": [
            {
              "type": "text",
              "text": {
                "content": "npm run serve\n",
                "link": null
              },
              "annotations": {
                "bold": false,
                "italic": false,
                "strikethrough": false,
                "underline": false,
                "code": false,
                "color": "default"
              },
              "plain_text": "npm run serve\n",
              "href": null
            }
          ],
          "language": "plain text"
        }
      },
      {
        "object": "block",
        "id": "7810d070-09f0-4658-b77a-8ad3a7871d94",
        "parent": {
          "type": "page_id",
          "page_id": "0148a891-e127-48ec-91d2-6213b9167593"
        },
        "created_time": "2023-03-12T20:36:00.000Z",
        "last_edited_time": "2023-03-12T20:36:00.000Z",
        "created_by": {
          "object": "user",
          "id": "4e38fa57-609c-4beb-8e28-271b11cc81a3"
        },
        "last_edited_by": {
          "object": "user",
          "id": "4e38fa57-609c-4beb-8e28-271b11cc81a3"
        },
        "has_children": false,
        "archived": false,
        "type": "paragraph",
        "paragraph": {
          "rich_text": [
            {
              "type": "text",
              "text": {
                "content": "This will start the server on port 3000. You can now view your blog by navigating to ",
                "link": null
              },
              "annotations": {
                "bold": false,
                "italic": false,
                "strikethrough": false,
                "underline": false,
                "code": false,
                "color": "default"
              },
              "plain_text": "This will start the server on port 3000. You can now view your blog by navigating to ",
              "href": null
            },
            {
              "type": "text",
              "text": {
                "content": "http://localhost:3000",
                "link": null
              },
              "annotations": {
                "bold": false,
                "italic": false,
                "strikethrough": false,
                "underline": false,
                "code": true,
                "color": "default"
              },
              "plain_text": "http://localhost:3000",
              "href": null
            },
            {
              "type": "text",
              "text": {
                "content": ".",
                "link": null
              },
              "annotations": {
                "bold": false,
                "italic": false,
                "strikethrough": false,
                "underline": false,
                "code": false,
                "color": "default"
              },
              "plain_text": ".",
              "href": null
            }
          ],
          "color": "default"
        }
      },
      {
        "object": "block",
        "id": "a96b83bc-aa54-4d2e-91c9-5b4b509e5658",
        "parent": {
          "type": "page_id",
          "page_id": "0148a891-e127-48ec-91d2-6213b9167593"
        },
        "created_time": "2023-03-12T20:36:00.000Z",
        "last_edited_time": "2023-03-12T20:36:00.000Z",
        "created_by": {
          "object": "user",
          "id": "4e38fa57-609c-4beb-8e28-271b11cc81a3"
        },
        "last_edited_by": {
          "object": "user",
          "id": "4e38fa57-609c-4beb-8e28-271b11cc81a3"
        },
        "has_children": false,
        "archived": false,
        "type": "paragraph",
        "paragraph": {
          "rich_text": [
            {
              "type": "text",
              "text": {
                "content": "Congratulations! You have successfully built a blog using NotionCMS and vite-plugin-ssr. Happy blogging!",
                "link": null
              },
              "annotations": {
                "bold": false,
                "italic": false,
                "strikethrough": false,
                "underline": false,
                "code": false,
                "color": "default"
              },
              "plain_text": "Congratulations! You have successfully built a blog using NotionCMS and vite-plugin-ssr. Happy blogging!",
              "href": null
            }
          ],
          "color": "default"
        }
      },
      {
        "object": "block",
        "id": "6efdfa94-15a3-40df-90f3-9aeaeb5f160e",
        "parent": {
          "type": "page_id",
          "page_id": "0148a891-e127-48ec-91d2-6213b9167593"
        },
        "created_time": "2023-03-12T20:36:00.000Z",
        "last_edited_time": "2023-03-12T20:36:00.000Z",
        "created_by": {
          "object": "user",
          "id": "4e38fa57-609c-4beb-8e28-271b11cc81a3"
        },
        "last_edited_by": {
          "object": "user",
          "id": "4e38fa57-609c-4beb-8e28-271b11cc81a3"
        },
        "has_children": false,
        "archived": false,
        "type": "heading_2",
        "heading_2": {
          "rich_text": [
            {
              "type": "text",
              "text": {
                "content": "Conclusion",
                "link": null
              },
              "annotations": {
                "bold": false,
                "italic": false,
                "strikethrough": false,
                "underline": false,
                "code": false,
                "color": "default"
              },
              "plain_text": "Conclusion",
              "href": null
            }
          ],
          "is_toggleable": false,
          "color": "default"
        }
      },
      {
        "object": "block",
        "id": "55a02b1f-3f40-4b81-beb3-daa8c153084e",
        "parent": {
          "type": "page_id",
          "page_id": "0148a891-e127-48ec-91d2-6213b9167593"
        },
        "created_time": "2023-03-12T20:36:00.000Z",
        "last_edited_time": "2023-03-12T20:36:00.000Z",
        "created_by": {
          "object": "user",
          "id": "4e38fa57-609c-4beb-8e28-271b11cc81a3"
        },
        "last_edited_by": {
          "object": "user",
          "id": "4e38fa57-609c-4beb-8e28-271b11cc81a3"
        },
        "has_children": false,
        "archived": false,
        "type": "paragraph",
        "paragraph": {
          "rich_text": [
            {
              "type": "text",
              "text": {
                "content": "In this guide, we showed you how to use NotionCMS and vite-plugin-ssr to create a blog with Notion. We hope you found this guide helpful and that it inspires you to create your own blog using NotionCMS. If you have any questions or feedback, feel free to leave a comment below.",
                "link": null
              },
              "annotations": {
                "bold": false,
                "italic": false,
                "strikethrough": false,
                "underline": false,
                "code": false,
                "color": "default"
              },
              "plain_text": "In this guide, we showed you how to use NotionCMS and vite-plugin-ssr to create a blog with Notion. We hope you found this guide helpful and that it inspires you to create your own blog using NotionCMS. If you have any questions or feedback, feel free to leave a comment below.",
              "href": null
            }
          ],
          "color": "default"
        }
      },
      {
        "object": "block",
        "id": "2b37249a-5979-40b2-9f6a-c7047f7c479e",
        "parent": {
          "type": "page_id",
          "page_id": "0148a891-e127-48ec-91d2-6213b9167593"
        },
        "created_time": "2023-03-12T20:36:00.000Z",
        "last_edited_time": "2023-03-12T20:36:00.000Z",
        "created_by": {
          "object": "user",
          "id": "4e38fa57-609c-4beb-8e28-271b11cc81a3"
        },
        "last_edited_by": {
          "object": "user",
          "id": "4e38fa57-609c-4beb-8e28-271b11cc81a3"
        },
        "has_children": false,
        "archived": false,
        "type": "paragraph",
        "paragraph": {
          "rich_text": [],
          "color": "default"
        }
      }
    ],
    "next_cursor": null,
    "has_more": false,
    "type": "block",
    "block": {}
  })

nock(baseUrl)
  .persist()
  .get(`/blocks/${pageIds[1]}/children`)
  .query({ page_size: 50 })
  .reply(200, {
    "object": "list",
    "results": [
      {
        "object": "block",
        "id": "9d66d6ed-750a-4e6a-aec0-18a4696c5fe9",
        "parent": {
          "type": "page_id",
          "page_id": "5d002c2b-bbf5-409a-b26a-9995a059138f"
        },
        "created_time": "2023-03-12T20:34:00.000Z",
        "last_edited_time": "2023-03-12T20:34:00.000Z",
        "created_by": {
          "object": "user",
          "id": "4e38fa57-609c-4beb-8e28-271b11cc81a3"
        },
        "last_edited_by": {
          "object": "user",
          "id": "4e38fa57-609c-4beb-8e28-271b11cc81a3"
        },
        "has_children": false,
        "archived": false,
        "type": "heading_1",
        "heading_1": {
          "rich_text": [
            {
              "type": "text",
              "text": {
                "content": "How to use Notion CMS",
                "link": null
              },
              "annotations": {
                "bold": false,
                "italic": false,
                "strikethrough": false,
                "underline": false,
                "code": false,
                "color": "default"
              },
              "plain_text": "How to use Notion CMS",
              "href": null
            }
          ],
          "is_toggleable": false,
          "color": "default"
        }
      },
      {
        "object": "block",
        "id": "69532019-c23a-4e31-8093-27ddab02b670",
        "parent": {
          "type": "page_id",
          "page_id": "5d002c2b-bbf5-409a-b26a-9995a059138f"
        },
        "created_time": "2023-03-12T20:34:00.000Z",
        "last_edited_time": "2023-03-12T20:34:00.000Z",
        "created_by": {
          "object": "user",
          "id": "4e38fa57-609c-4beb-8e28-271b11cc81a3"
        },
        "last_edited_by": {
          "object": "user",
          "id": "4e38fa57-609c-4beb-8e28-271b11cc81a3"
        },
        "has_children": false,
        "archived": false,
        "type": "paragraph",
        "paragraph": {
          "rich_text": [
            {
              "type": "text",
              "text": {
                "content": "Notion CMS is a powerful tool that can help you manage your website's content in a more efficient way. In this guide, we will walk you through the steps to use Notion CMS.",
                "link": null
              },
              "annotations": {
                "bold": false,
                "italic": false,
                "strikethrough": false,
                "underline": false,
                "code": false,
                "color": "default"
              },
              "plain_text": "Notion CMS is a powerful tool that can help you manage your website's content in a more efficient way. In this guide, we will walk you through the steps to use Notion CMS.",
              "href": null
            }
          ],
          "color": "default"
        }
      },
      {
        "object": "block",
        "id": "37641a60-0982-45b8-941c-a1dfdded3e5f",
        "parent": {
          "type": "page_id",
          "page_id": "5d002c2b-bbf5-409a-b26a-9995a059138f"
        },
        "created_time": "2023-03-12T20:34:00.000Z",
        "last_edited_time": "2023-03-12T20:34:00.000Z",
        "created_by": {
          "object": "user",
          "id": "4e38fa57-609c-4beb-8e28-271b11cc81a3"
        },
        "last_edited_by": {
          "object": "user",
          "id": "4e38fa57-609c-4beb-8e28-271b11cc81a3"
        },
        "has_children": false,
        "archived": false,
        "type": "heading_2",
        "heading_2": {
          "rich_text": [
            {
              "type": "text",
              "text": {
                "content": "Step 1: Clone the Notion CMS repository",
                "link": null
              },
              "annotations": {
                "bold": false,
                "italic": false,
                "strikethrough": false,
                "underline": false,
                "code": false,
                "color": "default"
              },
              "plain_text": "Step 1: Clone the Notion CMS repository",
              "href": null
            }
          ],
          "is_toggleable": false,
          "color": "default"
        }
      },
      {
        "object": "block",
        "id": "3e37dfd6-0b45-43dd-9e19-1d5e36d95bf6",
        "parent": {
          "type": "page_id",
          "page_id": "5d002c2b-bbf5-409a-b26a-9995a059138f"
        },
        "created_time": "2023-03-12T20:34:00.000Z",
        "last_edited_time": "2023-03-12T20:34:00.000Z",
        "created_by": {
          "object": "user",
          "id": "4e38fa57-609c-4beb-8e28-271b11cc81a3"
        },
        "last_edited_by": {
          "object": "user",
          "id": "4e38fa57-609c-4beb-8e28-271b11cc81a3"
        },
        "has_children": false,
        "archived": false,
        "type": "paragraph",
        "paragraph": {
          "rich_text": [
            {
              "type": "text",
              "text": {
                "content": "To get started, you will need to clone the Notion CMS repository from Github. You can do this by running the following command in your terminal:",
                "link": null
              },
              "annotations": {
                "bold": false,
                "italic": false,
                "strikethrough": false,
                "underline": false,
                "code": false,
                "color": "default"
              },
              "plain_text": "To get started, you will need to clone the Notion CMS repository from Github. You can do this by running the following command in your terminal:",
              "href": null
            }
          ],
          "color": "default"
        }
      },
      {
        "object": "block",
        "id": "55d7d9fd-7c35-472a-9110-f5f760f7f7f3",
        "parent": {
          "type": "page_id",
          "page_id": "5d002c2b-bbf5-409a-b26a-9995a059138f"
        },
        "created_time": "2023-03-12T20:34:00.000Z",
        "last_edited_time": "2023-03-12T20:34:00.000Z",
        "created_by": {
          "object": "user",
          "id": "4e38fa57-609c-4beb-8e28-271b11cc81a3"
        },
        "last_edited_by": {
          "object": "user",
          "id": "4e38fa57-609c-4beb-8e28-271b11cc81a3"
        },
        "has_children": false,
        "archived": false,
        "type": "code",
        "code": {
          "caption": [],
          "rich_text": [
            {
              "type": "text",
              "text": {
                "content": "git clone <https://github.com/agency-kit/notion-cms.git>\n",
                "link": null
              },
              "annotations": {
                "bold": false,
                "italic": false,
                "strikethrough": false,
                "underline": false,
                "code": false,
                "color": "default"
              },
              "plain_text": "git clone <https://github.com/agency-kit/notion-cms.git>\n",
              "href": null
            }
          ],
          "language": "plain text"
        }
      },
      {
        "object": "block",
        "id": "8e09f1be-962e-4b9b-83b6-90fc88c4bc1a",
        "parent": {
          "type": "page_id",
          "page_id": "5d002c2b-bbf5-409a-b26a-9995a059138f"
        },
        "created_time": "2023-03-12T20:34:00.000Z",
        "last_edited_time": "2023-03-12T20:34:00.000Z",
        "created_by": {
          "object": "user",
          "id": "4e38fa57-609c-4beb-8e28-271b11cc81a3"
        },
        "last_edited_by": {
          "object": "user",
          "id": "4e38fa57-609c-4beb-8e28-271b11cc81a3"
        },
        "has_children": false,
        "archived": false,
        "type": "heading_2",
        "heading_2": {
          "rich_text": [
            {
              "type": "text",
              "text": {
                "content": "Step 2: Install the required dependencies",
                "link": null
              },
              "annotations": {
                "bold": false,
                "italic": false,
                "strikethrough": false,
                "underline": false,
                "code": false,
                "color": "default"
              },
              "plain_text": "Step 2: Install the required dependencies",
              "href": null
            }
          ],
          "is_toggleable": false,
          "color": "default"
        }
      },
      {
        "object": "block",
        "id": "85c5cf5e-9c81-4748-b7b8-4577f0767b18",
        "parent": {
          "type": "page_id",
          "page_id": "5d002c2b-bbf5-409a-b26a-9995a059138f"
        },
        "created_time": "2023-03-12T20:34:00.000Z",
        "last_edited_time": "2023-03-12T20:34:00.000Z",
        "created_by": {
          "object": "user",
          "id": "4e38fa57-609c-4beb-8e28-271b11cc81a3"
        },
        "last_edited_by": {
          "object": "user",
          "id": "4e38fa57-609c-4beb-8e28-271b11cc81a3"
        },
        "has_children": false,
        "archived": false,
        "type": "paragraph",
        "paragraph": {
          "rich_text": [
            {
              "type": "text",
              "text": {
                "content": "Next, you will need to install the required dependencies for Notion CMS. You can do this by running the following command in your terminal:",
                "link": null
              },
              "annotations": {
                "bold": false,
                "italic": false,
                "strikethrough": false,
                "underline": false,
                "code": false,
                "color": "default"
              },
              "plain_text": "Next, you will need to install the required dependencies for Notion CMS. You can do this by running the following command in your terminal:",
              "href": null
            }
          ],
          "color": "default"
        }
      },
      {
        "object": "block",
        "id": "1e6ca659-ff9c-4308-811b-97174e4eb899",
        "parent": {
          "type": "page_id",
          "page_id": "5d002c2b-bbf5-409a-b26a-9995a059138f"
        },
        "created_time": "2023-03-12T20:34:00.000Z",
        "last_edited_time": "2023-03-12T20:34:00.000Z",
        "created_by": {
          "object": "user",
          "id": "4e38fa57-609c-4beb-8e28-271b11cc81a3"
        },
        "last_edited_by": {
          "object": "user",
          "id": "4e38fa57-609c-4beb-8e28-271b11cc81a3"
        },
        "has_children": false,
        "archived": false,
        "type": "code",
        "code": {
          "caption": [],
          "rich_text": [
            {
              "type": "text",
              "text": {
                "content": "npm install\n",
                "link": null
              },
              "annotations": {
                "bold": false,
                "italic": false,
                "strikethrough": false,
                "underline": false,
                "code": false,
                "color": "default"
              },
              "plain_text": "npm install\n",
              "href": null
            }
          ],
          "language": "plain text"
        }
      },
      {
        "object": "block",
        "id": "c6128982-aa92-4284-9a87-0c538a2089d7",
        "parent": {
          "type": "page_id",
          "page_id": "5d002c2b-bbf5-409a-b26a-9995a059138f"
        },
        "created_time": "2023-03-12T20:34:00.000Z",
        "last_edited_time": "2023-03-12T20:34:00.000Z",
        "created_by": {
          "object": "user",
          "id": "4e38fa57-609c-4beb-8e28-271b11cc81a3"
        },
        "last_edited_by": {
          "object": "user",
          "id": "4e38fa57-609c-4beb-8e28-271b11cc81a3"
        },
        "has_children": false,
        "archived": false,
        "type": "heading_2",
        "heading_2": {
          "rich_text": [
            {
              "type": "text",
              "text": {
                "content": "Step 3: Configure the environment variables",
                "link": null
              },
              "annotations": {
                "bold": false,
                "italic": false,
                "strikethrough": false,
                "underline": false,
                "code": false,
                "color": "default"
              },
              "plain_text": "Step 3: Configure the environment variables",
              "href": null
            }
          ],
          "is_toggleable": false,
          "color": "default"
        }
      },
      {
        "object": "block",
        "id": "3cdaf72b-f398-4de4-9ece-0c3560b49773",
        "parent": {
          "type": "page_id",
          "page_id": "5d002c2b-bbf5-409a-b26a-9995a059138f"
        },
        "created_time": "2023-03-12T20:34:00.000Z",
        "last_edited_time": "2023-03-12T20:34:00.000Z",
        "created_by": {
          "object": "user",
          "id": "4e38fa57-609c-4beb-8e28-271b11cc81a3"
        },
        "last_edited_by": {
          "object": "user",
          "id": "4e38fa57-609c-4beb-8e28-271b11cc81a3"
        },
        "has_children": false,
        "archived": false,
        "type": "paragraph",
        "paragraph": {
          "rich_text": [
            {
              "type": "text",
              "text": {
                "content": "After installing the dependencies, you will need to configure the environment variables for Notion CMS. You can do this by creating a ",
                "link": null
              },
              "annotations": {
                "bold": false,
                "italic": false,
                "strikethrough": false,
                "underline": false,
                "code": false,
                "color": "default"
              },
              "plain_text": "After installing the dependencies, you will need to configure the environment variables for Notion CMS. You can do this by creating a ",
              "href": null
            },
            {
              "type": "text",
              "text": {
                "content": ".env",
                "link": null
              },
              "annotations": {
                "bold": false,
                "italic": false,
                "strikethrough": false,
                "underline": false,
                "code": true,
                "color": "default"
              },
              "plain_text": ".env",
              "href": null
            },
            {
              "type": "text",
              "text": {
                "content": " file in the root directory of the project and adding the following variables:",
                "link": null
              },
              "annotations": {
                "bold": false,
                "italic": false,
                "strikethrough": false,
                "underline": false,
                "code": false,
                "color": "default"
              },
              "plain_text": " file in the root directory of the project and adding the following variables:",
              "href": null
            }
          ],
          "color": "default"
        }
      },
      {
        "object": "block",
        "id": "55b26c6f-3230-4186-b6a7-171d20c02d13",
        "parent": {
          "type": "page_id",
          "page_id": "5d002c2b-bbf5-409a-b26a-9995a059138f"
        },
        "created_time": "2023-03-12T20:34:00.000Z",
        "last_edited_time": "2023-03-12T20:34:00.000Z",
        "created_by": {
          "object": "user",
          "id": "4e38fa57-609c-4beb-8e28-271b11cc81a3"
        },
        "last_edited_by": {
          "object": "user",
          "id": "4e38fa57-609c-4beb-8e28-271b11cc81a3"
        },
        "has_children": false,
        "archived": false,
        "type": "code",
        "code": {
          "caption": [],
          "rich_text": [
            {
              "type": "text",
              "text": {
                "content": "NOTION_API_KEY=your_notion_api_key\nNOTION_DATABASE_ID=your_notion_database_id\n",
                "link": null
              },
              "annotations": {
                "bold": false,
                "italic": false,
                "strikethrough": false,
                "underline": false,
                "code": false,
                "color": "default"
              },
              "plain_text": "NOTION_API_KEY=your_notion_api_key\nNOTION_DATABASE_ID=your_notion_database_id\n",
              "href": null
            }
          ],
          "language": "plain text"
        }
      },
      {
        "object": "block",
        "id": "92c6d242-30df-4ec2-a5a1-d3a2a6572edf",
        "parent": {
          "type": "page_id",
          "page_id": "5d002c2b-bbf5-409a-b26a-9995a059138f"
        },
        "created_time": "2023-03-12T20:34:00.000Z",
        "last_edited_time": "2023-03-12T20:34:00.000Z",
        "created_by": {
          "object": "user",
          "id": "4e38fa57-609c-4beb-8e28-271b11cc81a3"
        },
        "last_edited_by": {
          "object": "user",
          "id": "4e38fa57-609c-4beb-8e28-271b11cc81a3"
        },
        "has_children": false,
        "archived": false,
        "type": "paragraph",
        "paragraph": {
          "rich_text": [
            {
              "type": "text",
              "text": {
                "content": "You can find your Notion API key and database ID by following the instructions in the ",
                "link": null
              },
              "annotations": {
                "bold": false,
                "italic": false,
                "strikethrough": false,
                "underline": false,
                "code": false,
                "color": "default"
              },
              "plain_text": "You can find your Notion API key and database ID by following the instructions in the ",
              "href": null
            },
            {
              "type": "text",
              "text": {
                "content": "README.md",
                "link": {
                  "url": "http://readme.md/"
                }
              },
              "annotations": {
                "bold": false,
                "italic": false,
                "strikethrough": false,
                "underline": false,
                "code": false,
                "color": "default"
              },
              "plain_text": "README.md",
              "href": "http://readme.md/"
            },
            {
              "type": "text",
              "text": {
                "content": " file of the Notion CMS repository.",
                "link": null
              },
              "annotations": {
                "bold": false,
                "italic": false,
                "strikethrough": false,
                "underline": false,
                "code": false,
                "color": "default"
              },
              "plain_text": " file of the Notion CMS repository.",
              "href": null
            }
          ],
          "color": "default"
        }
      },
      {
        "object": "block",
        "id": "76396b39-3ea9-496f-b0e0-950f31e575f2",
        "parent": {
          "type": "page_id",
          "page_id": "5d002c2b-bbf5-409a-b26a-9995a059138f"
        },
        "created_time": "2023-03-12T20:34:00.000Z",
        "last_edited_time": "2023-03-12T20:34:00.000Z",
        "created_by": {
          "object": "user",
          "id": "4e38fa57-609c-4beb-8e28-271b11cc81a3"
        },
        "last_edited_by": {
          "object": "user",
          "id": "4e38fa57-609c-4beb-8e28-271b11cc81a3"
        },
        "has_children": false,
        "archived": false,
        "type": "heading_2",
        "heading_2": {
          "rich_text": [
            {
              "type": "text",
              "text": {
                "content": "Step 4: Start the development server",
                "link": null
              },
              "annotations": {
                "bold": false,
                "italic": false,
                "strikethrough": false,
                "underline": false,
                "code": false,
                "color": "default"
              },
              "plain_text": "Step 4: Start the development server",
              "href": null
            }
          ],
          "is_toggleable": false,
          "color": "default"
        }
      },
      {
        "object": "block",
        "id": "05ca8f3b-c723-4717-8852-b3f240e9e42b",
        "parent": {
          "type": "page_id",
          "page_id": "5d002c2b-bbf5-409a-b26a-9995a059138f"
        },
        "created_time": "2023-03-12T20:34:00.000Z",
        "last_edited_time": "2023-03-12T20:34:00.000Z",
        "created_by": {
          "object": "user",
          "id": "4e38fa57-609c-4beb-8e28-271b11cc81a3"
        },
        "last_edited_by": {
          "object": "user",
          "id": "4e38fa57-609c-4beb-8e28-271b11cc81a3"
        },
        "has_children": false,
        "archived": false,
        "type": "paragraph",
        "paragraph": {
          "rich_text": [
            {
              "type": "text",
              "text": {
                "content": "Once you have configured the environment variables, you can start the development server by running the following command in your terminal:",
                "link": null
              },
              "annotations": {
                "bold": false,
                "italic": false,
                "strikethrough": false,
                "underline": false,
                "code": false,
                "color": "default"
              },
              "plain_text": "Once you have configured the environment variables, you can start the development server by running the following command in your terminal:",
              "href": null
            }
          ],
          "color": "default"
        }
      },
      {
        "object": "block",
        "id": "da94a68d-5a79-4044-ae78-f1bbd895ce52",
        "parent": {
          "type": "page_id",
          "page_id": "5d002c2b-bbf5-409a-b26a-9995a059138f"
        },
        "created_time": "2023-03-12T20:34:00.000Z",
        "last_edited_time": "2023-03-12T20:34:00.000Z",
        "created_by": {
          "object": "user",
          "id": "4e38fa57-609c-4beb-8e28-271b11cc81a3"
        },
        "last_edited_by": {
          "object": "user",
          "id": "4e38fa57-609c-4beb-8e28-271b11cc81a3"
        },
        "has_children": false,
        "archived": false,
        "type": "code",
        "code": {
          "caption": [],
          "rich_text": [
            {
              "type": "text",
              "text": {
                "content": "npm run dev\n",
                "link": null
              },
              "annotations": {
                "bold": false,
                "italic": false,
                "strikethrough": false,
                "underline": false,
                "code": false,
                "color": "default"
              },
              "plain_text": "npm run dev\n",
              "href": null
            }
          ],
          "language": "plain text"
        }
      },
      {
        "object": "block",
        "id": "29cdc562-f217-43de-8b30-045c9a56da7d",
        "parent": {
          "type": "page_id",
          "page_id": "5d002c2b-bbf5-409a-b26a-9995a059138f"
        },
        "created_time": "2023-03-12T20:34:00.000Z",
        "last_edited_time": "2023-03-12T20:34:00.000Z",
        "created_by": {
          "object": "user",
          "id": "4e38fa57-609c-4beb-8e28-271b11cc81a3"
        },
        "last_edited_by": {
          "object": "user",
          "id": "4e38fa57-609c-4beb-8e28-271b11cc81a3"
        },
        "has_children": false,
        "archived": false,
        "type": "paragraph",
        "paragraph": {
          "rich_text": [
            {
              "type": "text",
              "text": {
                "content": "This will start the development server on ",
                "link": null
              },
              "annotations": {
                "bold": false,
                "italic": false,
                "strikethrough": false,
                "underline": false,
                "code": false,
                "color": "default"
              },
              "plain_text": "This will start the development server on ",
              "href": null
            },
            {
              "type": "text",
              "text": {
                "content": "http://localhost:3000",
                "link": null
              },
              "annotations": {
                "bold": false,
                "italic": false,
                "strikethrough": false,
                "underline": false,
                "code": true,
                "color": "default"
              },
              "plain_text": "http://localhost:3000",
              "href": null
            },
            {
              "type": "text",
              "text": {
                "content": ".",
                "link": null
              },
              "annotations": {
                "bold": false,
                "italic": false,
                "strikethrough": false,
                "underline": false,
                "code": false,
                "color": "default"
              },
              "plain_text": ".",
              "href": null
            }
          ],
          "color": "default"
        }
      },
      {
        "object": "block",
        "id": "ed9e7511-f212-4a5b-acd9-cd20c9066796",
        "parent": {
          "type": "page_id",
          "page_id": "5d002c2b-bbf5-409a-b26a-9995a059138f"
        },
        "created_time": "2023-03-12T20:34:00.000Z",
        "last_edited_time": "2023-03-12T20:34:00.000Z",
        "created_by": {
          "object": "user",
          "id": "4e38fa57-609c-4beb-8e28-271b11cc81a3"
        },
        "last_edited_by": {
          "object": "user",
          "id": "4e38fa57-609c-4beb-8e28-271b11cc81a3"
        },
        "has_children": false,
        "archived": false,
        "type": "heading_2",
        "heading_2": {
          "rich_text": [
            {
              "type": "text",
              "text": {
                "content": "Step 5: Create and manage content",
                "link": null
              },
              "annotations": {
                "bold": false,
                "italic": false,
                "strikethrough": false,
                "underline": false,
                "code": false,
                "color": "default"
              },
              "plain_text": "Step 5: Create and manage content",
              "href": null
            }
          ],
          "is_toggleable": false,
          "color": "default"
        }
      },
      {
        "object": "block",
        "id": "ed9fa80e-8f75-4b3e-9e05-fba540ed4d01",
        "parent": {
          "type": "page_id",
          "page_id": "5d002c2b-bbf5-409a-b26a-9995a059138f"
        },
        "created_time": "2023-03-12T20:34:00.000Z",
        "last_edited_time": "2023-03-12T20:34:00.000Z",
        "created_by": {
          "object": "user",
          "id": "4e38fa57-609c-4beb-8e28-271b11cc81a3"
        },
        "last_edited_by": {
          "object": "user",
          "id": "4e38fa57-609c-4beb-8e28-271b11cc81a3"
        },
        "has_children": false,
        "archived": false,
        "type": "paragraph",
        "paragraph": {
          "rich_text": [
            {
              "type": "text",
              "text": {
                "content": "With the development server running, you can now create and manage content using Notion CMS. Simply create a new page or database entry in Notion, and it will automatically be reflected on your website.",
                "link": null
              },
              "annotations": {
                "bold": false,
                "italic": false,
                "strikethrough": false,
                "underline": false,
                "code": false,
                "color": "default"
              },
              "plain_text": "With the development server running, you can now create and manage content using Notion CMS. Simply create a new page or database entry in Notion, and it will automatically be reflected on your website.",
              "href": null
            }
          ],
          "color": "default"
        }
      },
      {
        "object": "block",
        "id": "4ccd4b59-6b65-4062-b89e-719e77e79e97",
        "parent": {
          "type": "page_id",
          "page_id": "5d002c2b-bbf5-409a-b26a-9995a059138f"
        },
        "created_time": "2023-03-12T20:34:00.000Z",
        "last_edited_time": "2023-03-12T20:34:00.000Z",
        "created_by": {
          "object": "user",
          "id": "4e38fa57-609c-4beb-8e28-271b11cc81a3"
        },
        "last_edited_by": {
          "object": "user",
          "id": "4e38fa57-609c-4beb-8e28-271b11cc81a3"
        },
        "has_children": false,
        "archived": false,
        "type": "heading_2",
        "heading_2": {
          "rich_text": [
            {
              "type": "text",
              "text": {
                "content": "Conclusion",
                "link": null
              },
              "annotations": {
                "bold": false,
                "italic": false,
                "strikethrough": false,
                "underline": false,
                "code": false,
                "color": "default"
              },
              "plain_text": "Conclusion",
              "href": null
            }
          ],
          "is_toggleable": false,
          "color": "default"
        }
      },
      {
        "object": "block",
        "id": "503c4a97-a8a4-4e7d-a569-0cadb17f6a65",
        "parent": {
          "type": "page_id",
          "page_id": "5d002c2b-bbf5-409a-b26a-9995a059138f"
        },
        "created_time": "2023-03-12T20:34:00.000Z",
        "last_edited_time": "2023-03-12T20:34:00.000Z",
        "created_by": {
          "object": "user",
          "id": "4e38fa57-609c-4beb-8e28-271b11cc81a3"
        },
        "last_edited_by": {
          "object": "user",
          "id": "4e38fa57-609c-4beb-8e28-271b11cc81a3"
        },
        "has_children": false,
        "archived": false,
        "type": "paragraph",
        "paragraph": {
          "rich_text": [
            {
              "type": "text",
              "text": {
                "content": "Notion CMS is a powerful tool that can help you manage your website's content in a more efficient way. By following the steps outlined in this guide, you can get started with Notion CMS and take advantage of its many features.",
                "link": null
              },
              "annotations": {
                "bold": false,
                "italic": false,
                "strikethrough": false,
                "underline": false,
                "code": false,
                "color": "default"
              },
              "plain_text": "Notion CMS is a powerful tool that can help you manage your website's content in a more efficient way. By following the steps outlined in this guide, you can get started with Notion CMS and take advantage of its many features.",
              "href": null
            }
          ],
          "color": "default"
        }
      }
    ],
    "next_cursor": null,
    "has_more": false,
    "type": "block",
    "block": {}
  })

nock(baseUrl)
  .persist()
  .get(`/blocks/${pageIds[2]}/children`)
  .query({ page_size: 50 })
  .reply(200, {
    "object": "list",
    "results": [
      {
        "object": "block",
        "id": "98d9403c-29f6-4ee9-9e14-8d96a0feac99",
        "parent": {
          "type": "page_id",
          "page_id": "226956e8-075d-4f50-bf7f-2c683fd93032"
        },
        "created_time": "2023-03-12T19:37:00.000Z",
        "last_edited_time": "2023-03-12T20:31:00.000Z",
        "created_by": {
          "object": "user",
          "id": "4e38fa57-609c-4beb-8e28-271b11cc81a3"
        },
        "last_edited_by": {
          "object": "user",
          "id": "4e38fa57-609c-4beb-8e28-271b11cc81a3"
        },
        "has_children": false,
        "archived": false,
        "type": "heading_2",
        "heading_2": {
          "rich_text": [
            {
              "type": "text",
              "text": {
                "content": "AgencyKit’s Notion CMS Posts",
                "link": null
              },
              "annotations": {
                "bold": false,
                "italic": false,
                "strikethrough": false,
                "underline": false,
                "code": false,
                "color": "default"
              },
              "plain_text": "AgencyKit’s Notion CMS Posts",
              "href": null
            }
          ],
          "is_toggleable": false,
          "color": "default"
        }
      },
      {
        "object": "block",
        "id": "c48c123a-6584-434b-914d-c08a4d565bf7",
        "parent": {
          "type": "page_id",
          "page_id": "226956e8-075d-4f50-bf7f-2c683fd93032"
        },
        "created_time": "2023-03-12T20:33:00.000Z",
        "last_edited_time": "2023-03-12T20:33:00.000Z",
        "created_by": {
          "object": "user",
          "id": "4e38fa57-609c-4beb-8e28-271b11cc81a3"
        },
        "last_edited_by": {
          "object": "user",
          "id": "4e38fa57-609c-4beb-8e28-271b11cc81a3"
        },
        "has_children": false,
        "archived": false,
        "type": "paragraph",
        "paragraph": {
          "rich_text": [
            {
              "type": "text",
              "text": {
                "content": "AgencyKit is an open source Notion CMS SDK that allows developers to create and manage a website using Notion as the backend. The AgencyKit blog will feature content related to using Notion as a CMS, as well as tutorials and guides for building websites with AgencyKit and Notion.",
                "link": null
              },
              "annotations": {
                "bold": false,
                "italic": false,
                "strikethrough": false,
                "underline": false,
                "code": false,
                "color": "default"
              },
              "plain_text": "AgencyKit is an open source Notion CMS SDK that allows developers to create and manage a website using Notion as the backend. The AgencyKit blog will feature content related to using Notion as a CMS, as well as tutorials and guides for building websites with AgencyKit and Notion.",
              "href": null
            }
          ],
          "color": "default"
        }
      },
      {
        "object": "block",
        "id": "328f7ffa-7016-4cc6-abb6-7a870f825e18",
        "parent": {
          "type": "page_id",
          "page_id": "226956e8-075d-4f50-bf7f-2c683fd93032"
        },
        "created_time": "2023-03-12T20:33:00.000Z",
        "last_edited_time": "2023-03-12T20:33:00.000Z",
        "created_by": {
          "object": "user",
          "id": "4e38fa57-609c-4beb-8e28-271b11cc81a3"
        },
        "last_edited_by": {
          "object": "user",
          "id": "4e38fa57-609c-4beb-8e28-271b11cc81a3"
        },
        "has_children": false,
        "archived": false,
        "type": "paragraph",
        "paragraph": {
          "rich_text": [
            {
              "type": "text",
              "text": {
                "content": "We will also feature case studies and interviews with developers and businesses that have successfully implemented Notion and AgencyKit in their websites. Our goal is to provide valuable resources and insights for developers and businesses looking to use Notion and AgencyKit to build efficient and scalable websites.",
                "link": null
              },
              "annotations": {
                "bold": false,
                "italic": false,
                "strikethrough": false,
                "underline": false,
                "code": false,
                "color": "default"
              },
              "plain_text": "We will also feature case studies and interviews with developers and businesses that have successfully implemented Notion and AgencyKit in their websites. Our goal is to provide valuable resources and insights for developers and businesses looking to use Notion and AgencyKit to build efficient and scalable websites.",
              "href": null
            }
          ],
          "color": "default"
        }
      }
    ],
    "next_cursor": null,
    "has_more": false,
    "type": "block",
    "block": {}
  })

nock(baseUrl)
  .persist()
  .get(`/blocks/${pageIds[3]}/children`)
  .query({ page_size: 50 })
  .reply(200, {
    "object": "list",
    "results": [
      {
        "object": "block",
        "id": "4325d8dd-e011-41fe-8311-a9d886eb42a6",
        "parent": {
          "type": "page_id",
          "page_id": "d400849b-afc2-4ffe-8150-83005a624192"
        },
        "created_time": "2023-03-12T20:46:00.000Z",
        "last_edited_time": "2023-03-12T20:46:00.000Z",
        "created_by": {
          "object": "user",
          "id": "4e38fa57-609c-4beb-8e28-271b11cc81a3"
        },
        "last_edited_by": {
          "object": "user",
          "id": "4e38fa57-609c-4beb-8e28-271b11cc81a3"
        },
        "has_children": false,
        "archived": false,
        "type": "heading_1",
        "heading_1": {
          "rich_text": [
            {
              "type": "text",
              "text": {
                "content": "Mortimer",
                "link": null
              },
              "annotations": {
                "bold": false,
                "italic": false,
                "strikethrough": false,
                "underline": false,
                "code": false,
                "color": "default"
              },
              "plain_text": "Mortimer",
              "href": null
            }
          ],
          "is_toggleable": false,
          "color": "default"
        }
      },
      {
        "object": "block",
        "id": "cc6760e6-34c0-4f93-a988-d4abedbbbe44",
        "parent": {
          "type": "page_id",
          "page_id": "d400849b-afc2-4ffe-8150-83005a624192"
        },
        "created_time": "2023-03-12T20:46:00.000Z",
        "last_edited_time": "2023-03-12T20:46:00.000Z",
        "created_by": {
          "object": "user",
          "id": "4e38fa57-609c-4beb-8e28-271b11cc81a3"
        },
        "last_edited_by": {
          "object": "user",
          "id": "4e38fa57-609c-4beb-8e28-271b11cc81a3"
        },
        "has_children": false,
        "archived": false,
        "type": "paragraph",
        "paragraph": {
          "rich_text": [
            {
              "type": "text",
              "text": {
                "content": "Mortimer is an avid Notion user and a big fan of the city of Boston. He is a highly organized individual who uses Notion to keep track of his daily tasks, work projects, and personal goals. Mortimer loves exploring the city of Boston and discovering new restaurants, museums, and cultural events.",
                "link": null
              },
              "annotations": {
                "bold": false,
                "italic": false,
                "strikethrough": false,
                "underline": false,
                "code": false,
                "color": "default"
              },
              "plain_text": "Mortimer is an avid Notion user and a big fan of the city of Boston. He is a highly organized individual who uses Notion to keep track of his daily tasks, work projects, and personal goals. Mortimer loves exploring the city of Boston and discovering new restaurants, museums, and cultural events.",
              "href": null
            }
          ],
          "color": "default"
        }
      },
      {
        "object": "block",
        "id": "0ed230eb-2780-40c3-b4e7-594c23e82dc7",
        "parent": {
          "type": "page_id",
          "page_id": "d400849b-afc2-4ffe-8150-83005a624192"
        },
        "created_time": "2023-03-12T20:46:00.000Z",
        "last_edited_time": "2023-03-12T20:46:00.000Z",
        "created_by": {
          "object": "user",
          "id": "4e38fa57-609c-4beb-8e28-271b11cc81a3"
        },
        "last_edited_by": {
          "object": "user",
          "id": "4e38fa57-609c-4beb-8e28-271b11cc81a3"
        },
        "has_children": false,
        "archived": false,
        "type": "paragraph",
        "paragraph": {
          "rich_text": [
            {
              "type": "text",
              "text": {
                "content": "As a Notion user, Mortimer takes advantage of the platform's various features to stay productive and efficient. He uses the Kanban board to visualize his workflow and track the progress of his projects. He also uses the calendar view to schedule his appointments and set reminders for important deadlines. In addition, Mortimer utilizes the database feature to store information about his favorite Boston restaurants, cultural landmarks, and historical sites.",
                "link": null
              },
              "annotations": {
                "bold": false,
                "italic": false,
                "strikethrough": false,
                "underline": false,
                "code": false,
                "color": "default"
              },
              "plain_text": "As a Notion user, Mortimer takes advantage of the platform's various features to stay productive and efficient. He uses the Kanban board to visualize his workflow and track the progress of his projects. He also uses the calendar view to schedule his appointments and set reminders for important deadlines. In addition, Mortimer utilizes the database feature to store information about his favorite Boston restaurants, cultural landmarks, and historical sites.",
              "href": null
            }
          ],
          "color": "default"
        }
      },
      {
        "object": "block",
        "id": "0833693f-7615-420c-a91d-9172e0bf0238",
        "parent": {
          "type": "page_id",
          "page_id": "d400849b-afc2-4ffe-8150-83005a624192"
        },
        "created_time": "2023-03-12T20:46:00.000Z",
        "last_edited_time": "2023-03-12T20:46:00.000Z",
        "created_by": {
          "object": "user",
          "id": "4e38fa57-609c-4beb-8e28-271b11cc81a3"
        },
        "last_edited_by": {
          "object": "user",
          "id": "4e38fa57-609c-4beb-8e28-271b11cc81a3"
        },
        "has_children": false,
        "archived": false,
        "type": "paragraph",
        "paragraph": {
          "rich_text": [
            {
              "type": "text",
              "text": {
                "content": "Despite his busy schedule, Mortimer always finds time to explore the city of Boston. He frequently attends concerts at the Boston Symphony Orchestra and visits the Museum of Fine Arts. He also enjoys taking long walks along the Charles River and exploring the city's historic neighborhoods.",
                "link": null
              },
              "annotations": {
                "bold": false,
                "italic": false,
                "strikethrough": false,
                "underline": false,
                "code": false,
                "color": "default"
              },
              "plain_text": "Despite his busy schedule, Mortimer always finds time to explore the city of Boston. He frequently attends concerts at the Boston Symphony Orchestra and visits the Museum of Fine Arts. He also enjoys taking long walks along the Charles River and exploring the city's historic neighborhoods.",
              "href": null
            }
          ],
          "color": "default"
        }
      },
      {
        "object": "block",
        "id": "f3f2ff18-564e-4710-a90f-c68bf408dc90",
        "parent": {
          "type": "page_id",
          "page_id": "d400849b-afc2-4ffe-8150-83005a624192"
        },
        "created_time": "2023-03-12T20:46:00.000Z",
        "last_edited_time": "2023-03-12T20:46:00.000Z",
        "created_by": {
          "object": "user",
          "id": "4e38fa57-609c-4beb-8e28-271b11cc81a3"
        },
        "last_edited_by": {
          "object": "user",
          "id": "4e38fa57-609c-4beb-8e28-271b11cc81a3"
        },
        "has_children": false,
        "archived": false,
        "type": "paragraph",
        "paragraph": {
          "rich_text": [
            {
              "type": "text",
              "text": {
                "content": "Overall, Mortimer is a dedicated Notion user and a passionate fan of the city of Boston. His use of Notion and his love of Boston are a testament to his commitment to productivity, organization, and personal growth.",
                "link": null
              },
              "annotations": {
                "bold": false,
                "italic": false,
                "strikethrough": false,
                "underline": false,
                "code": false,
                "color": "default"
              },
              "plain_text": "Overall, Mortimer is a dedicated Notion user and a passionate fan of the city of Boston. His use of Notion and his love of Boston are a testament to his commitment to productivity, organization, and personal growth.",
              "href": null
            }
          ],
          "color": "default"
        }
      },
      {
        "object": "block",
        "id": "73606fce-8493-43b5-8747-5602bae4833c",
        "parent": {
          "type": "page_id",
          "page_id": "d400849b-afc2-4ffe-8150-83005a624192"
        },
        "created_time": "2023-03-12T20:46:00.000Z",
        "last_edited_time": "2023-03-12T20:46:00.000Z",
        "created_by": {
          "object": "user",
          "id": "4e38fa57-609c-4beb-8e28-271b11cc81a3"
        },
        "last_edited_by": {
          "object": "user",
          "id": "4e38fa57-609c-4beb-8e28-271b11cc81a3"
        },
        "has_children": false,
        "archived": false,
        "type": "paragraph",
        "paragraph": {
          "rich_text": [],
          "color": "default"
        }
      }
    ],
    "next_cursor": null,
    "has_more": false,
    "type": "block",
    "block": {}
  })

nock(baseUrl)
  .persist()
  .get(`/blocks/${pageIds[4]}/children`)
  .query({ page_size: 50 })
  .reply(200, {
    "object": "list",
    "results": [
      {
        "object": "block",
        "id": "d5d9377c-303e-467a-96d3-44f876fb2b10",
        "parent": {
          "type": "page_id",
          "page_id": "0076e375-3bed-4aa1-97c2-2eea4d58fe93"
        },
        "created_time": "2023-03-12T20:45:00.000Z",
        "last_edited_time": "2023-03-12T20:45:00.000Z",
        "created_by": {
          "object": "user",
          "id": "4e38fa57-609c-4beb-8e28-271b11cc81a3"
        },
        "last_edited_by": {
          "object": "user",
          "id": "4e38fa57-609c-4beb-8e28-271b11cc81a3"
        },
        "has_children": false,
        "archived": false,
        "type": "heading_1",
        "heading_1": {
          "rich_text": [
            {
              "type": "text",
              "text": {
                "content": "Jacob",
                "link": null
              },
              "annotations": {
                "bold": false,
                "italic": false,
                "strikethrough": false,
                "underline": false,
                "code": false,
                "color": "default"
              },
              "plain_text": "Jacob",
              "href": null
            }
          ],
          "is_toggleable": false,
          "color": "default"
        }
      },
      {
        "object": "block",
        "id": "5db1da23-9aed-4616-b1f4-a20c8a3fd784",
        "parent": {
          "type": "page_id",
          "page_id": "0076e375-3bed-4aa1-97c2-2eea4d58fe93"
        },
        "created_time": "2023-03-12T20:45:00.000Z",
        "last_edited_time": "2023-03-12T20:45:00.000Z",
        "created_by": {
          "object": "user",
          "id": "4e38fa57-609c-4beb-8e28-271b11cc81a3"
        },
        "last_edited_by": {
          "object": "user",
          "id": "4e38fa57-609c-4beb-8e28-271b11cc81a3"
        },
        "has_children": false,
        "archived": false,
        "type": "paragraph",
        "paragraph": {
          "rich_text": [
            {
              "type": "text",
              "text": {
                "content": "Jacob is a skilled programmer with a passion for geology. He has always been intrigued by the earth's structures and formations, and often spends his free time studying rocks and minerals.",
                "link": null
              },
              "annotations": {
                "bold": false,
                "italic": false,
                "strikethrough": false,
                "underline": false,
                "code": false,
                "color": "default"
              },
              "plain_text": "Jacob is a skilled programmer with a passion for geology. He has always been intrigued by the earth's structures and formations, and often spends his free time studying rocks and minerals.",
              "href": null
            }
          ],
          "color": "default"
        }
      },
      {
        "object": "block",
        "id": "c9641ddd-6890-4882-a918-4d2969841430",
        "parent": {
          "type": "page_id",
          "page_id": "0076e375-3bed-4aa1-97c2-2eea4d58fe93"
        },
        "created_time": "2023-03-12T20:45:00.000Z",
        "last_edited_time": "2023-03-12T20:45:00.000Z",
        "created_by": {
          "object": "user",
          "id": "4e38fa57-609c-4beb-8e28-271b11cc81a3"
        },
        "last_edited_by": {
          "object": "user",
          "id": "4e38fa57-609c-4beb-8e28-271b11cc81a3"
        },
        "has_children": false,
        "archived": false,
        "type": "paragraph",
        "paragraph": {
          "rich_text": [
            {
              "type": "text",
              "text": {
                "content": "Despite his love for geology, Jacob's true talent lies in programming. He is proficient in several programming languages and is always eager to learn new ones. He enjoys the challenge of solving complex problems and is constantly striving to improve his skills.",
                "link": null
              },
              "annotations": {
                "bold": false,
                "italic": false,
                "strikethrough": false,
                "underline": false,
                "code": false,
                "color": "default"
              },
              "plain_text": "Despite his love for geology, Jacob's true talent lies in programming. He is proficient in several programming languages and is always eager to learn new ones. He enjoys the challenge of solving complex problems and is constantly striving to improve his skills.",
              "href": null
            }
          ],
          "color": "default"
        }
      },
      {
        "object": "block",
        "id": "584de723-6623-48f8-80e7-39bdca054f55",
        "parent": {
          "type": "page_id",
          "page_id": "0076e375-3bed-4aa1-97c2-2eea4d58fe93"
        },
        "created_time": "2023-03-12T20:45:00.000Z",
        "last_edited_time": "2023-03-12T20:45:00.000Z",
        "created_by": {
          "object": "user",
          "id": "4e38fa57-609c-4beb-8e28-271b11cc81a3"
        },
        "last_edited_by": {
          "object": "user",
          "id": "4e38fa57-609c-4beb-8e28-271b11cc81a3"
        },
        "has_children": false,
        "archived": false,
        "type": "paragraph",
        "paragraph": {
          "rich_text": [
            {
              "type": "text",
              "text": {
                "content": "In his professional life, Jacob has worked on a variety of projects ranging from simple web applications to complex software systems. He is particularly adept at debugging and troubleshooting, and has a reputation for being able to solve even the most difficult technical issues.",
                "link": null
              },
              "annotations": {
                "bold": false,
                "italic": false,
                "strikethrough": false,
                "underline": false,
                "code": false,
                "color": "default"
              },
              "plain_text": "In his professional life, Jacob has worked on a variety of projects ranging from simple web applications to complex software systems. He is particularly adept at debugging and troubleshooting, and has a reputation for being able to solve even the most difficult technical issues.",
              "href": null
            }
          ],
          "color": "default"
        }
      },
      {
        "object": "block",
        "id": "65ce8899-9785-405d-bee8-bd23debbc809",
        "parent": {
          "type": "page_id",
          "page_id": "0076e375-3bed-4aa1-97c2-2eea4d58fe93"
        },
        "created_time": "2023-03-12T20:45:00.000Z",
        "last_edited_time": "2023-03-12T20:45:00.000Z",
        "created_by": {
          "object": "user",
          "id": "4e38fa57-609c-4beb-8e28-271b11cc81a3"
        },
        "last_edited_by": {
          "object": "user",
          "id": "4e38fa57-609c-4beb-8e28-271b11cc81a3"
        },
        "has_children": false,
        "archived": false,
        "type": "paragraph",
        "paragraph": {
          "rich_text": [
            {
              "type": "text",
              "text": {
                "content": "Outside of work, Jacob enjoys exploring the great outdoors and going on hiking trips. He often combines his love of programming and geology by creating applications that help him identify different types of rocks and minerals while out on his adventures.",
                "link": null
              },
              "annotations": {
                "bold": false,
                "italic": false,
                "strikethrough": false,
                "underline": false,
                "code": false,
                "color": "default"
              },
              "plain_text": "Outside of work, Jacob enjoys exploring the great outdoors and going on hiking trips. He often combines his love of programming and geology by creating applications that help him identify different types of rocks and minerals while out on his adventures.",
              "href": null
            }
          ],
          "color": "default"
        }
      },
      {
        "object": "block",
        "id": "64096032-4d53-445b-9651-5e396c31fa8b",
        "parent": {
          "type": "page_id",
          "page_id": "0076e375-3bed-4aa1-97c2-2eea4d58fe93"
        },
        "created_time": "2023-03-12T20:45:00.000Z",
        "last_edited_time": "2023-03-12T20:45:00.000Z",
        "created_by": {
          "object": "user",
          "id": "4e38fa57-609c-4beb-8e28-271b11cc81a3"
        },
        "last_edited_by": {
          "object": "user",
          "id": "4e38fa57-609c-4beb-8e28-271b11cc81a3"
        },
        "has_children": false,
        "archived": false,
        "type": "paragraph",
        "paragraph": {
          "rich_text": [
            {
              "type": "text",
              "text": {
                "content": "Overall, Jacob is a versatile and talented programmer with a unique passion for geology that sets him apart from his peers.",
                "link": null
              },
              "annotations": {
                "bold": false,
                "italic": false,
                "strikethrough": false,
                "underline": false,
                "code": false,
                "color": "default"
              },
              "plain_text": "Overall, Jacob is a versatile and talented programmer with a unique passion for geology that sets him apart from his peers.",
              "href": null
            }
          ],
          "color": "default"
        }
      },
      {
        "object": "block",
        "id": "cc2a476d-0492-4710-81f8-3a6406790a55",
        "parent": {
          "type": "page_id",
          "page_id": "0076e375-3bed-4aa1-97c2-2eea4d58fe93"
        },
        "created_time": "2023-03-12T20:45:00.000Z",
        "last_edited_time": "2023-03-12T20:45:00.000Z",
        "created_by": {
          "object": "user",
          "id": "4e38fa57-609c-4beb-8e28-271b11cc81a3"
        },
        "last_edited_by": {
          "object": "user",
          "id": "4e38fa57-609c-4beb-8e28-271b11cc81a3"
        },
        "has_children": false,
        "archived": false,
        "type": "paragraph",
        "paragraph": {
          "rich_text": [],
          "color": "default"
        }
      }
    ],
    "next_cursor": null,
    "has_more": false,
    "type": "block",
    "block": {}
  })

nock(baseUrl)
  .persist()
  .get(`/blocks/${pageIds[5]}/children`)
  .query({ page_size: 50 })
  .reply(200, {
    "object": "list",
    "results": [
      {
        "object": "block",
        "id": "1d89d4db-947e-4811-8ef5-48c2e272d199",
        "parent": {
          "type": "page_id",
          "page_id": "595bf484-5455-41ab-beea-9d1a9d363464"
        },
        "created_time": "2023-03-12T20:55:00.000Z",
        "last_edited_time": "2023-03-12T20:55:00.000Z",
        "created_by": {
          "object": "user",
          "id": "4e38fa57-609c-4beb-8e28-271b11cc81a3"
        },
        "last_edited_by": {
          "object": "user",
          "id": "4e38fa57-609c-4beb-8e28-271b11cc81a3"
        },
        "has_children": false,
        "archived": false,
        "type": "heading_1",
        "heading_1": {
          "rich_text": [
            {
              "type": "text",
              "text": {
                "content": "Pricing",
                "link": null
              },
              "annotations": {
                "bold": false,
                "italic": false,
                "strikethrough": false,
                "underline": false,
                "code": false,
                "color": "default"
              },
              "plain_text": "Pricing",
              "href": null
            }
          ],
          "is_toggleable": false,
          "color": "default"
        }
      },
      {
        "object": "block",
        "id": "8eddcda9-ca7c-45cf-be23-1a5e6d38e0f9",
        "parent": {
          "type": "page_id",
          "page_id": "595bf484-5455-41ab-beea-9d1a9d363464"
        },
        "created_time": "2023-03-12T20:55:00.000Z",
        "last_edited_time": "2023-03-12T20:55:00.000Z",
        "created_by": {
          "object": "user",
          "id": "4e38fa57-609c-4beb-8e28-271b11cc81a3"
        },
        "last_edited_by": {
          "object": "user",
          "id": "4e38fa57-609c-4beb-8e28-271b11cc81a3"
        },
        "has_children": false,
        "archived": false,
        "type": "paragraph",
        "paragraph": {
          "rich_text": [
            {
              "type": "text",
              "text": {
                "content": "Here is a pricing schedule for a Notion integration that allows digital marketing and SEO agencies to use Notion as a content management system:",
                "link": null
              },
              "annotations": {
                "bold": false,
                "italic": false,
                "strikethrough": false,
                "underline": false,
                "code": false,
                "color": "default"
              },
              "plain_text": "Here is a pricing schedule for a Notion integration that allows digital marketing and SEO agencies to use Notion as a content management system:",
              "href": null
            }
          ],
          "color": "default"
        }
      },
      {
        "object": "block",
        "id": "128a069c-e128-4098-a5b4-85952154b046",
        "parent": {
          "type": "page_id",
          "page_id": "595bf484-5455-41ab-beea-9d1a9d363464"
        },
        "created_time": "2023-03-12T20:55:00.000Z",
        "last_edited_time": "2023-03-12T20:55:00.000Z",
        "created_by": {
          "object": "user",
          "id": "4e38fa57-609c-4beb-8e28-271b11cc81a3"
        },
        "last_edited_by": {
          "object": "user",
          "id": "4e38fa57-609c-4beb-8e28-271b11cc81a3"
        },
        "has_children": false,
        "archived": false,
        "type": "heading_2",
        "heading_2": {
          "rich_text": [
            {
              "type": "text",
              "text": {
                "content": "Basic Plan",
                "link": null
              },
              "annotations": {
                "bold": false,
                "italic": false,
                "strikethrough": false,
                "underline": false,
                "code": false,
                "color": "default"
              },
              "plain_text": "Basic Plan",
              "href": null
            }
          ],
          "is_toggleable": false,
          "color": "default"
        }
      },
      {
        "object": "block",
        "id": "8b93c66a-9fe1-4587-b31b-8d0b1f647d8b",
        "parent": {
          "type": "page_id",
          "page_id": "595bf484-5455-41ab-beea-9d1a9d363464"
        },
        "created_time": "2023-03-12T20:55:00.000Z",
        "last_edited_time": "2023-03-12T20:55:00.000Z",
        "created_by": {
          "object": "user",
          "id": "4e38fa57-609c-4beb-8e28-271b11cc81a3"
        },
        "last_edited_by": {
          "object": "user",
          "id": "4e38fa57-609c-4beb-8e28-271b11cc81a3"
        },
        "has_children": false,
        "archived": false,
        "type": "bulleted_list_item",
        "bulleted_list_item": {
          "rich_text": [
            {
              "type": "text",
              "text": {
                "content": "Price: $50/month",
                "link": null
              },
              "annotations": {
                "bold": false,
                "italic": false,
                "strikethrough": false,
                "underline": false,
                "code": false,
                "color": "default"
              },
              "plain_text": "Price: $50/month",
              "href": null
            }
          ],
          "color": "default"
        }
      },
      {
        "object": "block",
        "id": "6099b6ba-331b-430e-92f2-222a58a3ea45",
        "parent": {
          "type": "page_id",
          "page_id": "595bf484-5455-41ab-beea-9d1a9d363464"
        },
        "created_time": "2023-03-12T20:55:00.000Z",
        "last_edited_time": "2023-03-12T20:55:00.000Z",
        "created_by": {
          "object": "user",
          "id": "4e38fa57-609c-4beb-8e28-271b11cc81a3"
        },
        "last_edited_by": {
          "object": "user",
          "id": "4e38fa57-609c-4beb-8e28-271b11cc81a3"
        },
        "has_children": true,
        "archived": false,
        "type": "bulleted_list_item",
        "bulleted_list_item": {
          "rich_text": [
            {
              "type": "text",
              "text": {
                "content": "Features:",
                "link": null
              },
              "annotations": {
                "bold": false,
                "italic": false,
                "strikethrough": false,
                "underline": false,
                "code": false,
                "color": "default"
              },
              "plain_text": "Features:",
              "href": null
            }
          ],
          "color": "default"
        }
      },
      {
        "object": "block",
        "id": "e389764c-5bed-417b-8153-e5d1d3ec91be",
        "parent": {
          "type": "page_id",
          "page_id": "595bf484-5455-41ab-beea-9d1a9d363464"
        },
        "created_time": "2023-03-12T20:55:00.000Z",
        "last_edited_time": "2023-03-12T20:55:00.000Z",
        "created_by": {
          "object": "user",
          "id": "4e38fa57-609c-4beb-8e28-271b11cc81a3"
        },
        "last_edited_by": {
          "object": "user",
          "id": "4e38fa57-609c-4beb-8e28-271b11cc81a3"
        },
        "has_children": false,
        "archived": false,
        "type": "heading_2",
        "heading_2": {
          "rich_text": [
            {
              "type": "text",
              "text": {
                "content": "Pro Plan",
                "link": null
              },
              "annotations": {
                "bold": false,
                "italic": false,
                "strikethrough": false,
                "underline": false,
                "code": false,
                "color": "default"
              },
              "plain_text": "Pro Plan",
              "href": null
            }
          ],
          "is_toggleable": false,
          "color": "default"
        }
      },
      {
        "object": "block",
        "id": "c96740eb-cc06-47d5-85cc-1a5ecf9178a4",
        "parent": {
          "type": "page_id",
          "page_id": "595bf484-5455-41ab-beea-9d1a9d363464"
        },
        "created_time": "2023-03-12T20:55:00.000Z",
        "last_edited_time": "2023-03-12T20:55:00.000Z",
        "created_by": {
          "object": "user",
          "id": "4e38fa57-609c-4beb-8e28-271b11cc81a3"
        },
        "last_edited_by": {
          "object": "user",
          "id": "4e38fa57-609c-4beb-8e28-271b11cc81a3"
        },
        "has_children": false,
        "archived": false,
        "type": "bulleted_list_item",
        "bulleted_list_item": {
          "rich_text": [
            {
              "type": "text",
              "text": {
                "content": "Price: $100/month",
                "link": null
              },
              "annotations": {
                "bold": false,
                "italic": false,
                "strikethrough": false,
                "underline": false,
                "code": false,
                "color": "default"
              },
              "plain_text": "Price: $100/month",
              "href": null
            }
          ],
          "color": "default"
        }
      },
      {
        "object": "block",
        "id": "83c8c809-c788-44a5-b545-1ee041cf4235",
        "parent": {
          "type": "page_id",
          "page_id": "595bf484-5455-41ab-beea-9d1a9d363464"
        },
        "created_time": "2023-03-12T20:55:00.000Z",
        "last_edited_time": "2023-03-12T20:55:00.000Z",
        "created_by": {
          "object": "user",
          "id": "4e38fa57-609c-4beb-8e28-271b11cc81a3"
        },
        "last_edited_by": {
          "object": "user",
          "id": "4e38fa57-609c-4beb-8e28-271b11cc81a3"
        },
        "has_children": true,
        "archived": false,
        "type": "bulleted_list_item",
        "bulleted_list_item": {
          "rich_text": [
            {
              "type": "text",
              "text": {
                "content": "Features:",
                "link": null
              },
              "annotations": {
                "bold": false,
                "italic": false,
                "strikethrough": false,
                "underline": false,
                "code": false,
                "color": "default"
              },
              "plain_text": "Features:",
              "href": null
            }
          ],
          "color": "default"
        }
      },
      {
        "object": "block",
        "id": "d3d38f7a-c792-4f14-82b4-77afb4c8f202",
        "parent": {
          "type": "page_id",
          "page_id": "595bf484-5455-41ab-beea-9d1a9d363464"
        },
        "created_time": "2023-03-12T20:55:00.000Z",
        "last_edited_time": "2023-03-12T20:55:00.000Z",
        "created_by": {
          "object": "user",
          "id": "4e38fa57-609c-4beb-8e28-271b11cc81a3"
        },
        "last_edited_by": {
          "object": "user",
          "id": "4e38fa57-609c-4beb-8e28-271b11cc81a3"
        },
        "has_children": false,
        "archived": false,
        "type": "heading_2",
        "heading_2": {
          "rich_text": [
            {
              "type": "text",
              "text": {
                "content": "Enterprise Plan",
                "link": null
              },
              "annotations": {
                "bold": false,
                "italic": false,
                "strikethrough": false,
                "underline": false,
                "code": false,
                "color": "default"
              },
              "plain_text": "Enterprise Plan",
              "href": null
            }
          ],
          "is_toggleable": false,
          "color": "default"
        }
      },
      {
        "object": "block",
        "id": "1d6f2e1d-e56a-43de-95aa-e642eef6519a",
        "parent": {
          "type": "page_id",
          "page_id": "595bf484-5455-41ab-beea-9d1a9d363464"
        },
        "created_time": "2023-03-12T20:55:00.000Z",
        "last_edited_time": "2023-03-12T20:55:00.000Z",
        "created_by": {
          "object": "user",
          "id": "4e38fa57-609c-4beb-8e28-271b11cc81a3"
        },
        "last_edited_by": {
          "object": "user",
          "id": "4e38fa57-609c-4beb-8e28-271b11cc81a3"
        },
        "has_children": false,
        "archived": false,
        "type": "bulleted_list_item",
        "bulleted_list_item": {
          "rich_text": [
            {
              "type": "text",
              "text": {
                "content": "Price: Custom pricing",
                "link": null
              },
              "annotations": {
                "bold": false,
                "italic": false,
                "strikethrough": false,
                "underline": false,
                "code": false,
                "color": "default"
              },
              "plain_text": "Price: Custom pricing",
              "href": null
            }
          ],
          "color": "default"
        }
      },
      {
        "object": "block",
        "id": "ab5af97e-0781-422b-ae8f-b9452340e9f6",
        "parent": {
          "type": "page_id",
          "page_id": "595bf484-5455-41ab-beea-9d1a9d363464"
        },
        "created_time": "2023-03-12T20:55:00.000Z",
        "last_edited_time": "2023-03-12T20:55:00.000Z",
        "created_by": {
          "object": "user",
          "id": "4e38fa57-609c-4beb-8e28-271b11cc81a3"
        },
        "last_edited_by": {
          "object": "user",
          "id": "4e38fa57-609c-4beb-8e28-271b11cc81a3"
        },
        "has_children": true,
        "archived": false,
        "type": "bulleted_list_item",
        "bulleted_list_item": {
          "rich_text": [
            {
              "type": "text",
              "text": {
                "content": "Features:",
                "link": null
              },
              "annotations": {
                "bold": false,
                "italic": false,
                "strikethrough": false,
                "underline": false,
                "code": false,
                "color": "default"
              },
              "plain_text": "Features:",
              "href": null
            }
          ],
          "color": "default"
        }
      },
      {
        "object": "block",
        "id": "775a5111-0856-4e6b-ae4b-37b6504d3543",
        "parent": {
          "type": "page_id",
          "page_id": "595bf484-5455-41ab-beea-9d1a9d363464"
        },
        "created_time": "2023-03-12T20:55:00.000Z",
        "last_edited_time": "2023-03-12T20:55:00.000Z",
        "created_by": {
          "object": "user",
          "id": "4e38fa57-609c-4beb-8e28-271b11cc81a3"
        },
        "last_edited_by": {
          "object": "user",
          "id": "4e38fa57-609c-4beb-8e28-271b11cc81a3"
        },
        "has_children": false,
        "archived": false,
        "type": "paragraph",
        "paragraph": {
          "rich_text": [
            {
              "type": "text",
              "text": {
                "content": "Note: All plans come with a 30-day money-back guarantee, and you can cancel at any time.",
                "link": null
              },
              "annotations": {
                "bold": false,
                "italic": false,
                "strikethrough": false,
                "underline": false,
                "code": false,
                "color": "default"
              },
              "plain_text": "Note: All plans come with a 30-day money-back guarantee, and you can cancel at any time.",
              "href": null
            }
          ],
          "color": "default"
        }
      },
      {
        "object": "block",
        "id": "2961b026-6711-481c-86c0-4000471c2a13",
        "parent": {
          "type": "page_id",
          "page_id": "595bf484-5455-41ab-beea-9d1a9d363464"
        },
        "created_time": "2023-03-12T20:55:00.000Z",
        "last_edited_time": "2023-03-12T20:55:00.000Z",
        "created_by": {
          "object": "user",
          "id": "4e38fa57-609c-4beb-8e28-271b11cc81a3"
        },
        "last_edited_by": {
          "object": "user",
          "id": "4e38fa57-609c-4beb-8e28-271b11cc81a3"
        },
        "has_children": false,
        "archived": false,
        "type": "paragraph",
        "paragraph": {
          "rich_text": [
            {
              "type": "text",
              "text": {
                "content": "Thank you for considering our Notion integration for your digital marketing and SEO agency needs.",
                "link": null
              },
              "annotations": {
                "bold": false,
                "italic": false,
                "strikethrough": false,
                "underline": false,
                "code": false,
                "color": "default"
              },
              "plain_text": "Thank you for considering our Notion integration for your digital marketing and SEO agency needs.",
              "href": null
            }
          ],
          "color": "default"
        }
      }
    ],
    "next_cursor": null,
    "has_more": false,
    "type": "block",
    "block": {}
  })

nock(baseUrl)
  .persist()
  .get(`/blocks/${pageIds[6]}/children`)
  .query({ page_size: 50 })
  .reply(200, {
    "object": "list",
    "results": [
      {
        "object": "block",
        "id": "8e64410d-2c01-44c6-896e-f4e02bfa7e05",
        "parent": {
          "type": "page_id",
          "page_id": "b59e1887-7c2c-4566-afc9-a619271ad56d"
        },
        "created_time": "2023-03-12T20:53:00.000Z",
        "last_edited_time": "2023-03-12T20:53:00.000Z",
        "created_by": {
          "object": "user",
          "id": "4e38fa57-609c-4beb-8e28-271b11cc81a3"
        },
        "last_edited_by": {
          "object": "user",
          "id": "4e38fa57-609c-4beb-8e28-271b11cc81a3"
        },
        "has_children": false,
        "archived": false,
        "type": "heading_1",
        "heading_1": {
          "rich_text": [
            {
              "type": "text",
              "text": {
                "content": "Team",
                "link": null
              },
              "annotations": {
                "bold": false,
                "italic": false,
                "strikethrough": false,
                "underline": false,
                "code": false,
                "color": "default"
              },
              "plain_text": "Team",
              "href": null
            }
          ],
          "is_toggleable": false,
          "color": "default"
        }
      },
      {
        "object": "block",
        "id": "c7086cc8-88d0-4dc2-a10f-d781b192ca95",
        "parent": {
          "type": "page_id",
          "page_id": "b59e1887-7c2c-4566-afc9-a619271ad56d"
        },
        "created_time": "2023-03-12T20:53:00.000Z",
        "last_edited_time": "2023-03-12T20:53:00.000Z",
        "created_by": {
          "object": "user",
          "id": "4e38fa57-609c-4beb-8e28-271b11cc81a3"
        },
        "last_edited_by": {
          "object": "user",
          "id": "4e38fa57-609c-4beb-8e28-271b11cc81a3"
        },
        "has_children": false,
        "archived": false,
        "type": "heading_2",
        "heading_2": {
          "rich_text": [
            {
              "type": "text",
              "text": {
                "content": "AgencyKit Team Members",
                "link": null
              },
              "annotations": {
                "bold": false,
                "italic": false,
                "strikethrough": false,
                "underline": false,
                "code": false,
                "color": "default"
              },
              "plain_text": "AgencyKit Team Members",
              "href": null
            }
          ],
          "is_toggleable": false,
          "color": "default"
        }
      },
      {
        "object": "block",
        "id": "8f6b53e2-7df9-4bd0-a91a-f2e7695776e3",
        "parent": {
          "type": "page_id",
          "page_id": "b59e1887-7c2c-4566-afc9-a619271ad56d"
        },
        "created_time": "2023-03-12T20:53:00.000Z",
        "last_edited_time": "2023-03-12T20:53:00.000Z",
        "created_by": {
          "object": "user",
          "id": "4e38fa57-609c-4beb-8e28-271b11cc81a3"
        },
        "last_edited_by": {
          "object": "user",
          "id": "4e38fa57-609c-4beb-8e28-271b11cc81a3"
        },
        "has_children": false,
        "archived": false,
        "type": "paragraph",
        "paragraph": {
          "rich_text": [
            {
              "type": "text",
              "text": {
                "content": "The AgencyKit team is composed of two members: Jacob and Mortimer.",
                "link": null
              },
              "annotations": {
                "bold": false,
                "italic": false,
                "strikethrough": false,
                "underline": false,
                "code": false,
                "color": "default"
              },
              "plain_text": "The AgencyKit team is composed of two members: Jacob and Mortimer.",
              "href": null
            }
          ],
          "color": "default"
        }
      },
      {
        "object": "block",
        "id": "45b6bd1c-0f75-4dbe-9e85-5c0d10e48f54",
        "parent": {
          "type": "page_id",
          "page_id": "b59e1887-7c2c-4566-afc9-a619271ad56d"
        },
        "created_time": "2023-03-12T20:53:00.000Z",
        "last_edited_time": "2023-03-12T20:53:00.000Z",
        "created_by": {
          "object": "user",
          "id": "4e38fa57-609c-4beb-8e28-271b11cc81a3"
        },
        "last_edited_by": {
          "object": "user",
          "id": "4e38fa57-609c-4beb-8e28-271b11cc81a3"
        },
        "has_children": false,
        "archived": false,
        "type": "heading_3",
        "heading_3": {
          "rich_text": [
            {
              "type": "text",
              "text": {
                "content": "Jacob",
                "link": null
              },
              "annotations": {
                "bold": false,
                "italic": false,
                "strikethrough": false,
                "underline": false,
                "code": false,
                "color": "default"
              },
              "plain_text": "Jacob",
              "href": null
            }
          ],
          "is_toggleable": false,
          "color": "default"
        }
      },
      {
        "object": "block",
        "id": "4734fff9-a785-40c2-81a5-4ed7321f9bf9",
        "parent": {
          "type": "page_id",
          "page_id": "b59e1887-7c2c-4566-afc9-a619271ad56d"
        },
        "created_time": "2023-03-12T20:53:00.000Z",
        "last_edited_time": "2023-03-12T20:53:00.000Z",
        "created_by": {
          "object": "user",
          "id": "4e38fa57-609c-4beb-8e28-271b11cc81a3"
        },
        "last_edited_by": {
          "object": "user",
          "id": "4e38fa57-609c-4beb-8e28-271b11cc81a3"
        },
        "has_children": false,
        "archived": false,
        "type": "paragraph",
        "paragraph": {
          "rich_text": [
            {
              "type": "text",
              "text": {
                "content": "Jacob is a member of the AgencyKit team. He is responsible for [insert responsibilities]. He has [insert years of experience] years of experience in the industry and holds a degree in [insert degree].",
                "link": null
              },
              "annotations": {
                "bold": false,
                "italic": false,
                "strikethrough": false,
                "underline": false,
                "code": false,
                "color": "default"
              },
              "plain_text": "Jacob is a member of the AgencyKit team. He is responsible for [insert responsibilities]. He has [insert years of experience] years of experience in the industry and holds a degree in [insert degree].",
              "href": null
            }
          ],
          "color": "default"
        }
      },
      {
        "object": "block",
        "id": "658c136f-f8ce-486c-b5ae-ccfb7ab7ee65",
        "parent": {
          "type": "page_id",
          "page_id": "b59e1887-7c2c-4566-afc9-a619271ad56d"
        },
        "created_time": "2023-03-12T20:53:00.000Z",
        "last_edited_time": "2023-03-12T20:53:00.000Z",
        "created_by": {
          "object": "user",
          "id": "4e38fa57-609c-4beb-8e28-271b11cc81a3"
        },
        "last_edited_by": {
          "object": "user",
          "id": "4e38fa57-609c-4beb-8e28-271b11cc81a3"
        },
        "has_children": false,
        "archived": false,
        "type": "heading_3",
        "heading_3": {
          "rich_text": [
            {
              "type": "text",
              "text": {
                "content": "Mortimer",
                "link": null
              },
              "annotations": {
                "bold": false,
                "italic": false,
                "strikethrough": false,
                "underline": false,
                "code": false,
                "color": "default"
              },
              "plain_text": "Mortimer",
              "href": null
            }
          ],
          "is_toggleable": false,
          "color": "default"
        }
      },
      {
        "object": "block",
        "id": "b56301b1-4841-47c1-86f4-a3443165c419",
        "parent": {
          "type": "page_id",
          "page_id": "b59e1887-7c2c-4566-afc9-a619271ad56d"
        },
        "created_time": "2023-03-12T20:53:00.000Z",
        "last_edited_time": "2023-03-12T20:53:00.000Z",
        "created_by": {
          "object": "user",
          "id": "4e38fa57-609c-4beb-8e28-271b11cc81a3"
        },
        "last_edited_by": {
          "object": "user",
          "id": "4e38fa57-609c-4beb-8e28-271b11cc81a3"
        },
        "has_children": false,
        "archived": false,
        "type": "paragraph",
        "paragraph": {
          "rich_text": [
            {
              "type": "text",
              "text": {
                "content": "Mortimer is another member of the AgencyKit team. He is responsible for [insert responsibilities]. He has [insert years of experience] years of experience in the industry and holds a degree in [insert degree].",
                "link": null
              },
              "annotations": {
                "bold": false,
                "italic": false,
                "strikethrough": false,
                "underline": false,
                "code": false,
                "color": "default"
              },
              "plain_text": "Mortimer is another member of the AgencyKit team. He is responsible for [insert responsibilities]. He has [insert years of experience] years of experience in the industry and holds a degree in [insert degree].",
              "href": null
            }
          ],
          "color": "default"
        }
      },
      {
        "object": "block",
        "id": "ba53fa32-3408-4d68-bb2d-6eb10d515161",
        "parent": {
          "type": "page_id",
          "page_id": "b59e1887-7c2c-4566-afc9-a619271ad56d"
        },
        "created_time": "2023-03-12T20:53:00.000Z",
        "last_edited_time": "2023-03-12T20:53:00.000Z",
        "created_by": {
          "object": "user",
          "id": "4e38fa57-609c-4beb-8e28-271b11cc81a3"
        },
        "last_edited_by": {
          "object": "user",
          "id": "4e38fa57-609c-4beb-8e28-271b11cc81a3"
        },
        "has_children": false,
        "archived": false,
        "type": "heading_2",
        "heading_2": {
          "rich_text": [
            {
              "type": "text",
              "text": {
                "content": "About AgencyKit",
                "link": null
              },
              "annotations": {
                "bold": false,
                "italic": false,
                "strikethrough": false,
                "underline": false,
                "code": false,
                "color": "default"
              },
              "plain_text": "About AgencyKit",
              "href": null
            }
          ],
          "is_toggleable": false,
          "color": "default"
        }
      },
      {
        "object": "block",
        "id": "1a5a3ab0-1f3d-4a66-9dfb-2175d0d8135d",
        "parent": {
          "type": "page_id",
          "page_id": "b59e1887-7c2c-4566-afc9-a619271ad56d"
        },
        "created_time": "2023-03-12T20:53:00.000Z",
        "last_edited_time": "2023-03-12T20:53:00.000Z",
        "created_by": {
          "object": "user",
          "id": "4e38fa57-609c-4beb-8e28-271b11cc81a3"
        },
        "last_edited_by": {
          "object": "user",
          "id": "4e38fa57-609c-4beb-8e28-271b11cc81a3"
        },
        "has_children": false,
        "archived": false,
        "type": "paragraph",
        "paragraph": {
          "rich_text": [
            {
              "type": "text",
              "text": {
                "content": "AgencyKit is a [insert description of the company]. Our team is dedicated to providing [insert mission statement or values].",
                "link": null
              },
              "annotations": {
                "bold": false,
                "italic": false,
                "strikethrough": false,
                "underline": false,
                "code": false,
                "color": "default"
              },
              "plain_text": "AgencyKit is a [insert description of the company]. Our team is dedicated to providing [insert mission statement or values].",
              "href": null
            }
          ],
          "color": "default"
        }
      },
      {
        "object": "block",
        "id": "aeca1830-9986-4cc3-8402-c55d3ef8361f",
        "parent": {
          "type": "page_id",
          "page_id": "b59e1887-7c2c-4566-afc9-a619271ad56d"
        },
        "created_time": "2023-03-12T20:53:00.000Z",
        "last_edited_time": "2023-03-12T20:53:00.000Z",
        "created_by": {
          "object": "user",
          "id": "4e38fa57-609c-4beb-8e28-271b11cc81a3"
        },
        "last_edited_by": {
          "object": "user",
          "id": "4e38fa57-609c-4beb-8e28-271b11cc81a3"
        },
        "has_children": false,
        "archived": false,
        "type": "heading_2",
        "heading_2": {
          "rich_text": [
            {
              "type": "text",
              "text": {
                "content": "Published",
                "link": null
              },
              "annotations": {
                "bold": false,
                "italic": false,
                "strikethrough": false,
                "underline": false,
                "code": false,
                "color": "default"
              },
              "plain_text": "Published",
              "href": null
            }
          ],
          "is_toggleable": false,
          "color": "default"
        }
      },
      {
        "object": "block",
        "id": "5b04d8b8-64e8-47b9-b8b6-fae7cd3bf250",
        "parent": {
          "type": "page_id",
          "page_id": "b59e1887-7c2c-4566-afc9-a619271ad56d"
        },
        "created_time": "2023-03-12T20:53:00.000Z",
        "last_edited_time": "2023-03-12T20:53:00.000Z",
        "created_by": {
          "object": "user",
          "id": "4e38fa57-609c-4beb-8e28-271b11cc81a3"
        },
        "last_edited_by": {
          "object": "user",
          "id": "4e38fa57-609c-4beb-8e28-271b11cc81a3"
        },
        "has_children": false,
        "archived": false,
        "type": "paragraph",
        "paragraph": {
          "rich_text": [
            {
              "type": "text",
              "text": {
                "content": "This document is currently in draft and subject to change.",
                "link": null
              },
              "annotations": {
                "bold": false,
                "italic": false,
                "strikethrough": false,
                "underline": false,
                "code": false,
                "color": "default"
              },
              "plain_text": "This document is currently in draft and subject to change.",
              "href": null
            }
          ],
          "color": "default"
        }
      },
      {
        "object": "block",
        "id": "c9351bdf-7381-429d-8f3e-75efd7742403",
        "parent": {
          "type": "page_id",
          "page_id": "b59e1887-7c2c-4566-afc9-a619271ad56d"
        },
        "created_time": "2023-03-12T20:53:00.000Z",
        "last_edited_time": "2023-03-12T20:53:00.000Z",
        "created_by": {
          "object": "user",
          "id": "4e38fa57-609c-4beb-8e28-271b11cc81a3"
        },
        "last_edited_by": {
          "object": "user",
          "id": "4e38fa57-609c-4beb-8e28-271b11cc81a3"
        },
        "has_children": false,
        "archived": false,
        "type": "heading_2",
        "heading_2": {
          "rich_text": [
            {
              "type": "text",
              "text": {
                "content": "Sub-Pages",
                "link": null
              },
              "annotations": {
                "bold": false,
                "italic": false,
                "strikethrough": false,
                "underline": false,
                "code": false,
                "color": "default"
              },
              "plain_text": "Sub-Pages",
              "href": null
            }
          ],
          "is_toggleable": false,
          "color": "default"
        }
      },
      {
        "object": "block",
        "id": "a3782138-0fab-40e7-a18b-5711c727782b",
        "parent": {
          "type": "page_id",
          "page_id": "b59e1887-7c2c-4566-afc9-a619271ad56d"
        },
        "created_time": "2023-03-12T20:53:00.000Z",
        "last_edited_time": "2023-03-12T20:53:00.000Z",
        "created_by": {
          "object": "user",
          "id": "4e38fa57-609c-4beb-8e28-271b11cc81a3"
        },
        "last_edited_by": {
          "object": "user",
          "id": "4e38fa57-609c-4beb-8e28-271b11cc81a3"
        },
        "has_children": false,
        "archived": false,
        "type": "paragraph",
        "paragraph": {
          "rich_text": [
            {
              "type": "text",
              "text": {
                "content": "For more information about Jacob and Mortimer, please visit the following sub-pages:",
                "link": null
              },
              "annotations": {
                "bold": false,
                "italic": false,
                "strikethrough": false,
                "underline": false,
                "code": false,
                "color": "default"
              },
              "plain_text": "For more information about Jacob and Mortimer, please visit the following sub-pages:",
              "href": null
            }
          ],
          "color": "default"
        }
      },
      {
        "object": "block",
        "id": "3c0b37c7-e217-4962-a787-66d910566b9d",
        "parent": {
          "type": "page_id",
          "page_id": "b59e1887-7c2c-4566-afc9-a619271ad56d"
        },
        "created_time": "2023-03-12T20:53:00.000Z",
        "last_edited_time": "2023-03-12T20:53:00.000Z",
        "created_by": {
          "object": "user",
          "id": "4e38fa57-609c-4beb-8e28-271b11cc81a3"
        },
        "last_edited_by": {
          "object": "user",
          "id": "4e38fa57-609c-4beb-8e28-271b11cc81a3"
        },
        "has_children": false,
        "archived": false,
        "type": "bulleted_list_item",
        "bulleted_list_item": {
          "rich_text": [
            {
              "type": "text",
              "text": {
                "content": "https://www.notion.so/Jacob-0076e3753bed4aa197c22eea4d58fe93",
                "link": {
                  "url": "https://www.notion.so/Jacob-0076e3753bed4aa197c22eea4d58fe93"
                }
              },
              "annotations": {
                "bold": false,
                "italic": false,
                "strikethrough": false,
                "underline": false,
                "code": false,
                "color": "default"
              },
              "plain_text": "https://www.notion.so/Jacob-0076e3753bed4aa197c22eea4d58fe93",
              "href": "https://www.notion.so/Jacob-0076e3753bed4aa197c22eea4d58fe93"
            }
          ],
          "color": "default"
        }
      },
      {
        "object": "block",
        "id": "96e34323-fc16-40bb-9a66-b1cb496079db",
        "parent": {
          "type": "page_id",
          "page_id": "b59e1887-7c2c-4566-afc9-a619271ad56d"
        },
        "created_time": "2023-03-12T20:53:00.000Z",
        "last_edited_time": "2023-03-12T20:53:00.000Z",
        "created_by": {
          "object": "user",
          "id": "4e38fa57-609c-4beb-8e28-271b11cc81a3"
        },
        "last_edited_by": {
          "object": "user",
          "id": "4e38fa57-609c-4beb-8e28-271b11cc81a3"
        },
        "has_children": false,
        "archived": false,
        "type": "bulleted_list_item",
        "bulleted_list_item": {
          "rich_text": [
            {
              "type": "text",
              "text": {
                "content": "https://www.notion.so/Mortimer-d400849bafc24ffe815083005a624192",
                "link": {
                  "url": "https://www.notion.so/Mortimer-d400849bafc24ffe815083005a624192"
                }
              },
              "annotations": {
                "bold": false,
                "italic": false,
                "strikethrough": false,
                "underline": false,
                "code": false,
                "color": "default"
              },
              "plain_text": "https://www.notion.so/Mortimer-d400849bafc24ffe815083005a624192",
              "href": "https://www.notion.so/Mortimer-d400849bafc24ffe815083005a624192"
            }
          ],
          "color": "default"
        }
      }
    ],
    "next_cursor": null,
    "has_more": false,
    "type": "block",
    "block": {}
  })

nock(baseUrl)
  .persist()
  .get(`/blocks/${pageIds[7]}/children`)
  .query({ page_size: 50 })
  .reply(200, {
    "object": "list",
    "results": [
      {
        "object": "block",
        "id": "e61cbed7-c4b4-4304-88a2-4295e44a7562",
        "parent": {
          "type": "page_id",
          "page_id": "232177b4-31ac-4fdb-946b-cdd996add2d2"
        },
        "created_time": "2023-03-12T20:54:00.000Z",
        "last_edited_time": "2023-03-12T20:54:00.000Z",
        "created_by": {
          "object": "user",
          "id": "4e38fa57-609c-4beb-8e28-271b11cc81a3"
        },
        "last_edited_by": {
          "object": "user",
          "id": "4e38fa57-609c-4beb-8e28-271b11cc81a3"
        },
        "has_children": false,
        "archived": false,
        "type": "heading_1",
        "heading_1": {
          "rich_text": [
            {
              "type": "text",
              "text": {
                "content": "About AgencyKit",
                "link": null
              },
              "annotations": {
                "bold": false,
                "italic": false,
                "strikethrough": false,
                "underline": false,
                "code": false,
                "color": "default"
              },
              "plain_text": "About AgencyKit",
              "href": null
            }
          ],
          "is_toggleable": false,
          "color": "default"
        }
      },
      {
        "object": "block",
        "id": "21d4debd-4707-4369-bda7-9c088eb89275",
        "parent": {
          "type": "page_id",
          "page_id": "232177b4-31ac-4fdb-946b-cdd996add2d2"
        },
        "created_time": "2023-03-12T20:54:00.000Z",
        "last_edited_time": "2023-03-12T20:54:00.000Z",
        "created_by": {
          "object": "user",
          "id": "4e38fa57-609c-4beb-8e28-271b11cc81a3"
        },
        "last_edited_by": {
          "object": "user",
          "id": "4e38fa57-609c-4beb-8e28-271b11cc81a3"
        },
        "has_children": false,
        "archived": false,
        "type": "paragraph",
        "paragraph": {
          "rich_text": [
            {
              "type": "text",
              "text": {
                "content": "AgencyKit is a company that specializes in providing SEO and marketing agency geared Notion integrations. Their goal is to help businesses optimize their workflows and increase productivity using Notion CMS.",
                "link": null
              },
              "annotations": {
                "bold": false,
                "italic": false,
                "strikethrough": false,
                "underline": false,
                "code": false,
                "color": "default"
              },
              "plain_text": "AgencyKit is a company that specializes in providing SEO and marketing agency geared Notion integrations. Their goal is to help businesses optimize their workflows and increase productivity using Notion CMS.",
              "href": null
            }
          ],
          "color": "default"
        }
      },
      {
        "object": "block",
        "id": "84c05ba8-e49e-4f5a-a028-79cb2adc3ae4",
        "parent": {
          "type": "page_id",
          "page_id": "232177b4-31ac-4fdb-946b-cdd996add2d2"
        },
        "created_time": "2023-03-12T20:54:00.000Z",
        "last_edited_time": "2023-03-12T20:54:00.000Z",
        "created_by": {
          "object": "user",
          "id": "4e38fa57-609c-4beb-8e28-271b11cc81a3"
        },
        "last_edited_by": {
          "object": "user",
          "id": "4e38fa57-609c-4beb-8e28-271b11cc81a3"
        },
        "has_children": false,
        "archived": false,
        "type": "paragraph",
        "paragraph": {
          "rich_text": [
            {
              "type": "text",
              "text": {
                "content": "One of the main advantages of AgencyKit is that they offer a wide range of integrations, including SEO tools, social media management, project management, and more. This allows businesses to customize their Notion setup according to their specific needs.",
                "link": null
              },
              "annotations": {
                "bold": false,
                "italic": false,
                "strikethrough": false,
                "underline": false,
                "code": false,
                "color": "default"
              },
              "plain_text": "One of the main advantages of AgencyKit is that they offer a wide range of integrations, including SEO tools, social media management, project management, and more. This allows businesses to customize their Notion setup according to their specific needs.",
              "href": null
            }
          ],
          "color": "default"
        }
      },
      {
        "object": "block",
        "id": "0990a516-76dd-4c17-a48c-9ceda7e76fc3",
        "parent": {
          "type": "page_id",
          "page_id": "232177b4-31ac-4fdb-946b-cdd996add2d2"
        },
        "created_time": "2023-03-12T20:54:00.000Z",
        "last_edited_time": "2023-03-12T20:54:00.000Z",
        "created_by": {
          "object": "user",
          "id": "4e38fa57-609c-4beb-8e28-271b11cc81a3"
        },
        "last_edited_by": {
          "object": "user",
          "id": "4e38fa57-609c-4beb-8e28-271b11cc81a3"
        },
        "has_children": false,
        "archived": false,
        "type": "paragraph",
        "paragraph": {
          "rich_text": [
            {
              "type": "text",
              "text": {
                "content": "Another benefit of working with AgencyKit is their focus on customer support. They offer responsive and personalized support to their clients, ensuring that their Notion setup is running smoothly and efficiently.",
                "link": null
              },
              "annotations": {
                "bold": false,
                "italic": false,
                "strikethrough": false,
                "underline": false,
                "code": false,
                "color": "default"
              },
              "plain_text": "Another benefit of working with AgencyKit is their focus on customer support. They offer responsive and personalized support to their clients, ensuring that their Notion setup is running smoothly and efficiently.",
              "href": null
            }
          ],
          "color": "default"
        }
      },
      {
        "object": "block",
        "id": "eea06248-32b4-4514-ad54-75c7afb29ce2",
        "parent": {
          "type": "page_id",
          "page_id": "232177b4-31ac-4fdb-946b-cdd996add2d2"
        },
        "created_time": "2023-03-12T20:54:00.000Z",
        "last_edited_time": "2023-03-12T20:54:00.000Z",
        "created_by": {
          "object": "user",
          "id": "4e38fa57-609c-4beb-8e28-271b11cc81a3"
        },
        "last_edited_by": {
          "object": "user",
          "id": "4e38fa57-609c-4beb-8e28-271b11cc81a3"
        },
        "has_children": false,
        "archived": false,
        "type": "paragraph",
        "paragraph": {
          "rich_text": [
            {
              "type": "text",
              "text": {
                "content": "Overall, AgencyKit is a valuable resource for businesses looking to enhance their Notion CMS capabilities. With their expertise and dedication to customer service, they provide a comprehensive solution for businesses seeking to optimize their workflows and increase productivity.",
                "link": null
              },
              "annotations": {
                "bold": false,
                "italic": false,
                "strikethrough": false,
                "underline": false,
                "code": false,
                "color": "default"
              },
              "plain_text": "Overall, AgencyKit is a valuable resource for businesses looking to enhance their Notion CMS capabilities. With their expertise and dedication to customer service, they provide a comprehensive solution for businesses seeking to optimize their workflows and increase productivity.",
              "href": null
            }
          ],
          "color": "default"
        }
      }
    ],
    "next_cursor": null,
    "has_more": false,
    "type": "block",
    "block": {}
  })
