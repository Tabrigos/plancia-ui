/**
 * The arithmetic behind `Sparkline` and `Bars`: a domain from the values, the
 * points of a line, the path of a bar with rounded data-ends. Pure, so it
 * is tested without a layout engine; not part of the public API.
 */

export interface Domain { min: number; max: number }

/** The range the marks are scaled on: the data extent, unless the app pins one end. */
export function domainOf(values: number[], min?: number, max?: number): Domain {
  const lo = min ?? Math.min(...values)
  const hi = max ?? Math.max(...values)
  return hi > lo ? { min: lo, max: hi } : { min: lo - 1, max: hi + 1 }
}

/** Points of a line, left to right, inside the box minus a padding for the stroke and the end dot. */
export function linePoints(values: number[], width: number, height: number, domain: Domain, pad = 3): Array<[number, number]> {
  if (values.length === 0) return []
  const innerW = width - 2 * pad
  const innerH = height - 2 * pad
  const step = values.length > 1 ? innerW / (values.length - 1) : 0
  return values.map((v, i) => {
    const t = (v - domain.min) / (domain.max - domain.min)
    const x = values.length > 1 ? pad + i * step : width / 2
    return [round(x), round(pad + innerH - t * innerH)]
  })
}

export function polyline(points: Array<[number, number]>): string {
  return points.map(([x, y]) => `${x},${y}`).join(' ')
}

/** A bar anchored to the baseline with its two top corners rounded by `r`, never the bottom ones. */
export function barPath(x: number, top: number, width: number, bottom: number, r: number): string {
  const rr = Math.min(r, width / 2, Math.max(0, bottom - top))
  const right = x + width
  return `M${x},${bottom} V${round(top + rr)} Q${x},${round(top)} ${round(x + rr)},${round(top)} H${round(right - rr)} Q${right},${round(top)} ${right},${round(top + rr)} V${bottom} Z`
}

function round(n: number): number {
  return Math.round(n * 100) / 100
}
