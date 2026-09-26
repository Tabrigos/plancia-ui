<script lang="ts" module>
  export interface TabItem { id: string; label: string; title?: string; disabled?: boolean }
  // Ids that tie each tab to the panel
  let counter = 0
</script>
<script lang="ts">
  import type { Snippet } from 'svelte'

  /**
   * Tabs that swap the panel under them: a `tablist` and the `tabpanel` of
   * the chosen tab, tied to each other here. One tab stop: Tab reaches the
   * chosen tab, then the panel; the arrow keys move and choose at once,
   * since the panel shows without waiting, and Home and End go to the
   * ends. Only the chosen panel is mounted, afresh on every change, so a
   * panel keeps no state of its own across tabs. The tabs share the width and
   * their text wraps rather than scroll: a scrolling row would clip the
   * focus ring. For a control that swaps a large part of the page; a view
   * of the same data is a `Segmented`, more than four or five tabs a `Select`.
   */
  let {
    items,
    value = $bindable(),
    label,
    panel,
    onchange,
    class: consumerClass,
    ...rest
  }: {
    items: TabItem[]
    /** Bindable: the `id` of the chosen tab; the first enabled one when absent */
    value?: string
    /** Accessible name of the tab list, when no heading next to it names it */
    label?: string
    /** The panel of the chosen tab, given its `id` */
    panel: Snippet<[string]>
    onchange?: (id: string) => void
    /** A class of the consumer, added next to the component's own */
    class?: string
    /** The consumer's own attributes (`id`, `data-*`), on the frame */
    [key: string]: unknown
  } = $props()

  const base = `p-tabs-${++counter}`
  let list = $state<HTMLDivElement>()
  const chosen = $derived(items.find((item) => item.id === value && !item.disabled) ?? items.find((item) => !item.disabled))

  function choose(id: string): void {
    if (id === value) return
    value = id
    onchange?.(id)
  }

  function onkeydown(event: KeyboardEvent): void {
    const enabled = items.filter((item) => !item.disabled)
    const at = enabled.findIndex((item) => item.id === chosen?.id)
    const to = ({ ArrowRight: at + 1, ArrowLeft: at - 1, Home: 0, End: enabled.length - 1 } as Record<string, number>)[event.key]
    if (to === undefined || !enabled.length) return
    event.preventDefault()
    const next = enabled[(to + enabled.length) % enabled.length]
    choose(next.id)
    list?.querySelectorAll<HTMLElement>('[role="tab"]')[items.indexOf(next)]?.focus()
  }
</script>

<div {...rest} class="p-tabs {consumerClass ?? ''}">
  <div class="p-tablist" role="tablist" aria-label={label} bind:this={list}>
    {#each items as item, index (item.id)}
      {@const on = item.id === chosen?.id}
      <button type="button" role="tab" id="{base}-tab-{index}" aria-selected={on} aria-controls={on ? `${base}-panel` : undefined}
              tabindex={on ? 0 : -1} disabled={item.disabled} title={item.title} onclick={() => choose(item.id)} {onkeydown}>{item.label}</button>
    {/each}
  </div>
  {#if chosen}
    <div class="p-tabpanel" role="tabpanel" id="{base}-panel" aria-labelledby="{base}-tab-{items.indexOf(chosen)}" tabindex="0">
      {#key chosen.id}{@render panel(chosen.id)}{/key}
    </div>
  {/if}
</div>

<style>
  .p-tabs { min-width: 0; }
  /* The baseline is a shadow inside the row: the chosen tab's border covers it */
  .p-tablist { display: flex; box-shadow: inset 0 -1px 0 var(--p-border); }
  .p-tablist button {
    flex: 1 1 auto; min-width: 0; min-height: var(--p-control-h); padding: 6px 10px;
    border: 0; border-bottom: 2px solid transparent; border-radius: var(--p-r1) var(--p-r1) 0 0; background: none;
    font-family: var(--p-font-ui); font-size: var(--p-t12); font-weight: 500; line-height: 1.25; color: var(--p-text-dim);
    text-align: center; cursor: pointer;
    transition: color var(--p-motion-fast) var(--p-motion-ease), border-color var(--p-motion-fast) var(--p-motion-ease);
  }
  .p-tablist button[aria-selected='true'] { color: var(--p-text-hi); border-bottom-color: var(--p-accent); }
  .p-tablist button:disabled { opacity: 0.4; cursor: default; }
  .p-tabpanel { min-width: 0; padding-top: 12px; }
  /* Hover only for a pointer that hovers: on touch a tap would leave it stuck */
  @media (hover: hover) {
    .p-tablist button:enabled:hover { color: var(--p-text-hi); background: var(--p-hover); }
  }
</style>
