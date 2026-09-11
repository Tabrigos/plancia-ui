<script lang="ts">
  import type { Snippet } from 'svelte'

  /**
   * Riga di un elenco di console: icona, nome, comando a destra. È la riga
   * dei layer e delle impostazioni — tocca i bordi della colonna (il padding
   * orizzontale è suo) e si accende al passaggio del mouse.
   */
  let {
    label,
    title,
    help = false,
    icon,
    children,
    ...rest
  }: {
    label: string
    title?: string
    /** Il titolo spiega il dato: cursore da aiuto sul nome */
    help?: boolean
    /** Glifo a sinistra, 18 px */
    icon?: Snippet
    /** Comandi a destra (interruttore, chip, contatore, pulsanti) */
    children?: Snippet
    /** Attributi propri del consumatore (`data-*`, `id`, …) */
    [key: string]: unknown
  } = $props()
</script>

<!-- lo spread PRIMA: la classe del componente non si perde se chi lo usa
     passa un `class` proprio -->
<div {...rest} class="p-setting-row" {title}>
  {#if icon}<span class="ic" aria-hidden="true">{@render icon()}</span>{/if}
  <span class="name" class:help>{label}</span>
  {#if children}<span class="ctl">{@render children()}</span>{/if}
</div>

<style>
  .p-setting-row {
    display: flex; align-items: center; gap: 10px;
    padding: 7px 14px 7px 16px;
    transition: background var(--p-motion-fast) var(--p-motion-ease);
  }
  .p-setting-row:hover { background: var(--p-hover); }
  .ic { display: flex; width: 18px; flex: none; color: var(--p-text-dim); }
  .name.help { cursor: help; }
  .name {
    flex: 1; min-width: 0;
    font-size: var(--p-t12); color: var(--p-text);
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  }
  .ctl { display: flex; align-items: center; gap: 8px; flex: none; }
</style>
