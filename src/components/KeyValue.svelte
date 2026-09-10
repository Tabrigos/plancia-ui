<script lang="ts">
  import type { Snippet } from 'svelte'
  import type { Tone } from '../index'

  /**
   * Riga etichetta / valore: l'etichetta a sinistra in 12 px NON va mai a
   * capo; il valore a destra in monospazio sta su una riga; se c'è
   * un'informazione in più (`sub`) va su una seconda riga secondaria,
   * mai spezzando il valore. `tone` colora il valore (es. ok/danger).
   */
  let {
    label,
    sub,
    subTone,
    tone,
    title,
    id,
    children,
  }: {
    label: string
    sub?: string
    /** Tono della riga secondaria (es. warn se sopra la mediana) */
    subTone?: Tone
    tone?: Tone
    id?: string
    /** Tooltip nativo (spiegazione del dato) */
    title?: string
    children?: Snippet
  } = $props()
</script>

<div class="p-kv" {title} {id}>
  <span class="k">{label}</span>
  <span class="v" class:ok={tone === 'ok'} class:warn={tone === 'warn'} class:danger={tone === 'danger'} class:accent={tone === 'accent'} class:info={tone === 'info'}>
    <span class="main">{@render children?.()}</span>
    {#if sub}<span class="sub" class:s-ok={subTone === 'ok'} class:s-warn={subTone === 'warn'} class:s-danger={subTone === 'danger'} class:s-info={subTone === 'info'}>{sub}</span>{/if}
  </span>
</div>

<style>
  .p-kv { display: flex; align-items: baseline; justify-content: space-between; gap: 12px; padding: 6px 0; }
  :global(.p-kv + .p-kv) { border-top: 1px solid var(--p-border); }
  .k { font-size: var(--p-t12); color: var(--p-text-dim); white-space: nowrap; }
  .v { display: flex; flex-direction: column; align-items: flex-end; min-width: 0; font-family: var(--p-font-mono); font-size: var(--p-t12); color: var(--p-text-hi); text-align: right; }
  .main { white-space: nowrap; }
  .sub { font-family: var(--p-font-ui); font-size: var(--p-t11); font-weight: 400; color: var(--p-text-dim); max-width: 200px; }
  .v.ok { color: var(--p-ok); } .v.warn { color: var(--p-warn); } .v.danger { color: var(--p-danger); }
  .v.accent { color: var(--p-accent); } .v.info { color: var(--p-info); }
  .sub.s-ok { color: var(--p-ok); } .sub.s-warn { color: var(--p-warn); } .sub.s-danger { color: var(--p-danger); } .sub.s-info { color: var(--p-info); }
</style>
