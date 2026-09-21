<script lang="ts">
  import { domainOf, linePoints, polyline, runsOf, xOf, yOf, type Sample } from '../chart.js'

  /**
   * A line in a box, no axes: the shape of a series next to its value
   * (X-ray flux, wind speed). 2 px stroke on a dataviz token, an optional
   * area under it, an end dot for the last value. A `null` sample is a gap:
   * the pen lifts, a lone sample between gaps is a dot. For a signed series
   * a thin zero line; a dashed marker at an index separates observed from
   * predicted. Text and axes stay outside: the label names it for
   * assistive technology, the app writes the numbers with the text tokens.
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
    zeroLine = false,
    markIndex,
    label,
    title,
  }: {
    /** The series, left to right; `null` is a missing sample (a gap) */
    values: Sample[]
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
    /** A thin line at 0, with the scale stretched to hold it (signed series: Bz, a delta) */
    zeroLine?: boolean
    /** A dashed vertical marker at this index ("now" in a series that continues with a forecast) */
    markIndex?: number
    /** Accessible name: what the series is */
    label: string
    /** Native tooltip */
    title?: string
  } = $props()

  const domain = $derived(domainOf(values, min, max, zeroLine))
  const points = $derived(linePoints(values, width, height, domain))
  const runs = $derived(runsOf(points))
  const last = $derived(runs.at(-1)?.at(-1))
  const zeroY = $derived(yOf(0, height, domain))
  const markX = $derived(markIndex !== undefined && markIndex >= 0 && markIndex < values.length ? xOf(markIndex, values.length, width) : undefined)
  const areaOf = (run: (typeof runs)[number]) => `M${run[0][0]},${height - 3} L${polyline(run).replace(/ /g, ' L')} L${run.at(-1)![0]},${height - 3} Z`
</script>

<svg class="p-spark" viewBox="0 0 {width} {height}" {width} {height} role="img" aria-label={label} style="--spark-color:{color}">
  {#if title}<title>{title}</title>{/if}
  {#if zeroLine}<line class="zero" x1="0" x2={width} y1={zeroY} y2={zeroY} />{/if}
  {#if markX !== undefined}<line class="mark" x1={markX} x2={markX} y1="0" y2={height} />{/if}
  {#each runs as run}
    {#if run.length > 1}
      {#if area}<path class="area" d={areaOf(run)} />{/if}
      <polyline class="line" points={polyline(run)} />
    {:else}
      <circle class="lone" cx={run[0][0]} cy={run[0][1]} r="1.5" />
    {/if}
  {/each}
  {#if endDot && last}<circle class="dot" cx={last[0]} cy={last[1]} r="2.5" />{/if}
</svg>

<style>
  .p-spark { display: block; overflow: visible; }
  .line { fill: none; stroke: var(--spark-color); stroke-width: 2; stroke-linejoin: round; stroke-linecap: round; }
  .area { fill: color-mix(in srgb, var(--spark-color) 15%, transparent); }
  .dot { fill: var(--spark-color); stroke: var(--p-s2); stroke-width: 2; }
  .lone { fill: var(--spark-color); }
  .zero { stroke: var(--p-border-strong); stroke-width: 1; }
  .mark { stroke: var(--p-text-dim); stroke-width: 1; stroke-dasharray: 2 2; }
</style>
