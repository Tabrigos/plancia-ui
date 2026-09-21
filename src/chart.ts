/**
 * The arithmetic behind `Sparkline` and `Bars`: a domain from the values, the
 * points of a line, the path of a bar with rounded data-ends. Pure, so it
 * is tested without a layout engine; not part of the public API.
 */

export interface Domain { min: number; max: number }

/** A value of a series; `null` is a missing sample, a gap in the line. */
export type Sample = number | null

export type Point = [number, number]

/** The range the marks are scaled on: the data extent (gaps ignored), unless the app pins one end; `includeZero` stretches it to hold 0. */
export function domainOf(values: Sample[], min?: number, max?: number, includeZero = false): Domain {
  const present = values.filter((v): v is number => v !== null && Number.isFinite(v))
  if (includeZero) present.push(0)
  const lo = min ?? (present.length ? Math.min(...present) : 0)
  const hi = max ?? (present.length ? Math.max(...present) : 0)
  return hi > lo ? { min: lo, max: hi } : { min: lo - 1, max: hi + 1 }
}

/** The x of the sample at `index`, samples spread left to right inside the padding; a single sample sits in the middle. */
export function xOf(index: number, count: number, width: number, pad = 3): number {
  if (count < 2) return round(width / 2)
  return round(pad + index * ((width - 2 * pad) / (count - 1)))
}

/** The y of a value on the domain, high values up, inside the padding. */
export function yOf(value: number, height: number, domain: Domain, pad = 3): number {
  const innerH = height - 2 * pad
  const t = (value - domain.min) / (domain.max - domain.min)
  return round(pad + innerH - t * innerH)
}

/** Points of a line, left to right, inside the box minus a padding for the stroke and the end dot; a gap stays `null`. */
export function linePoints(values: Sample[], width: number, height: number, domain: Domain, pad = 3): Array<Point | null> {
  return values.map((v, i) => (v === null ? null : [xOf(i, values.length, width, pad), yOf(v, height, domain, pad)]))
}

/** The runs of consecutive points between gaps: one polyline each, so the pen lifts at a missing sample. */
export function runsOf(points: Array<Point | null>): Point[][] {
  const runs: Point[][] = []
  let run: Point[] = []
  for (const p of points) {
    if (p) run.push(p)
    else if (run.length) { runs.push(run); run = [] }
  }
  if (run.length) runs.push(run)
  return runs
}

export function polyline(points: Point[]): string {
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
