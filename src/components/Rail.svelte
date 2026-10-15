<script lang="ts" module>
  let counter = 0
</script>
<script lang="ts">
  import type { Snippet } from 'svelte'
  import type { TabItem } from './Tabs.svelte'
  import { tabAfterKey } from '../tab-keys.js'

  /**
   * Tabs in a narrow column beside their panel, an icon over a short label
   * each, for more modes than a row of tabs holds. One tab stop; up and
   * down choose and wrap, Home and End go to the ends. The panel takes the
   * room left and scrolls, as with `Tabs fill`. The app can hide it while
   * the rail stays (`open`); choosing an item opens it again, the chosen
   * one never closes it: a tab is not a switch. A brand on top and a few
   * actions at the bottom stay outside the list. On a phone, rail and
   * panel go together in a `Drawer`.
   */
  let {
    items,
    value = $bindable(),
    open = $bindable(true),
    label,
    icon,
    panel,
    header,
    actions,
    onchange,
    class: consumerClass,
    ...rest
  }: {
    /** `label` under the icon, a word or two; `title` the accessible name and tooltip, longer, holding the label */
    items: TabItem[]
    /** Bindable: the `id` of the chosen item; the first enabled one when absent */
    value?: string
    /** Bindable: the panel shows; choosing an item sets it */
    open?: boolean
    /** Accessible name of the list of items */
    label?: string
    /** The icon of an item, given its `id`; the icons are the app's */
    icon: Snippet<[string]>
    /** The panel of the chosen item, given its `id` */
    panel: Snippet<[string]>
    /** Above the items: a brand */
    header?: Snippet
    /** Below the items, outside the list: a theme switch, the button that hides the panel */
    actions?: Snippet
    onchange?: (id: string) => void
    /** A class of the consumer, added next to the component's own */
    class?: string
    /** The consumer's own attributes (`id`, `data-*`), on the frame */
    [key: string]: unknown
  } = $props()

  const base = `p-rail-${++counter}`
  let list = $state<HTMLDivElement>()
  const chosen = $derived(items.find((item) => item.id === value && !item.disabled) ?? items.find((item) => !item.disabled))

  function choose(id: string): void {
    open = true
    if (id === value) return
    value = id
    onchange?.(id)
  }

  function onkeydown(event: KeyboardEvent): void {
    const next = tabAfterKey(items, chosen?.id, event.key, true)
    if (!next) return
    event.preventDefault()
    choose(next.id)
    list?.querySelectorAll<HTMLElement>('[role="tab"]')[items.indexOf(next)]?.focus()
  }
</script>

<div {...rest} class="p-rail {consumerClass ?? ''}">
  <div class="column">
    {#if header}<div class="header">{@render header()}</div>{/if}
    <div class="items" role="tablist" aria-label={label} aria-orientation="vertical" bind:this={list}>
      {#each items as item, index (item.id)}
        {@const on = item.id === chosen?.id}
        <button type="button" role="tab" id="{base}-tab-{index}" aria-selected={on} aria-controls={on && open ? `${base}-panel` : undefined}
                tabindex={on ? 0 : -1} disabled={item.disabled} title={item.title} aria-label={item.title} onclick={() => choose(item.id)} {onkeydown}>
          <span class="icon" aria-hidden="true">{@render icon(item.id)}</span>
          <span class="label">{item.label}</span>
        </button>
      {/each}
    </div>
    {#if actions}<div class="actions">{@render actions()}</div>{/if}
  </div>
  {#if open && chosen}
    <!-- The whole panel is new on every change: a panel that scrolls starts at the top -->
    {#key chosen.id}
      <div class="p-railpanel" role="tabpanel" id="{base}-panel" aria-labelledby="{base}-tab-{items.indexOf(chosen)}" tabindex="0">
        {@render panel(chosen.id)}
      </div>
    {/key}
  {/if}
</div>

<style>
  .p-rail { display: flex; min-width: 0; min-height: 0; }
  .column { display: flex; flex: none; flex-direction: column; width: var(--p-rail-w); border-right: 1px solid var(--p-border); }
  .header, .actions { display: flex; flex: none; flex-direction: column; align-items: center; gap: var(--p-space-2); padding: var(--p-space-3) 0; }
  .items { display: flex; flex: 1; flex-direction: column; min-height: 0; }
  .items button {
    display: flex; flex-direction: column; align-items: center; gap: var(--p-space-1); min-height: max(var(--p-control-h), var(--p-tap-h)); padding: var(--p-space-2) 0;
    border: 0; border-right: 2px solid transparent; background: none; color: var(--p-text-dim); cursor: pointer;
    transition: color var(--p-motion-fast) var(--p-motion-ease), border-color var(--p-motion-fast) var(--p-motion-ease);
  }
  .icon { display: flex; }
  .label { font-family: var(--p-font-ui); font-size: var(--p-t11); font-weight: 500; line-height: 1.25; text-align: center; overflow-wrap: break-word; }
  .items button[aria-selected='true'] { color: var(--p-text-hi); border-right-color: var(--p-accent); }
  .items button[aria-selected='true'] .icon { color: var(--p-accent); }
  .items button:disabled { opacity: 0.4; cursor: default; }
  /* Item and panel draw their focus ring inside themselves: the column and
     the frame the app sizes would clip one drawn outside */
  .items button:focus-visible, .p-railpanel:focus-visible { box-shadow: none; outline: 2px solid var(--p-accent); outline-offset: -2px; }
  .p-railpanel { flex: 1; min-width: 0; min-height: 0; overflow: auto; overscroll-behavior: contain; }
  /* Hover only for a pointer that hovers: on touch a tap would leave it stuck */
  @media (hover: hover) {
    .items button:enabled:hover { color: var(--p-text-hi); background: var(--p-hover); }
  }
</style>
