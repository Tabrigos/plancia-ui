<script lang="ts">
  import type { Snippet } from 'svelte'
  import type { Tone } from '../index'

  /** Stat in a card: small uppercase label, 16 px monospace value, note. */
  let {
    label,
    sub,
    tone,
    title,
    id,
    children,
  }: { label: string; sub?: string; tone?: Tone; title?: string; id?: string; children?: Snippet } = $props()
</script>

<div class="p-stat" {title} {id}>
  <span class="k">{label}</span>
  <span class="v {tone ?? ''}">{@render children?.()}</span>
  {#if sub}<span class="sub">{sub}</span>{/if}
</div>

<style>
  .p-stat { display: flex; flex-direction: column; gap: 4px; padding: 10px 12px; border-radius: var(--p-r2); background: var(--p-s2); border: 1px solid var(--p-border); min-width: 0; }
  .k { font-size: var(--p-t11); letter-spacing: 0.06em; text-transform: uppercase; color: var(--p-text-dim); font-weight: 600; white-space: nowrap; }
  .v { font-family: var(--p-font-mono); font-size: var(--p-t16); font-weight: 500; color: var(--p-text-hi); white-space: nowrap; }
  .sub { font-size: var(--p-t11); color: var(--p-text-dim); }
  /* Every Tone */
  .v.ok { color: var(--p-ok); } .v.warn { color: var(--p-warn); } .v.orange { color: var(--p-orange); } .v.danger { color: var(--p-danger); }
  .v.accent { color: var(--p-accent); } .v.info { color: var(--p-info); } .v.neutral { color: var(--p-text-dim); }
</style>
