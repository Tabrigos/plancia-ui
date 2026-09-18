<script lang="ts">
  import type { Snippet } from 'svelte'
  import { getLabels } from '../labels.svelte.js'

  /**
   * The one panel head: title 14/600, optional monospace subtitle, optional
   * chips under the title (`chips`), actions on the right (`actions`), the
   * close button always last (`onclose`).
   */
  let {
    title,
    subtitle,
    subtitleTitle,
    chips,
    actions,
    onclose,
    closeLabel,
  }: {
    title: string
    subtitle?: string
    /** Native tooltip on the subtitle (what that datum is) */
    subtitleTitle?: string
    chips?: Snippet
    actions?: Snippet
    onclose?: () => void
    /** Accessible name and tooltip of the close button; the default comes from `setLabels()` */
    closeLabel?: string
  } = $props()

  const labels = getLabels()
</script>

<div class="p-ph">
  <div class="text">
    <div class="line"><span class="title">{title}</span>{#if subtitle}<span class="sub" class:help={Boolean(subtitleTitle)} title={subtitleTitle}>{subtitle}</span>{/if}</div>
    {#if chips}<div class="chips">{@render chips()}</div>{/if}
  </div>
  <div class="sp"></div>
  {#if actions}<div class="actions">{@render actions()}</div>{/if}
  {#if onclose}
    <button type="button" class="close" onclick={onclose} title={closeLabel ?? labels.close} aria-label={closeLabel ?? labels.close}>
      <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round"><path d="M4 4l8 8M12 4l-8 8"/></svg>
    </button>
  {/if}
</div>

<style>
  .p-ph { display: flex; align-items: flex-start; gap: 10px; padding: 12px 14px; border-bottom: 1px solid var(--p-border); }
  .text { display: flex; flex-direction: column; gap: 6px; min-width: 0; }
  .line { display: flex; align-items: baseline; gap: 10px; min-width: 0; }
  .title { font-size: var(--p-t14); font-weight: 600; color: var(--p-text-hi); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .sub { font-family: var(--p-font-mono); font-size: var(--p-t11); color: var(--p-text-dim); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .sub.help { cursor: help; text-decoration: underline dotted; text-underline-offset: 3px; }
  .chips { display: flex; gap: 6px; flex-wrap: wrap; }
  .sp { flex: 1; }
  .actions { display: flex; align-items: center; gap: 6px; }
  .close {
    display: inline-flex; align-items: center; justify-content: center; width: 26px; height: 26px; margin: -3px -4px 0 0;
    border: none; border-radius: var(--p-r2); background: transparent; color: var(--p-text-dim); cursor: pointer;
  }
  .close:hover { background: var(--p-hover); color: var(--p-text-hi); }
</style>
