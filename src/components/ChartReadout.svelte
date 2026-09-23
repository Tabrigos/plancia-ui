<script lang="ts">
  import type { Snippet } from 'svelte'
  import { readoutLeft } from '../chart.js'

  /**
   * The reading of a chart, shared by `Sparkline` and `Bars` so the two
   * read alike; internal, not exported. A slider over the chart for
   * assistive technology, a mouse that hovers, a finger that reads while it
   * drags (the page still scrolls up and down) and keeps the reading when
   * lifted, the arrow keys on focus, Esc; and the small monospace box with
   * the text, kept inside the width. The chart decides what an x or a step
   * picks and draws its own mark of the picked sample.
   */
  let {
    label,
    class: consumerClass,
    width,
    count,
    current,
    valueText,
    text,
    x,
    onpoint,
    onstep,
    onclear,
    children,
  }: {
    label: string
    class: string
    width: number
    /** Samples or bars: the range of the slider */
    count: number
    /** The index read out to assistive technology: the picked one, or the last at rest */
    current: number
    valueText?: string
    /** The text of the box; hidden when empty */
    text: string
    /** The center of the box, in the chart's own coordinates */
    x: number
    onpoint: (x: number) => void
    onstep: (step: -1 | 1) => void
    onclear: () => void
    children: Snippet
  } = $props()

  let box = $state<HTMLElement | null>(null)
  let boxWidth = $state(0)
  $effect(() => { void text; boxWidth = box?.offsetWidth ?? 0 })

  function point(event: PointerEvent): void {
    const target = event.currentTarget as HTMLElement
    if (event.type === 'pointerdown') target.setPointerCapture(event.pointerId)
    else if (event.pointerType === 'touch' && event.buttons === 0) return
    onpoint(event.clientX - target.getBoundingClientRect().left)
  }
  function leave(event: PointerEvent): void {
    if (event.pointerType !== 'touch') onclear()
  }
  function onkeydown(event: KeyboardEvent): void {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') onstep(event.key === 'ArrowLeft' ? -1 : 1)
    else if (event.key === 'Escape') onclear()
    else return
    event.preventDefault()
  }
</script>

<span class="p-chart-reading {consumerClass}" role="slider" aria-label={label} aria-orientation="horizontal" aria-valuemin="0" aria-valuemax={count - 1} aria-valuenow={current} aria-valuetext={valueText} tabindex="0" onpointerdown={point} onpointermove={point} onpointerleave={leave} {onkeydown} onblur={onclear}>
  {@render children()}
  <span class="readout" aria-hidden="true" bind:this={box} style="left:{text ? readoutLeft(x, boxWidth, width) : 0}px" hidden={!text}>{text}</span>
</span>

<style>
  /* pan-y: a finger dragging along the chart reads it, the page still scrolls up and down */
  .p-chart-reading { position: relative; display: inline-block; touch-action: pan-y; }
  .readout {
    position: absolute; bottom: 100%; margin-bottom: 4px; padding: 2px 6px; z-index: var(--p-z-popover);
    background: var(--p-s3a); border: 1px solid var(--p-border); border-radius: var(--p-r1); box-shadow: var(--p-sh1);
    font-family: var(--p-font-mono); font-size: var(--p-t11); line-height: 1.4; color: var(--p-text-hi); white-space: nowrap; pointer-events: none;
  }
  .readout[hidden] { display: none; }
</style>
