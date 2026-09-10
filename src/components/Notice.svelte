<script lang="ts" module>
  export type NoticeKind = 'empty' | 'info' | 'warn' | 'error'
</script>

<script lang="ts">
  import type { Snippet } from 'svelte'

  /**
   * Stati con un solo vocabolario: `empty` (inset neutro), `info`, `warn`
   * (warn-soft), `error` (danger-soft, con azione a destra se c'è).
   */
  let {
    kind = 'info',
    title,
    text,
    children,
  }: { kind?: NoticeKind; title?: string; text?: string; children?: Snippet } = $props()
</script>

<div class="p-notice {kind}" role={kind === 'error' ? 'alert' : 'status'}>
  {#if kind === 'warn' || kind === 'error'}
    <svg class="ic" width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M8 2.5l6 11H2z"/><path d="M8 7v3M8 11.5v.5"/></svg>
  {:else if kind === 'info'}
    <svg class="ic" width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round"><circle cx="8" cy="8" r="6.5"/><path d="M8 7v4M8 5v.5"/></svg>
  {/if}
  <div class="body">
    {#if title}<div class="title">{title}</div>{/if}
    {#if text}<div class="text">{text}</div>{/if}
  </div>
  {#if children}<div class="action">{@render children()}</div>{/if}
</div>

<style>
  .p-notice { display: flex; align-items: center; gap: 8px; padding: 8px 10px; border-radius: var(--p-r2); border: 1px solid var(--p-border); background: var(--p-inset); }
  .p-notice.empty { padding: 14px; }
  .p-notice.info { background: var(--p-info-soft); border-color: color-mix(in srgb, var(--p-info) 30%, transparent); color: var(--p-info); }
  .p-notice.warn { background: var(--p-warn-soft); border-color: color-mix(in srgb, var(--p-warn) 30%, transparent); color: var(--p-warn); }
  .p-notice.error { background: var(--p-danger-soft); border-color: color-mix(in srgb, var(--p-danger) 30%, transparent); color: var(--p-danger); }
  .ic { flex: none; }
  .body { display: flex; flex-direction: column; gap: 2px; min-width: 0; flex: 1; }
  .title { font-size: var(--p-t13); font-weight: 500; color: var(--p-text-hi); }
  .p-notice.warn .title, .p-notice.error .title, .p-notice.info .title { font-size: var(--p-t12); }
  .text { font-size: var(--p-t12); color: var(--p-text-dim); }
  .action { flex: none; }
</style>
