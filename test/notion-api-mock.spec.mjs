import nock from 'nock'

const notionDatabaseId = '610627a9-28b1-4477-b660-c00c5364435b'
const notionKitchenSinkDatabaseId = '21608fc7-c1c5-40a1-908f-9ade89585111'

const baseUrl = 'https://api.notion.com/v1'

const pageIds = [
  '7fc90a1d-ca4d-49ad-91b5-136c3d5a304d',
  '1cec47af-3e5f-4382-bbfd-cd5f98effa30',
  'b194a437-262e-482c-92b2-c5581eb5b477',
  '163bc39b-ffa6-4d88-84f5-cb73fa4a705a',
  'dd5157a6-cf4c-4a51-8da5-0da83ef641ae',
]

const kitchenSinkPageId = '35a20998-a733-4ba0-b02e-0d629ded73f1'

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
    authors: ['Jacob Milhorn'],
    tags: [],
    _notion: {
      id: '163bc39b-ffa6-4d88-84f5-cb73fa4a705a',
      last_edited_time: '2023-04-09T06:07:00.000Z',
    },
    content: { html: '<h1 id=\"team\">Team</h1>\n<p>about the team</p>\n' },
    coverImage: undefined,
    slug: 'team',
    path: '/team',
    url: '',
  },
  '/products': {
    'name': 'Products',
    '_key': '/products',
    'id': 'dd5157a6-cf4c-4a51-8da5-0da83ef641ae',
    'pid': undefined,
    'authors': [],
    'tags': [],
    '_notion': {
      id: 'dd5157a6-cf4c-4a51-8da5-0da83ef641ae',
      last_edited_time: '2023-04-09T05:56:00.000Z',
    },
    'content': { html: '<h1 id=\"products\">Products</h1>\n<p>about products</p>\n' },
    'coverImage': undefined,
    'slug': 'products',
    'path': '/products',
    'url': '',
    '/category': {
      'name': 'Category',
      '_key': '/category',
      'id': 'b194a437-262e-482c-92b2-c5581eb5b477',
      'pid': 'dd5157a6-cf4c-4a51-8da5-0da83ef641ae',
      'authors': [],
      'tags': [
        'blog',
        'notion',
        'apis',
      ],
      '_notion': {
        id: 'b194a437-262e-482c-92b2-c5581eb5b477',
        last_edited_time: '2023-04-09T06:03:00.000Z',
      },
      'content': { html: '<h2 id=\"product-categories\">Product Categories</h2>\n<p>about product categories</p>\n' },
      'coverImage': undefined,
      'slug': 'category',
      'path': '/products/category',
      'url': '',
      '/product-a': {
        name: 'Product A',
        _key: '/product-a',
        id: '1cec47af-3e5f-4382-bbfd-cd5f98effa30',
        pid: 'b194a437-262e-482c-92b2-c5581eb5b477',
        authors: ['Jacob Milhorn'],
        tags: ['programming'],
        content: { html: '<h2 id=\"product-a\">Product A</h2>\n<p>about product A</p>\n' },
        _notion: {
          id: '1cec47af-3e5f-4382-bbfd-cd5f98effa30',
          last_edited_time: '2023-04-09T06:03:00.000Z',
        },
        coverImage: undefined,
        slug: 'product-a',
        path: '/products/category/product-a',
        url: '',
      },
      '/product-b': {
        name: 'Product B',
        _key: '/product-b',
        id: '7fc90a1d-ca4d-49ad-91b5-136c3d5a304d',
        pid: 'b194a437-262e-482c-92b2-c5581eb5b477',
        authors: [],
        tags: [
          'blog',
          'notion',
          'apis',
          'programming',
          'javascript',
        ],
        content: { html: '<h2 id=\"product-b\">Product B</h2>\n<p>about product B</p>\n' },
        _notion: {
          id: '7fc90a1d-ca4d-49ad-91b5-136c3d5a304d',
          last_edited_time: '2023-04-09T06:03:00.000Z',
        },
        coverImage: undefined,
        slug: 'product-b',
        path: '/products/category/product-b',
        url: '',
      },
    },
  },
}

export const expectedTags = [
  'blog',
  'notion',
  'apis',
  'javascript',
  'programming',
]

export const expectedTagGroups = {
  blog: [
    '/products/category',
    '/products/category/product-b',
  ],
  notion: [
    '/products/category',
    '/products/category/product-b',
  ],
  apis: [
    '/products/category',
    '/products/category/product-b',
  ],
  programming: [
    '/products/category/product-b',
    '/products/category/product-a',
  ],
  javascript: [
    '/products/category/product-b',
  ],
}

export const expectedTaggedCollection = [
  {
    'name': 'Category',
    '_key': '/category',
    'id': 'b194a437-262e-482c-92b2-c5581eb5b477',
    'pid': 'dd5157a6-cf4c-4a51-8da5-0da83ef641ae',
    'authors': [],
    'tags': [
      'blog',
      'notion',
      'apis',
    ],
    '_notion': {
      id: 'b194a437-262e-482c-92b2-c5581eb5b477',
      last_edited_time: '2023-04-09T06:03:00.000Z',
    },
    'content': { html: '<h2 id=\"product-categories\">Product Categories</h2>\n<p>about product categories</p>\n' },
    'coverImage': undefined,
    'slug': 'category',
    'path': '/products/category',
    'url': '',
    '/product-a': {
      name: 'Product A',
      _key: '/product-a',
      id: '1cec47af-3e5f-4382-bbfd-cd5f98effa30',
      pid: 'b194a437-262e-482c-92b2-c5581eb5b477',
      authors: ['Jacob Milhorn'],
      tags: ['programming'],
      content: { html: '<h2 id=\"product-a\">Product A</h2>\n<p>about product A</p>\n' },
      _notion: {
        id: '1cec47af-3e5f-4382-bbfd-cd5f98effa30',
        last_edited_time: '2023-04-09T06:03:00.000Z',
      },
      coverImage: undefined,
      slug: 'product-a',
      path: '/products/category/product-a',
      url: '',
    },
    '/product-b': {
      name: 'Product B',
      _key: '/product-b',
      id: '7fc90a1d-ca4d-49ad-91b5-136c3d5a304d',
      pid: 'b194a437-262e-482c-92b2-c5581eb5b477',
      authors: [],
      tags: [
        'blog',
        'notion',
        'apis',
        'programming',
        'javascript',
      ],
      content: { html: '<h2 id=\"product-b\">Product B</h2>\n<p>about product B</p>\n' },
      _notion: {
        id: '7fc90a1d-ca4d-49ad-91b5-136c3d5a304d',
        last_edited_time: '2023-04-09T06:03:00.000Z',
      },
      coverImage: undefined,
      slug: 'product-b',
      path: '/products/category/product-b',
      url: '',
    },
  },
  {
    name: 'Product B',
    _key: '/product-b',
    id: '7fc90a1d-ca4d-49ad-91b5-136c3d5a304d',
    pid: 'b194a437-262e-482c-92b2-c5581eb5b477',
    authors: [],
    tags: [
      'blog',
      'notion',
      'apis',
      'programming',
      'javascript',
    ],
    content: { html: '<h2 id=\"product-b\">Product B</h2>\n<p>about product B</p>\n' },
    _notion: {
      id: '7fc90a1d-ca4d-49ad-91b5-136c3d5a304d',
      last_edited_time: '2023-04-09T06:03:00.000Z',
    },
    coverImage: undefined,
    slug: 'product-b',
    path: '/products/category/product-b',
    url: '',
  },
  {
    name: 'Product A',
    _key: '/product-a',
    id: '1cec47af-3e5f-4382-bbfd-cd5f98effa30',
    pid: 'b194a437-262e-482c-92b2-c5581eb5b477',
    authors: ['Jacob Milhorn'],
    tags: ['programming'],
    content: { html: '<h2 id=\"product-a\">Product A</h2>\n<p>about product A</p>\n' },
    _notion: {
      id: '1cec47af-3e5f-4382-bbfd-cd5f98effa30',
      last_edited_time: '2023-04-09T06:03:00.000Z',
    },
    coverImage: undefined,
    slug: 'product-a',
    path: '/products/category/product-a',
    url: '',
  },
]

export const expectedRejectedPageData = {
  name: 'Category',
  _key: '/category',
  id: 'b194a437-262e-482c-92b2-c5581eb5b477',
  pid: 'dd5157a6-cf4c-4a51-8da5-0da83ef641ae',
  authors: [],
  tags: [
    'blog',
    'notion',
    'apis',
  ],
  _notion: {
    id: 'b194a437-262e-482c-92b2-c5581eb5b477',
    last_edited_time: '2023-04-09T06:03:00.000Z',
  },
  content: { html: '<h2 id=\"product-categories\">Product Categories</h2>\n<p>about product categories</p>\n' },
  coverImage: undefined,
  slug: 'category',
  path: '/products/category',
  url: '',
}

export const expectedKitchenSinkSiteData = {
  '/kitchen-sink': {
    _key: '/kitchen-sink',
    id: '35a20998-a733-4ba0-b02e-0d629ded73f1',
    pid: undefined,
    _notion: {
      id: '35a20998-a733-4ba0-b02e-0d629ded73f1',
      last_edited_time: '2023-04-22T05:04:00.000Z',
    },
    name: 'Kitchen Sink',
    slug: 'kitchen-sink',
    authors: [
      'Jacob Milhorn',
    ],
    tags: [],
    coverImage: 'https://images.unsplash.com/photo-1477233534935-f5e6fe7c1159?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb',
    path: '/kitchen-sink',
    url: '',
    content: {
      html: '<h1 id="kitchen-sink">Kitchen Sink</h1>\n<h2 id="introduction">Introduction</h2>\n<p>Welcome to the Kitchen Sink document, where we showcase one of each Notion block available.</p>\n<h2 id="audio-block">Audio Block</h2>\n<p><img src="https://s3.us-west-2.amazonaws.com/secure.notion-static.com/2372979e-60dc-40f0-b9ce-978d9c7c3707/barradeen-bedtime-after-a-coffee.mp3?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20230422%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20230422T050834Z&X-Amz-Expires=3600&X-Amz-Signature=714a8f2a8463f9f36d217825797dc2b8580a278ff991ac3135ec1dcceee62e92&X-Amz-SignedHeaders=host&x-id=GetObject" alt=""></p>\n<h3 id="bulleted-list">Bulleted List</h3>\n<ul>\n<li>Item 1</li>\n<li>Item 2</li>\n<li>Item 3</li>\n</ul>\n<h2 id="callout">Callout</h2>\n<div notion-callout>\n  <span notion-callout-emoji><p>🧑🏾‍🚀</p>\n</span>\n  <span notion-callout-text><p>Callout here</p>\n</span></div>\n\n<h2 id="embeds">Embeds</h2>\n<h2 id="file">File</h2>\n<p>To be supported: <a href="https://s3.us-west-2.amazonaws.com/secure.notion-static.com/c42c0a17-06fa-4562-9824-64613d26ad37/elixir-demo.exs?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20230422%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20230422T050834Z&X-Amz-Expires=3600&X-Amz-Signature=9a595fdf829ab2af7dd146b9bceaf6e86c970170e6c01a8ef2e19f3e1da9ddf1&X-Amz-SignedHeaders=host&x-id=GetObject">https://s3.us-west-2.amazonaws.com/secure.notion-static.com/c42c0a17-06fa-4562-9824-64613d26ad37/elixir-demo.exs?X-Amz-Algorithm=AWS4-HMAC-SHA256&amp;X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&amp;X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20230422%2Fus-west-2%2Fs3%2Faws4_request&amp;X-Amz-Date=20230422T050834Z&amp;X-Amz-Expires=3600&amp;X-Amz-Signature=9a595fdf829ab2af7dd146b9bceaf6e86c970170e6c01a8ef2e19f3e1da9ddf1&amp;X-Amz-SignedHeaders=host&amp;x-id=GetObject</a> with </p>\n<h1 id="heading-1">Heading 1</h1>\n<p>This is a main heading.</p>\n<h2 id="heading-2">Heading 2</h2>\n<p>This is a subheading.</p>\n<h3 id="heading-3">Heading 3</h3>\n<p>This is a smaller subheading.</p>\n<h2 id="images">Images</h2>\n<figure notion-figure>\n  <img src=\'https://images.unsplash.com/photo-1477233534935-f5e6fe7c1159?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb\' alt=\'\'>\n  <figcaption notion-figcaption></figcaption></figure>\n\n\n<h3 id="numbered-list">Numbered List</h3>\n<ol>\n<li>First item</li>\n<li>Second item</li>\n<li>Third item</li>\n</ol>\n<h2 id="paragraph">Paragraph</h2>\n<p>This is a sample paragraph. It has nothing to do with the rest of this document, but it is here to showcase the paragraph block.</p>\n<h2 id="pdf">Pdf</h2>\n<figure>\n  <object data=\'https://s3.us-west-2.amazonaws.com/secure.notion-static.com/4abc717f-3f8a-4bdf-b482-090ca8371eab/Deep_Work.pdf?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20230422%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20230422T050834Z&X-Amz-Expires=3600&X-Amz-Signature=7d5012d5fe544ffea48bbbeecb56d768f949dee7138a4c9f8a63850b42ea2e86&X-Amz-SignedHeaders=host&x-id=GetObject\' type=\'application/pdf\'></object>\n  <figcaption></figcaption></figure>\n\n\n<h2 id="quotes">Quotes</h2>\n<blockquote>\n<p>This is a block quote.</p>\n</blockquote>\n<h2 id="to-do-list">To-do list</h2>\n<ul>\n<li><input checked="" disabled="" type="checkbox"> Completed task</li>\n<li><input disabled="" type="checkbox"> Incomplete task</li>\n</ul>\n<h2 id="toggle">Toggle</h2>\n<details><summary><p>Toggle heading</p>\n</summary><p>Toggle content</p>\n</details>\n## Video\n\n<iframe width=\'560\' height=\'315\' src=\'https://www.youtube-nocookie.com/embed/-XmImaT5TxM\' title=\'YouTube video player\' frameborder=\'0\' allow=\'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture\' allowfullscreen></iframe>\n\n<h1 id="extras">Extras</h1>\n<h2 id="tables">Tables</h2>\n<h2 id="code">Code</h2>\n<pre><code class=\'hljs language-none\'>This is a code block.\n</code></pre><h2 id="divider">Divider</h2>\n<hr>\n<h2 id="links">Links</h2>\n<p><a href="https://www.notion.so/">This is a link to Notion&#39;s website.</a></p>\n<h2 id="equation">Equation</h2>\n',
    },
  },
}

nock(baseUrl)
  .persist()
  .post(`/databases/${notionDatabaseId}/query`)
  .query(true)
  .reply(200, {
    object: 'list',
    results: [
      {
        object: 'page',
        id: '7fc90a1d-ca4d-49ad-91b5-136c3d5a304d',
        created_time: '2023-04-09T06:03:00.000Z',
        last_edited_time: '2023-04-09T06:03:00.000Z',
        created_by: {
          object: 'user',
          id: '4e38fa57-609c-4beb-8e28-271b11cc81a3',
        },
        last_edited_by: {
          object: 'user',
          id: '4e38fa57-609c-4beb-8e28-271b11cc81a3',
        },
        cover: null,
        icon: null,
        parent: {
          type: 'database_id',
          database_id: '610627a9-28b1-4477-b660-c00c5364435b',
        },
        archived: false,
        properties: {
          'parent-page': {
            id: '%3FuXy',
            type: 'relation',
            relation: [
              {
                id: 'b194a437-262e-482c-92b2-c5581eb5b477',
              },
            ],
            has_more: false,
          },
          'sub-page': {
            id: '%40KPB',
            type: 'relation',
            relation: [],
            has_more: false,
          },
          'Tags': {
            id: 'NNmP',
            type: 'multi_select',
            multi_select: [
              {
                id: '39c42409-611d-45d5-accb-3b1d05917b3a',
                name: 'blog',
                color: 'gray',
              },
              {
                id: '9d1eaabc-234f-4e1a-8812-06c286f863cd',
                name: 'notion',
                color: 'red',
              },
              {
                id: 'a37db9a6-cb20-4914-86ec-e5d0beac072d',
                name: 'apis',
                color: 'orange',
              },
              {
                id: '098acfda-2fb1-4ecf-8737-c03b80b5cb18',
                name: 'programming',
                color: 'default',
              },
              {
                id: '165eef40-7a03-468a-882e-5516b4f63af8',
                name: 'javascript',
                color: 'green',
              },
            ],
          },
          'Author': {
            id: 'SQeZ',
            type: 'people',
            people: [],
          },
          'Published': {
            id: 'frgL',
            type: 'select',
            select: {
              id: 'dFFu',
              name: 'Draft',
              color: 'green',
            },
          },
          'name': {
            id: 'title',
            type: 'title',
            title: [
              {
                type: 'text',
                text: {
                  content: 'Product B',
                  link: null,
                },
                annotations: {
                  bold: false,
                  italic: false,
                  strikethrough: false,
                  underline: false,
                  code: false,
                  color: 'default',
                },
                plain_text: 'Product B',
                href: null,
              },
            ],
          },
        },
        url: 'https://www.notion.so/Product-B-7fc90a1dca4d49ad91b5136c3d5a304d',
      },
      {
        object: 'page',
        id: '1cec47af-3e5f-4382-bbfd-cd5f98effa30',
        created_time: '2023-04-09T05:50:00.000Z',
        last_edited_time: '2023-04-09T06:03:00.000Z',
        created_by: {
          object: 'user',
          id: '4e38fa57-609c-4beb-8e28-271b11cc81a3',
        },
        last_edited_by: {
          object: 'user',
          id: '4e38fa57-609c-4beb-8e28-271b11cc81a3',
        },
        cover: null,
        icon: null,
        parent: {
          type: 'database_id',
          database_id: '610627a9-28b1-4477-b660-c00c5364435b',
        },
        archived: false,
        properties: {
          'parent-page': {
            id: '%3FuXy',
            type: 'relation',
            relation: [
              {
                id: 'b194a437-262e-482c-92b2-c5581eb5b477',
              },
            ],
            has_more: false,
          },
          'sub-page': {
            id: '%40KPB',
            type: 'relation',
            relation: [],
            has_more: false,
          },
          'Tags': {
            id: 'NNmP',
            type: 'multi_select',
            multi_select: [
              {
                id: '098acfda-2fb1-4ecf-8737-c03b80b5cb18',
                name: 'programming',
                color: 'default',
              },
            ],
          },
          'Author': {
            id: 'SQeZ',
            type: 'people',
            people: [
              {
                object: 'user',
                id: '4e38fa57-609c-4beb-8e28-271b11cc81a3',
                name: 'Jacob Milhorn',
                avatar_url: null,
                type: 'person',
                person: {
                  email: 'jacob.milhorn@gmail.com',
                },
              },
            ],
          },
          'Published': {
            id: 'frgL',
            type: 'select',
            select: {
              id: 'dFFu',
              name: 'Draft',
              color: 'green',
            },
          },
          'name': {
            id: 'title',
            type: 'title',
            title: [
              {
                type: 'text',
                text: {
                  content: 'Product A',
                  link: null,
                },
                annotations: {
                  bold: false,
                  italic: false,
                  strikethrough: false,
                  underline: false,
                  code: false,
                  color: 'default',
                },
                plain_text: 'Product A',
                href: null,
              },
            ],
          },
        },
        url: 'https://www.notion.so/Product-A-1cec47af3e5f4382bbfdcd5f98effa30',
      },
      {
        object: 'page',
        id: 'b194a437-262e-482c-92b2-c5581eb5b477',
        created_time: '2023-04-09T05:50:00.000Z',
        last_edited_time: '2023-04-09T06:03:00.000Z',
        created_by: {
          object: 'user',
          id: '4e38fa57-609c-4beb-8e28-271b11cc81a3',
        },
        last_edited_by: {
          object: 'user',
          id: '4e38fa57-609c-4beb-8e28-271b11cc81a3',
        },
        cover: null,
        icon: null,
        parent: {
          type: 'database_id',
          database_id: '610627a9-28b1-4477-b660-c00c5364435b',
        },
        archived: false,
        properties: {
          'parent-page': {
            id: '%3FuXy',
            type: 'relation',
            relation: [
              {
                id: 'dd5157a6-cf4c-4a51-8da5-0da83ef641ae',
              },
            ],
            has_more: false,
          },
          'sub-page': {
            id: '%40KPB',
            type: 'relation',
            relation: [
              {
                id: '1cec47af-3e5f-4382-bbfd-cd5f98effa30',
              },
              {
                id: '7fc90a1d-ca4d-49ad-91b5-136c3d5a304d',
              },
            ],
            has_more: false,
          },
          'Tags': {
            id: 'NNmP',
            type: 'multi_select',
            multi_select: [
              {
                id: '39c42409-611d-45d5-accb-3b1d05917b3a',
                name: 'blog',
                color: 'gray',
              },
              {
                id: '9d1eaabc-234f-4e1a-8812-06c286f863cd',
                name: 'notion',
                color: 'red',
              },
              {
                id: 'a37db9a6-cb20-4914-86ec-e5d0beac072d',
                name: 'apis',
                color: 'orange',
              },
            ],
          },
          'Author': {
            id: 'SQeZ',
            type: 'people',
            people: [],
          },
          'Published': {
            id: 'frgL',
            type: 'select',
            select: {
              id: 'dFFu',
              name: 'Draft',
              color: 'green',
            },
          },
          'name': {
            id: 'title',
            type: 'title',
            title: [
              {
                type: 'text',
                text: {
                  content: 'Category',
                  link: null,
                },
                annotations: {
                  bold: false,
                  italic: false,
                  strikethrough: false,
                  underline: false,
                  code: false,
                  color: 'default',
                },
                plain_text: 'Category',
                href: null,
              },
            ],
          },
        },
        url: 'https://www.notion.so/Category-b194a437262e482c92b2c5581eb5b477',
      },
      {
        object: 'page',
        id: '163bc39b-ffa6-4d88-84f5-cb73fa4a705a',
        created_time: '2023-04-09T05:45:00.000Z',
        last_edited_time: '2023-04-09T06:07:00.000Z',
        created_by: {
          object: 'user',
          id: '4e38fa57-609c-4beb-8e28-271b11cc81a3',
        },
        last_edited_by: {
          object: 'user',
          id: '4e38fa57-609c-4beb-8e28-271b11cc81a3',
        },
        cover: null,
        icon: null,
        parent: {
          type: 'database_id',
          database_id: '610627a9-28b1-4477-b660-c00c5364435b',
        },
        archived: false,
        properties: {
          'parent-page': {
            id: '%3FuXy',
            type: 'relation',
            relation: [],
            has_more: false,
          },
          'sub-page': {
            id: '%40KPB',
            type: 'relation',
            relation: [],
            has_more: false,
          },
          'Tags': {
            id: 'NNmP',
            type: 'multi_select',
            multi_select: [],
          },
          'Author': {
            id: 'SQeZ',
            type: 'people',
            people: [
              {
                object: 'user',
                id: '4e38fa57-609c-4beb-8e28-271b11cc81a3',
                name: 'Jacob Milhorn',
                avatar_url: null,
                type: 'person',
                person: {
                  email: 'jacob.milhorn@gmail.com',
                },
              },
            ],
          },
          'Published': {
            id: 'frgL',
            type: 'select',
            select: {
              id: 'dFFu',
              name: 'Draft',
              color: 'green',
            },
          },
          'name': {
            id: 'title',
            type: 'title',
            title: [
              {
                type: 'text',
                text: {
                  content: 'Team',
                  link: null,
                },
                annotations: {
                  bold: false,
                  italic: false,
                  strikethrough: false,
                  underline: false,
                  code: false,
                  color: 'default',
                },
                plain_text: 'Team',
                href: null,
              },
            ],
          },
        },
        url: 'https://www.notion.so/Team-163bc39bffa64d8884f5cb73fa4a705a',
      },
      {
        object: 'page',
        id: 'dd5157a6-cf4c-4a51-8da5-0da83ef641ae',
        created_time: '2023-04-09T05:45:00.000Z',
        last_edited_time: '2023-04-09T05:56:00.000Z',
        created_by: {
          object: 'user',
          id: '4e38fa57-609c-4beb-8e28-271b11cc81a3',
        },
        last_edited_by: {
          object: 'user',
          id: '4e38fa57-609c-4beb-8e28-271b11cc81a3',
        },
        cover: null,
        icon: null,
        parent: {
          type: 'database_id',
          database_id: '610627a9-28b1-4477-b660-c00c5364435b',
        },
        archived: false,
        properties: {
          'parent-page': {
            id: '%3FuXy',
            type: 'relation',
            relation: [],
            has_more: false,
          },
          'sub-page': {
            id: '%40KPB',
            type: 'relation',
            relation: [
              {
                id: 'b194a437-262e-482c-92b2-c5581eb5b477',
              },
            ],
            has_more: false,
          },
          'Tags': {
            id: 'NNmP',
            type: 'multi_select',
            multi_select: [],
          },
          'Author': {
            id: 'SQeZ',
            type: 'people',
            people: [],
          },
          'Published': {
            id: 'frgL',
            type: 'select',
            select: {
              id: 'dFFu',
              name: 'Draft',
              color: 'green',
            },
          },
          'name': {
            id: 'title',
            type: 'title',
            title: [
              {
                type: 'text',
                text: {
                  content: 'Products',
                  link: null,
                },
                annotations: {
                  bold: false,
                  italic: false,
                  strikethrough: false,
                  underline: false,
                  code: false,
                  color: 'default',
                },
                plain_text: 'Products',
                href: null,
              },
            ],
          },
        },
        url: 'https://www.notion.so/Products-dd5157a6cf4c4a518da50da83ef641ae',
      },
    ],
    next_cursor: null,
    has_more: false,
    type: 'page',
    page: {},
  })

// Kitchen Sink Response
nock(baseUrl)
  .persist()
  .post(`/databases/${notionKitchenSinkDatabaseId}/query`)
  .query(true)
  .reply(200, {
    object: 'list',
    results: [
      {
        object: 'page',
        id: '35a20998-a733-4ba0-b02e-0d629ded73f1',
        created_time: '2023-04-22T04:33:00.000Z',
        last_edited_time: '2023-04-22T05:04:00.000Z',
        created_by: {
          object: 'user',
          id: '4e38fa57-609c-4beb-8e28-271b11cc81a3',
        },
        last_edited_by: {
          object: 'user',
          id: '4e38fa57-609c-4beb-8e28-271b11cc81a3',
        },
        cover: null,
        icon: null,
        parent: {
          type: 'database_id',
          database_id: '21608fc7-c1c5-40a1-908f-9ade89585111',
        },
        archived: false,
        properties: {
          'parent-page': {
            id: '%3FuXy',
            type: 'relation',
            relation: [],
            has_more: false,
          },
          'sub-page': {
            id: '%40KPB',
            type: 'relation',
            relation: [],
            has_more: false,
          },
          'Tags': {
            id: 'NNmP',
            type: 'multi_select',
            multi_select: [],
          },
          'Author': {
            id: 'SQeZ',
            type: 'people',
            people: [
              {
                object: 'user',
                id: '4e38fa57-609c-4beb-8e28-271b11cc81a3',
                name: 'Jacob Milhorn',
                avatar_url: null,
                type: 'person',
                person: {
                  email: 'jacob.milhorn@gmail.com',
                },
              },
            ],
          },
          'Published': {
            id: 'frgL',
            type: 'select',
            select: {
              id: '|]Pp',
              name: 'Published',
              color: 'default',
            },
          },
          'name': {
            id: 'title',
            type: 'title',
            title: [
              {
                type: 'text',
                text: {
                  content: 'Kitchen Sink',
                  link: null,
                },
                annotations: {
                  bold: false,
                  italic: false,
                  strikethrough: false,
                  underline: false,
                  code: false,
                  color: 'default',
                },
                plain_text: 'Kitchen Sink',
                href: null,
              },
            ],
          },
        },
        url: 'https://www.notion.so/Kitchen-Sink-35a20998a7334ba0b02e0d629ded73f1',
      },
    ],
    next_cursor: null,
    has_more: false,
    type: 'page',
    page: {},
    developer_survey: 'https://notionup.typeform.com/to/bllBsoI4?utm_source=insomnia',
  })

// Block Children Queries

// Kitchen Sink Blocks
nock(baseUrl)
  .persist()
  .get(`/blocks/${kitchenSinkPageId}/children`)
  .query(true)
  .reply(200, {
    object: 'list',
    results: [
      {
        object: 'block',
        id: '1c92a5ea-dfeb-4c8f-b662-cde078bb02ad',
        parent: {
          type: 'page_id',
          page_id: '35a20998-a733-4ba0-b02e-0d629ded73f1',
        },
        created_time: '2023-04-22T04:34:00.000Z',
        last_edited_time: '2023-04-22T04:34:00.000Z',
        created_by: {
          object: 'user',
          id: '4e38fa57-609c-4beb-8e28-271b11cc81a3',
        },
        last_edited_by: {
          object: 'user',
          id: '4e38fa57-609c-4beb-8e28-271b11cc81a3',
        },
        has_children: false,
        archived: false,
        type: 'heading_1',
        heading_1: {
          rich_text: [
            {
              type: 'text',
              text: {
                content: 'Kitchen Sink',
                link: null,
              },
              annotations: {
                bold: false,
                italic: false,
                strikethrough: false,
                underline: false,
                code: false,
                color: 'default',
              },
              plain_text: 'Kitchen Sink',
              href: null,
            },
          ],
          is_toggleable: false,
          color: 'default',
        },
      },
      {
        object: 'block',
        id: '644a181a-ec65-4f4b-954b-9196e5f0ca93',
        parent: {
          type: 'page_id',
          page_id: '35a20998-a733-4ba0-b02e-0d629ded73f1',
        },
        created_time: '2023-04-22T04:34:00.000Z',
        last_edited_time: '2023-04-22T04:34:00.000Z',
        created_by: {
          object: 'user',
          id: '4e38fa57-609c-4beb-8e28-271b11cc81a3',
        },
        last_edited_by: {
          object: 'user',
          id: '4e38fa57-609c-4beb-8e28-271b11cc81a3',
        },
        has_children: false,
        archived: false,
        type: 'heading_2',
        heading_2: {
          rich_text: [
            {
              type: 'text',
              text: {
                content: 'Introduction',
                link: null,
              },
              annotations: {
                bold: false,
                italic: false,
                strikethrough: false,
                underline: false,
                code: false,
                color: 'default',
              },
              plain_text: 'Introduction',
              href: null,
            },
          ],
          is_toggleable: false,
          color: 'default',
        },
      },
      {
        object: 'block',
        id: '1173cbc2-a28a-40e2-8409-4a778f77cf91',
        parent: {
          type: 'page_id',
          page_id: '35a20998-a733-4ba0-b02e-0d629ded73f1',
        },
        created_time: '2023-04-22T04:34:00.000Z',
        last_edited_time: '2023-04-22T04:34:00.000Z',
        created_by: {
          object: 'user',
          id: '4e38fa57-609c-4beb-8e28-271b11cc81a3',
        },
        last_edited_by: {
          object: 'user',
          id: '4e38fa57-609c-4beb-8e28-271b11cc81a3',
        },
        has_children: false,
        archived: false,
        type: 'paragraph',
        paragraph: {
          rich_text: [
            {
              type: 'text',
              text: {
                content: 'Welcome to the Kitchen Sink document, where we showcase one of each Notion block available.',
                link: null,
              },
              annotations: {
                bold: false,
                italic: false,
                strikethrough: false,
                underline: false,
                code: false,
                color: 'default',
              },
              plain_text: 'Welcome to the Kitchen Sink document, where we showcase one of each Notion block available.',
              href: null,
            },
          ],
          color: 'default',
        },
      },
      {
        object: 'block',
        id: '203dc733-0a55-4b32-9541-95330a2959a5',
        parent: {
          type: 'page_id',
          page_id: '35a20998-a733-4ba0-b02e-0d629ded73f1',
        },
        created_time: '2023-04-22T04:53:00.000Z',
        last_edited_time: '2023-04-22T04:53:00.000Z',
        created_by: {
          object: 'user',
          id: '4e38fa57-609c-4beb-8e28-271b11cc81a3',
        },
        last_edited_by: {
          object: 'user',
          id: '4e38fa57-609c-4beb-8e28-271b11cc81a3',
        },
        has_children: false,
        archived: false,
        type: 'heading_2',
        heading_2: {
          rich_text: [
            {
              type: 'text',
              text: {
                content: 'Audio Block',
                link: null,
              },
              annotations: {
                bold: false,
                italic: false,
                strikethrough: false,
                underline: false,
                code: false,
                color: 'default',
              },
              plain_text: 'Audio Block',
              href: null,
            },
          ],
          is_toggleable: false,
          color: 'default',
        },
      },
      {
        object: 'block',
        id: 'e5bffb21-be1b-4e92-b1c8-a16520e08747',
        parent: {
          type: 'page_id',
          page_id: '35a20998-a733-4ba0-b02e-0d629ded73f1',
        },
        created_time: '2023-04-22T04:51:00.000Z',
        last_edited_time: '2023-04-22T04:52:00.000Z',
        created_by: {
          object: 'user',
          id: '4e38fa57-609c-4beb-8e28-271b11cc81a3',
        },
        last_edited_by: {
          object: 'user',
          id: '4e38fa57-609c-4beb-8e28-271b11cc81a3',
        },
        has_children: false,
        archived: false,
        type: 'audio',
        audio: {
          caption: [],
          type: 'file',
          file: {
            url: 'https://s3.us-west-2.amazonaws.com/secure.notion-static.com/2372979e-60dc-40f0-b9ce-978d9c7c3707/barradeen-bedtime-after-a-coffee.mp3?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20230422%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20230422T050834Z&X-Amz-Expires=3600&X-Amz-Signature=714a8f2a8463f9f36d217825797dc2b8580a278ff991ac3135ec1dcceee62e92&X-Amz-SignedHeaders=host&x-id=GetObject',
            expiry_time: '2023-04-22T06:08:34.426Z',
          },
        },
      },
      {
        object: 'block',
        id: '33c0202c-e2a4-4700-8b70-3c4d65a28f6e',
        parent: {
          type: 'page_id',
          page_id: '35a20998-a733-4ba0-b02e-0d629ded73f1',
        },
        created_time: '2023-04-22T04:34:00.000Z',
        last_edited_time: '2023-04-22T04:54:00.000Z',
        created_by: {
          object: 'user',
          id: '4e38fa57-609c-4beb-8e28-271b11cc81a3',
        },
        last_edited_by: {
          object: 'user',
          id: '4e38fa57-609c-4beb-8e28-271b11cc81a3',
        },
        has_children: false,
        archived: false,
        type: 'heading_3',
        heading_3: {
          rich_text: [
            {
              type: 'text',
              text: {
                content: 'Bulleted List',
                link: null,
              },
              annotations: {
                bold: false,
                italic: false,
                strikethrough: false,
                underline: false,
                code: false,
                color: 'default',
              },
              plain_text: 'Bulleted List',
              href: null,
            },
          ],
          is_toggleable: false,
          color: 'default',
        },
      },
      {
        object: 'block',
        id: '70ced692-4660-45e1-b353-293e98c3312e',
        parent: {
          type: 'page_id',
          page_id: '35a20998-a733-4ba0-b02e-0d629ded73f1',
        },
        created_time: '2023-04-22T04:34:00.000Z',
        last_edited_time: '2023-04-22T04:54:00.000Z',
        created_by: {
          object: 'user',
          id: '4e38fa57-609c-4beb-8e28-271b11cc81a3',
        },
        last_edited_by: {
          object: 'user',
          id: '4e38fa57-609c-4beb-8e28-271b11cc81a3',
        },
        has_children: false,
        archived: false,
        type: 'bulleted_list_item',
        bulleted_list_item: {
          rich_text: [
            {
              type: 'text',
              text: {
                content: 'Item 1',
                link: null,
              },
              annotations: {
                bold: false,
                italic: false,
                strikethrough: false,
                underline: false,
                code: false,
                color: 'default',
              },
              plain_text: 'Item 1',
              href: null,
            },
          ],
          color: 'default',
        },
      },
      {
        object: 'block',
        id: '98fce499-d6aa-4951-bfbb-cfeabe04de94',
        parent: {
          type: 'page_id',
          page_id: '35a20998-a733-4ba0-b02e-0d629ded73f1',
        },
        created_time: '2023-04-22T04:54:00.000Z',
        last_edited_time: '2023-04-22T04:54:00.000Z',
        created_by: {
          object: 'user',
          id: '4e38fa57-609c-4beb-8e28-271b11cc81a3',
        },
        last_edited_by: {
          object: 'user',
          id: '4e38fa57-609c-4beb-8e28-271b11cc81a3',
        },
        has_children: false,
        archived: false,
        type: 'bulleted_list_item',
        bulleted_list_item: {
          rich_text: [
            {
              type: 'text',
              text: {
                content: 'Item 2',
                link: null,
              },
              annotations: {
                bold: false,
                italic: false,
                strikethrough: false,
                underline: false,
                code: false,
                color: 'default',
              },
              plain_text: 'Item 2',
              href: null,
            },
          ],
          color: 'default',
        },
      },
      {
        object: 'block',
        id: 'dcf46a2a-d27b-4a9f-8cc4-9e0ffeb51443',
        parent: {
          type: 'page_id',
          page_id: '35a20998-a733-4ba0-b02e-0d629ded73f1',
        },
        created_time: '2023-04-22T04:34:00.000Z',
        last_edited_time: '2023-04-22T04:54:00.000Z',
        created_by: {
          object: 'user',
          id: '4e38fa57-609c-4beb-8e28-271b11cc81a3',
        },
        last_edited_by: {
          object: 'user',
          id: '4e38fa57-609c-4beb-8e28-271b11cc81a3',
        },
        has_children: false,
        archived: false,
        type: 'bulleted_list_item',
        bulleted_list_item: {
          rich_text: [
            {
              type: 'text',
              text: {
                content: 'Item 3',
                link: null,
              },
              annotations: {
                bold: false,
                italic: false,
                strikethrough: false,
                underline: false,
                code: false,
                color: 'default',
              },
              plain_text: 'Item 3',
              href: null,
            },
          ],
          color: 'default',
        },
      },
      {
        object: 'block',
        id: '73668a29-3a89-447f-bf2b-e06d739b1f9a',
        parent: {
          type: 'page_id',
          page_id: '35a20998-a733-4ba0-b02e-0d629ded73f1',
        },
        created_time: '2023-04-22T04:34:00.000Z',
        last_edited_time: '2023-04-22T04:54:00.000Z',
        created_by: {
          object: 'user',
          id: '4e38fa57-609c-4beb-8e28-271b11cc81a3',
        },
        last_edited_by: {
          object: 'user',
          id: '4e38fa57-609c-4beb-8e28-271b11cc81a3',
        },
        has_children: false,
        archived: false,
        type: 'heading_2',
        heading_2: {
          rich_text: [
            {
              type: 'text',
              text: {
                content: 'Callout',
                link: null,
              },
              annotations: {
                bold: false,
                italic: false,
                strikethrough: false,
                underline: false,
                code: false,
                color: 'default',
              },
              plain_text: 'Callout',
              href: null,
            },
          ],
          is_toggleable: false,
          color: 'default',
        },
      },
      {
        object: 'block',
        id: '8e7cad16-c9c3-4f43-8ff2-ba562f8ac450',
        parent: {
          type: 'page_id',
          page_id: '35a20998-a733-4ba0-b02e-0d629ded73f1',
        },
        created_time: '2023-04-22T04:49:00.000Z',
        last_edited_time: '2023-04-22T04:54:00.000Z',
        created_by: {
          object: 'user',
          id: '4e38fa57-609c-4beb-8e28-271b11cc81a3',
        },
        last_edited_by: {
          object: 'user',
          id: '4e38fa57-609c-4beb-8e28-271b11cc81a3',
        },
        has_children: false,
        archived: false,
        type: 'callout',
        callout: {
          rich_text: [
            {
              type: 'text',
              text: {
                content: 'Callout here',
                link: null,
              },
              annotations: {
                bold: false,
                italic: false,
                strikethrough: false,
                underline: false,
                code: false,
                color: 'default',
              },
              plain_text: 'Callout here',
              href: null,
            },
          ],
          icon: {
            type: 'emoji',
            emoji: '🧑🏾‍🚀',
          },
          color: 'gray_background',
        },
      },
      {
        object: 'block',
        id: 'ccf2cc60-e572-4e56-a761-9017f75c1b77',
        parent: {
          type: 'page_id',
          page_id: '35a20998-a733-4ba0-b02e-0d629ded73f1',
        },
        created_time: '2023-04-22T04:34:00.000Z',
        last_edited_time: '2023-04-22T04:55:00.000Z',
        created_by: {
          object: 'user',
          id: '4e38fa57-609c-4beb-8e28-271b11cc81a3',
        },
        last_edited_by: {
          object: 'user',
          id: '4e38fa57-609c-4beb-8e28-271b11cc81a3',
        },
        has_children: false,
        archived: false,
        type: 'heading_2',
        heading_2: {
          rich_text: [
            {
              type: 'text',
              text: {
                content: 'Embeds',
                link: null,
              },
              annotations: {
                bold: false,
                italic: false,
                strikethrough: false,
                underline: false,
                code: false,
                color: 'default',
              },
              plain_text: 'Embeds',
              href: null,
            },
          ],
          is_toggleable: false,
          color: 'default',
        },
      },
      {
        object: 'block',
        id: '2c53e751-975a-4f08-9135-c4713608d6e8',
        parent: {
          type: 'page_id',
          page_id: '35a20998-a733-4ba0-b02e-0d629ded73f1',
        },
        created_time: '2023-04-22T04:48:00.000Z',
        last_edited_time: '2023-04-22T04:55:00.000Z',
        created_by: {
          object: 'user',
          id: '4e38fa57-609c-4beb-8e28-271b11cc81a3',
        },
        last_edited_by: {
          object: 'user',
          id: '4e38fa57-609c-4beb-8e28-271b11cc81a3',
        },
        has_children: false,
        archived: false,
        type: 'bookmark',
        bookmark: {
          caption: [],
          url: 'http://notion.so',
        },
      },
      {
        object: 'block',
        id: '70e77e9f-9281-4c39-8740-7f4ceaad4894',
        parent: {
          type: 'page_id',
          page_id: '35a20998-a733-4ba0-b02e-0d629ded73f1',
        },
        created_time: '2023-04-22T04:56:00.000Z',
        last_edited_time: '2023-04-22T04:56:00.000Z',
        created_by: {
          object: 'user',
          id: '4e38fa57-609c-4beb-8e28-271b11cc81a3',
        },
        last_edited_by: {
          object: 'user',
          id: '4e38fa57-609c-4beb-8e28-271b11cc81a3',
        },
        has_children: false,
        archived: false,
        type: 'heading_2',
        heading_2: {
          rich_text: [
            {
              type: 'text',
              text: {
                content: 'File',
                link: null,
              },
              annotations: {
                bold: false,
                italic: false,
                strikethrough: false,
                underline: false,
                code: false,
                color: 'default',
              },
              plain_text: 'File',
              href: null,
            },
          ],
          is_toggleable: false,
          color: 'default',
        },
      },
      {
        object: 'block',
        id: '6ce7cfe3-5dc8-4ff0-98c7-76f70542ce02',
        parent: {
          type: 'page_id',
          page_id: '35a20998-a733-4ba0-b02e-0d629ded73f1',
        },
        created_time: '2023-04-22T04:55:00.000Z',
        last_edited_time: '2023-04-22T04:57:00.000Z',
        created_by: {
          object: 'user',
          id: '4e38fa57-609c-4beb-8e28-271b11cc81a3',
        },
        last_edited_by: {
          object: 'user',
          id: '4e38fa57-609c-4beb-8e28-271b11cc81a3',
        },
        has_children: false,
        archived: false,
        type: 'file',
        file: {
          caption: [],
          type: 'file',
          file: {
            url: 'https://s3.us-west-2.amazonaws.com/secure.notion-static.com/c42c0a17-06fa-4562-9824-64613d26ad37/elixir-demo.exs?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20230422%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20230422T050834Z&X-Amz-Expires=3600&X-Amz-Signature=9a595fdf829ab2af7dd146b9bceaf6e86c970170e6c01a8ef2e19f3e1da9ddf1&X-Amz-SignedHeaders=host&x-id=GetObject',
            expiry_time: '2023-04-22T06:08:34.426Z',
          },
        },
      },
      {
        object: 'block',
        id: '7d905dc6-ee5b-4610-8636-96c8771cedf0',
        parent: {
          type: 'page_id',
          page_id: '35a20998-a733-4ba0-b02e-0d629ded73f1',
        },
        created_time: '2023-04-22T04:57:00.000Z',
        last_edited_time: '2023-04-22T04:58:00.000Z',
        created_by: {
          object: 'user',
          id: '4e38fa57-609c-4beb-8e28-271b11cc81a3',
        },
        last_edited_by: {
          object: 'user',
          id: '4e38fa57-609c-4beb-8e28-271b11cc81a3',
        },
        has_children: false,
        archived: false,
        type: 'heading_1',
        heading_1: {
          rich_text: [
            {
              type: 'text',
              text: {
                content: 'Heading 1',
                link: null,
              },
              annotations: {
                bold: false,
                italic: false,
                strikethrough: false,
                underline: false,
                code: false,
                color: 'default',
              },
              plain_text: 'Heading 1',
              href: null,
            },
          ],
          is_toggleable: false,
          color: 'default',
        },
      },
      {
        object: 'block',
        id: '3ea9ac0a-7fad-47ca-bcb9-152ffc5ad340',
        parent: {
          type: 'page_id',
          page_id: '35a20998-a733-4ba0-b02e-0d629ded73f1',
        },
        created_time: '2023-04-22T04:58:00.000Z',
        last_edited_time: '2023-04-22T04:58:00.000Z',
        created_by: {
          object: 'user',
          id: '4e38fa57-609c-4beb-8e28-271b11cc81a3',
        },
        last_edited_by: {
          object: 'user',
          id: '4e38fa57-609c-4beb-8e28-271b11cc81a3',
        },
        has_children: false,
        archived: false,
        type: 'paragraph',
        paragraph: {
          rich_text: [
            {
              type: 'text',
              text: {
                content: 'This is a main heading.',
                link: null,
              },
              annotations: {
                bold: false,
                italic: false,
                strikethrough: false,
                underline: false,
                code: false,
                color: 'default',
              },
              plain_text: 'This is a main heading.',
              href: null,
            },
          ],
          color: 'default',
        },
      },
      {
        object: 'block',
        id: 'ae7beb1c-36f3-4103-bbd4-a870fa914525',
        parent: {
          type: 'page_id',
          page_id: '35a20998-a733-4ba0-b02e-0d629ded73f1',
        },
        created_time: '2023-04-22T04:34:00.000Z',
        last_edited_time: '2023-04-22T04:58:00.000Z',
        created_by: {
          object: 'user',
          id: '4e38fa57-609c-4beb-8e28-271b11cc81a3',
        },
        last_edited_by: {
          object: 'user',
          id: '4e38fa57-609c-4beb-8e28-271b11cc81a3',
        },
        has_children: false,
        archived: false,
        type: 'heading_2',
        heading_2: {
          rich_text: [
            {
              type: 'text',
              text: {
                content: 'Heading 2',
                link: null,
              },
              annotations: {
                bold: false,
                italic: false,
                strikethrough: false,
                underline: false,
                code: false,
                color: 'default',
              },
              plain_text: 'Heading 2',
              href: null,
            },
          ],
          is_toggleable: false,
          color: 'default',
        },
      },
      {
        object: 'block',
        id: 'c081da61-c469-473b-8ad7-090c3a5c1bd5',
        parent: {
          type: 'page_id',
          page_id: '35a20998-a733-4ba0-b02e-0d629ded73f1',
        },
        created_time: '2023-04-22T04:34:00.000Z',
        last_edited_time: '2023-04-22T04:34:00.000Z',
        created_by: {
          object: 'user',
          id: '4e38fa57-609c-4beb-8e28-271b11cc81a3',
        },
        last_edited_by: {
          object: 'user',
          id: '4e38fa57-609c-4beb-8e28-271b11cc81a3',
        },
        has_children: false,
        archived: false,
        type: 'paragraph',
        paragraph: {
          rich_text: [
            {
              type: 'text',
              text: {
                content: 'This is a subheading.',
                link: null,
              },
              annotations: {
                bold: false,
                italic: false,
                strikethrough: false,
                underline: false,
                code: false,
                color: 'default',
              },
              plain_text: 'This is a subheading.',
              href: null,
            },
          ],
          color: 'default',
        },
      },
      {
        object: 'block',
        id: 'e6c6dd20-a24b-41f9-a0a6-bd6d8cbec502',
        parent: {
          type: 'page_id',
          page_id: '35a20998-a733-4ba0-b02e-0d629ded73f1',
        },
        created_time: '2023-04-22T04:34:00.000Z',
        last_edited_time: '2023-04-22T04:58:00.000Z',
        created_by: {
          object: 'user',
          id: '4e38fa57-609c-4beb-8e28-271b11cc81a3',
        },
        last_edited_by: {
          object: 'user',
          id: '4e38fa57-609c-4beb-8e28-271b11cc81a3',
        },
        has_children: false,
        archived: false,
        type: 'heading_3',
        heading_3: {
          rich_text: [
            {
              type: 'text',
              text: {
                content: 'Heading 3',
                link: null,
              },
              annotations: {
                bold: false,
                italic: false,
                strikethrough: false,
                underline: false,
                code: false,
                color: 'default',
              },
              plain_text: 'Heading 3',
              href: null,
            },
          ],
          is_toggleable: false,
          color: 'default',
        },
      },
      {
        object: 'block',
        id: '8ea74483-d7ba-4acc-abfd-0472161751c0',
        parent: {
          type: 'page_id',
          page_id: '35a20998-a733-4ba0-b02e-0d629ded73f1',
        },
        created_time: '2023-04-22T04:34:00.000Z',
        last_edited_time: '2023-04-22T04:34:00.000Z',
        created_by: {
          object: 'user',
          id: '4e38fa57-609c-4beb-8e28-271b11cc81a3',
        },
        last_edited_by: {
          object: 'user',
          id: '4e38fa57-609c-4beb-8e28-271b11cc81a3',
        },
        has_children: false,
        archived: false,
        type: 'paragraph',
        paragraph: {
          rich_text: [
            {
              type: 'text',
              text: {
                content: 'This is a smaller subheading.',
                link: null,
              },
              annotations: {
                bold: false,
                italic: false,
                strikethrough: false,
                underline: false,
                code: false,
                color: 'default',
              },
              plain_text: 'This is a smaller subheading.',
              href: null,
            },
          ],
          color: 'default',
        },
      },
      {
        object: 'block',
        id: '8448cc20-a7df-44b2-9ab5-1a08202cad35',
        parent: {
          type: 'page_id',
          page_id: '35a20998-a733-4ba0-b02e-0d629ded73f1',
        },
        created_time: '2023-04-22T04:34:00.000Z',
        last_edited_time: '2023-04-22T04:58:00.000Z',
        created_by: {
          object: 'user',
          id: '4e38fa57-609c-4beb-8e28-271b11cc81a3',
        },
        last_edited_by: {
          object: 'user',
          id: '4e38fa57-609c-4beb-8e28-271b11cc81a3',
        },
        has_children: false,
        archived: false,
        type: 'heading_2',
        heading_2: {
          rich_text: [
            {
              type: 'text',
              text: {
                content: 'Images',
                link: null,
              },
              annotations: {
                bold: false,
                italic: false,
                strikethrough: false,
                underline: false,
                code: false,
                color: 'default',
              },
              plain_text: 'Images',
              href: null,
            },
          ],
          is_toggleable: false,
          color: 'default',
        },
      },
      {
        object: 'block',
        id: '0fdb2edf-3bfc-494e-81b3-be141d547e5f',
        parent: {
          type: 'page_id',
          page_id: '35a20998-a733-4ba0-b02e-0d629ded73f1',
        },
        created_time: '2023-04-22T04:34:00.000Z',
        last_edited_time: '2023-04-22T04:58:00.000Z',
        created_by: {
          object: 'user',
          id: '4e38fa57-609c-4beb-8e28-271b11cc81a3',
        },
        last_edited_by: {
          object: 'user',
          id: '4e38fa57-609c-4beb-8e28-271b11cc81a3',
        },
        has_children: false,
        archived: false,
        type: 'image',
        image: {
          caption: [],
          type: 'external',
          external: {
            url: 'https://images.unsplash.com/photo-1477233534935-f5e6fe7c1159?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb',
          },
        },
      },
      {
        object: 'block',
        id: '25bb32ec-fffd-4cde-8a64-1beb0a712dd4',
        parent: {
          type: 'page_id',
          page_id: '35a20998-a733-4ba0-b02e-0d629ded73f1',
        },
        created_time: '2023-04-22T04:34:00.000Z',
        last_edited_time: '2023-04-22T04:34:00.000Z',
        created_by: {
          object: 'user',
          id: '4e38fa57-609c-4beb-8e28-271b11cc81a3',
        },
        last_edited_by: {
          object: 'user',
          id: '4e38fa57-609c-4beb-8e28-271b11cc81a3',
        },
        has_children: false,
        archived: false,
        type: 'heading_3',
        heading_3: {
          rich_text: [
            {
              type: 'text',
              text: {
                content: 'Numbered List',
                link: null,
              },
              annotations: {
                bold: false,
                italic: false,
                strikethrough: false,
                underline: false,
                code: false,
                color: 'default',
              },
              plain_text: 'Numbered List',
              href: null,
            },
          ],
          is_toggleable: false,
          color: 'default',
        },
      },
      {
        object: 'block',
        id: '66997c55-0d83-4d81-af51-50011bc3719c',
        parent: {
          type: 'page_id',
          page_id: '35a20998-a733-4ba0-b02e-0d629ded73f1',
        },
        created_time: '2023-04-22T04:34:00.000Z',
        last_edited_time: '2023-04-22T04:34:00.000Z',
        created_by: {
          object: 'user',
          id: '4e38fa57-609c-4beb-8e28-271b11cc81a3',
        },
        last_edited_by: {
          object: 'user',
          id: '4e38fa57-609c-4beb-8e28-271b11cc81a3',
        },
        has_children: false,
        archived: false,
        type: 'numbered_list_item',
        numbered_list_item: {
          rich_text: [
            {
              type: 'text',
              text: {
                content: 'First item',
                link: null,
              },
              annotations: {
                bold: false,
                italic: false,
                strikethrough: false,
                underline: false,
                code: false,
                color: 'default',
              },
              plain_text: 'First item',
              href: null,
            },
          ],
          color: 'default',
        },
      },
      {
        object: 'block',
        id: '4b89040f-d963-43bb-b6f2-83a18613221e',
        parent: {
          type: 'page_id',
          page_id: '35a20998-a733-4ba0-b02e-0d629ded73f1',
        },
        created_time: '2023-04-22T04:34:00.000Z',
        last_edited_time: '2023-04-22T04:34:00.000Z',
        created_by: {
          object: 'user',
          id: '4e38fa57-609c-4beb-8e28-271b11cc81a3',
        },
        last_edited_by: {
          object: 'user',
          id: '4e38fa57-609c-4beb-8e28-271b11cc81a3',
        },
        has_children: false,
        archived: false,
        type: 'numbered_list_item',
        numbered_list_item: {
          rich_text: [
            {
              type: 'text',
              text: {
                content: 'Second item',
                link: null,
              },
              annotations: {
                bold: false,
                italic: false,
                strikethrough: false,
                underline: false,
                code: false,
                color: 'default',
              },
              plain_text: 'Second item',
              href: null,
            },
          ],
          color: 'default',
        },
      },
      {
        object: 'block',
        id: '4fe55d9e-b639-4926-b464-2183493d898b',
        parent: {
          type: 'page_id',
          page_id: '35a20998-a733-4ba0-b02e-0d629ded73f1',
        },
        created_time: '2023-04-22T04:34:00.000Z',
        last_edited_time: '2023-04-22T04:59:00.000Z',
        created_by: {
          object: 'user',
          id: '4e38fa57-609c-4beb-8e28-271b11cc81a3',
        },
        last_edited_by: {
          object: 'user',
          id: '4e38fa57-609c-4beb-8e28-271b11cc81a3',
        },
        has_children: false,
        archived: false,
        type: 'numbered_list_item',
        numbered_list_item: {
          rich_text: [
            {
              type: 'text',
              text: {
                content: 'Third item',
                link: null,
              },
              annotations: {
                bold: false,
                italic: false,
                strikethrough: false,
                underline: false,
                code: false,
                color: 'default',
              },
              plain_text: 'Third item',
              href: null,
            },
          ],
          color: 'default',
        },
      },
      {
        object: 'block',
        id: 'b9f320ea-c670-4ce4-81f7-d1924b1b69af',
        parent: {
          type: 'page_id',
          page_id: '35a20998-a733-4ba0-b02e-0d629ded73f1',
        },
        created_time: '2023-04-22T04:58:00.000Z',
        last_edited_time: '2023-04-22T04:59:00.000Z',
        created_by: {
          object: 'user',
          id: '4e38fa57-609c-4beb-8e28-271b11cc81a3',
        },
        last_edited_by: {
          object: 'user',
          id: '4e38fa57-609c-4beb-8e28-271b11cc81a3',
        },
        has_children: false,
        archived: false,
        type: 'heading_2',
        heading_2: {
          rich_text: [
            {
              type: 'text',
              text: {
                content: 'Paragraph',
                link: null,
              },
              annotations: {
                bold: false,
                italic: false,
                strikethrough: false,
                underline: false,
                code: false,
                color: 'default',
              },
              plain_text: 'Paragraph',
              href: null,
            },
          ],
          is_toggleable: false,
          color: 'default',
        },
      },
      {
        object: 'block',
        id: '70faf1fd-c58e-4306-b2e8-a56082a437d1',
        parent: {
          type: 'page_id',
          page_id: '35a20998-a733-4ba0-b02e-0d629ded73f1',
        },
        created_time: '2023-04-22T04:59:00.000Z',
        last_edited_time: '2023-04-22T05:00:00.000Z',
        created_by: {
          object: 'user',
          id: '4e38fa57-609c-4beb-8e28-271b11cc81a3',
        },
        last_edited_by: {
          object: 'user',
          id: '4e38fa57-609c-4beb-8e28-271b11cc81a3',
        },
        has_children: false,
        archived: false,
        type: 'paragraph',
        paragraph: {
          rich_text: [
            {
              type: 'text',
              text: {
                content: 'This is a sample paragraph. It has nothing to do with the rest of this document, but it is here to showcase the paragraph block.',
                link: null,
              },
              annotations: {
                bold: false,
                italic: false,
                strikethrough: false,
                underline: false,
                code: false,
                color: 'default',
              },
              plain_text: 'This is a sample paragraph. It has nothing to do with the rest of this document, but it is here to showcase the paragraph block.',
              href: null,
            },
          ],
          color: 'default',
        },
      },
      {
        object: 'block',
        id: 'fd5cad06-8e2e-425d-9b4e-138afde8cf0e',
        parent: {
          type: 'page_id',
          page_id: '35a20998-a733-4ba0-b02e-0d629ded73f1',
        },
        created_time: '2023-04-22T04:59:00.000Z',
        last_edited_time: '2023-04-22T05:00:00.000Z',
        created_by: {
          object: 'user',
          id: '4e38fa57-609c-4beb-8e28-271b11cc81a3',
        },
        last_edited_by: {
          object: 'user',
          id: '4e38fa57-609c-4beb-8e28-271b11cc81a3',
        },
        has_children: false,
        archived: false,
        type: 'heading_2',
        heading_2: {
          rich_text: [
            {
              type: 'text',
              text: {
                content: 'Pdf',
                link: null,
              },
              annotations: {
                bold: false,
                italic: false,
                strikethrough: false,
                underline: false,
                code: false,
                color: 'default',
              },
              plain_text: 'Pdf',
              href: null,
            },
          ],
          is_toggleable: false,
          color: 'default',
        },
      },
      {
        object: 'block',
        id: '9fd4698a-4e76-4a1c-8e7b-a013c85dd475',
        parent: {
          type: 'page_id',
          page_id: '35a20998-a733-4ba0-b02e-0d629ded73f1',
        },
        created_time: '2023-04-22T04:59:00.000Z',
        last_edited_time: '2023-04-22T05:00:00.000Z',
        created_by: {
          object: 'user',
          id: '4e38fa57-609c-4beb-8e28-271b11cc81a3',
        },
        last_edited_by: {
          object: 'user',
          id: '4e38fa57-609c-4beb-8e28-271b11cc81a3',
        },
        has_children: false,
        archived: false,
        type: 'pdf',
        pdf: {
          caption: [],
          type: 'file',
          file: {
            url: 'https://s3.us-west-2.amazonaws.com/secure.notion-static.com/4abc717f-3f8a-4bdf-b482-090ca8371eab/Deep_Work.pdf?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20230422%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20230422T050834Z&X-Amz-Expires=3600&X-Amz-Signature=7d5012d5fe544ffea48bbbeecb56d768f949dee7138a4c9f8a63850b42ea2e86&X-Amz-SignedHeaders=host&x-id=GetObject',
            expiry_time: '2023-04-22T06:08:34.417Z',
          },
        },
      },
      {
        object: 'block',
        id: '1bdd5623-30dd-410a-8865-2a822907f180',
        parent: {
          type: 'page_id',
          page_id: '35a20998-a733-4ba0-b02e-0d629ded73f1',
        },
        created_time: '2023-04-22T04:34:00.000Z',
        last_edited_time: '2023-04-22T05:00:00.000Z',
        created_by: {
          object: 'user',
          id: '4e38fa57-609c-4beb-8e28-271b11cc81a3',
        },
        last_edited_by: {
          object: 'user',
          id: '4e38fa57-609c-4beb-8e28-271b11cc81a3',
        },
        has_children: false,
        archived: false,
        type: 'heading_2',
        heading_2: {
          rich_text: [
            {
              type: 'text',
              text: {
                content: 'Quotes',
                link: null,
              },
              annotations: {
                bold: false,
                italic: false,
                strikethrough: false,
                underline: false,
                code: false,
                color: 'default',
              },
              plain_text: 'Quotes',
              href: null,
            },
          ],
          is_toggleable: false,
          color: 'default',
        },
      },
      {
        object: 'block',
        id: '24bc67cb-e1a8-408d-ac2b-28a8de7e5a48',
        parent: {
          type: 'page_id',
          page_id: '35a20998-a733-4ba0-b02e-0d629ded73f1',
        },
        created_time: '2023-04-22T04:34:00.000Z',
        last_edited_time: '2023-04-22T05:02:00.000Z',
        created_by: {
          object: 'user',
          id: '4e38fa57-609c-4beb-8e28-271b11cc81a3',
        },
        last_edited_by: {
          object: 'user',
          id: '4e38fa57-609c-4beb-8e28-271b11cc81a3',
        },
        has_children: false,
        archived: false,
        type: 'quote',
        quote: {
          rich_text: [
            {
              type: 'text',
              text: {
                content: 'This is a block quote.',
                link: null,
              },
              annotations: {
                bold: false,
                italic: false,
                strikethrough: false,
                underline: false,
                code: false,
                color: 'default',
              },
              plain_text: 'This is a block quote.',
              href: null,
            },
          ],
          color: 'default',
        },
      },
      {
        object: 'block',
        id: 'dfe9d55b-eb15-463a-8893-02615c83c069',
        parent: {
          type: 'page_id',
          page_id: '35a20998-a733-4ba0-b02e-0d629ded73f1',
        },
        created_time: '2023-04-22T04:34:00.000Z',
        last_edited_time: '2023-04-22T05:02:00.000Z',
        created_by: {
          object: 'user',
          id: '4e38fa57-609c-4beb-8e28-271b11cc81a3',
        },
        last_edited_by: {
          object: 'user',
          id: '4e38fa57-609c-4beb-8e28-271b11cc81a3',
        },
        has_children: false,
        archived: false,
        type: 'heading_2',
        heading_2: {
          rich_text: [
            {
              type: 'text',
              text: {
                content: 'To-do list',
                link: null,
              },
              annotations: {
                bold: false,
                italic: false,
                strikethrough: false,
                underline: false,
                code: false,
                color: 'default',
              },
              plain_text: 'To-do list',
              href: null,
            },
          ],
          is_toggleable: false,
          color: 'default',
        },
      },
      {
        object: 'block',
        id: '83579363-4afb-4b52-9e1c-427dac9ba8fd',
        parent: {
          type: 'page_id',
          page_id: '35a20998-a733-4ba0-b02e-0d629ded73f1',
        },
        created_time: '2023-04-22T04:34:00.000Z',
        last_edited_time: '2023-04-22T05:02:00.000Z',
        created_by: {
          object: 'user',
          id: '4e38fa57-609c-4beb-8e28-271b11cc81a3',
        },
        last_edited_by: {
          object: 'user',
          id: '4e38fa57-609c-4beb-8e28-271b11cc81a3',
        },
        has_children: false,
        archived: false,
        type: 'to_do',
        to_do: {
          rich_text: [
            {
              type: 'text',
              text: {
                content: 'Completed task',
                link: null,
              },
              annotations: {
                bold: false,
                italic: false,
                strikethrough: false,
                underline: false,
                code: false,
                color: 'default',
              },
              plain_text: 'Completed task',
              href: null,
            },
          ],
          checked: true,
          color: 'default',
        },
      },
      {
        object: 'block',
        id: '22930a4e-8c76-4a34-b4e5-e716851c57ec',
        parent: {
          type: 'page_id',
          page_id: '35a20998-a733-4ba0-b02e-0d629ded73f1',
        },
        created_time: '2023-04-22T04:34:00.000Z',
        last_edited_time: '2023-04-22T05:02:00.000Z',
        created_by: {
          object: 'user',
          id: '4e38fa57-609c-4beb-8e28-271b11cc81a3',
        },
        last_edited_by: {
          object: 'user',
          id: '4e38fa57-609c-4beb-8e28-271b11cc81a3',
        },
        has_children: false,
        archived: false,
        type: 'to_do',
        to_do: {
          rich_text: [
            {
              type: 'text',
              text: {
                content: 'Incomplete task',
                link: null,
              },
              annotations: {
                bold: false,
                italic: false,
                strikethrough: false,
                underline: false,
                code: false,
                color: 'default',
              },
              plain_text: 'Incomplete task',
              href: null,
            },
          ],
          checked: false,
          color: 'default',
        },
      },
      {
        object: 'block',
        id: 'a76b18aa-d7f7-4453-af04-7922bd936107',
        parent: {
          type: 'page_id',
          page_id: '35a20998-a733-4ba0-b02e-0d629ded73f1',
        },
        created_time: '2023-04-22T04:34:00.000Z',
        last_edited_time: '2023-04-22T05:02:00.000Z',
        created_by: {
          object: 'user',
          id: '4e38fa57-609c-4beb-8e28-271b11cc81a3',
        },
        last_edited_by: {
          object: 'user',
          id: '4e38fa57-609c-4beb-8e28-271b11cc81a3',
        },
        has_children: false,
        archived: false,
        type: 'heading_2',
        heading_2: {
          rich_text: [
            {
              type: 'text',
              text: {
                content: 'Toggle',
                link: null,
              },
              annotations: {
                bold: false,
                italic: false,
                strikethrough: false,
                underline: false,
                code: false,
                color: 'default',
              },
              plain_text: 'Toggle',
              href: null,
            },
          ],
          is_toggleable: false,
          color: 'default',
        },
      },
      {
        object: 'block',
        id: '150eabf8-b9e6-47a7-96e8-9db3f17b5af2',
        parent: {
          type: 'page_id',
          page_id: '35a20998-a733-4ba0-b02e-0d629ded73f1',
        },
        created_time: '2023-04-22T04:34:00.000Z',
        last_edited_time: '2023-04-22T05:03:00.000Z',
        created_by: {
          object: 'user',
          id: '4e38fa57-609c-4beb-8e28-271b11cc81a3',
        },
        last_edited_by: {
          object: 'user',
          id: '4e38fa57-609c-4beb-8e28-271b11cc81a3',
        },
        has_children: true,
        archived: false,
        type: 'toggle',
        toggle: {
          rich_text: [
            {
              type: 'text',
              text: {
                content: 'Toggle heading',
                link: null,
              },
              annotations: {
                bold: false,
                italic: false,
                strikethrough: false,
                underline: false,
                code: false,
                color: 'default',
              },
              plain_text: 'Toggle heading',
              href: null,
            },
          ],
          color: 'default',
        },
      },
      {
        object: 'block',
        id: '15009060-620d-479b-abb8-30d58bbd2f1a',
        parent: {
          type: 'page_id',
          page_id: '35a20998-a733-4ba0-b02e-0d629ded73f1',
        },
        created_time: '2023-04-22T05:03:00.000Z',
        last_edited_time: '2023-04-22T05:03:00.000Z',
        created_by: {
          object: 'user',
          id: '4e38fa57-609c-4beb-8e28-271b11cc81a3',
        },
        last_edited_by: {
          object: 'user',
          id: '4e38fa57-609c-4beb-8e28-271b11cc81a3',
        },
        has_children: false,
        archived: false,
        type: 'heading_2',
        heading_2: {
          rich_text: [
            {
              type: 'text',
              text: {
                content: 'Video',
                link: null,
              },
              annotations: {
                bold: false,
                italic: false,
                strikethrough: false,
                underline: false,
                code: false,
                color: 'default',
              },
              plain_text: 'Video',
              href: null,
            },
          ],
          is_toggleable: false,
          color: 'default',
        },
      },
      {
        object: 'block',
        id: '4c4c1ffd-28a2-4d47-bb4f-bda743167ddd',
        parent: {
          type: 'page_id',
          page_id: '35a20998-a733-4ba0-b02e-0d629ded73f1',
        },
        created_time: '2023-04-22T05:02:00.000Z',
        last_edited_time: '2023-04-22T05:03:00.000Z',
        created_by: {
          object: 'user',
          id: '4e38fa57-609c-4beb-8e28-271b11cc81a3',
        },
        last_edited_by: {
          object: 'user',
          id: '4e38fa57-609c-4beb-8e28-271b11cc81a3',
        },
        has_children: false,
        archived: false,
        type: 'video',
        video: {
          caption: [],
          type: 'external',
          external: {
            url: 'https://www.youtube.com/watch?v=-XmImaT5TxM',
          },
        },
      },
      {
        object: 'block',
        id: '6f04395b-70e0-4e9a-824f-c90925888cb8',
        parent: {
          type: 'page_id',
          page_id: '35a20998-a733-4ba0-b02e-0d629ded73f1',
        },
        created_time: '2023-04-22T04:33:00.000Z',
        last_edited_time: '2023-04-22T05:02:00.000Z',
        created_by: {
          object: 'user',
          id: '4e38fa57-609c-4beb-8e28-271b11cc81a3',
        },
        last_edited_by: {
          object: 'user',
          id: '4e38fa57-609c-4beb-8e28-271b11cc81a3',
        },
        has_children: false,
        archived: false,
        type: 'heading_1',
        heading_1: {
          rich_text: [
            {
              type: 'text',
              text: {
                content: 'Extras',
                link: null,
              },
              annotations: {
                bold: false,
                italic: false,
                strikethrough: false,
                underline: false,
                code: false,
                color: 'default',
              },
              plain_text: 'Extras',
              href: null,
            },
          ],
          is_toggleable: false,
          color: 'default',
        },
      },
      {
        object: 'block',
        id: 'fc27637b-5408-4e7c-8cce-8d4f86aabfe8',
        parent: {
          type: 'page_id',
          page_id: '35a20998-a733-4ba0-b02e-0d629ded73f1',
        },
        created_time: '2023-04-22T04:34:00.000Z',
        last_edited_time: '2023-04-22T05:01:00.000Z',
        created_by: {
          object: 'user',
          id: '4e38fa57-609c-4beb-8e28-271b11cc81a3',
        },
        last_edited_by: {
          object: 'user',
          id: '4e38fa57-609c-4beb-8e28-271b11cc81a3',
        },
        has_children: false,
        archived: false,
        type: 'heading_2',
        heading_2: {
          rich_text: [
            {
              type: 'text',
              text: {
                content: 'Tables',
                link: null,
              },
              annotations: {
                bold: false,
                italic: false,
                strikethrough: false,
                underline: false,
                code: false,
                color: 'default',
              },
              plain_text: 'Tables',
              href: null,
            },
          ],
          is_toggleable: false,
          color: 'default',
        },
      },
      {
        object: 'block',
        id: '4d6d646c-b236-4b52-a40e-399f87a5c89f',
        parent: {
          type: 'page_id',
          page_id: '35a20998-a733-4ba0-b02e-0d629ded73f1',
        },
        created_time: '2023-04-22T04:34:00.000Z',
        last_edited_time: '2023-04-22T04:34:00.000Z',
        created_by: {
          object: 'user',
          id: '4e38fa57-609c-4beb-8e28-271b11cc81a3',
        },
        last_edited_by: {
          object: 'user',
          id: '4e38fa57-609c-4beb-8e28-271b11cc81a3',
        },
        has_children: true,
        archived: false,
        type: 'table',
        table: {
          table_width: 3,
          has_column_header: false,
          has_row_header: false,
        },
      },
      {
        object: 'block',
        id: '8b15ccd9-8200-46eb-bfa9-31cc86502138',
        parent: {
          type: 'page_id',
          page_id: '35a20998-a733-4ba0-b02e-0d629ded73f1',
        },
        created_time: '2023-04-22T04:34:00.000Z',
        last_edited_time: '2023-04-22T04:34:00.000Z',
        created_by: {
          object: 'user',
          id: '4e38fa57-609c-4beb-8e28-271b11cc81a3',
        },
        last_edited_by: {
          object: 'user',
          id: '4e38fa57-609c-4beb-8e28-271b11cc81a3',
        },
        has_children: false,
        archived: false,
        type: 'heading_2',
        heading_2: {
          rich_text: [
            {
              type: 'text',
              text: {
                content: 'Code',
                link: null,
              },
              annotations: {
                bold: false,
                italic: false,
                strikethrough: false,
                underline: false,
                code: false,
                color: 'default',
              },
              plain_text: 'Code',
              href: null,
            },
          ],
          is_toggleable: false,
          color: 'default',
        },
      },
      {
        object: 'block',
        id: 'f8894210-9696-4f6f-8b03-9d6228d7ca2e',
        parent: {
          type: 'page_id',
          page_id: '35a20998-a733-4ba0-b02e-0d629ded73f1',
        },
        created_time: '2023-04-22T04:34:00.000Z',
        last_edited_time: '2023-04-22T04:34:00.000Z',
        created_by: {
          object: 'user',
          id: '4e38fa57-609c-4beb-8e28-271b11cc81a3',
        },
        last_edited_by: {
          object: 'user',
          id: '4e38fa57-609c-4beb-8e28-271b11cc81a3',
        },
        has_children: false,
        archived: false,
        type: 'code',
        code: {
          caption: [],
          rich_text: [
            {
              type: 'text',
              text: {
                content: 'This is a code block.\n',
                link: null,
              },
              annotations: {
                bold: false,
                italic: false,
                strikethrough: false,
                underline: false,
                code: false,
                color: 'default',
              },
              plain_text: 'This is a code block.\n',
              href: null,
            },
          ],
          language: 'plain text',
        },
      },
      {
        object: 'block',
        id: 'f9196d85-ed6a-4e66-9e4a-e06649c82eb1',
        parent: {
          type: 'page_id',
          page_id: '35a20998-a733-4ba0-b02e-0d629ded73f1',
        },
        created_time: '2023-04-22T04:34:00.000Z',
        last_edited_time: '2023-04-22T04:34:00.000Z',
        created_by: {
          object: 'user',
          id: '4e38fa57-609c-4beb-8e28-271b11cc81a3',
        },
        last_edited_by: {
          object: 'user',
          id: '4e38fa57-609c-4beb-8e28-271b11cc81a3',
        },
        has_children: false,
        archived: false,
        type: 'heading_2',
        heading_2: {
          rich_text: [
            {
              type: 'text',
              text: {
                content: 'Divider',
                link: null,
              },
              annotations: {
                bold: false,
                italic: false,
                strikethrough: false,
                underline: false,
                code: false,
                color: 'default',
              },
              plain_text: 'Divider',
              href: null,
            },
          ],
          is_toggleable: false,
          color: 'default',
        },
      },
      {
        object: 'block',
        id: '0ec6df58-042f-4d5a-b9e7-12f29bbcadaa',
        parent: {
          type: 'page_id',
          page_id: '35a20998-a733-4ba0-b02e-0d629ded73f1',
        },
        created_time: '2023-04-22T04:34:00.000Z',
        last_edited_time: '2023-04-22T04:34:00.000Z',
        created_by: {
          object: 'user',
          id: '4e38fa57-609c-4beb-8e28-271b11cc81a3',
        },
        last_edited_by: {
          object: 'user',
          id: '4e38fa57-609c-4beb-8e28-271b11cc81a3',
        },
        has_children: false,
        archived: false,
        type: 'divider',
        divider: {},
      },
      {
        object: 'block',
        id: 'd7aa833d-9696-4fe0-b8de-d8140c9ec45e',
        parent: {
          type: 'page_id',
          page_id: '35a20998-a733-4ba0-b02e-0d629ded73f1',
        },
        created_time: '2023-04-22T04:34:00.000Z',
        last_edited_time: '2023-04-22T04:34:00.000Z',
        created_by: {
          object: 'user',
          id: '4e38fa57-609c-4beb-8e28-271b11cc81a3',
        },
        last_edited_by: {
          object: 'user',
          id: '4e38fa57-609c-4beb-8e28-271b11cc81a3',
        },
        has_children: false,
        archived: false,
        type: 'heading_2',
        heading_2: {
          rich_text: [
            {
              type: 'text',
              text: {
                content: 'Links',
                link: null,
              },
              annotations: {
                bold: false,
                italic: false,
                strikethrough: false,
                underline: false,
                code: false,
                color: 'default',
              },
              plain_text: 'Links',
              href: null,
            },
          ],
          is_toggleable: false,
          color: 'default',
        },
      },
      {
        object: 'block',
        id: 'f735c8ef-16aa-46c1-993a-660401ec68cb',
        parent: {
          type: 'page_id',
          page_id: '35a20998-a733-4ba0-b02e-0d629ded73f1',
        },
        created_time: '2023-04-22T04:34:00.000Z',
        last_edited_time: '2023-04-22T04:34:00.000Z',
        created_by: {
          object: 'user',
          id: '4e38fa57-609c-4beb-8e28-271b11cc81a3',
        },
        last_edited_by: {
          object: 'user',
          id: '4e38fa57-609c-4beb-8e28-271b11cc81a3',
        },
        has_children: false,
        archived: false,
        type: 'paragraph',
        paragraph: {
          rich_text: [
            {
              type: 'text',
              text: {
                content: 'This is a link to Notion\'s website.',
                link: {
                  url: 'https://www.notion.so/',
                },
              },
              annotations: {
                bold: false,
                italic: false,
                strikethrough: false,
                underline: false,
                code: false,
                color: 'default',
              },
              plain_text: 'This is a link to Notion\'s website.',
              href: 'https://www.notion.so/',
            },
          ],
          color: 'default',
        },
      },
      {
        object: 'block',
        id: '3ab413cf-eb50-40cf-a7de-8124be31c12f',
        parent: {
          type: 'page_id',
          page_id: '35a20998-a733-4ba0-b02e-0d629ded73f1',
        },
        created_time: '2023-04-22T04:34:00.000Z',
        last_edited_time: '2023-04-22T04:34:00.000Z',
        created_by: {
          object: 'user',
          id: '4e38fa57-609c-4beb-8e28-271b11cc81a3',
        },
        last_edited_by: {
          object: 'user',
          id: '4e38fa57-609c-4beb-8e28-271b11cc81a3',
        },
        has_children: false,
        archived: false,
        type: 'heading_2',
        heading_2: {
          rich_text: [
            {
              type: 'text',
              text: {
                content: 'Equation',
                link: null,
              },
              annotations: {
                bold: false,
                italic: false,
                strikethrough: false,
                underline: false,
                code: false,
                color: 'default',
              },
              plain_text: 'Equation',
              href: null,
            },
          ],
          is_toggleable: false,
          color: 'default',
        },
      },
      {
        object: 'block',
        id: 'f16d5090-f1ea-40c4-ad08-f6b795367113',
        parent: {
          type: 'page_id',
          page_id: '35a20998-a733-4ba0-b02e-0d629ded73f1',
        },
        created_time: '2023-04-22T04:49:00.000Z',
        last_edited_time: '2023-04-22T04:50:00.000Z',
        created_by: {
          object: 'user',
          id: '4e38fa57-609c-4beb-8e28-271b11cc81a3',
        },
        last_edited_by: {
          object: 'user',
          id: '4e38fa57-609c-4beb-8e28-271b11cc81a3',
        },
        has_children: false,
        archived: false,
        type: 'equation',
        equation: {
          expression: '(a+b)^n=a^n+{n \\choose 1}a^{n-1}b+{n \\choose 2}a^{n-2}b^2 + \\cdots + {n \\choose r}a^{n-r}b^r + \\cdots + b^n',
        },
      },
    ],
    next_cursor: null,
    has_more: false,
    type: 'block',
    block: {},
    developer_survey: 'https://notionup.typeform.com/to/bllBsoI4?utm_source=insomnia',
  })

// Kitchen Sink children blocks
nock(baseUrl)
  .persist()
  .get(`/blocks/${'150eabf8-b9e6-47a7-96e8-9db3f17b5af2'}/children`)
  .query(true)
  .reply(200, {
    object: 'list',
    results: [
      {
        object: 'block',
        id: '5d6e8f49-bea3-4ba7-974f-924c98768d6a',
        parent: {
          type: 'block_id',
          block_id: '150eabf8-b9e6-47a7-96e8-9db3f17b5af2',
        },
        created_time: '2023-04-22T04:51:00.000Z',
        last_edited_time: '2023-04-22T04:51:00.000Z',
        created_by: {
          object: 'user',
          id: '4e38fa57-609c-4beb-8e28-271b11cc81a3',
        },
        last_edited_by: {
          object: 'user',
          id: '4e38fa57-609c-4beb-8e28-271b11cc81a3',
        },
        has_children: false,
        archived: false,
        type: 'paragraph',
        paragraph: {
          rich_text: [
            {
              type: 'text',
              text: {
                content: 'Toggle content',
                link: null,
              },
              annotations: {
                bold: false,
                italic: false,
                strikethrough: false,
                underline: false,
                code: false,
                color: 'default',
              },
              plain_text: 'Toggle content',
              href: null,
            },
          ],
          color: 'default',
        },
      },
    ],
    next_cursor: null,
    has_more: false,
    type: 'block',
    block: {},
    developer_survey: 'https://notionup.typeform.com/to/bllBsoI4?utm_source=insomnia',
  })

// Kitchen Sink children blocks
nock(baseUrl)
  .persist()
  .get(`/blocks/${'4d6d646c-b236-4b52-a40e-399f87a5c89f'}/children`)
  .query(true)
  .reply(200, {
    object: 'list',
    results: [
      {
        object: 'block',
        id: 'a3c6065c-401a-43bc-b374-f8f292618ef6',
        parent: {
          type: 'block_id',
          block_id: '4d6d646c-b236-4b52-a40e-399f87a5c89f',
        },
        created_time: '2023-04-22T04:34:00.000Z',
        last_edited_time: '2023-04-22T04:34:00.000Z',
        created_by: {
          object: 'user',
          id: '4e38fa57-609c-4beb-8e28-271b11cc81a3',
        },
        last_edited_by: {
          object: 'user',
          id: '4e38fa57-609c-4beb-8e28-271b11cc81a3',
        },
        has_children: false,
        archived: false,
        type: 'table_row',
        table_row: {
          cells: [
            [
              {
                type: 'text',
                text: {
                  content: 'Column 1',
                  link: null,
                },
                annotations: {
                  bold: false,
                  italic: false,
                  strikethrough: false,
                  underline: false,
                  code: false,
                  color: 'default',
                },
                plain_text: 'Column 1',
                href: null,
              },
            ],
            [
              {
                type: 'text',
                text: {
                  content: 'Column 2',
                  link: null,
                },
                annotations: {
                  bold: false,
                  italic: false,
                  strikethrough: false,
                  underline: false,
                  code: false,
                  color: 'default',
                },
                plain_text: 'Column 2',
                href: null,
              },
            ],
            [
              {
                type: 'text',
                text: {
                  content: 'Column 3',
                  link: null,
                },
                annotations: {
                  bold: false,
                  italic: false,
                  strikethrough: false,
                  underline: false,
                  code: false,
                  color: 'default',
                },
                plain_text: 'Column 3',
                href: null,
              },
            ],
          ],
        },
      },
      {
        object: 'block',
        id: 'b54a3c90-19de-47ee-9eff-a9d7cb8cbe82',
        parent: {
          type: 'block_id',
          block_id: '4d6d646c-b236-4b52-a40e-399f87a5c89f',
        },
        created_time: '2023-04-22T04:34:00.000Z',
        last_edited_time: '2023-04-22T04:34:00.000Z',
        created_by: {
          object: 'user',
          id: '4e38fa57-609c-4beb-8e28-271b11cc81a3',
        },
        last_edited_by: {
          object: 'user',
          id: '4e38fa57-609c-4beb-8e28-271b11cc81a3',
        },
        has_children: false,
        archived: false,
        type: 'table_row',
        table_row: {
          cells: [
            [
              {
                type: 'text',
                text: {
                  content: 'Row 1, Column 1',
                  link: null,
                },
                annotations: {
                  bold: false,
                  italic: false,
                  strikethrough: false,
                  underline: false,
                  code: false,
                  color: 'default',
                },
                plain_text: 'Row 1, Column 1',
                href: null,
              },
            ],
            [
              {
                type: 'text',
                text: {
                  content: 'Row 1, Column 2',
                  link: null,
                },
                annotations: {
                  bold: false,
                  italic: false,
                  strikethrough: false,
                  underline: false,
                  code: false,
                  color: 'default',
                },
                plain_text: 'Row 1, Column 2',
                href: null,
              },
            ],
            [
              {
                type: 'text',
                text: {
                  content: 'Row 1, Column 3',
                  link: null,
                },
                annotations: {
                  bold: false,
                  italic: false,
                  strikethrough: false,
                  underline: false,
                  code: false,
                  color: 'default',
                },
                plain_text: 'Row 1, Column 3',
                href: null,
              },
            ],
          ],
        },
      },
      {
        object: 'block',
        id: 'b311d987-e18e-479d-8783-dc66ec88ffe6',
        parent: {
          type: 'block_id',
          block_id: '4d6d646c-b236-4b52-a40e-399f87a5c89f',
        },
        created_time: '2023-04-22T04:34:00.000Z',
        last_edited_time: '2023-04-22T04:34:00.000Z',
        created_by: {
          object: 'user',
          id: '4e38fa57-609c-4beb-8e28-271b11cc81a3',
        },
        last_edited_by: {
          object: 'user',
          id: '4e38fa57-609c-4beb-8e28-271b11cc81a3',
        },
        has_children: false,
        archived: false,
        type: 'table_row',
        table_row: {
          cells: [
            [
              {
                type: 'text',
                text: {
                  content: 'Row 2, Column 1',
                  link: null,
                },
                annotations: {
                  bold: false,
                  italic: false,
                  strikethrough: false,
                  underline: false,
                  code: false,
                  color: 'default',
                },
                plain_text: 'Row 2, Column 1',
                href: null,
              },
            ],
            [
              {
                type: 'text',
                text: {
                  content: 'Row 2, Column 2',
                  link: null,
                },
                annotations: {
                  bold: false,
                  italic: false,
                  strikethrough: false,
                  underline: false,
                  code: false,
                  color: 'default',
                },
                plain_text: 'Row 2, Column 2',
                href: null,
              },
            ],
            [
              {
                type: 'text',
                text: {
                  content: 'Row 2, Column 3',
                  link: null,
                },
                annotations: {
                  bold: false,
                  italic: false,
                  strikethrough: false,
                  underline: false,
                  code: false,
                  color: 'default',
                },
                plain_text: 'Row 2, Column 3',
                href: null,
              },
            ],
          ],
        },
      },
    ],
    next_cursor: null,
    has_more: false,
    type: 'block',
    block: {},
    developer_survey: 'https://notionup.typeform.com/to/bllBsoI4?utm_source=insomnia',
  })

// All others
nock(baseUrl)
  .persist()
  .get(`/blocks/${pageIds[0]}/children`)
  .query(true)
  .reply(200, {
    object: 'list',
    results: [
      {
        object: 'block',
        id: 'c2b84e62-6f89-45f6-ae1e-15d4f1cce6c2',
        parent: {
          type: 'page_id',
          page_id: '7fc90a1d-ca4d-49ad-91b5-136c3d5a304d',
        },
        created_time: '2023-04-09T06:03:00.000Z',
        last_edited_time: '2023-04-09T06:03:00.000Z',
        created_by: {
          object: 'user',
          id: '4e38fa57-609c-4beb-8e28-271b11cc81a3',
        },
        last_edited_by: {
          object: 'user',
          id: '4e38fa57-609c-4beb-8e28-271b11cc81a3',
        },
        has_children: false,
        archived: false,
        type: 'heading_2',
        heading_2: {
          rich_text: [
            {
              type: 'text',
              text: {
                content: 'Product B',
                link: null,
              },
              annotations: {
                bold: false,
                italic: false,
                strikethrough: false,
                underline: false,
                code: false,
                color: 'default',
              },
              plain_text: 'Product B',
              href: null,
            },
          ],
          is_toggleable: false,
          color: 'default',
        },
      },
      {
        object: 'block',
        id: '6d5f0b3f-fd01-4c77-bd29-4594315b0299',
        parent: {
          type: 'page_id',
          page_id: '7fc90a1d-ca4d-49ad-91b5-136c3d5a304d',
        },
        created_time: '2023-04-09T06:03:00.000Z',
        last_edited_time: '2023-04-09T06:03:00.000Z',
        created_by: {
          object: 'user',
          id: '4e38fa57-609c-4beb-8e28-271b11cc81a3',
        },
        last_edited_by: {
          object: 'user',
          id: '4e38fa57-609c-4beb-8e28-271b11cc81a3',
        },
        has_children: false,
        archived: false,
        type: 'paragraph',
        paragraph: {
          rich_text: [
            {
              type: 'text',
              text: {
                content: 'about product B',
                link: null,
              },
              annotations: {
                bold: false,
                italic: false,
                strikethrough: false,
                underline: false,
                code: false,
                color: 'default',
              },
              plain_text: 'about product B',
              href: null,
            },
          ],
          color: 'default',
        },
      },
    ],
    next_cursor: null,
    has_more: false,
    type: 'block',
    block: {},
  })

nock(baseUrl)
  .persist()
  .get(`/blocks/${pageIds[1]}/children`)
  .query(true)
  .reply(200, {
    object: 'list',
    results: [
      {
        object: 'block',
        id: 'b51a74cd-7627-4485-b046-75c1ddd490da',
        parent: {
          type: 'page_id',
          page_id: '1cec47af-3e5f-4382-bbfd-cd5f98effa30',
        },
        created_time: '2023-04-09T05:50:00.000Z',
        last_edited_time: '2023-04-09T06:03:00.000Z',
        created_by: {
          object: 'user',
          id: '4e38fa57-609c-4beb-8e28-271b11cc81a3',
        },
        last_edited_by: {
          object: 'user',
          id: '4e38fa57-609c-4beb-8e28-271b11cc81a3',
        },
        has_children: false,
        archived: false,
        type: 'heading_2',
        heading_2: {
          rich_text: [
            {
              type: 'text',
              text: {
                content: 'Product A',
                link: null,
              },
              annotations: {
                bold: false,
                italic: false,
                strikethrough: false,
                underline: false,
                code: false,
                color: 'default',
              },
              plain_text: 'Product A',
              href: null,
            },
          ],
          is_toggleable: false,
          color: 'default',
        },
      },
      {
        object: 'block',
        id: '5fcc45ad-283b-4e1c-aa3d-56286b5b75a3',
        parent: {
          type: 'page_id',
          page_id: '1cec47af-3e5f-4382-bbfd-cd5f98effa30',
        },
        created_time: '2023-04-09T05:56:00.000Z',
        last_edited_time: '2023-04-09T06:03:00.000Z',
        created_by: {
          object: 'user',
          id: '4e38fa57-609c-4beb-8e28-271b11cc81a3',
        },
        last_edited_by: {
          object: 'user',
          id: '4e38fa57-609c-4beb-8e28-271b11cc81a3',
        },
        has_children: false,
        archived: false,
        type: 'paragraph',
        paragraph: {
          rich_text: [
            {
              type: 'text',
              text: {
                content: 'about product A',
                link: null,
              },
              annotations: {
                bold: false,
                italic: false,
                strikethrough: false,
                underline: false,
                code: false,
                color: 'default',
              },
              plain_text: 'about product A',
              href: null,
            },
          ],
          color: 'default',
        },
      },
    ],
    next_cursor: null,
    has_more: false,
    type: 'block',
    block: {},
  })

nock(baseUrl)
  .persist()
  .get(`/blocks/${pageIds[2]}/children`)
  .query(true)
  .reply(200, {
    object: 'list',
    results: [
      {
        object: 'block',
        id: 'ebf8bcb5-f819-41d5-b97b-0075672f7ddc',
        parent: {
          type: 'page_id',
          page_id: 'b194a437-262e-482c-92b2-c5581eb5b477',
        },
        created_time: '2023-04-09T05:50:00.000Z',
        last_edited_time: '2023-04-09T05:56:00.000Z',
        created_by: {
          object: 'user',
          id: '4e38fa57-609c-4beb-8e28-271b11cc81a3',
        },
        last_edited_by: {
          object: 'user',
          id: '4e38fa57-609c-4beb-8e28-271b11cc81a3',
        },
        has_children: false,
        archived: false,
        type: 'heading_2',
        heading_2: {
          rich_text: [
            {
              type: 'text',
              text: {
                content: 'Product Categories',
                link: null,
              },
              annotations: {
                bold: false,
                italic: false,
                strikethrough: false,
                underline: false,
                code: false,
                color: 'default',
              },
              plain_text: 'Product Categories',
              href: null,
            },
          ],
          is_toggleable: false,
          color: 'default',
        },
      },
      {
        object: 'block',
        id: 'dd77693a-1580-4f27-95e1-67a6cd1d9e3a',
        parent: {
          type: 'page_id',
          page_id: 'b194a437-262e-482c-92b2-c5581eb5b477',
        },
        created_time: '2023-04-09T05:56:00.000Z',
        last_edited_time: '2023-04-09T05:56:00.000Z',
        created_by: {
          object: 'user',
          id: '4e38fa57-609c-4beb-8e28-271b11cc81a3',
        },
        last_edited_by: {
          object: 'user',
          id: '4e38fa57-609c-4beb-8e28-271b11cc81a3',
        },
        has_children: false,
        archived: false,
        type: 'paragraph',
        paragraph: {
          rich_text: [
            {
              type: 'text',
              text: {
                content: 'about product categories',
                link: null,
              },
              annotations: {
                bold: false,
                italic: false,
                strikethrough: false,
                underline: false,
                code: false,
                color: 'default',
              },
              plain_text: 'about product categories',
              href: null,
            },
          ],
          color: 'default',
        },
      },
    ],
    next_cursor: null,
    has_more: false,
    type: 'block',
    block: {},
  })

nock(baseUrl)
  .persist()
  .get(`/blocks/${pageIds[3]}/children`)
  .query(true)
  .reply(200, {
    object: 'list',
    results: [
      {
        object: 'block',
        id: '0907be1b-593b-47c8-93ac-f27f263119e8',
        parent: {
          type: 'page_id',
          page_id: '163bc39b-ffa6-4d88-84f5-cb73fa4a705a',
        },
        created_time: '2023-04-09T05:45:00.000Z',
        last_edited_time: '2023-04-09T05:45:00.000Z',
        created_by: {
          object: 'user',
          id: '4e38fa57-609c-4beb-8e28-271b11cc81a3',
        },
        last_edited_by: {
          object: 'user',
          id: '4e38fa57-609c-4beb-8e28-271b11cc81a3',
        },
        has_children: false,
        archived: false,
        type: 'heading_1',
        heading_1: {
          rich_text: [
            {
              type: 'text',
              text: {
                content: 'Team',
                link: null,
              },
              annotations: {
                bold: false,
                italic: false,
                strikethrough: false,
                underline: false,
                code: false,
                color: 'default',
              },
              plain_text: 'Team',
              href: null,
            },
          ],
          is_toggleable: false,
          color: 'default',
        },
      },
      {
        object: 'block',
        id: '125f2adb-2154-4c1b-a6a4-eba8f92bda8b',
        parent: {
          type: 'page_id',
          page_id: '163bc39b-ffa6-4d88-84f5-cb73fa4a705a',
        },
        created_time: '2023-04-09T05:55:00.000Z',
        last_edited_time: '2023-04-09T05:55:00.000Z',
        created_by: {
          object: 'user',
          id: '4e38fa57-609c-4beb-8e28-271b11cc81a3',
        },
        last_edited_by: {
          object: 'user',
          id: '4e38fa57-609c-4beb-8e28-271b11cc81a3',
        },
        has_children: false,
        archived: false,
        type: 'paragraph',
        paragraph: {
          rich_text: [
            {
              type: 'text',
              text: {
                content: 'about the team',
                link: null,
              },
              annotations: {
                bold: false,
                italic: false,
                strikethrough: false,
                underline: false,
                code: false,
                color: 'default',
              },
              plain_text: 'about the team',
              href: null,
            },
          ],
          color: 'default',
        },
      },
    ],
    next_cursor: null,
    has_more: false,
    type: 'block',
    block: {},
  })

nock(baseUrl)
  .persist()
  .get(`/blocks/${pageIds[4]}/children`)
  .query(true)
  .reply(200, {
    object: 'list',
    results: [
      {
        object: 'block',
        id: 'f835a203-0dab-4a3d-8f89-02c5e9404d43',
        parent: {
          type: 'page_id',
          page_id: 'dd5157a6-cf4c-4a51-8da5-0da83ef641ae',
        },
        created_time: '2023-04-09T05:45:00.000Z',
        last_edited_time: '2023-04-09T05:56:00.000Z',
        created_by: {
          object: 'user',
          id: '4e38fa57-609c-4beb-8e28-271b11cc81a3',
        },
        last_edited_by: {
          object: 'user',
          id: '4e38fa57-609c-4beb-8e28-271b11cc81a3',
        },
        has_children: false,
        archived: false,
        type: 'heading_1',
        heading_1: {
          rich_text: [
            {
              type: 'text',
              text: {
                content: 'Products',
                link: null,
              },
              annotations: {
                bold: false,
                italic: false,
                strikethrough: false,
                underline: false,
                code: false,
                color: 'default',
              },
              plain_text: 'Products',
              href: null,
            },
          ],
          is_toggleable: false,
          color: 'default',
        },
      },
      {
        object: 'block',
        id: '16a97a8d-5b38-484f-8d98-1ce03ee03b1b',
        parent: {
          type: 'page_id',
          page_id: 'dd5157a6-cf4c-4a51-8da5-0da83ef641ae',
        },
        created_time: '2023-04-09T05:56:00.000Z',
        last_edited_time: '2023-04-09T05:56:00.000Z',
        created_by: {
          object: 'user',
          id: '4e38fa57-609c-4beb-8e28-271b11cc81a3',
        },
        last_edited_by: {
          object: 'user',
          id: '4e38fa57-609c-4beb-8e28-271b11cc81a3',
        },
        has_children: false,
        archived: false,
        type: 'paragraph',
        paragraph: {
          rich_text: [
            {
              type: 'text',
              text: {
                content: 'about products',
                link: null,
              },
              annotations: {
                bold: false,
                italic: false,
                strikethrough: false,
                underline: false,
                code: false,
                color: 'default',
              },
              plain_text: 'about products',
              href: null,
            },
          ],
          color: 'default',
        },
      },
    ],
    next_cursor: null,
    has_more: false,
    type: 'block',
    block: {},
  })
