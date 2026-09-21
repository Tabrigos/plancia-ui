<script lang="ts">
  import { domainOf, linePoints, nearestSample, polyline, readoutLeft, runsOf, xOf, yOf, type Sample } from '../chart.js'

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

  // The readout: the picked index, its point, the box kept inside the width
  let picked = $state(-1)
  let boxWidth = $state(0)
  let box = $state<HTMLElement | null>(null)
  const pickedPoint = $derived(picked >= 0 ? points[picked] : null)
  const text = $derived(pickedPoint && readout ? readout(picked, values[picked] as number) : '')
  // For assistive technology the box is a slider over the samples: its value text is the readout of the picked sample, the last one at rest
  const current = $derived(picked >= 0 ? picked : nearestSample(values, width, width))
  $effect(() => { void text; boxWidth = box?.offsetWidth ?? 0 })

  // A mouse reads by hovering; a finger reads while it is down (the page still scrolls vertically) and keeps the reading when lifted
  function pick(event: PointerEvent): void {
    const target = event.currentTarget as HTMLElement
    if (event.type === 'pointerdown') target.setPointerCapture(event.pointerId)
    else if (event.pointerType === 'touch' && event.buttons === 0) return
    picked = nearestSample(values, event.clientX - target.getBoundingClientRect().left, width)
  }
  function leave(event: PointerEvent): void {
    if (event.pointerType !== 'touch') picked = -1
  }
  function onkeydown(event: KeyboardEvent): void {
    const step = event.key === 'ArrowLeft' ? -1 : event.key === 'ArrowRight' ? 1 : 0
    if (step) picked = nearestSample(values, xOf((picked < 0 ? values.length - 1 : picked) + step, values.length, width), width)
    else if (event.key === 'Escape') picked = -1
    else return
    event.preventDefault()
  }
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
  <span class="p-spark-box" role="slider" aria-label={label} aria-orientation="horizontal" aria-valuemin="0" aria-valuemax={values.length - 1} aria-valuenow={current} aria-valuetext={current >= 0 ? readout(current, values[current] as number) : undefined} tabindex="0" onpointerdown={pick} onpointermove={pick} onpointerleave={leave} {onkeydown} onblur={() => { picked = -1 }}>
    {@render chart()}
    <span class="readout" aria-hidden="true" bind:this={box} style="left:{pickedPoint ? readoutLeft(pickedPoint[0], boxWidth, width) : 0}px" hidden={!pickedPoint}>{text}</span>
  </span>
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
  /* pan-y: a finger dragging along the line reads it, the page still scrolls up and down */
  .p-spark-box { position: relative; display: inline-block; touch-action: pan-y; }
  .readout {
    position: absolute; bottom: 100%; margin-bottom: 4px; padding: 2px 6px; z-index: var(--p-z-popover);
    background: var(--p-s3a); border: 1px solid var(--p-border); border-radius: var(--p-r1); box-shadow: var(--p-sh1);
    font-family: var(--p-font-mono); font-size: var(--p-t11); line-height: 1.4; color: var(--p-text-hi); white-space: nowrap; pointer-events: none;
  }
  .readout[hidden] { display: none; }
</style>
