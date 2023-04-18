import { AppendBlockChildrenParameters } from "@notionhq/client/build/src/api-endpoints"
import { markdownToBlocks } from '@tryfabric/martian';

export default class NotionPage {
  properties: {
    [key: string]: unknown
  }
  parent: {
    type: 'database_id' | 'page_id',
    page_id?: string,
    database_id?: string
  }
  children: AppendBlockChildrenParameters['children']

  constructor() {
    this.properties = {}
  }

  get name() {
    return this.properties?.['Name'] || 'Page'
  }

  // Does this properly render the nested items?
  addParentPage(page: ParentOrDatabaseId): NotionPage {
    this.properties['parent-page'] = {
      type: "relation",
      "relation": [{ "id": page.id }
      ],
    }
    return this
  }

  addParentDb(db: ParentOrDatabaseId): NotionPage {
    if (this.parent?.page_id) throw new Error('A parent has already been defined for this page.')
    Object.assign(
      this.parent,
      {
        type: 'database_id',
        id: db.id
      })
    return this
  }

  addProp(prop: Prop): NotionPage {
    const { propName, type, value } = prop
    switch (type) {
      case 'multiselect':
        this.properties[propName] = {
          "multi_select": [value.map((select: string) => ({ name: select }))]
        }
        break;
      case 'people':
        this.properties[propName] = {
          "people": [value.map((select: string) => ({ name: select }))]
        }
        break;
      default:
        this.properties[propName] = {
          "rich_text": [
            {
              "type": "text",
              "text": {
                "content": value,
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
              "plain_text": value,
              "href": null
            }]
        }
    }
    return this
  }

  addProps(props: Prop[]): NotionPage {
    props.forEach(prop => this.addProp(prop))
    return this
  }

  addContent(content: string): NotionPage {
    this.children = [...markdownToBlocks(content)]
    return this
  }
}

type Prop = {
  propName: string,
  type?: 'people' | 'multiselect' | 'richtext'
  value: any | any[],
}
type ParentOrDatabaseId = { id: string }
