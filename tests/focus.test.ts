import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { srcDir } from '../scripts/build-tokens.mjs'

// The focus ring comes from one zero-specificity rule of base.css. Checked on
// the source: jsdom matches no :focus-visible style. An element the browser
// focuses by itself and the list forgets keeps the browser's outline (#30).
const NATIVELY_FOCUSABLE = ['button', 'a', 'input', 'select', 'textarea', 'summary', '[tabindex]']

const css = readFileSync(join(srcDir, 'base.css'), 'utf8')
const rule = css.match(/:where\(([^)]*)\):focus-visible\s*\{([^}]*)\}/)

describe('focus ring', () => {
  it('covers every natively focusable element', () => {
    expect(rule).not.toBeNull()
    const selectors = rule![1].split(',').map((selector) => selector.trim())
    expect(selectors).toEqual(expect.arrayContaining(NATIVELY_FOCUSABLE))
  })

  it('draws the themed ring in place of the outline', () => {
    expect(rule![2]).toContain('outline: none')
    expect(rule![2]).toContain('box-shadow: var(--p-focus)')
  })
})
