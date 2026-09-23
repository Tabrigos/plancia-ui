<script lang="ts" module>
  // Fallback ids for aria-controls when the consumer passes none
  let counter = 0
</script>
<script lang="ts">
  import type { Snippet } from 'svelte'

  /**
   * A row that opens its detail below itself: the whole row is a button
   * (`aria-expanded`), the detail a full-width line under it. On touch the
   * tooltip is silent, so a fact that lives in a row's `title` (the full
   * text of a truncated message, the end of a pass) needs a place a finger
   * reaches: this is it; the tooltip stays for the mouse. The row's content
   * and its layout are the app's (a flex row, or `subgrid` in a list with
   * columns: every default here has zero specificity, so a class of the
   * app wins). On touch the row is as tall as a small control.
   */
  let {
    open = $bindable(false),
    onchange,
    title,
    id,
    detail,
    children,
    class: consumerClass,
    ...rest
  }: {
    /** Bindable: the detail is shown */
    open?: boolean
    /** Called on every tap with the new state (one row open at a time is the app's rule) */
    onchange?: (open: boolean) => void
    /** Tooltip of the row for the mouse, usually the same fact as the detail */
    title?: string
    /** Id of the detail (`aria-controls`); generated when absent */
    id?: string
    /** The detail under the row */
    detail: Snippet
    /** The row itself */
    children: Snippet
    /** A class of the consumer (its layout: flex, subgrid), added next to the component's own */
    class?: string
    /** The consumer's own attributes (`data-*`, …), on the button */
    [key: string]: unknown
  } = $props()

  const fallbackId = `p-expandable-${++counter}`
  const detailId = $derived(id ?? fallbackId)

  function toggle(): void {
    open = !open
    onchange?.(open)
  }
</script>

<button type="button" {...rest} class="p-expandable {consumerClass ?? ''}" aria-expanded={open} aria-controls={detailId} {title} onclick={toggle}>{@render children()}</button>
<div class="p-expandable-detail" id={detailId} hidden={!open}>{@render detail()}</div>

<style>
  /* Zero specificity: the app lays the row out with a class of its own */
  :where(.p-expandable) {
    display: flex; align-items: baseline; gap: 8px; grid-column: 1 / -1; width: 100%; margin: 0;
    padding: max(0px, calc((var(--p-tap-h) - 1lh) / 2)) 0; border: 0; border-radius: var(--p-r1);
    background: none; font: inherit; color: inherit; text-align: left; cursor: pointer;
  }
  :where(.p-expandable-detail) {
    grid-column: 1 / -1; padding-bottom: 4px;
    font-family: var(--p-font-ui); font-size: var(--p-t11); line-height: 1.45; color: var(--p-text-dim); white-space: normal;
  }
  .p-expandable-detail[hidden] { display: none; }
  /* Hover only for a pointer that hovers: on touch a tap would leave it stuck */
  @media (hover: hover) {
    :where(.p-expandable):hover { background: var(--p-hover); }
  }
</style>
