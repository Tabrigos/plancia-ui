<script lang="ts">
  import type { Snippet } from 'svelte'

  /**
   * Control row of a card: label on the left (never wrapping, ellipsis
   * when it does not fit), controls on the right — a toggle, an (i)
   * button, a chip. It is the head of the cards of a console.
   *
   * `help` sets the help cursor: use it when `title` really explains the
   * datum, not to repeat the label.
   */
  let {
    label,
    title,
    help = false,
    tone = 'hi',
    children,
  }: {
    label: string
    title?: string
    /** The title explains the datum: help cursor */
    help?: boolean
    /** `hi` (default) or `dim` for secondary rows */
    tone?: 'hi' | 'dim'
    /** The controls on the right, in the order they must appear */
    children?: Snippet
  } = $props()
</script>

<div class="p-ctl-row">
  <span class="p-ctl-label {tone}" class:help {title}>{label}</span>
  {#if children}<span class="ctl">{@render children()}</span>{/if}
</div>

<style>
  .p-ctl-row { display: flex; align-items: center; justify-content: space-between; gap: 8px; }
  .p-ctl-label {
    flex: 1; min-width: 0;
    font-size: var(--p-t12);
    color: var(--p-text-hi);
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  }
  .p-ctl-label.dim { color: var(--p-text-dim); }
  .p-ctl-label.help { cursor: help; }
  .ctl { display: flex; align-items: center; gap: 6px; flex: none; }
</style>
