<script lang="ts" module>
  const UNITS: Array<[Intl.RelativeTimeFormatUnit, number]> = [
    ['day', 86_400_000],
    ['hour', 3_600_000],
    ['minute', 60_000],
    ['second', 1_000],
  ]

  /** "3m ago" in the locale, from an age in milliseconds; whole units, the largest that fits. */
  export function formatAge(ageMs: number, locale?: string): string {
    const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto', style: 'narrow' })
    const age = Math.max(0, ageMs)
    for (const [unit, ms] of UNITS) {
      if (age >= ms) return rtf.format(-Math.floor(age / ms), unit)
    }
    return rtf.format(0, 'second')
  }
</script>
<script lang="ts">
  import Chip from './Chip.svelte'

  /**
   * Freshness of a datum as a chip: "3m ago", neutral while fresh, `warn`
   * past `staleAfter`, `danger` past `deadAfter`. The text comes from
   * `Intl.RelativeTimeFormat` in the app's locale, so no label to
   * translate; the tooltip is the absolute time. It re-renders by itself
   * every thirty seconds, so a chip left on screen does not lie.
   */
  let {
    updatedAt,
    staleAfter,
    deadAfter,
    locale,
    title,
    now,
  }: {
    /** When the datum was produced (Date, epoch milliseconds or ISO string) */
    updatedAt: Date | number | string
    /** Age in milliseconds past which the tone turns `warn` */
    staleAfter?: number
    /** Age in milliseconds past which the tone turns `danger` */
    deadAfter?: number
    /** BCP 47 locale for the text; the browser's when absent */
    locale?: string
    /** Tooltip; the absolute time in the locale when absent */
    title?: string
    /** The current time, for tests and for a clock the app controls; a 30 s timer when absent */
    now?: number
  } = $props()

  let tick = $state(Date.now())
  $effect(() => {
    if (now !== undefined) return
    const timer = setInterval(() => { tick = Date.now() }, 30_000)
    return () => clearInterval(timer)
  })

  const at = $derived(new Date(updatedAt).getTime())
  const age = $derived((now ?? tick) - at)
  const tone = $derived(deadAfter !== undefined && age >= deadAfter ? 'danger' : staleAfter !== undefined && age >= staleAfter ? 'warn' : 'neutral')
  const absolute = $derived(new Intl.DateTimeFormat(locale, { dateStyle: 'medium', timeStyle: 'short' }).format(at))
</script>

<Chip {tone} title={title ?? absolute}><time datetime={new Date(at).toISOString()}>{formatAge(age, locale)}</time></Chip>
