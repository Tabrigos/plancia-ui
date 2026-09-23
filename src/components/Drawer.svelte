<script lang="ts">
  import { tick, untrack, type Snippet } from 'svelte'

  /**
   * A drawer: a panel that slides in from a side of the app's container.
   * Two uses. `modal` (a phone, a short screen): over the stage, with a
   * scrim that closes it, Esc, focus trapped inside. Otherwise a column
   * next to the stage that the user can retract. Either way focus moves in
   * on open, goes back to the `opener` on close if it was inside, and a
   * closed drawer is `inert`. The app owns the state, the side, the width
   * (a class of its own) and the content: this is the shape.
   */
  let {
    open,
    onclose,
    label,
    modal = false,
    side = 'left',
    opener,
    children,
    class: consumerClass,
    ...rest
  }: {
    /** Open or closed: the state is the app's */
    open: boolean
    /** Called by the scrim and by Esc when modal; the app then closes it */
    onclose: () => void
    /** Accessible name of the drawer */
    label: string
    /** Over the stage with a scrim and focus trapped (a phone); otherwise a column beside it */
    modal?: boolean
    /** The edge it slides from */
    side?: 'left' | 'right'
    /** The element (or its id) that opens it: focus goes back to it on close, if it was inside */
    opener?: HTMLElement | string
    children?: Snippet
    /** A class of the consumer (the width), added next to the component's own */
    class?: string
    /** The consumer's own attributes (`id`, `data-*`, …) */
    [key: string]: unknown
  } = $props()

  const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), summary, [tabindex]:not([tabindex="-1"])'

  let panel = $state<HTMLElement | null>(null)
  // Deliberately not reactive: the effect compares against it
  let wasOpen = untrack(() => open)
  let hadFocus = false

  // Before the DOM changes: turning inert, the drawer loses the focus it had
  $effect.pre(() => {
    if (!open && wasOpen) hadFocus = panel?.contains(document.activeElement) ?? false
  })

  // After: focus moves in on open (the control that opened it often hides),
  // back to the opener on close. The first run leaves focus alone.
  $effect(() => {
    if (open === wasOpen) return
    wasOpen = open
    if (open) {
      panel?.focus({ preventScroll: true })
    } else if (hadFocus && opener) {
      hadFocus = false
      // The opener may reappear with the app's own update: one tick later
      void tick().then(() => (typeof opener === 'string' ? document.getElementById(opener) : opener)?.focus({ preventScroll: true }))
    }
  })

  function onkeydown(event: KeyboardEvent): void {
    if (!modal || !open || !panel) return
    if (event.key === 'Escape') {
      event.stopPropagation()
      onclose()
      return
    }
    if (event.key !== 'Tab') return
    const items = [...panel.querySelectorAll<HTMLElement>(FOCUSABLE)].filter((item) => item.getClientRects().length > 0 && !item.closest('[inert]'))
    if (items.length === 0) return
    const [first, last] = [items[0], items[items.length - 1]]
    if (event.shiftKey && (document.activeElement === first || document.activeElement === panel)) {
      event.preventDefault()
      last.focus()
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault()
      first.focus()
    }
  }
</script>

{#if modal}
  <div class="p-drawer-scrim" class:on={open} role="presentation" onclick={onclose}></div>
{/if}
<div {...rest} class="p-drawer {side} {consumerClass ?? ''}" class:closed={!open} class:modal inert={open ? undefined : true} tabindex="-1" bind:this={panel}
     role={modal ? 'dialog' : 'region'} aria-modal={modal && open ? 'true' : undefined} aria-label={label} {onkeydown}>
  {@render children?.()}
</div>

<style>
  /* Placed against the app's container (its nearest positioned ancestor),
     full height; the padding keeps the content off a notch or a home bar */
  .p-drawer {
    position: absolute; top: 0; bottom: 0; z-index: var(--p-z-panel); display: flex; flex-direction: column;
    padding: env(safe-area-inset-top, 0px) 0 env(safe-area-inset-bottom, 0px);
    background: var(--p-s1a); backdrop-filter: blur(16px) saturate(1.3); color: var(--p-text); outline: none;
    transition: transform var(--p-motion-base) var(--p-motion-ease);
  }
  .p-drawer.left { left: 0; padding-left: env(safe-area-inset-left, 0px); border-right: 1px solid var(--p-border); }
  .p-drawer.right { right: 0; padding-right: env(safe-area-inset-right, 0px); border-left: 1px solid var(--p-border); }
  .p-drawer.left.closed { transform: translateX(-101%); }
  .p-drawer.right.closed { transform: translateX(101%); }
  .p-drawer.modal { z-index: var(--p-z-modal); box-shadow: var(--p-sh2); }
  .p-drawer:focus-visible { box-shadow: var(--p-focus); }
  .p-drawer-scrim {
    position: absolute; inset: 0; z-index: calc(var(--p-z-modal) - 1); visibility: hidden; opacity: 0;
    background: color-mix(in srgb, var(--p-bg) 55%, transparent); backdrop-filter: blur(1px);
    transition: opacity var(--p-motion-base) var(--p-motion-ease), visibility var(--p-motion-base);
  }
  .p-drawer-scrim.on { visibility: visible; opacity: 1; }
</style>
