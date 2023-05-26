import esbuild from 'rollup-plugin-esbuild'
import terser from '@rollup/plugin-terser'

export default [{
  input: 'src/index.ts',
  plugins: [esbuild()],
  output: [
    { format: 'esm', file: './dist/index.mjs' },
    { format: 'cjs', file: './dist/index.js' },
  ],
},
{
  input: 'src/index.ts',
  plugins: [esbuild({ sourceMap: true }), terser()],
  output: [
    { format: 'esm', file: './dist/index.min.mjs', sourcemap: 'inline' },
    { format: 'cjs', file: './dist/index.min.js', sourcemap: 'inline' },
  ],
},
{
  input: 'src/tests/test.ts',
  plugins: [esbuild()],
  output: [
    { format: 'esm', file: './test/test.mjs' },
  ],
}]
