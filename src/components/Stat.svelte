<script lang="ts">
  import type { Snippet } from 'svelte'
  import type { Tone } from '../index'

  /** Statistica in card: etichetta piccola in maiuscolo, valore mono 16 px, nota. */
  let {
    label,
    sub,
    tone,
    title,
    children,
  }: { label: string; sub?: string; tone?: Tone; title?: string; children?: Snippet } = $props()
</script>

<div class="p-stat" {title}>
  <span class="k">{label}</span>
  <span class="v" class:ok={tone === 'ok'} class:warn={tone === 'warn'} class:danger={tone === 'danger'} class:accent={tone === 'accent'}>{@render children?.()}</span>
  {#if sub}<span class="sub">{sub}</span>{/if}
</div>

<style>
  .p-stat { display: flex; flex-direction: column; gap: 4px; padding: 10px 12px; border-radius: var(--p-r2); background: var(--p-s2); border: 1px solid var(--p-border); min-width: 0; }
  .k { font-size: var(--p-t11); letter-spacing: 0.06em; text-transform: uppercase; color: var(--p-text-dim); font-weight: 600; white-space: nowrap; }
  .v { font-family: var(--p-font-mono); font-size: var(--p-t16); font-weight: 500; color: var(--p-text-hi); white-space: nowrap; }
  .sub { font-size: var(--p-t11); color: var(--p-text-dim); }
  .v.ok { color: var(--p-ok); } .v.warn { color: var(--p-warn); } .v.danger { color: var(--p-danger); } .v.accent { color: var(--p-accent); }
</style>
