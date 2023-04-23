import esbuild from 'rollup-plugin-esbuild'
import terser from '@rollup/plugin-terser'

export default {
  input: 'src/index.ts',
  plugins: [esbuild({ sourceMap: true }), terser()],
  output: [
    { format: 'esm', file: './dist/index.mjs', sourcemap: true },
    { format: 'cjs', file: './dist/index.js', sourcemap: true },
  ]
};
