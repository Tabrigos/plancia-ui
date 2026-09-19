import { describe, expect, it } from 'vitest'
import { barPath, domainOf, linePoints, polyline } from '../src/chart'

describe('domainOf', () => {
  it('takes the data extent unless an end is pinned', () => {
    expect(domainOf([3, 1, 2])).toEqual({ min: 1, max: 3 })
    expect(domainOf([3, 1, 2], 0)).toEqual({ min: 0, max: 3 })
    expect(domainOf([3, 1, 2], undefined, 10)).toEqual({ min: 1, max: 10 })
  })

  it('opens a flat series so nothing divides by zero', () => {
    expect(domainOf([5, 5])).toEqual({ min: 4, max: 6 })
  })
})

describe('linePoints', () => {
  it('spreads the values left to right inside the padding, high values up', () => {
    const points = linePoints([0, 10], 100, 20, { min: 0, max: 10 })
    expect(points).toEqual([[3, 17], [97, 3]])
    expect(polyline(points)).toBe('3,17 97,3')
  })

  it('centers a single value and handles an empty series', () => {
    expect(linePoints([4], 100, 20, { min: 0, max: 10 })).toEqual([[50, 11.4]])
    expect(linePoints([], 100, 20, { min: 0, max: 10 })).toEqual([])
  })
})

describe('barPath', () => {
  it('rounds the two top corners and anchors the bottom to the baseline', () => {
    expect(barPath(0, 10, 10, 30, 2)).toBe('M0,30 V12 Q0,10 2,10 H8 Q10,10 10,12 V30 Z')
  })

  it('shrinks the radius for a bar shorter than it', () => {
    expect(barPath(0, 29, 10, 30, 2)).toBe('M0,30 V30 Q0,29 1,29 H9 Q10,29 10,30 V30 Z')
  })
})
