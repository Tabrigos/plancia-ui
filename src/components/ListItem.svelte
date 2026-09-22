<script lang="ts">
  import type { Snippet } from 'svelte'
  import ControlRow from './ControlRow.svelte'

  /**
   * An item of a `List`, and only inside one: an inset card with a head —
   * the label on the left, the controls on the right, the `ControlRow`
   * shape — and a body under it, often shown only while the item is on
   * (the app wraps it in its own `{#if}`). Without a label there is no head
   * and the body is the whole card. The body keeps the rhythm of a card:
   * 8 px after the head and between blocks, while `MetaRow` and
   * `LegendDots` keep their own 6 px.
   */
  let {
    label,
    title,
    help = false,
    controls,
    children,
    class: consumerClass,
    ...rest
  }: {
    /** The name of the item, in the head; no head without it */
    label?: string
    /** Tooltip of the label: the full name when it is cut, or what the item is */
    title?: string
    /** The title explains the item: help cursor on the label */
    help?: boolean
    /** Controls on the right of the head, in order: an `InfoButton`, a `Toggle` */
    controls?: Snippet
    /** The body under the head */
    children?: Snippet
    /** A class of the consumer, added next to the component's own */
    class?: string
    /** The consumer's own attributes (`data-*`, `id`, …) */
    [key: string]: unknown
  } = $props()
</script>

<li {...rest} class="p-list-item {consumerClass ?? ''}">
  {#if label}
    {#if controls}<ControlRow {label} {title} {help}>{@render controls()}</ControlRow>{:else}<ControlRow {label} {title} {help} />{/if}
  {/if}
  {#if children}<div class="p-list-body">{@render children()}</div>{/if}
</li>

<style>
  .p-list-item { display: block; min-width: 0; padding: 8px 10px; background: var(--p-inset); border: 1px solid var(--p-border-soft); border-radius: var(--p-r2); }
  /* A block, not a flex column: its top margin merges with the first
     block's own, so a MetaRow right under the head is 8 px away, not 14 */
  .p-list-body { margin-top: 8px; }
  .p-list-body:first-child { margin-top: 0; }
  /* Zero specificity: a component with a margin of its own keeps it */
  :global(:where(.p-list-body) > * + *) { margin-top: 8px; }
</style>
