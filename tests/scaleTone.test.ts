import { describe, expect, it } from 'vitest'
import { scaleTone } from '../src/index'

describe('scaleTone', () => {
  it('maps the NOAA levels 0–5 to the semantic tones', () => {
    expect([0, 1, 2, 3, 4, 5].map(scaleTone)).toEqual(['ok', 'warn', 'warn', 'orange', 'danger', 'danger'])
  })

  it('clamps values outside the scale', () => {
    expect(scaleTone(-1)).toBe('ok')
    expect(scaleTone(9)).toBe('danger')
  })
})
