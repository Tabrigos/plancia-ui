<script lang="ts" module>
  export type StatusKind = 'loading' | 'ok' | 'stale' | 'error' | 'idle'
</script>
<script lang="ts">
  /**
   * Inline state of a datum or a layer: a spinner while loading, a status
   * dot with the semantic tone otherwise (ok, stale = warn, error = danger,
   * idle = neutral), a short text next to it, a `title` that explains. It
   * sits inside a row (`SettingRow`, `MetaRow`, a `Section` summary line);
   * `Notice` is the block message, this is the glance.
   */
  let {
    kind = 'idle',
    text,
    title,
    help = false,
  }: {
    kind?: StatusKind
    /** Short text next to the indicator; with no text the indicator is named by `title` */
    text?: string
    /** Native tooltip: what happened, what to expect */
    title?: string
    /** The title explains: help cursor */
    help?: boolean
  } = $props()

  const tone = $derived({ loading: 'accent', ok: 'ok', stale: 'warn', error: 'danger', idle: '' }[kind])
</script>

<span class="p-status {kind}" class:help role="status" aria-busy={kind === 'loading' ? true : undefined} aria-label={text ? undefined : title} {title}>
  {#if kind === 'loading'}<i class="p-spinner" aria-hidden="true"></i>{:else}<i class="p-dot {tone}" aria-hidden="true"></i>{/if}
  {#if text}<span class="text">{text}</span>{/if}
</span>

<style>
  .p-status { display: inline-flex; align-items: center; gap: 6px; font-size: var(--p-t11); color: var(--p-text-dim); white-space: nowrap; }
  .p-status.help { cursor: help; }
  .p-status.stale .text { color: var(--p-warn); }
  .p-status.error .text { color: var(--p-danger); }
</style>
