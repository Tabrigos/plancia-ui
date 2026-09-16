import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'

// La vetrina legge i SORGENTI del pacchetto (../src), non `dist`: così una
// modifica a un componente o a tokens.json (dopo `npm run tokens` nella
// radice) arriva in HMR senza ricostruire il pacchetto. Stessi alias nei
// `paths` di tsconfig.json.
const src = fileURLToPath(new URL('../src/', import.meta.url))

export default defineConfig({
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
