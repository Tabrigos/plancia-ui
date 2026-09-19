import { describe, expect, it } from 'vitest'
import { placeTooltip } from '../src/tooltip-placement'

const viewport = { width: 1000, height: 800 }
const tip = { width: 200, height: 40 }
const anchor = { left: 400, top: 300, width: 100, height: 20 }

describe('placeTooltip', () => {
  it('goes below, centered, when there is room', () => {
    expect(placeTooltip(anchor, tip, viewport, 8)).toEqual({ x: 350, y: 328, above: false })
  })

  it('goes above when there is no room below', () => {
    const low = { ...anchor, top: 770 }
    expect(placeTooltip(low, tip, viewport, 8)).toEqual({ x: 350, y: 722, above: true })
  })

  it('stays below when neither side fits', () => {
    const cramped = placeTooltip({ ...anchor, top: 20 }, { width: 200, height: 790 }, viewport, 8)
    expect(cramped.above).toBe(false)
  })

  it('keeps inside the viewport horizontally and narrows to it', () => {
    expect(placeTooltip({ ...anchor, left: 0 }, tip, viewport, 8).x).toBe(8)
    expect(placeTooltip({ ...anchor, left: 950 }, tip, viewport, 8).x).toBe(792)
    expect(placeTooltip(anchor, { width: 2000, height: 40 }, viewport, 8).x).toBe(8)
  })

  it('picks the side that covers less of the obstacles, below on a tie', () => {
    const panelBelow = { left: 300, top: 320, width: 300, height: 200 }
    expect(placeTooltip(anchor, tip, viewport, 8, [panelBelow]).above).toBe(true)
    const panelAbove = { left: 300, top: 200, width: 300, height: 80 }
    expect(placeTooltip(anchor, tip, viewport, 8, [panelAbove]).above).toBe(false)
    // a tie: one panel fully under the below box, one fully over the above box
    expect(placeTooltip(anchor, tip, viewport, 8, [panelBelow, { left: 300, top: 220, width: 300, height: 80 }]).above).toBe(false)
  })
})
