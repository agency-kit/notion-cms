import type { Renderer as MarkedRenderer } from 'marked'
import { marked } from 'marked'
import hljs from 'highlight.js'
import type { Blocks } from '@notion-stuff/v4-types'
import _ from 'lodash'

// @ts-expect-error module
import { gfmHeadingId } from 'marked-gfm-heading-id'
import type NotionBlocksMarkdownParser from './notion-blocks-md-parser'

export default class NotionBlocksHtmlParser {
  markdownParser: NotionBlocksMarkdownParser
  renderer: MarkedRenderer
  markedOptions
  debug: boolean

  constructor(parser: NotionBlocksMarkdownParser, debug?: boolean) {
    this.markdownParser = parser
    this.debug = debug || false

    this.renderer = new marked.Renderer()
    this.renderer.code = this._highlight.bind(this)
    this.markedOptions = {
      renderer: this.renderer,
      pedantic: false,
      mangle: false,
      gfm: true,
      headerIds: true,
      breaks: false,
      sanitize: false,
      smartypants: false,
      xhtml: false,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      extensions: [gfmHeadingId({ prefix: '' })],
    }
    marked.use({ silent: true })
  }

  marked(md: string): string {
    return marked(md, this.markedOptions)
  }

  parse(blocks: Blocks) {
    let markdown = this.markdownParser.parse(blocks)
    // if (this.debug)
    //   fs.writeFileSync('./debug/parsed.md', markdown)
    // Take another pass to wrap any deeply nested mixed HTML content's inner text in p tags
    markdown = this._mixedHTML(markdown)
    // if (this.debug)
    //   fs.appendFileSync('./debug/parsed.md', `--------ALTERED----------**\n\n\n${markdown}`)
    return marked(markdown, this.markedOptions)
  }

  _highlight(code: string, lang: string | undefined): string {
    const language = (lang && hljs.getLanguage(lang)) ? lang : 'plaintext'
    const higlighted = hljs.highlight(code, { language })
    const langClass = `language-${
      (!language || language.includes('plain')) ? 'none' : language}`
    return `<pre><code class='hljs ${langClass}'>${higlighted.value}</code></pre>`
  }

  _mixedHTML(mixedHtml: string) {
    return mixedHtml.replaceAll(/[^<>]+?(?=<\/)/g, (match) => {
      // Must trim or Marked classifies text preceded by tabs as indented code.
      const tokens = marked.lexer(_.trim(match), this.markedOptions)
      return marked.parser(tokens, this.markedOptions)
    })
  }
}
