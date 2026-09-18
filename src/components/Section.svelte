<script lang="ts" module>
  // Fallback ids for aria-controls when the consumer passes none
  let counter = 0
</script>
<script lang="ts">
  import type { Snippet } from 'svelte'

  /**
   * A collapsible console section: the `p-sec-title` title, a one-line
   * summary computed by the consumer from its data (readable while closed),
   * optional actions on the right (an (i) button, a chip), the content
   * under it. The open/closed state belongs to the consumer (`open` is
   * bindable, `onchange` reports a click): the package stores nothing.
   * Closed content stays mounted and `hidden`, so its state survives.
   */
  let {
    title,
    summary,
    open = $bindable(true),
    onchange,
    actions,
    children,
    id,
  }: {
    title: string
    /** One line next to the title: the gist of the content, useful while closed */
    summary?: string
    open?: boolean
    onchange?: (open: boolean) => void
    /** Controls on the right of the head, outside the toggle button */
    actions?: Snippet
    children?: Snippet
    /** Id of the content region (`aria-controls`); generated when absent */
    id?: string
  } = $props()

  const fallbackId = `p-section-${++counter}`
  const bodyId = $derived(id ?? fallbackId)

  function toggle(): void {
    open = !open
    onchange?.(open)
  }
</script>

<section class="p-section" class:open>
  <div class="head">
    <button type="button" class="toggle" aria-expanded={open} aria-controls={bodyId} onclick={toggle}>
      <svg class="chevron" width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 3l5 5-5 5"/></svg>
      <span class="p-sec-title">{title}</span>
      {#if summary}<span class="summary">{summary}</span>{/if}
    </button>
    {#if actions}<div class="actions">{@render actions()}</div>{/if}
  </div>
  <div class="body" id={bodyId} hidden={!open}>{@render children?.()}</div>
</section>

<style>
  .p-section { display: flex; flex-direction: column; }
  :global(.p-section + .p-section) { border-top: 1px solid var(--p-border); }
  .head { display: flex; align-items: center; gap: 8px; min-height: var(--p-row-h); }
  .toggle {
    display: flex; align-items: center; gap: 8px; flex: 1; min-width: 0;
    padding: var(--p-row) 0; border: none; background: transparent; color: inherit;
    font: inherit; text-align: left; cursor: pointer;
  }
  .chevron { flex: none; color: var(--p-text-dim); transition: transform var(--p-motion-fast) var(--p-motion-ease); }
  .open .chevron { transform: rotate(90deg); }
  .toggle:hover .p-sec-title { color: var(--p-text); }
  .summary {
    min-width: 0; font-family: var(--p-font-mono); font-size: var(--p-t11); color: var(--p-text-dim);
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  }
  .actions { display: flex; align-items: center; gap: 6px; flex: none; }
  .body { display: flex; flex-direction: column; gap: var(--p-space-2); padding-bottom: var(--p-row); }
  /* `display: flex` would beat the `hidden` attribute: closed means closed */
  .body[hidden] { display: none; }
</style>
