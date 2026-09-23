<script lang="ts">
  import { domainOf, linePoints, nearestSample, polyline, runsOf, xOf, yOf, type Sample } from '../chart.js'
  import ChartReadout from './ChartReadout.svelte'

  /**
   * A line in a box, no axes: the shape of a series next to its value
   * (X-ray flux, wind speed). 2 px stroke on a dataviz token, an optional
   * area under it, an end dot for the last value. A `null` sample is a gap:
   * the pen lifts, a lone sample between gaps is a dot. For a signed series
   * a thin zero line; a dashed marker at an index separates observed from
   * predicted. With `readout`, a pointer, a finger or the arrow keys pick a
   * sample: a dot on the line and a small monospace box with the text the
   * app formats. Otherwise text and axes stay outside: the label names it
   * for assistive technology, the app writes the numbers with the text tokens.
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
    readout,
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
    /** Text of the sample under the pointer (or the finger, or the focused arrow keys), e.g. `12:40 UTC · 512 km/s`; none without it */
    readout?: (index: number, value: number) => string
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

  // The readout (ChartReadout): the picked sample, or the last one at rest for assistive technology; a gap is never picked
  let picked = $state(-1)
  const pickedPoint = $derived(picked >= 0 ? points[picked] : null)
  const current = $derived(picked >= 0 ? picked : nearestSample(values, width, width))
  const read = (index: number) => (readout && index >= 0 ? readout(index, values[index] as number) : '')
  const step = (by: -1 | 1) => { picked = nearestSample(values, xOf((picked < 0 ? values.length - 1 : picked) + by, values.length, width), width) }
</script>

{#snippet chart()}
<svg class="p-spark" viewBox="0 0 {width} {height}" {width} {height} role={readout ? undefined : 'img'} aria-label={readout ? undefined : label} aria-hidden={readout ? true : undefined} style="--spark-color:{color}">
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
  {#if pickedPoint}<circle class="pick" cx={pickedPoint[0]} cy={pickedPoint[1]} r="3" />{/if}
</svg>
{/snippet}

{#if readout}
  <ChartReadout class="p-spark-box" {label} {width} count={values.length} {current} valueText={read(current) || undefined} text={pickedPoint ? read(picked) : ''} x={pickedPoint?.[0] ?? 0}
                onpoint={(x) => { picked = nearestSample(values, x, width) }} onstep={step} onclear={() => { picked = -1 }}>
    {@render chart()}
  </ChartReadout>
{:else}
  {@render chart()}
{/if}

<style>
  .p-spark { display: block; overflow: visible; }
  .line { fill: none; stroke: var(--spark-color); stroke-width: 2; stroke-linejoin: round; stroke-linecap: round; }
  .area { fill: color-mix(in srgb, var(--spark-color) 15%, transparent); }
  .dot { fill: var(--spark-color); stroke: var(--p-s2); stroke-width: 2; }
  .lone { fill: var(--spark-color); }
  .zero { stroke: var(--p-border-strong); stroke-width: 1; }
  .mark { stroke: var(--p-text-dim); stroke-width: 1; stroke-dasharray: 2 2; }
  .pick { fill: var(--p-text-hi); stroke: var(--p-s2); stroke-width: 2; }
</style>
