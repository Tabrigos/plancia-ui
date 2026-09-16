// Component tests run in jsdom against the sources in src/, compiled by
// the same Svelte plugin the showcase uses. svelteTesting() resolves the
// browser build of Svelte and cleans up after every test.
import { defineConfig } from 'vitest/config'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import { svelteTesting } from '@testing-library/svelte/vite'

export default defineConfig({
  plugins: [svelte(), svelteTesting()],
  test: {
    environment: 'jsdom',
    include: ['tests/**/*.test.ts'],
    // One jsdom per worker instead of one per file: the library cleans the
    // DOM after every test, and creating the environment cost more than
    // running the tests.
    isolate: false,
  },
})
