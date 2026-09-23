<script lang="ts" module>
  export interface Bar {
    value: number
    /** Read by assistive technology and shown as the bar's tooltip */
    label?: string
    /** Per-bar color, e.g. a status token when the bar means a level (`var(--p-scale-3)`) */
    color?: string
  }
</script>
<script lang="ts">
  import { barAt, barPath, domainOf } from '../chart.js'
  import ChartReadout from './ChartReadout.svelte'

  /**
   * Bars in a box, no axes: a short series of magnitudes (Kp over a day,
   * counts per hour). Thin marks with rounded data-ends anchored to the
   * baseline and a 2 px surface gap between them. One dataviz token for all
   * bars, or a color per bar when the bar means a level and wears a status
   * token. With `readout`, a pointer, a finger or the arrow keys pick a bar:
   * the others fade and a small monospace box shows the text the app
   * formats, as in `Sparkline`. Otherwise text and axes stay outside.
   */
  let {
    bars,
    width = 120,
    height = 32,
    color = 'var(--p-viz-1)',
    max,
    label,
    gap = 2,
    readout,
  }: {
    bars: Bar[]
    width?: number
    height?: number
    /** Default color of every bar, a dataviz token */
    color?: string
    /** Top of the scale; the largest value when absent. The bottom is always 0 */
    max?: number
    /** Accessible name: what the series is */
    label: string
    /** Surface gap between bars, in pixels */
    gap?: number
    /** Text of the bar under the pointer (or the finger, or the focused arrow keys), e.g. `21–24 UTC · Kp 3.7`; none without it */
    readout?: (index: number, bar: Bar) => string
  } = $props()

  const domain = $derived(domainOf(bars.map((b) => b.value), 0, max))
  const slot = $derived(bars.length ? width / bars.length : width)
  const barWidth = $derived(Math.max(1, slot - gap))
  const scaled = $derived(bars.map((b, i) => {
    const t = Math.max(0, Math.min(1, (b.value - domain.min) / (domain.max - domain.min)))
    const h = t * height
    return { ...b, d: barPath(round(i * slot + gap / 2), round(height - h), round(barWidth), height, 2) }
  }))

  function round(n: number): number {
    return Math.round(n * 100) / 100
  }

  // The readout (ChartReadout): the picked bar, or the last one at rest for assistive technology
  let picked = $state(-1)
  const current = $derived(picked >= 0 ? picked : bars.length - 1)
  const read = (index: number) => (readout && index >= 0 ? readout(index, bars[index]) : '')
  const step = (by: -1 | 1) => { picked = Math.max(0, Math.min(bars.length - 1, (picked < 0 ? bars.length - 1 : picked) + by)) }
</script>

{#snippet chart()}
<svg class="p-bars" viewBox="0 0 {width} {height}" {width} {height} role={readout ? undefined : 'img'} aria-label={readout ? undefined : label} aria-hidden={readout ? true : undefined}>
  {#each scaled as bar, i (i)}
    <path d={bar.d} style="fill:{bar.color ?? color}" class:faded={picked >= 0 && i !== picked}>{#if bar.label && !readout}<title>{bar.label}</title>{/if}</path>
  {/each}
</svg>
{/snippet}

{#if readout}
  <ChartReadout class="p-bars-box" {label} {width} count={bars.length} {current} valueText={read(current) || undefined} text={read(picked)} x={round(picked * slot + slot / 2)}
                onpoint={(x) => { picked = barAt(x, bars.length, width) }} onstep={step} onclear={() => { picked = -1 }}>
    {@render chart()}
  </ChartReadout>
{:else}
  {@render chart()}
{/if}

<style>
  .p-bars { display: block; }
  /* The picked bar stays whole, the others step back */
  path { transition: opacity var(--p-motion-fast) var(--p-motion-ease); }
  path.faded { opacity: 0.35; }
</style>
