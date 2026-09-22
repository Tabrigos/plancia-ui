<script lang="ts">
  import type { Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'
  import type { Tone } from '../index'

  /**
   * One chip for statuses, scale levels and bands: 22 px, monospace,
   * semantic tone. `count` is the low (18 px) counter variant; `small`
   * the same low height but with the tone (scale levels in tables).
   * `color` overrides the tone with a free color (e.g. the color of a
   * satellite group): background and border derive from it; in the light
   * theme the text leans toward the text color, since a free color is
   * usually picked for a dark stage. `uppercase`
   * is a short label (LIVE, an alert type) in the spaced uppercase of
   * `p-sec-title`, the only other place the system allows it: the text
   * stays in normal case in the DOM, so a screen reader reads a word
   * instead of spelling it.
   */
  let {
    tone = 'neutral',
    count = false,
    small = false,
    uppercase = false,
    color,
    children,
    ...rest
  }: HTMLAttributes<HTMLSpanElement> & {
    tone?: Tone
    count?: boolean
    small?: boolean
    /** A short label in spaced uppercase, written in normal case by the app */
    uppercase?: boolean
    color?: string
    children?: Snippet
  } = $props()

  const custom = $derived(color
    ? `--chip-fg:${color};--chip-bg:color-mix(in srgb, ${color} 14%, transparent);--chip-bd:color-mix(in srgb, ${color} 35%, transparent)`
    : '')
</script>

<span class="p-chip {tone}" class:count class:small class:uppercase class:custom={Boolean(color)} style={custom} {...rest}>
  {@render children?.()}
</span>

<style>
  .p-chip {
    display: inline-flex; align-items: center; gap: 6px;
    height: 22px; padding: 0 8px; border-radius: var(--p-r1);
    font-family: var(--p-font-mono); font-size: var(--p-t11); font-weight: 600; line-height: 1;
    white-space: nowrap;
    border: 1px solid var(--p-border); background: var(--p-neutral-soft); color: var(--p-text);
  }
  .p-chip.count { height: 18px; padding: 0 6px; font-weight: 500; color: var(--p-text-dim); }
  .p-chip.small { height: 18px; padding: 0 6px; }
  /* The spacing trails the last letter too: the right padding gives it back */
  .p-chip.uppercase { padding-right: calc(8px - 0.08em); font-family: var(--p-font-ui); letter-spacing: 0.08em; text-transform: uppercase; }
  .p-chip.small.uppercase { padding-right: calc(6px - 0.08em); }
  .p-chip.accent { background: var(--p-accent-soft); border-color: color-mix(in srgb, var(--p-accent) 35%, transparent); color: var(--p-accent); }
  .p-chip.ok { background: var(--p-ok-soft); border-color: color-mix(in srgb, var(--p-ok) 35%, transparent); color: var(--p-ok); }
  .p-chip.warn { background: var(--p-warn-soft); border-color: color-mix(in srgb, var(--p-warn) 35%, transparent); color: var(--p-warn); }
  .p-chip.orange { background: var(--p-orange-soft); border-color: color-mix(in srgb, var(--p-orange) 35%, transparent); color: var(--p-orange); }
  .p-chip.danger { background: var(--p-danger-soft); border-color: color-mix(in srgb, var(--p-danger) 35%, transparent); color: var(--p-danger); }
  .p-chip.info { background: var(--p-info-soft); border-color: color-mix(in srgb, var(--p-info) 35%, transparent); color: var(--p-info); }
  /* 45 % of the free color in OKLab keeps 4.5:1 in light even for white,
     lime or yellow; `light-dark()` reads the `color-scheme` of the theme */
  .p-chip.custom { background: var(--chip-bg); border-color: var(--chip-bd); color: light-dark(color-mix(in oklab, var(--chip-fg) 45%, var(--p-text-hi)), var(--chip-fg)); }
</style>
