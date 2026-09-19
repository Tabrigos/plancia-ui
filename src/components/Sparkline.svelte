<script lang="ts">
  import { domainOf, linePoints, polyline } from '../chart.js'

  /**
   * A line in a box, no axes: the shape of a series next to its value
   * (X-ray flux, wind speed). 2 px stroke on a dataviz token, an optional
   * area under it, an end dot for the last value. Text and axes stay
   * outside: the label names it for assistive technology, the app writes
   * the numbers with the text tokens.
   */
  let {
    values,
    width = 120,
    height = 32,
    color = 'var(--p-viz-1)',
    area = false,
    endDot = true,
    min,
    max,
    label,
    title,
  }: {
    values: number[]
    width?: number
    height?: number
    /** Stroke, a dataviz token by default (`var(--p-viz-1)`) */
    color?: string
    /** Fill the area under the line, 15 % of the stroke color */
    area?: boolean
    /** Mark the last value with a dot */
    endDot?: boolean
    /** Pin the bottom of the scale (e.g. 0) instead of the data minimum */
    min?: number
    /** Pin the top of the scale instead of the data maximum */
    max?: number
    /** Accessible name: what the series is */
    label: string
    /** Native tooltip */
    title?: string
  } = $props()

  const domain = $derived(domainOf(values, min, max))
  const points = $derived(linePoints(values, width, height, domain))
  const line = $derived(polyline(points))
  const last = $derived(points.at(-1))
  const areaPath = $derived(points.length ? `M${points[0][0]},${height - 3} L${line.replace(/ /g, ' L')} L${points.at(-1)![0]},${height - 3} Z` : '')
</script>

<svg class="p-spark" viewBox="0 0 {width} {height}" {width} {height} role="img" aria-label={label} style="--spark-color:{color}">
  {#if title}<title>{title}</title>{/if}
  {#if area && points.length > 1}<path class="area" d={areaPath} />{/if}
  {#if points.length > 1}<polyline class="line" points={line} />{/if}
  {#if endDot && last}<circle class="dot" cx={last[0]} cy={last[1]} r="2.5" />{/if}
</svg>

<style>
  .p-spark { display: block; overflow: visible; }
  .line { fill: none; stroke: var(--spark-color); stroke-width: 2; stroke-linejoin: round; stroke-linecap: round; }
  .area { fill: color-mix(in srgb, var(--spark-color) 15%, transparent); }
  .dot { fill: var(--spark-color); stroke: var(--p-s2); stroke-width: 2; }
</style>
