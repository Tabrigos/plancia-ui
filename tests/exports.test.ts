import { describe, expect, it } from 'vitest'
import pkg from '../package.json'
// The sources as text (Vite `?raw`): the check is static, CI then imports
// the built entries from plain Node.
import theme from '../src/theme.ts?raw'
import labels from '../src/labels.ts?raw'
import index from '../src/index.ts?raw'

/**
 * The subpath exports promise a module that loads without the Svelte
 * compiler: the entry exists, its source imports no `.svelte` file and
 * uses no rune.
 */
const PURE: Record<string, string> = { './theme': theme, './labels': labels }

describe('subpath exports', () => {
  it('declares plain-JavaScript entries for the helpers', () => {
    const exports = pkg.exports as Record<string, { types?: string; default?: string }>
    for (const [entry, code] of Object.entries(PURE)) {
      const target = exports[entry]
      expect(target?.default, entry).toMatch(/^\.\/dist\/[a-z]+\.js$/)
      expect(target?.types, entry).toMatch(/^\.\/dist\/[a-z]+\.d\.ts$/)
      expect(code, entry).not.toMatch(/\.svelte['"]/)
      expect(code, entry).not.toMatch(/\$(state|derived|effect|props)\b/)
    }
  })

  it('keeps the index re-exporting the same helpers', () => {
    expect(index).toContain("from './labels.js'")
    expect(index).toContain("from './theme.js'")
  })
})
