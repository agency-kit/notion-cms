import type { PageContent } from '../types'

export default function () {
  return {
    name: 'ncms-plugin-head',
    hook: 'during-tree',
    core: true,
    exec: (context: PageContent) => {
      const copyOfContext = structuredClone(context) as PageContentWithMeta
      copyOfContext.meta = {
        title: '',
        description: '',
      }
      if (copyOfContext.otherProps?.metaTitle
         && copyOfContext.otherProps?.metaTitle.type === 'rich_text')
        copyOfContext.meta.title = copyOfContext.otherProps?.metaTitle?.rich_text[0]?.plain_text

      if (copyOfContext.otherProps?.metaDescription
         && copyOfContext.otherProps?.metaDescription.type === 'rich_text')
        copyOfContext.meta.description = copyOfContext.otherProps?.metaDescription?.rich_text[0]?.plain_text

      return copyOfContext
    },
  }
}

export interface PageContentWithMeta extends PageContent {
  meta: Meta
}

interface Meta {
  title: string
  description: string
}
