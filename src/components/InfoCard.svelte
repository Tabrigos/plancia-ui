<script lang="ts">
  import type { Snippet } from 'svelte'
  import { labels } from '../labels.js'

  /**
   * The frame of an explanation ("what is this datum"): an inset card with
   * the typography for a paragraph, a `<dl>` of facts and a link. Two
   * shapes: with `summary` it is a native `<details>` the user opens by
   * itself (no state, works on touch); without, an always-open card that an
   * `InfoButton` elsewhere shows and hides, with an optional close button.
   * The content is the app's: this is the frame.
   */
  let {
    summary,
    open = $bindable(false),
    onclose,
    closeLabel,
    label,
    id,
    children,
  }: {
    /** The line to click to open the card; without it the card is always open */
    summary?: string
    /** Bindable, for the `<details>` shape */
    open?: boolean
    /** For the always-open shape: renders a close button */
    onclose?: () => void
    closeLabel?: string
    /** Accessible name of the always-open region */
    label?: string
    id?: string
    children?: Snippet
  } = $props()
</script>

{#if summary}
  <details class="p-info-card" bind:open {id}>
    <summary>{summary}</summary>
    <div class="body">{@render children?.()}</div>
  </details>
{:else}
  <div class="p-info-card inline" role="region" aria-label={label} {id}>
    {#if onclose}
      <button type="button" class="close" onclick={onclose} title={closeLabel ?? $labels.close} aria-label={closeLabel ?? $labels.close}>
        <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" aria-hidden="true"><path d="M4 4l8 8M12 4l-8 8"/></svg>
      </button>
    {/if}
    <div class="body">{@render children?.()}</div>
  </div>
{/if}

<style>
  .p-info-card { position: relative; background: var(--p-inset); border: 1px solid var(--p-border); border-radius: var(--p-r2); font-size: var(--p-t12); color: var(--p-text); }
  /* 28 px by default; on touch the summary grows to the small control height */
  summary { padding: max(6px, calc((var(--p-control-h-sm) - 1lh) / 2)) 10px; border-radius: var(--p-r2); font-size: var(--p-t11); color: var(--p-text-dim); cursor: pointer; user-select: none; }
  .body { display: flex; flex-direction: column; gap: 8px; padding: 8px 10px 10px; line-height: 1.45; }
  .inline .body { padding-right: calc(var(--p-control-h-sm) + 10px); }
  .close {
    position: absolute; top: 4px; right: 4px; display: inline-flex; align-items: center; justify-content: center;
    width: var(--p-control-h-sm); height: var(--p-control-h-sm); border: none; border-radius: var(--p-r1); background: transparent; color: var(--p-text-dim); cursor: pointer;
  }
  .body :global(p) { margin: 0; }
  .body :global(b) { color: var(--p-text-hi); font-weight: 600; }
  .body :global(dl) { display: grid; grid-template-columns: max-content 1fr; gap: 3px 12px; margin: 0; }
  .body :global(dt) { color: var(--p-text-dim); font-size: var(--p-t11); }
  .body :global(dd) { margin: 0; font-family: var(--p-font-mono); font-size: var(--p-t11); color: var(--p-text-hi); }
  .body :global(a) { font-size: var(--p-t11); }
  /* A link on a line of its own is a tap target: its area grows to the small
     control height without moving anything; a link inside a sentence does not */
  .body > :global(a) { position: relative; align-self: flex-start; }
  .body > :global(a)::after { content: ''; position: absolute; inset: calc((1lh - var(--p-control-h-sm)) / 2) 0; }
  /* Hover only for a pointer that hovers: on touch a tap would leave it stuck */
  @media (hover: hover) {
    summary:hover { color: var(--p-text); }
    .close:hover { background: var(--p-hover); color: var(--p-text-hi); }
  }
</style>
