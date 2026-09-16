import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { generateTokensCss, srcDir } from '../scripts/build-tokens.mjs'
import tokens from '../src/tokens.json'

const committed = readFileSync(join(srcDir, 'tokens.css'), 'utf8').replace(/\r\n/g, '\n')

describe('tokens', () => {
  it('the committed tokens.css is what tokens.json generates', () => {
    expect(generateTokensCss(tokens).css).toBe(committed)
  })

  it('every color token of the dark theme exists in the light theme, and only those', () => {
    for (const group of ['color', 'glow', 'shadow'] as const) {
      expect(Object.keys(tokens.light[group]).sort()).toEqual(Object.keys(tokens[group]).sort())
    }
    expect(tokens.light.scale.length).toBe(tokens.scale.length)
  })

  it('the generator refuses a color token present in one theme only', () => {
    const broken = structuredClone(tokens) as typeof tokens & { color: Record<string, string> }
    broken.color['brand'] = '#123456'
    expect(() => generateTokensCss(broken)).toThrow(/missing \[brand\]/)
  })

  it('exposes the contract: the --p-* names the README and the skill promise', () => {
    const names = [...committed.matchAll(/--p-([a-z0-9-]+):/g)].map((m) => m[1])
    for (const expected of ['bg', 's3a', 'text-dim', 'accent-ink', 'ok-soft', 'danger-glow', 'scale-5', 'sh2', 'font-mono', 't11', 't28', 'space-8', 'r-pill', 'z-modal', 'motion-ease', 'row-h', 'focus']) {
      expect(names).toContain(expected)
    }
    expect(committed).toContain('[data-theme="light"]')
    expect(committed).toContain('[data-density="comfortable"]')
  })
})
