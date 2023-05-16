import type {
  Annotations,
  AudioBlock,
  Blocks,
  BulletedListItemBlock,
  CalloutBlock,
  CalloutIconEmoji,
  CalloutIconExternal,
  CalloutIconFile,
  CodeBlock,
  EmbedBlock,
  ExternalFileWithCaption,
  FileBlock,
  FileWithCaption,
  HeadingBlock,
  ImageBlock,
  NumberedListItemBlock,
  PDFBlock,
  ParagraphBlock,
  QuoteBlock,
  RichText,
  RichTextEquation,
  RichTextMention,
  RichTextText,
  ToDoBlock,
  ToggleBlock,
  VideoBlock,
} from '@notion-stuff/v4-types'

const EOL_MD = '\n'

export default class NotionBlocksMarkdownParser {
  parse(blocks: Blocks, depth = 0): string {
    return blocks
      .reduce((markdown, childBlock) => {
        let childBlockString = ''
        // @ts-expect-error children
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        if (childBlock.has_children && childBlock[childBlock.type].children) {
          childBlockString = ' '
            .repeat(depth)
            .concat(
              childBlockString,
              // @ts-expect-error children
              // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-argument
              this.parse(childBlock[childBlock.type].children, depth + 2),
            )
        }

        if (childBlock.type === 'unsupported') {
          markdown += 'NotionAPI Unsupported'.concat(
            EOL_MD.repeat(2),
            childBlockString,
          )
        }

        if (childBlock.type === 'paragraph')
          markdown += this.parseParagraph(childBlock).concat(childBlockString)

        if (childBlock.type === 'code')
          markdown += this.parseCodeBlock(childBlock).concat(childBlockString)

        if (childBlock.type === 'quote')
          markdown += this.parseQuoteBlock(childBlock).concat(childBlockString)

        if (childBlock.type === 'callout') {
          markdown
            += this.parseCalloutBlock(childBlock).concat(childBlockString)
        }

        if (childBlock.type.startsWith('heading_')) {
          const headingLevel = Number(childBlock.type.split('_')[1])
          markdown += this.parseHeading(
            childBlock as HeadingBlock,
            headingLevel,
          ).concat(childBlockString)
        }

        if (childBlock.type === 'bulleted_list_item') {
          markdown
            += this.parseBulletedListItems(childBlock).concat(childBlockString)
        }

        if (childBlock.type === 'numbered_list_item') {
          markdown
            += this.parseNumberedListItems(childBlock).concat(childBlockString)
        }

        if (childBlock.type === 'to_do')
          markdown += this.parseTodoBlock(childBlock).concat(childBlockString)

        if (childBlock.type === 'toggle') {
          markdown += this.parseToggleBlock(childBlock).replace(
            '{{childBlock}}',
            childBlockString,
          )
        }

        if (childBlock.type === 'image')
          markdown += this.parseImageBlock(childBlock).concat(childBlockString)

        if (childBlock.type === 'embed')
          markdown += this.parseEmbedBlock(childBlock).concat(childBlockString)

        if (childBlock.type === 'audio')
          markdown += this.parseAudioBlock(childBlock).concat(childBlockString)

        if (childBlock.type === 'video')
          markdown += this.parseVideoBlock(childBlock).concat(childBlockString)

        if (childBlock.type === 'file')
          markdown += this.parseFileBlock(childBlock).concat(childBlockString)

        if (childBlock.type === 'pdf')
          markdown += this.parsePdfBlock(childBlock).concat(childBlockString)

        if (childBlock.type === 'divider')
          markdown += EOL_MD.concat('---', EOL_MD, childBlockString)

        return markdown
      }, '')
      .concat(EOL_MD)
  }

  parseParagraph(paragraphBlock: ParagraphBlock): string {
    const text: string = this.parseRichTexts(paragraphBlock.paragraph.rich_text)
    return EOL_MD.concat(text, EOL_MD)
  }

  parseCodeBlock(codeBlock: CodeBlock): string {
    return `\n\n\`\`\`${codeBlock.code.language.toLowerCase() || ''}
${(codeBlock.code.rich_text[0] as RichTextText).text.content}
\`\`\`\n\n`.concat(EOL_MD)
  }

  parseQuoteBlock(quoteBlock: QuoteBlock): string {
    return EOL_MD.concat(
      `> ${this.parseRichTexts(quoteBlock.quote.rich_text)}`,
      EOL_MD,
    )
  }

  parseCalloutBlock(calloutBlock: CalloutBlock) {
    const callout = `<div notion-callout>
  {{icon}}
  <span notion-callout-text>
    ${this.parseRichTexts(calloutBlock.callout.rich_text)}
  </span>
</div>`

    function getCalloutIcon(
      icon: CalloutIconEmoji | CalloutIconExternal | CalloutIconFile,
    ) {
      switch (icon.type) {
        case 'emoji':
          return `<span notion-callout-emoji>${icon.emoji}</span>`
        case 'external':
          return `<img notion-callout-external src='${icon.external.url}' alt='notion-callout-external-link'/>`
        case 'file':
          // TODO: add support for Callout File
          return 'notion-callout-file'
      }
    }

    return EOL_MD.concat(
      // @ts-expect-error callout
      callout.replace('{{icon}}', getCalloutIcon(calloutBlock.callout.icon)),
      EOL_MD,
    )
  }

  parseHeading(headingBlock: HeadingBlock, headingLevel: number): string {
    return EOL_MD.concat(
      '#'.repeat(headingLevel),
      ' ',
      // @ts-expect-error heading
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
      this.parseRichTexts(headingBlock[headingBlock.type].rich_text),
      EOL_MD,
    )
  }

  parseBulletedListItems(bulletedListItemBlock: BulletedListItemBlock): string {
    return '* '.concat(
      this.parseRichTexts(bulletedListItemBlock.bulleted_list_item.rich_text),
      EOL_MD,
    )
  }

  parseNumberedListItems(numberedListItemBlock: NumberedListItemBlock): string {
    return '1. '.concat(
      this.parseRichTexts(numberedListItemBlock.numbered_list_item.rich_text),
      EOL_MD,
    )
  }

  parseTodoBlock(todoBlock: ToDoBlock): string {
    return `- [${todoBlock.to_do.checked ? 'x' : ' '}] `.concat(
      this.parseRichTexts(todoBlock.to_do.rich_text),
      EOL_MD,
    )
  }

  parseToggleBlock(toggleBlock: ToggleBlock): string {
    return `<details><summary>${this.parseRichTexts(
      toggleBlock.toggle.rich_text,
    )}</summary>{{childBlock}}</details>`
  }

  parseImageBlock(imageBlock: ImageBlock): string {
    const { url, caption } = this.parseFile(imageBlock.image)
    return `
<figure notion-figure>
  <img src='${url}' alt='${caption}'>
  <figcaption notion-figcaption>${caption}</figcaption>
</figure>
`.concat(EOL_MD)
  }

  parseAudioBlock(audioBlock: AudioBlock): string {
    const { url, caption } = this.parseFile(audioBlock.audio)
    return `![${caption}](${url})`
  }

  parseVideoBlock(videoBlock: VideoBlock): string {
    const { url, caption } = this.parseFile(videoBlock.video)

    const [processed, iframeOrUrl] = processExternalVideoUrl(url)

    if (processed)
      return EOL_MD.concat(iframeOrUrl, EOL_MD)

    return `To be supported: ${url} with ${caption}`.concat(EOL_MD)
  }

  parseFileBlock(fileBlock: FileBlock): string {
    const { url, caption } = this.parseFile(fileBlock.file)
    return `To be supported: ${url} with ${caption}`.concat(EOL_MD)
  }

  parsePdfBlock(pdfBlock: PDFBlock): string {
    const { url, caption } = this.parseFile(pdfBlock.pdf)
    return `
<figure>
  <object data='${url}' type='application/pdf'></object>
  <figcaption>${caption}</figcaption>
</figure>
`.concat(EOL_MD)
  }

  parseEmbedBlock(embedBlock: EmbedBlock): string {
    const embedded = `<iframe src='${embedBlock.embed.url}'></iframe>`

    if (embedBlock.embed.caption) {
      return `
<figure>
  ${embedded}
  <figcaption>${this.parseRichTexts(embedBlock.embed.caption)}</figcaption>
</figure>`.concat(EOL_MD)
    }

    return embedded.concat(EOL_MD)
  }

  parseRichTexts(richTexts: RichText[]): string {
    return richTexts.reduce((parsedContent, richText) => {
      switch (richText.type) {
        case 'text':
          parsedContent += this.parseText(richText)
          break
        case 'mention':
          parsedContent += this.parseMention(richText)
          break
        case 'equation':
          parsedContent += this.parseEquation(richText)
          break
      }

      return parsedContent
    }, '')
  }

  parseText(richText: RichTextText): string {
    const content = this.annotate(richText.annotations, richText.text.content)

    return richText.text.link
      ? this.annotateLink(richText.text, content)
      : content
  }

  // TODO: support mention when we know what it actually means

  parseMention(mention: RichTextMention): string {
    switch (mention.mention.type) {
      case 'user':
        break
      case 'page':
        break
      case 'database':
        break
      case 'date':
        break
    }
    return this.annotate(mention.annotations, mention.plain_text)
  }

  parseEquation(equation: RichTextEquation): string {
    return this.annotate(
      equation.annotations,
      `$${equation.equation.expression}$`,
    )
  }

  parseFile(file: ExternalFileWithCaption | FileWithCaption): {
    caption: string
    url: string
  } {
    const fileContent = {
      caption: '',
      url: '',
    }

    switch (file.type) {
      case 'external':
        fileContent.url = file.external.url
        break
      case 'file':
        fileContent.url = file.file.url
        break
    }

    fileContent.caption = file.caption
      ? this.parseRichTexts(file.caption)
      : fileContent.url

    return fileContent
  }

  private annotate(annotations: Annotations, originalContent: string): string {
    // @ts-expect-error reduce
    return Object.entries(annotations).reduce(
      // @ts-expect-error reduce
      (
        annotatedContent,
        [modifier, isOnOrColor]: [
          keyof Annotations,
          boolean | Annotations['color'],
        ],
      ) =>
        isOnOrColor
          ? this.annotateModifier(
            modifier,
            annotatedContent,
            isOnOrColor as Annotations['color'],
          )
          : annotatedContent,
      originalContent,
    )
  }

  private annotateLink(
    text: RichTextText['text'],
    annotatedContent: string,
  ): string {
    return `[${annotatedContent}](${
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      text?.link?.url ? text?.link.url : text.link
    })`
  }

  private annotateModifier(
    modifier: keyof Annotations,
    originalContent: string,
    color?: Annotations['color'],
  ): string {
    switch (modifier) {
      case 'bold':
        return `**${originalContent}**`
      case 'italic':
        return `_${originalContent}_`
      case 'strikethrough':
        return `~~${originalContent}~~`
      case 'underline':
        return `<u>${originalContent}</u>`
      case 'code':
        return `\`${originalContent}\``
      case 'color':
        if (color !== 'default')
          // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
          return `<span notion-color='${color}'>${originalContent}</span>`
        return originalContent
    }
  }
}

function processExternalVideoUrl(url: string): [boolean, string] {
  if (url.includes('youtu'))
    return processYoutubeUrl(url)

  return [false, url]
}

function processYoutubeUrl(youtubeUrl: string): [boolean, string] {
  const lastPart = youtubeUrl.split('/').pop()

  const youtubeIframe = '<iframe width=\'560\' height=\'315\' src=\'https://www.youtube-nocookie.com/embed/{{videoId}}\' title=\'YouTube video player\' frameborder=\'0\' allow=\'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture\' allowfullscreen></iframe>'
  if (!lastPart)
    return [true, youtubeIframe]
  if (lastPart.includes('watch')) {
    const [, queryString] = lastPart.split('watch')
    const queryParams = new URLSearchParams(queryString)
    if (queryParams.has('v'))
      return [true, youtubeIframe.replace('{{videoId}}', queryParams.get('v') || '')]

    return [false, youtubeUrl]
  }

  return [true, youtubeIframe.replace('{{videoId}}', lastPart)]
}
