<script lang="ts">
  import type { Snippet } from 'svelte'

  /**
   * A key, as shown in help texts and hints: "Esc closes", "↑ ↓ to move".
   * Monospace on a raised inset, so a key reads as a key and not as a word.
   * A combination is several `Kbd` side by side, the app puts the "+".
   */
  let { children }: { children?: Snippet } = $props()
</script>

<kbd class="p-kbd">{@render children?.()}</kbd>

<style>
  .p-kbd {
    display: inline-block; padding: 1px 5px; min-width: 18px; text-align: center;
    border: 1px solid var(--p-border-strong); border-bottom-width: 2px; border-radius: var(--p-r1);
    background: var(--p-s2); color: var(--p-text-hi);
    font-family: var(--p-font-mono); font-size: var(--p-t11); line-height: 1.4; white-space: nowrap;
  }
</style>
