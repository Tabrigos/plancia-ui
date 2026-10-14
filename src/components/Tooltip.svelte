<script lang="ts" module>
  let counter = 0
</script>
<script lang="ts">
  import { onMount } from 'svelte'
  import { placeTooltip } from '../tooltip-placement.js'
  import { delegate, describe } from '../tooltip-delegation.js'

  /**
   * One themed tooltip for the whole page, mounted once, in place of the
   * native ones (slow, grey, off theme). Delegated: on hover or focus of an
   * element with `title` (how, and when it hides, is in
   * `tooltip-delegation.ts`) the text renders in a glass box below — or
   * above — the element, inside the window, on the side that covers less of
   * the elements in `avoid` (the arithmetic is in `tooltip-placement.ts`).
   * While visible its id is added to the anchor's `aria-describedby`. The
   * box is a popover in the top layer, so it shows over an element in
   * fullscreen. Silent on touch; `InfoButton` explains things there.
   * Keep writing `title`: this is the only change.
   */
  let {
    delay = 180,
    maxWidth = 300,
    gap = 8,
    avoid,
  }: {
    /** Milliseconds between hover and tooltip; focus shows it at once */
    delay?: number
    maxWidth?: number
    /** Distance from the element, in pixels */
    gap?: number
    /** Selector of the elements the tooltip should not cover (floating panels); an element's own panel does not count */
    avoid?: string
  } = $props()

  const tipId = `p-tip-${++counter}`
  let visible = $state(false)
  let text = $state('')
  let x = $state(0)
  let y = $state(0)
  let above = $state(false)
  let box = $state<HTMLDivElement | null>(null)

  let anchor: Element | null = null

  function obstacles(anchorEl: Element): DOMRect[] {
    if (!avoid) return []
    return [...document.querySelectorAll(avoid)].filter((panel) => !panel.contains(anchorEl)).map((panel) => panel.getBoundingClientRect())
  }

  // Centered by its own width: a short text makes a box narrower than maxWidth
  function place(target: Element): void {
    const p = placeTooltip(
      target.getBoundingClientRect(),
      { width: box?.offsetWidth ?? maxWidth, height: box?.offsetHeight ?? 40 },
      { width: window.innerWidth, height: window.innerHeight },
      gap,
      obstacles(target),
    )
    x = p.x
    y = p.y
    above = p.above
  }

  // An element in fullscreen is drawn alone with its subtree, and the box,
  // at the root, would stay behind it: the top layer is above, and free of
  // the overflow and z-index of any ancestor too. Without the Popover API the
  // box gets no `popover` (a closed one is hidden) and stays fixed, as before
  const topLayer = typeof HTMLElement !== 'undefined' && typeof HTMLElement.prototype.showPopover === 'function'
  $effect(() => {
    if (box && topLayer) box.showPopover()
  })

  function show(target: Element): void {
    const tip = target.getAttribute('data-tip')
    if (!tip) return
    anchor = target
    text = tip
    visible = true
    describe(target, tipId, true)
    requestAnimationFrame(() => anchor && place(anchor))
  }

  function hide(): void {
    if (anchor) describe(anchor, tipId, false)
    visible = false
    anchor = null
  }

  onMount(() => delegate({ delay: () => delay, anchor: () => anchor, show, hide }))
</script>

{#if visible}
  <div class="p-tip" class:above bind:this={box} popover={topLayer ? 'manual' : undefined} role="tooltip" id={tipId} style="left:{x}px; top:{y}px; max-width:{maxWidth}px">{text}</div>
{/if}

<style>
  .p-tip {
    /* inset and margin undo the centering a popover gets from the browser;
       the width is the text's, never the room left before the window's edge,
       so the box measures the same wherever it stood before it moves */
    position: fixed; z-index: var(--p-z-tooltip); inset: auto; margin: 0; width: max-content;
    padding: 7px 10px;
    background: var(--p-s3a); backdrop-filter: blur(12px) saturate(1.2);
    border: 1px solid var(--p-border-strong); border-radius: var(--p-r2); box-shadow: var(--p-sh1);
    color: var(--p-text-hi); font-family: var(--p-font-ui); font-size: var(--p-t12); line-height: 1.45;
    pointer-events: none;
    animation: p-tip-in var(--p-motion-fast) var(--p-motion-ease);
  }
  @keyframes p-tip-in { from { opacity: 0; transform: translateY(-2px); } to { opacity: 1; transform: none; } }
  .p-tip.above { animation-name: p-tip-in-above; }
  @keyframes p-tip-in-above { from { opacity: 0; transform: translateY(2px); } to { opacity: 1; transform: none; } }
</style>
