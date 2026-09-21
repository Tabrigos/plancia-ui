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
   * Closed content stays mounted, `inert` and hidden from readers, so its
   * state survives; the height animates on the motion tokens (a grid row
   * from 1fr to 0fr: no JavaScript, and `prefers-reduced-motion` turns it
   * off from base.css).
   */
  let {
    title,
    summary,
    summaryTitle,
    open = $bindable(true),
    onchange,
    actions,
    children,
    id,
  }: {
    title: string
    /** One line next to the title: the gist of the content, useful while closed */
    summary?: string
    /** Tooltip of the summary, with the help cursor: what the compressed reading means (silent on touch, like every title) */
    summaryTitle?: string
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
      {#if summary}<span class="summary" class:help={!!summaryTitle} title={summaryTitle}>{summary}</span>{/if}
    </button>
    {#if actions}<div class="actions">{@render actions()}</div>{/if}
  </div>
  <div class="body" id={bodyId} inert={!open} aria-hidden={!open}>
    <div class="inner">{@render children?.()}</div>
  </div>
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
  .summary {
    min-width: 0; font-family: var(--p-font-mono); font-size: var(--p-t11); color: var(--p-text-dim);
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  }
  .summary.help { cursor: help; }
  .actions { display: flex; align-items: center; gap: 6px; flex: none; }
  .body { display: grid; grid-template-rows: 1fr; transition: grid-template-rows var(--p-motion-base) var(--p-motion-ease); }
  .body[inert] { grid-template-rows: 0fr; }
  .inner { display: flex; flex-direction: column; gap: var(--p-space-2); min-height: 0; overflow: hidden; }
  .open .inner { padding-bottom: var(--p-row); }
  /* Hover only for a pointer that hovers: on touch a tap would leave it stuck */
  @media (hover: hover) {
    .toggle:hover .p-sec-title { color: var(--p-text); }
  }
</style>
