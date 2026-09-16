<script lang="ts">
  import type { Snippet } from 'svelte'

  /**
   * Row of a console list: icon, name, control on the right. It is the row
   * of layers and settings — it touches the column edges (the horizontal
   * padding is its own) and highlights on hover.
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
    /** The title explains the datum: help cursor on the name */
    help?: boolean
    /** Glyph on the left, 18 px */
    icon?: Snippet
    /** Controls on the right (toggle, chip, counter, buttons) */
    children?: Snippet
    /** The consumer's own attributes (`data-*`, `id`, …) */
    [key: string]: unknown
  } = $props()
</script>

<!-- the spread FIRST: the component's class is not lost when the consumer
     passes a `class` of its own -->
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
