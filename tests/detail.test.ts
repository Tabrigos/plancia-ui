import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { srcDir } from '../scripts/build-tokens.mjs'

// `p-detail` promises the look of the detail of ExpandableRow, for when there
// is nothing to open: the two rules must not drift apart. Checked on the
// sources: jsdom matches no stylesheet of base.css.
const LOOK = ['font-family', 'font-size', 'line-height', 'color', 'white-space']

function declarations(css: string, selector: string): Record<string, string> {
  const at = css.indexOf(selector)
  expect(at, selector).toBeGreaterThan(-1)
  const body = css.slice(css.indexOf('{', at) + 1, css.indexOf('}', at))
  return Object.fromEntries(body.split(';').map((part) => part.split(':').map((side) => side.trim())).filter(([name, value]) => name && value))
}

describe('p-detail', () => {
  const base = readFileSync(join(srcDir, 'base.css'), 'utf8')
  const row = readFileSync(join(srcDir, 'components', 'ExpandableRow.svelte'), 'utf8')

  it('is a dim, wrapping line of 11 px in the ui font', () => {
    const rule = declarations(base, '.p-detail {')
    expect(rule['font-size']).toBe('var(--p-t11)')
    expect(rule['font-family']).toBe('var(--p-font-ui)')
    expect(rule.color).toBe('var(--p-text-dim)')
    expect(rule['white-space']).toBe('normal')
  })

  it('looks like the detail of ExpandableRow', () => {
    const detail = declarations(base, '.p-detail {')
    const expandable = declarations(row, ':where(.p-expandable-detail) {')
    for (const name of LOOK) expect(detail[name], name).toBe(expandable[name])
  })
})
