import type { Renderer as MarkedRenderer } from 'marked'
import { marked } from 'marked'
import _ from 'lodash'

const block = (text: string) => `${text}\n\n`
const escapeBlock = (text: string) => `${_.escape(text)}\n\n`
const line = (text: string) => `${text}\n`
const inline = (text: string) => text
const newline = () => '\n'
const empty = () => ''

export default class NotionBlocksPlaintextParser {
  renderer: MarkedRenderer
  markedOptions

  constructor() {
    this.renderer = {
      // Block elements
      code: escapeBlock,
      blockquote: block,
      html: empty,
      heading: block,
      hr: newline,
      list: text => block(text.trim()),
      listitem: line,
      checkbox: empty,
      paragraph: block,
      table: (header, body) => line(header + body),
      tablerow: text => line(text.trim()),
      tablecell: text => `${text} `,
      // Inline elements
      strong: inline,
      em: inline,
      codespan: inline,
      br: newline,
      del: inline,
      link: (_0, _1, text) => text,
      image: (_0, _1, text) => text,
      text: inline,
      // etc.
      options: {},
    }
    this.markedOptions = {
      renderer: this.renderer,
      pedantic: false,
      mangle: false,
      gfm: false,
      extensions: undefined,
      breaks: false,
      headerIds: false,
      sanitize: false,
      smartypants: false,
      xhtml: false,
    }
  }

  parse(markdown: string) {
    const unmarked = marked(markdown, this.markedOptions)
    const unescaped = _.unescape(unmarked)
    const trimmed = _.trim(unescaped)
    return trimmed
  }
}

/* Much thanks to Eric Buss for making: https://github.com/ejrbuss/markdown-to-txt
From which the Marked Renderer and utilities were copied.
*/
