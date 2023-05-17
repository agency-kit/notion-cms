import type { Blocks } from '@notion-stuff/v4-types'
import _ from 'lodash'
import type { BlockRenderers } from '../notion-blocks-parser'
import NotionBlocksParser from '../notion-blocks-parser'
import type { PluginPassthrough, UnsafePlugin } from '../types'

export default function ({
  blockRenderers,
  debug,
}: { blockRenderers: BlockRenderers; debug?: boolean }) {
  return {
    name: 'ncms-plugin-blocks-render',
    core: true,
    hook: 'parse',
    exec: (context: PluginPassthrough): string => {
      const copyOfContext = _.cloneDeep(context) as Blocks
      const parser = new NotionBlocksParser({ blockRenderers, debug })
      return parser.blocksToHtml(copyOfContext)
    },
  } satisfies UnsafePlugin
}
