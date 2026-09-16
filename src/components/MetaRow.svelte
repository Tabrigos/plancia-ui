<script lang="ts">
  import type { Snippet } from 'svelte'

  /**
   * Metadata row under the content of a card: data age, thresholds, notes
   * on method, small actions. 11 px, dim color, items at the two ends
   * (`align="start"` to line them up), wrapping by whole item when they
   * do not fit: a value is never split. Every item carries its own
   * tooltip with `title`; a `<b>` inside is the highlighted value (mono, hi).
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
