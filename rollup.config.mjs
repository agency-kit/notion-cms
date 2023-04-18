import esbuild from 'rollup-plugin-esbuild'
import terser from '@rollup/plugin-terser'
import shebang from 'rollup-plugin-preserve-shebang'

export default [
  {
    input: 'src/notion-cms.ts',
    plugins: [esbuild(), terser()],
    output: [
      { format: 'esm', file: './dist/index.mjs' },
      { format: 'cjs', file: './dist/index.js' },
    ]
  },
  {
    input: 'src/cli.ts',
    plugins: [esbuild(), terser(), shebang()],
    output: [
      { format: 'esm', file: './dist/cli.mjs' },
    ]
  },
];
