<script lang="ts">
  import type { Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'
  import type { Tone } from '../index'

  /**
   * Un chip solo per stati, scale e bande: 22 px, monospazio, tono
   * semantico. `count` è la variante bassa (18 px) dei contatori;
   * `small` la stessa altezza ma col tono (le scale nelle tabelle).
   * `color` sovrascrive il tono con un colore proprio (es. il colore di un
   * gruppo di satelliti): sfondo e bordo derivano da quello.
   */
  let {
    tone = 'neutral',
    count = false,
    small = false,
    color,
    children,
    ...rest
  }: HTMLAttributes<HTMLSpanElement> & {
    tone?: Tone
    count?: boolean
    small?: boolean
    color?: string
    children?: Snippet
  } = $props()

  const custom = $derived(color
    ? `--chip-fg:${color};--chip-bg:color-mix(in srgb, ${color} 14%, transparent);--chip-bd:color-mix(in srgb, ${color} 35%, transparent)`
    : '')
</script>

<span class="p-chip {tone}" class:count class:small class:custom={Boolean(color)} style={custom} {...rest}>
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
  .p-chip.accent { background: var(--p-accent-soft); border-color: color-mix(in srgb, var(--p-accent) 35%, transparent); color: var(--p-accent); }
  .p-chip.ok { background: var(--p-ok-soft); border-color: color-mix(in srgb, var(--p-ok) 35%, transparent); color: var(--p-ok); }
  .p-chip.warn { background: var(--p-warn-soft); border-color: color-mix(in srgb, var(--p-warn) 35%, transparent); color: var(--p-warn); }
  .p-chip.orange { background: var(--p-orange-soft); border-color: color-mix(in srgb, var(--p-orange) 35%, transparent); color: var(--p-orange); }
  .p-chip.danger { background: var(--p-danger-soft); border-color: color-mix(in srgb, var(--p-danger) 35%, transparent); color: var(--p-danger); }
  .p-chip.info { background: var(--p-info-soft); border-color: color-mix(in srgb, var(--p-info) 35%, transparent); color: var(--p-info); }
  .p-chip.custom { background: var(--chip-bg); border-color: var(--chip-bd); color: var(--chip-fg); }
</style>
