import esbuild from 'rollup-plugin-esbuild'
import terser from '@rollup/plugin-terser'

export default {
  input: 'src/notion-cms.ts',
  plugins: [esbuild(), terser()],
  output: {
    file: 'dist/index.js',
    format: 'esm',
    sourcemap: true,
  }
};