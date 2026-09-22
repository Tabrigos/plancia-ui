<script lang="ts">
  import type { Snippet } from 'svelte'
  import PanelHead from './PanelHead.svelte'
  import { keyboardScroll } from '../keyboard-scroll.js'

  /**
   * A floating panel over a stage (a globe, a map): the `p-panel` frame with
   * a translucent backdrop, `PanelHead` touching the edges, the body
   * scrolling inside a bounded height, and the behavior three panels used
   * to repeat: Esc closes while focus is inside, focus returns to the
   * opener on close. Under 700 px it is a bottom sheet: the stage stays
   * visible above, the head is fixed, the body scrolls, the safe area of a
   * phone is respected. The app positions it (a class with `position`,
   * `top`, `right`, `width`) and decides when it exists, one at a time on a
   * phone: the package never keeps an open/closed state.
   */
  let {
    title,
    subtitle,
    subtitleTitle,
    chips,
    actions,
    onclose,
    closeLabel,
    opener,
    autofocus = false,
    label,
    children,
    class: consumerClass,
    ...rest
  }: {
    title: string
    subtitle?: string
    subtitleTitle?: string
    chips?: Snippet
    actions?: Snippet
    /** Called by the close button and by Esc; the app then removes the panel */
    onclose?: () => void
    closeLabel?: string
    /** The element (or its id) that opened the panel: focus goes back to it on close, if it was inside */
    opener?: HTMLElement | string
    /** Move focus into the panel on mount (a dialog the user asked for) */
    autofocus?: boolean
    /** Accessible name of the dialog; the title when absent */
    label?: string
    children?: Snippet
    class?: string
    [key: string]: unknown
  } = $props()

  let panel = $state<HTMLElement | null>(null)

  function resolveOpener(): HTMLElement | null {
    if (!opener) return null
    return typeof opener === 'string' ? document.getElementById(opener) : opener
  }

  function close(): void {
    const hadFocus = panel?.contains(document.activeElement) ?? false
    onclose?.()
    if (hadFocus) resolveOpener()?.focus()
  }

  function onkeydown(event: KeyboardEvent): void {
    if (event.key !== 'Escape' || !onclose) return
    event.stopPropagation()
    close()
  }

  $effect(() => {
    if (autofocus) panel?.focus()
  })
</script>

<section {...rest} class="p-floating {consumerClass ?? ''}" role="dialog" aria-label={label ?? title} tabindex="-1" bind:this={panel} {onkeydown}>
  <PanelHead {title} {subtitle} {subtitleTitle} {chips} {actions} onclose={onclose ? close : undefined} {closeLabel} />
  <div class="body" use:keyboardScroll>{@render children?.()}</div>
</section>

<style>
  .p-floating {
    display: flex; flex-direction: column;
    max-height: var(--p-floating-max-height, calc(100dvh - 110px));
    background: var(--p-s3a); backdrop-filter: blur(16px) saturate(1.3);
    border: 1px solid var(--p-border); border-radius: var(--p-r3); box-shadow: var(--p-sh2);
    color: var(--p-text); outline: none;
    animation: p-float-in var(--p-motion-base) var(--p-motion-ease);
  }
  @keyframes p-float-in { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: none; } }
  .p-floating:focus-visible { box-shadow: var(--p-sh2), var(--p-focus); }
  .body { flex: 1; min-height: 0; overflow-y: auto; padding: var(--p-space-3) var(--p-space-4) var(--p-space-4); }
  /* A phone has no room for a panel beside the stage: the panel becomes a
     sheet from the bottom, the stage stays visible above it. The doubled
     class outweighs the single class the app positions with, without
     reaching an id: position with a class, not an id. `dvh` follows the
     address bar of a phone browser; the safe-area inset keeps the body off
     the home indicator (the app's viewport meta needs `viewport-fit=cover`). */
  @media (max-width: 700px) {
    .p-floating.p-floating {
      top: auto; bottom: 0; left: 0; right: 0; width: auto;
      max-height: var(--p-floating-max-height, 60dvh);
      border-radius: var(--p-r3) var(--p-r3) 0 0; border-bottom: none;
      padding-bottom: env(safe-area-inset-bottom, 0px);
      animation-name: p-sheet-in;
    }
  }
  @keyframes p-sheet-in { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: none; } }
</style>
