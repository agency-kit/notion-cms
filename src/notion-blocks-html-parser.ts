import type { Renderer as MarkedRenderer } from 'marked'
import { marked } from 'marked'
import hljs from 'highlight.js'
import type { Blocks } from '@notion-stuff/v4-types'

// @ts-expect-error module
import { gfmHeadingId } from 'marked-gfm-heading-id'
import type NotionBlocksMarkdownParser from './notion-blocks-md-parser'

export default class NotionBlocksHtmlParser {
  markdownParser: NotionBlocksMarkdownParser
  renderer: MarkedRenderer
  markedOptions

  constructor(parser: NotionBlocksMarkdownParser) {
    this.markdownParser = parser
    this.renderer = new marked.Renderer()
    this.renderer.code = this._highlight.bind(this)
    this.markedOptions = {
      renderer: this.renderer,
      pedantic: false,
      mangle: false,
      gfm: true,
      breaks: false,
      sanitize: false,
      smartypants: false,
      xhtml: false,
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-call
    marked.use(this.markedOptions, gfmHeadingId({ prefix: '' }))
  }

  marked(md: string): string {
    return marked(md)
  }

  parse(blocks: Blocks) {
    const markdown = this.markdownParser.parse(blocks)
    return marked(markdown)
  }

  _highlight(code: string, lang: string | undefined): string {
    const language = (lang && hljs.getLanguage(lang)) ? lang : 'plaintext'
    const higlighted = hljs.highlight(code, { language })
    const langClass = `language-${
      (!language || language.includes('plain')) ? 'none' : language}`
    return `<pre><code class='hljs ${langClass}'>${higlighted.value}</code></pre>`
  }
}
