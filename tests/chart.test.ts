import { describe, expect, it } from 'vitest'
import { barPath, domainOf, linePoints, polyline, runsOf, xOf, yOf } from '../src/chart'

describe('domainOf', () => {
  it('takes the data extent unless an end is pinned', () => {
    expect(domainOf([3, 1, 2])).toEqual({ min: 1, max: 3 })
    expect(domainOf([3, 1, 2], 0)).toEqual({ min: 0, max: 3 })
    expect(domainOf([3, 1, 2], undefined, 10)).toEqual({ min: 1, max: 10 })
  })

  it('opens a flat series so nothing divides by zero', () => {
    expect(domainOf([5, 5])).toEqual({ min: 4, max: 6 })
  })

  it('ignores gaps and stretches to hold zero when asked', () => {
    expect(domainOf([3, null, 1])).toEqual({ min: 1, max: 3 })
    expect(domainOf([3, null, 1], undefined, undefined, true)).toEqual({ min: 0, max: 3 })
    expect(domainOf([-2, -1], undefined, undefined, true)).toEqual({ min: -2, max: 0 })
    expect(domainOf([null, null])).toEqual({ min: -1, max: 1 })
  })
})

describe('xOf and yOf', () => {
  it('place a sample by index and a value on the domain', () => {
    expect(xOf(0, 5, 120)).toBe(3)
    expect(xOf(2, 5, 120)).toBe(60)
    expect(xOf(4, 5, 120)).toBe(117)
    expect(xOf(0, 1, 120)).toBe(60)
    expect(yOf(0, 32, { min: -2, max: 2 })).toBe(16)
    expect(yOf(2, 32, { min: -2, max: 2 })).toBe(3)
  })
})

describe('runsOf', () => {
  it('splits the points at every gap and drops empty runs', () => {
    const points = linePoints([1, 2, null, 4, null, null, 6], 120, 32, { min: 0, max: 10 })
    expect(points[2]).toBeNull()
    const runs = runsOf(points)
    expect(runs.map((run) => run.length)).toEqual([2, 1, 1])
    expect(runsOf([])).toEqual([])
    expect(runsOf([null])).toEqual([])
  })
})

describe('linePoints', () => {
  it('spreads the values left to right inside the padding, high values up', () => {
    const points = linePoints([0, 10], 100, 20, { min: 0, max: 10 })
    expect(points).toEqual([[3, 17], [97, 3]])
    expect(polyline(points as Array<[number, number]>)).toBe('3,17 97,3')
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
