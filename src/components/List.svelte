<script lang="ts">
  import type { Snippet } from 'svelte'

  /**
   * A list of a console: layers, sources, instruments, one framed
   * `ListItem` each, 10 px apart, with an optional credit line under it.
   * A real list for assistive technology, announced with its name and the
   * number of items (`role="list"` stays: Safari drops the semantics of a
   * list without bullets). Which items exist, their order and what they
   * say belong to the app.
   */
  let {
    label,
    footer,
    children,
  }: {
    /** Accessible name of the list, when no heading next to it names it */
    label?: string
    /** A line under the list, 11 px, dim: the attribution of the data */
    footer?: Snippet
    /** The `ListItem`s */
    children?: Snippet
  } = $props()
</script>

<ul class="p-list" role="list" aria-label={label}>{@render children?.()}</ul>
{#if footer}<p class="p-list-footer">{@render footer()}</p>{/if}

<style>
  .p-list { display: flex; flex-direction: column; gap: 10px; margin: 0; padding: 0; list-style: none; }
  .p-list-footer { margin: 10px 0 0; font-size: var(--p-t11); color: var(--p-text-dim); }
</style>
