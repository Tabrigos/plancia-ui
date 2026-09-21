import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { srcDir } from '../scripts/build-tokens.mjs'

// On a touch screen a tap leaves :hover stuck on the element, so every hover
// rule of the package lives under `@media (hover: hover)`. Checked on the
// sources: jsdom has no layout and no pointer to hover with.
const GUARD = '@media (hover: hover)'

function guardedRanges(css: string): Array<[number, number]> {
  const ranges: Array<[number, number]> = []
  let from = css.indexOf(GUARD)
  while (from !== -1) {
    const open = css.indexOf('{', from)
    let depth = 0
    let i = open
    for (; i < css.length; i++) {
      if (css[i] === '{') depth++
      if (css[i] === '}' && --depth === 0) break
    }
    ranges.push([open, i])
    from = css.indexOf(GUARD, i)
  }
  return ranges
}

function unguardedHovers(css: string): number[] {
  const ranges = guardedRanges(css)
  const hovers = [...css.matchAll(/:hover/g)].map((m) => m.index)
  return hovers.filter((at) => !ranges.some(([a, b]) => at > a && at < b))
}

const files = [
  join(srcDir, 'base.css'),
  ...readdirSync(join(srcDir, 'components')).map((name) => join(srcDir, 'components', name)),
]

describe('hover on touch', () => {
  it('finds hover rules at all, so the check means something', () => {
    const total = files.reduce((n, file) => n + (readFileSync(file, 'utf8').match(/:hover/g)?.length ?? 0), 0)
    expect(total).toBeGreaterThan(5)
  })

  it.each(files.map((file) => [file.slice(srcDir.length + 1), file]))('%s keeps every :hover under @media (hover: hover)', (_name, file) => {
    expect(unguardedHovers(readFileSync(file, 'utf8'))).toEqual([])
  })

  it('the checker itself sees an unguarded hover', () => {
    expect(unguardedHovers('.a:hover { color: red }')).toEqual([2])
    expect(unguardedHovers('@media (hover: hover) { .a:hover { color: red } }')).toEqual([])
  })
})
