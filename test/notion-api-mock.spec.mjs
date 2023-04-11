import nock from 'nock'

const notionDatabaseId = '610627a9-28b1-4477-b660-c00c5364435b'

const baseUrl = 'https://api.notion.com/v1'

const pageIds = [
  '7fc90a1d-ca4d-49ad-91b5-136c3d5a304d',
  '1cec47af-3e5f-4382-bbfd-cd5f98effa30',
  'b194a437-262e-482c-92b2-c5581eb5b477',
  '163bc39b-ffa6-4d88-84f5-cb73fa4a705a',
  'dd5157a6-cf4c-4a51-8da5-0da83ef641ae',
]

export const expectedRoutes = [
  '/team',
  '/products',
  '/products/category',
  '/products/category/product-a',
  '/products/category/product-b',
]

export const expectedSiteData = {
  '/team': {
    name: 'Team',
    _key: '/team',
    id: '163bc39b-ffa6-4d88-84f5-cb73fa4a705a',
    pid: undefined,
    authors: ["Jacob Milhorn"],
    tags: [],
    _notion: {
      id: "163bc39b-ffa6-4d88-84f5-cb73fa4a705a",
      last_edited_time: "2023-04-09T06:07:00.000Z"
    },
    content: '<h1 id=\"team\">Team</h1>\n<p>about the team</p>\n',
    coverImage: undefined,
    slug: 'team',
    path: "/team",
    url: "",
    _ancestors: []
  },
  '/products': {
    name: 'Products',
    _key: '/products',
    id: 'dd5157a6-cf4c-4a51-8da5-0da83ef641ae',
    pid: undefined,
    authors: [],
    tags: [],
    _notion: {
      id: "dd5157a6-cf4c-4a51-8da5-0da83ef641ae",
      last_edited_time: "2023-04-09T05:56:00.000Z"
    },
    content: '<h1 id=\"products\">Products</h1>\n<p>about products</p>\n',
    coverImage: undefined,
    slug: 'products',
    path: "/products",
    url: "",
    _ancestors: [],
    '/category': {
      name: 'Category',
      _key: '/category',
      id: 'b194a437-262e-482c-92b2-c5581eb5b477',
      pid: 'dd5157a6-cf4c-4a51-8da5-0da83ef641ae',
      authors: [],
      tags: [
        "blog",
        "notion",
        "apis"
      ],
      _notion: {
        id: "b194a437-262e-482c-92b2-c5581eb5b477",
        last_edited_time: "2023-04-09T06:03:00.000Z"
      },
      content: '<h2 id=\"product-categories\">Product Categories</h2>\n<p>about product categories</p>\n',
      coverImage: undefined,
      slug: 'category',
      path: "/products/category",
      url: "",

      _ancestors: [],
      '/product-a': {
        name: 'Product A',
        _key: '/product-a',
        id: '1cec47af-3e5f-4382-bbfd-cd5f98effa30',
        pid: 'b194a437-262e-482c-92b2-c5581eb5b477',
        authors: ["Jacob Milhorn"],
        tags: ["programming"],
        content: '<h2 id=\"product-a\">Product A</h2>\n<p>about product A</p>\n',
        _notion: {
          id: "1cec47af-3e5f-4382-bbfd-cd5f98effa30",
          last_edited_time: "2023-04-09T06:03:00.000Z"
        },
        coverImage: undefined,
        slug: 'product-a',
        path: "/products/category/product-a",
        url: "",

        _ancestors: []
      },
      '/product-b': {
        name: 'Product B',
        _key: '/product-b',
        id: '7fc90a1d-ca4d-49ad-91b5-136c3d5a304d',
        pid: 'b194a437-262e-482c-92b2-c5581eb5b477',
        authors: [],
        tags: [
          "blog",
          "notion",
          "apis",
          "programming",
          "javascript"
        ],
        content: '<h2 id=\"product-b\">Product B</h2>\n<p>about product B</p>\n',
        _notion: {
          id: "7fc90a1d-ca4d-49ad-91b5-136c3d5a304d",
          last_edited_time: "2023-04-09T06:03:00.000Z"
        },
        coverImage: undefined,
        slug: 'product-b',
        path: "/products/category/product-b",
        url: "",

        _ancestors: []
      },
    },
  },
}

export const expectedTags = [
  'blog',
  'notion',
  'apis',
  'javascript',
  'programming'
]

export const expectedTaggedCollection = [
  {
    name: 'Category',
    _key: '/category',
    id: 'b194a437-262e-482c-92b2-c5581eb5b477',
    pid: 'dd5157a6-cf4c-4a51-8da5-0da83ef641ae',
    authors: [],
    tags: [
      "blog",
      "notion",
      "apis"
    ],
    _notion: {
      id: "b194a437-262e-482c-92b2-c5581eb5b477",
      last_edited_time: "2023-04-09T06:03:00.000Z"
    },
    content: '<h2 id=\"product-categories\">Product Categories</h2>\n<p>about product categories</p>\n',
    coverImage: undefined,
    slug: 'category',
    path: "/products/category",
    url: "",
    _ancestors: [],
    '/product-a': {
      name: 'Product A',
      _key: '/product-a',
      id: '1cec47af-3e5f-4382-bbfd-cd5f98effa30',
      pid: 'b194a437-262e-482c-92b2-c5581eb5b477',
      authors: ["Jacob Milhorn"],
      tags: ["programming"],
      content: '<h2 id=\"product-a\">Product A</h2>\n<p>about product A</p>\n',
      _notion: {
        id: "1cec47af-3e5f-4382-bbfd-cd5f98effa30",
        last_edited_time: "2023-04-09T06:03:00.000Z"
      },
      coverImage: undefined,
      slug: 'product-a',
      path: "/products/category/product-a",
      url: "",

      _ancestors: []
    },
    '/product-b': {
      name: 'Product B',
      _key: '/product-b',
      id: '7fc90a1d-ca4d-49ad-91b5-136c3d5a304d',
      pid: 'b194a437-262e-482c-92b2-c5581eb5b477',
      authors: [],
      tags: [
        "blog",
        "notion",
        "apis",
        "programming",
        "javascript"
      ],
      content: '<h2 id=\"product-b\">Product B</h2>\n<p>about product B</p>\n',
      _notion: {
        id: "7fc90a1d-ca4d-49ad-91b5-136c3d5a304d",
        last_edited_time: "2023-04-09T06:03:00.000Z"
      },
      coverImage: undefined,
      slug: 'product-b',
      path: "/products/category/product-b",
      url: "",

      _ancestors: []
    },
  },
  {
    name: 'Product B',
    _key: '/product-b',
    id: '7fc90a1d-ca4d-49ad-91b5-136c3d5a304d',
    pid: 'b194a437-262e-482c-92b2-c5581eb5b477',
    authors: [],
    tags: [
      "blog",
      "notion",
      "apis",
      "programming",
      "javascript"
    ],
    content: '<h2 id=\"product-b\">Product B</h2>\n<p>about product B</p>\n',
    _notion: {
      id: "7fc90a1d-ca4d-49ad-91b5-136c3d5a304d",
      last_edited_time: "2023-04-09T06:03:00.000Z"
    },
    coverImage: undefined,
    slug: 'product-b',
    path: "/products/category/product-b",
    url: "",
    _ancestors: []
  },
  {
    name: 'Product A',
    _key: '/product-a',
    id: '1cec47af-3e5f-4382-bbfd-cd5f98effa30',
    pid: 'b194a437-262e-482c-92b2-c5581eb5b477',
    authors: ["Jacob Milhorn"],
    tags: ["programming"],
    content: '<h2 id=\"product-a\">Product A</h2>\n<p>about product A</p>\n',
    _notion: {
      id: "1cec47af-3e5f-4382-bbfd-cd5f98effa30",
      last_edited_time: "2023-04-09T06:03:00.000Z"
    },
    coverImage: undefined,
    slug: 'product-a',
    path: "/products/category/product-a",
    url: "",
    _ancestors: []
  },
]


nock(baseUrl)
  .persist()
  .post(`/databases/${notionDatabaseId}/query`)
  .reply(200, {
    "object": "list",
    "results": [
      {
        "object": "page",
        "id": "7fc90a1d-ca4d-49ad-91b5-136c3d5a304d",
        "created_time": "2023-04-09T06:03:00.000Z",
        "last_edited_time": "2023-04-09T06:03:00.000Z",
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
          "database_id": "610627a9-28b1-4477-b660-c00c5364435b"
        },
        "archived": false,
        "properties": {
          "parent-page": {
            "id": "%3FuXy",
            "type": "relation",
            "relation": [
              {
                "id": "b194a437-262e-482c-92b2-c5581eb5b477"
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
                "id": "a37db9a6-cb20-4914-86ec-e5d0beac072d",
                "name": "apis",
                "color": "orange"
              },
              {
                "id": "098acfda-2fb1-4ecf-8737-c03b80b5cb18",
                "name": "programming",
                "color": "default"
              },
              {
                "id": "165eef40-7a03-468a-882e-5516b4f63af8",
                "name": "javascript",
                "color": "green"
              }
            ]
          },
          "Author": {
            "id": "SQeZ",
            "type": "people",
            "people": []
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
          "name": {
            "id": "title",
            "type": "title",
            "title": [
              {
                "type": "text",
                "text": {
                  "content": "Product B",
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
                "plain_text": "Product B",
                "href": null
              }
            ]
          }
        },
        "url": "https://www.notion.so/Product-B-7fc90a1dca4d49ad91b5136c3d5a304d"
      },
      {
        "object": "page",
        "id": "1cec47af-3e5f-4382-bbfd-cd5f98effa30",
        "created_time": "2023-04-09T05:50:00.000Z",
        "last_edited_time": "2023-04-09T06:03:00.000Z",
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
          "database_id": "610627a9-28b1-4477-b660-c00c5364435b"
        },
        "archived": false,
        "properties": {
          "parent-page": {
            "id": "%3FuXy",
            "type": "relation",
            "relation": [
              {
                "id": "b194a437-262e-482c-92b2-c5581eb5b477"
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
                "id": "098acfda-2fb1-4ecf-8737-c03b80b5cb18",
                "name": "programming",
                "color": "default"
              }
            ]
          },
          "Author": {
            "id": "SQeZ",
            "type": "people",
            "people": [
              {
                "object": "user",
                "id": "4e38fa57-609c-4beb-8e28-271b11cc81a3",
                "name": "Jacob Milhorn",
                "avatar_url": null,
                "type": "person",
                "person": {
                  "email": "jacob.milhorn@gmail.com"
                }
              }
            ]
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
          "name": {
            "id": "title",
            "type": "title",
            "title": [
              {
                "type": "text",
                "text": {
                  "content": "Product A",
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
                "plain_text": "Product A",
                "href": null
              }
            ]
          }
        },
        "url": "https://www.notion.so/Product-A-1cec47af3e5f4382bbfdcd5f98effa30"
      },
      {
        "object": "page",
        "id": "b194a437-262e-482c-92b2-c5581eb5b477",
        "created_time": "2023-04-09T05:50:00.000Z",
        "last_edited_time": "2023-04-09T06:03:00.000Z",
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
          "database_id": "610627a9-28b1-4477-b660-c00c5364435b"
        },
        "archived": false,
        "properties": {
          "parent-page": {
            "id": "%3FuXy",
            "type": "relation",
            "relation": [
              {
                "id": "dd5157a6-cf4c-4a51-8da5-0da83ef641ae"
              }
            ],
            "has_more": false
          },
          "sub-page": {
            "id": "%40KPB",
            "type": "relation",
            "relation": [
              {
                "id": "1cec47af-3e5f-4382-bbfd-cd5f98effa30"
              },
              {
                "id": "7fc90a1d-ca4d-49ad-91b5-136c3d5a304d"
              }
            ],
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
                "id": "a37db9a6-cb20-4914-86ec-e5d0beac072d",
                "name": "apis",
                "color": "orange"
              }
            ]
          },
          "Author": {
            "id": "SQeZ",
            "type": "people",
            "people": []
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
          "name": {
            "id": "title",
            "type": "title",
            "title": [
              {
                "type": "text",
                "text": {
                  "content": "Category",
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
                "plain_text": "Category",
                "href": null
              }
            ]
          }
        },
        "url": "https://www.notion.so/Category-b194a437262e482c92b2c5581eb5b477"
      },
      {
        "object": "page",
        "id": "163bc39b-ffa6-4d88-84f5-cb73fa4a705a",
        "created_time": "2023-04-09T05:45:00.000Z",
        "last_edited_time": "2023-04-09T06:07:00.000Z",
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
          "database_id": "610627a9-28b1-4477-b660-c00c5364435b"
        },
        "archived": false,
        "properties": {
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
          "Author": {
            "id": "SQeZ",
            "type": "people",
            "people": [
              {
                "object": "user",
                "id": "4e38fa57-609c-4beb-8e28-271b11cc81a3",
                "name": "Jacob Milhorn",
                "avatar_url": null,
                "type": "person",
                "person": {
                  "email": "jacob.milhorn@gmail.com"
                }
              }
            ]
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
        "url": "https://www.notion.so/Team-163bc39bffa64d8884f5cb73fa4a705a"
      },
      {
        "object": "page",
        "id": "dd5157a6-cf4c-4a51-8da5-0da83ef641ae",
        "created_time": "2023-04-09T05:45:00.000Z",
        "last_edited_time": "2023-04-09T05:56:00.000Z",
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
          "database_id": "610627a9-28b1-4477-b660-c00c5364435b"
        },
        "archived": false,
        "properties": {
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
                "id": "b194a437-262e-482c-92b2-c5581eb5b477"
              }
            ],
            "has_more": false
          },
          "Tags": {
            "id": "NNmP",
            "type": "multi_select",
            "multi_select": []
          },
          "Author": {
            "id": "SQeZ",
            "type": "people",
            "people": []
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
          "name": {
            "id": "title",
            "type": "title",
            "title": [
              {
                "type": "text",
                "text": {
                  "content": "Products",
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
                "plain_text": "Products",
                "href": null
              }
            ]
          }
        },
        "url": "https://www.notion.so/Products-dd5157a6cf4c4a518da50da83ef641ae"
      }
    ],
    "next_cursor": null,
    "has_more": false,
    "type": "page",
    "page": {}
  })


// Block Children Queries

nock(baseUrl)
  .persist()
  .get(`/blocks/${pageIds[0]}/children`)
  .query({ page_size: 100 })
  .reply(200, {
    "object": "list",
    "results": [
      {
        "object": "block",
        "id": "c2b84e62-6f89-45f6-ae1e-15d4f1cce6c2",
        "parent": {
          "type": "page_id",
          "page_id": "7fc90a1d-ca4d-49ad-91b5-136c3d5a304d"
        },
        "created_time": "2023-04-09T06:03:00.000Z",
        "last_edited_time": "2023-04-09T06:03:00.000Z",
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
                "content": "Product B",
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
              "plain_text": "Product B",
              "href": null
            }
          ],
          "is_toggleable": false,
          "color": "default"
        }
      },
      {
        "object": "block",
        "id": "6d5f0b3f-fd01-4c77-bd29-4594315b0299",
        "parent": {
          "type": "page_id",
          "page_id": "7fc90a1d-ca4d-49ad-91b5-136c3d5a304d"
        },
        "created_time": "2023-04-09T06:03:00.000Z",
        "last_edited_time": "2023-04-09T06:03:00.000Z",
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
                "content": "about product B",
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
              "plain_text": "about product B",
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
  .get(`/blocks/${pageIds[1]}/children`)
  .query({ page_size: 100 })
  .reply(200, {
    "object": "list",
    "results": [
      {
        "object": "block",
        "id": "b51a74cd-7627-4485-b046-75c1ddd490da",
        "parent": {
          "type": "page_id",
          "page_id": "1cec47af-3e5f-4382-bbfd-cd5f98effa30"
        },
        "created_time": "2023-04-09T05:50:00.000Z",
        "last_edited_time": "2023-04-09T06:03:00.000Z",
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
                "content": "Product A",
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
              "plain_text": "Product A",
              "href": null
            }
          ],
          "is_toggleable": false,
          "color": "default"
        }
      },
      {
        "object": "block",
        "id": "5fcc45ad-283b-4e1c-aa3d-56286b5b75a3",
        "parent": {
          "type": "page_id",
          "page_id": "1cec47af-3e5f-4382-bbfd-cd5f98effa30"
        },
        "created_time": "2023-04-09T05:56:00.000Z",
        "last_edited_time": "2023-04-09T06:03:00.000Z",
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
                "content": "about product A",
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
              "plain_text": "about product A",
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
  .query({ page_size: 100 })
  .reply(200, {
    "object": "list",
    "results": [
      {
        "object": "block",
        "id": "ebf8bcb5-f819-41d5-b97b-0075672f7ddc",
        "parent": {
          "type": "page_id",
          "page_id": "b194a437-262e-482c-92b2-c5581eb5b477"
        },
        "created_time": "2023-04-09T05:50:00.000Z",
        "last_edited_time": "2023-04-09T05:56:00.000Z",
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
                "content": "Product Categories",
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
              "plain_text": "Product Categories",
              "href": null
            }
          ],
          "is_toggleable": false,
          "color": "default"
        }
      },
      {
        "object": "block",
        "id": "dd77693a-1580-4f27-95e1-67a6cd1d9e3a",
        "parent": {
          "type": "page_id",
          "page_id": "b194a437-262e-482c-92b2-c5581eb5b477"
        },
        "created_time": "2023-04-09T05:56:00.000Z",
        "last_edited_time": "2023-04-09T05:56:00.000Z",
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
                "content": "about product categories",
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
              "plain_text": "about product categories",
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
  .query({ page_size: 100 })
  .reply(200, {
    "object": "list",
    "results": [
      {
        "object": "block",
        "id": "0907be1b-593b-47c8-93ac-f27f263119e8",
        "parent": {
          "type": "page_id",
          "page_id": "163bc39b-ffa6-4d88-84f5-cb73fa4a705a"
        },
        "created_time": "2023-04-09T05:45:00.000Z",
        "last_edited_time": "2023-04-09T05:45:00.000Z",
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
        "id": "125f2adb-2154-4c1b-a6a4-eba8f92bda8b",
        "parent": {
          "type": "page_id",
          "page_id": "163bc39b-ffa6-4d88-84f5-cb73fa4a705a"
        },
        "created_time": "2023-04-09T05:55:00.000Z",
        "last_edited_time": "2023-04-09T05:55:00.000Z",
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
                "content": "about the team",
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
              "plain_text": "about the team",
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
  .get(`/blocks/${pageIds[4]}/children`)
  .query({ page_size: 100 })
  .reply(200, {
    "object": "list",
    "results": [
      {
        "object": "block",
        "id": "f835a203-0dab-4a3d-8f89-02c5e9404d43",
        "parent": {
          "type": "page_id",
          "page_id": "dd5157a6-cf4c-4a51-8da5-0da83ef641ae"
        },
        "created_time": "2023-04-09T05:45:00.000Z",
        "last_edited_time": "2023-04-09T05:56:00.000Z",
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
                "content": "Products",
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
              "plain_text": "Products",
              "href": null
            }
          ],
          "is_toggleable": false,
          "color": "default"
        }
      },
      {
        "object": "block",
        "id": "16a97a8d-5b38-484f-8d98-1ce03ee03b1b",
        "parent": {
          "type": "page_id",
          "page_id": "dd5157a6-cf4c-4a51-8da5-0da83ef641ae"
        },
        "created_time": "2023-04-09T05:56:00.000Z",
        "last_edited_time": "2023-04-09T05:56:00.000Z",
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
                "content": "about products",
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
              "plain_text": "about products",
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
