<script lang="ts">
  /** The code of a recipe: the source of the very file that runs above it, to copy. */
  let { label, source }: { label: string; source: string } = $props()
</script>

<details class="code">
  <summary>{label}</summary>
  <!-- Focusable, so a keyboard can scroll a long line (axe: scrollable-region-focusable) -->
  <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
  <pre tabindex="0" role="region" aria-label="Code of {label}"><code>{source.trim()}</code></pre>
</details>

<style>
  .code { border: 1px solid var(--p-border); border-radius: var(--p-r2); background: var(--p-inset); }
  summary { padding: max(6px, calc((var(--p-control-h-sm) - 1lh) / 2)) 12px; border-radius: var(--p-r2); font-family: var(--p-font-mono); font-size: var(--p-t12); color: var(--p-text-dim); cursor: pointer; }
  pre { margin: 0; padding: 12px; max-height: 480px; overflow: auto; border-top: 1px solid var(--p-border-soft); font-family: var(--p-font-mono); font-size: var(--p-t12); line-height: 1.5; color: var(--p-text); tab-size: 2; }
</style>
