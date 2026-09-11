<script lang="ts">
  import type { Snippet } from 'svelte'

  /**
   * Riga di comando di una scheda: etichetta a sinistra (mai a capo, con
   * ellissi se non entra), comandi a destra — un interruttore, un pulsante
   * (i), un chip. È la testa delle schede di una console.
   *
   * `help` mette il cursore da spiegazione: usalo quando `title` spiega
   * davvero il dato, non per ripetere l'etichetta.
   */
  let {
    label,
    title,
    help = false,
    tone = 'hi',
    children,
  }: {
    label: string
    title?: string
    /** Il titolo spiega il dato: cursore da aiuto */
    help?: boolean
    /** `hi` (predefinito) o `dim` per le righe secondarie */
    tone?: 'hi' | 'dim'
    /** I comandi a destra, nell'ordine in cui devono comparire */
    children?: Snippet
  } = $props()
</script>

<div class="p-ctl-row">
  <span class="p-ctl-label {tone}" class:help {title}>{label}</span>
  {#if children}<span class="ctl">{@render children()}</span>{/if}
</div>

<style>
  .p-ctl-row { display: flex; align-items: center; justify-content: space-between; gap: 8px; }
  .p-ctl-label {
    flex: 1; min-width: 0;
    font-size: var(--p-t12);
    color: var(--p-text-hi);
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  }
  .p-ctl-label.dim { color: var(--p-text-dim); }
  .p-ctl-label.help { cursor: help; }
  .ctl { display: flex; align-items: center; gap: 6px; flex: none; }
</style>
