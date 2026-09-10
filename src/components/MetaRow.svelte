<script lang="ts">
  import type { Snippet } from 'svelte'

  /**
   * Riga di metadati sotto il contenuto di una card: età del dato, soglie,
   * note di metodo, piccole azioni. 11 px in colore attenuato, voci ai due
   * estremi (`align="start"` per metterle in fila), a capo per voce intera
   * quando non entrano: un valore non si spezza mai. Ogni voce porta il suo
   * tooltip con `title`; un `<b>` dentro è il valore in evidenza (mono, hi).
   */
  let { align = 'between', children }: { align?: 'between' | 'start'; children?: Snippet } = $props()
</script>

<div class="p-meta" class:start={align === 'start'}>{@render children?.()}</div>

<style>
  .p-meta {
    display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: 4px 10px;
    margin-top: 6px; font-size: var(--p-t11); color: var(--p-text-dim);
  }
  .p-meta.start { justify-content: flex-start; }
  .p-meta :global(> *) { min-width: 0; }
  .p-meta :global(b) { font-family: var(--p-font-mono); font-weight: 500; color: var(--p-text-hi); }
</style>
