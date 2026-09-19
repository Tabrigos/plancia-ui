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
  import { barPath, domainOf } from '../chart.js'

  /**
   * Bars in a box, no axes: a short series of magnitudes (Kp over a day,
   * counts per hour). Thin marks with rounded data-ends anchored to the
   * baseline and a 2 px surface gap between them. One dataviz token for all
   * bars, or a color per bar when the bar means a level and wears a status
   * token. Text and axes stay outside.
   */
  let {
    bars,
    width = 120,
    height = 32,
    color = 'var(--p-viz-1)',
    max,
    label,
    gap = 2,
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
</script>

<svg class="p-bars" viewBox="0 0 {width} {height}" {width} {height} role="img" aria-label={label}>
  {#each scaled as bar, i (i)}
    <path d={bar.d} style="fill:{bar.color ?? color}">{#if bar.label}<title>{bar.label}</title>{/if}</path>
  {/each}
</svg>

<style>
  .p-bars { display: block; }
</style>
