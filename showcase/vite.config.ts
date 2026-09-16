import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'

// The showcase reads the package SOURCES (../src), not `dist`: a change to a
// component or to tokens.json (after `npm run tokens` in the root) arrives
// through HMR without rebuilding the package. Same aliases in the `paths`
// of tsconfig.json.
const src = fileURLToPath(new URL('../src/', import.meta.url))

export default defineConfig({
  // GitHub Pages serves the showcase under /plancia-ui/: the workflow sets
  // PAGES_BASE, locally the base stays "/".
  base: process.env.PAGES_BASE ?? '/',
  plugins: [svelte()],
  resolve: {
    alias: [
      { find: /^plancia-ui$/, replacement: `${src}index.ts` },
      { find: /^plancia-ui\/(.*)$/, replacement: `${src}$1` },
    ],
  },
  server: {
    fs: { allow: ['..'] },
    port: 5174,
  },
})
