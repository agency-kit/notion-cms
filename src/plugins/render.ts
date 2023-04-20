import type { Blocks } from '@notion-stuff/v4-types'
import type { BlockRenderers } from '../notion-blocks-parser'
import NotionBlocksParser from '../notion-blocks-parser'
import { UnsafePlugin, PluginPassthrough } from '../types'

export default function ({
  blockRenderers,
}: { blockRenderers: BlockRenderers }) {
  return {
    name: 'ncms-plugin-blocks-render',
    core: true,
    hook: 'parse',
    exec: (context: PluginPassthrough): string => {
      const copyOfContext = structuredClone(context) as Blocks
      const parser = new NotionBlocksParser({ blockRenderers })
      return parser.blocksToHtml(copyOfContext)
    },
  } satisfies UnsafePlugin
}
