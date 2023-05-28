import type {
  AudioBlock,
  Block,
  Blocks,
  BulletedListItemBlock,
  CalloutBlock,
  CodeBlock,
  EmbedBlock,
  FileBlock,
  HeadingBlock,
  ImageBlock,
  LinkToPageBlock,
  NumberedListItemBlock,
  PDFBlock,
  ParagraphBlock,
  QuoteBlock,
  RichText,
  ToDoBlock,
  VideoBlock,
} from '@notion-stuff/v4-types'
import { z } from 'zod'
import NotionBlocksMarkdownParser from './notion-blocks-md-parser'
import NotionBlocksHtmlParser from './notion-blocks-html-parser'
import NotionBlocksPlaintextParser from './notion-blocks-plaintext-parser'

const blockRenderers = z.object({
  AudioBlock: z.function().returns(z.string()),
  BulletedListItemBlock: z.function().returns(z.string()),
  CalloutBlock: z.function().returns(z.string()),
  CodeBlock: z.function().returns(z.string()),
  EmbedBlock: z.function().returns(z.string()),
  FileBlock: z.function().returns(z.string()),
  HeadingBlock: z.function().returns(z.string()),
  ImageBlock: z.function().returns(z.string()),
  LinkToPageBlock: z.function().returns(z.string()),
  NumberedListItemBlock: z.function().returns(z.string()),
  ParagraphBlock: z.function().returns(z.string()),
  PDFBlock: z.function().returns(z.string()),
  QuoteBlock: z.function().returns(z.string()),
  RichText: z.function().returns(z.string()),
  RichTextEquation: z.function().returns(z.string()),
  RichTextMention: z.function().returns(z.string()),
  RichTextText: z.function().returns(z.string()),
  ToDoBlock: z.function().returns(z.string()),
  ToggleBlock: z.function().returns(z.string()),
  VideoBlock: z.function().returns(z.string()),
}).partial()

export type BlockRenderers = z.infer<typeof blockRenderers>

type Renderer = (block: Block | RichText[], ...args: unknown[]) => string
type CustomRenderer = (block: Block | RichText[], ...args: unknown[]) => string | null

function modularize(
  custom: CustomRenderer | undefined,
  def: Renderer): Renderer {
  return function render(block: Block | RichText[], ...args: unknown[]) {
    if (custom) {
      const customRender = custom(block, ...args)
      if (customRender !== null)
        return customRender
    }
    return def(block, ...args)
  }
}

export default class NotionBlocksParser {
  mdParser: NotionBlocksMarkdownParser
  htmlParser: NotionBlocksHtmlParser
  plainTextParser: NotionBlocksPlaintextParser
  debug: boolean

  constructor({ blockRenderers, debug }: { blockRenderers?: BlockRenderers; debug?: boolean }) {
    this.mdParser = new NotionBlocksMarkdownParser()
    this.plainTextParser = new NotionBlocksPlaintextParser()
    this.debug = debug || false

    this.mdParser.parseParagraph = modularize(
      blockRenderers?.ParagraphBlock,
      this.mdParser.parseParagraph.bind(this.mdParser) as Renderer,
    ) as (block: ParagraphBlock) => string

    this.mdParser.parseCodeBlock = modularize(
      blockRenderers?.CodeBlock,
      this.mdParser.parseCodeBlock.bind(this.mdParser) as Renderer,
    ) as (block: CodeBlock) => string

    this.mdParser.parseQuoteBlock = modularize(
      blockRenderers?.QuoteBlock,
      this.mdParser.parseQuoteBlock.bind(this.mdParser) as Renderer,
    ) as (block: QuoteBlock) => string

    this.mdParser.parseCalloutBlock = modularize(
      blockRenderers?.CalloutBlock,
      this.mdParser.parseCalloutBlock.bind(this.mdParser) as Renderer,
    ) as (block: CalloutBlock) => string

    this.mdParser.parseHeading = modularize(
      blockRenderers?.HeadingBlock,
      this.mdParser.parseHeading.bind(this.mdParser) as Renderer,
    ) as (block: HeadingBlock) => string

    this.mdParser.parseBulletedListItems = modularize(
      blockRenderers?.BulletedListItemBlock,
      this.mdParser.parseBulletedListItems.bind(this.mdParser) as Renderer,
    ) as (block: BulletedListItemBlock) => string

    this.mdParser.parseLinkToPageBlock = modularize(
      blockRenderers?.LinkToPageBlock,
      this.mdParser.parseLinkToPageBlock.bind(this.mdParser) as Renderer,
    ) as (block: LinkToPageBlock) => string

    this.mdParser.parseNumberedListItems = modularize(
      blockRenderers?.NumberedListItemBlock,
      this.mdParser.parseNumberedListItems.bind(this.mdParser) as Renderer,
    ) as (block: NumberedListItemBlock) => string

    this.mdParser.parseTodoBlock = modularize(
      blockRenderers?.ToDoBlock,
      this.mdParser.parseTodoBlock.bind(this.mdParser) as Renderer,
    ) as (block: ToDoBlock) => string

    this.mdParser.parseImageBlock = modularize(
      blockRenderers?.ImageBlock,
      this.mdParser.parseImageBlock.bind(this.mdParser) as Renderer,
    ) as (block: ImageBlock) => string

    this.mdParser.parseEmbedBlock = modularize(
      blockRenderers?.EmbedBlock,
      this.mdParser.parseEmbedBlock.bind(this.mdParser) as Renderer,
    ) as (block: EmbedBlock) => string

    this.mdParser.parseAudioBlock = modularize(
      blockRenderers?.AudioBlock,
      this.mdParser.parseAudioBlock.bind(this.mdParser) as Renderer,
    ) as (block: AudioBlock) => string

    this.mdParser.parseVideoBlock = modularize(
      blockRenderers?.VideoBlock,
      this.mdParser.parseVideoBlock.bind(this.mdParser) as Renderer,
    ) as (block: VideoBlock) => string

    this.mdParser.parseFileBlock = modularize(
      blockRenderers?.FileBlock,
      this.mdParser.parseFileBlock.bind(this.mdParser) as Renderer,
    ) as (block: FileBlock) => string

    this.mdParser.parsePdfBlock = modularize(
      blockRenderers?.PDFBlock,
      this.mdParser.parsePdfBlock.bind(this.mdParser) as Renderer,
    ) as (block: PDFBlock) => string

    // Warning: this parser is used in many of the other parsers internally.
    // Modding it could affect the others unexpectedly.
    this.mdParser.parseRichTexts = modularize(
      blockRenderers?.RichText,
      this.mdParser.parseRichTexts.bind(this.mdParser) as Renderer,
    ) as (block: RichText[]) => string

    this.htmlParser = new NotionBlocksHtmlParser(this.mdParser, this.debug)
  }

  markdownToPlainText(markdown: string): string {
    return this.plainTextParser.parse(markdown)
  }

  blocksToPlainText(blocks: Blocks, depth?: number): string {
    return this.plainTextParser.parse(
      this.blocksToMarkdown(blocks, depth))
  }

  blocksToMarkdown(blocks: Blocks, depth?: number): string {
    return this.mdParser.parse(blocks, depth)
  }

  blocksToHtml(blocks: Blocks): string {
    return this.htmlParser.parse(blocks)
  }

  static parseRichText(richTexts: RichText[]) {
    const tempParser = new NotionBlocksMarkdownParser()
    return tempParser.parseRichTexts(richTexts)
  }
}
