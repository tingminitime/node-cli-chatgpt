import { defineConfig } from 'rollup'
import typescript from '@rollup/plugin-typescript'

export default defineConfig({
  input: './src/index.ts',
  output: {
    file: './dist/bundle.ts',
    format: 'esm',
  },
  plugins: [typescript()],
})
