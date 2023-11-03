import typescript from '@rollup/plugin-typescript'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'

// export default defineConfig({
//   input: [
//     './src/index.ts',

//   ],
//   output: {
//     file: './dist/bundle.js',
//     format: 'esm',
//   },
//   plugins: [typescript()],
// })

export default {
  input: ['./src/index.ts', './src/openai.ts', './src/openai-stream.ts'],
  output: {
    dir: 'dist',
    format: 'esm',
  },
  plugins: [
    typescript(),
    commonjs(),
    nodeResolve({
      exportConditions: ['node'],
    }),
  ],
}
