<script lang="ts" module>
  let counter = 0
</script>
<script lang="ts">
  import { onMount } from 'svelte'
  import { placeTooltip } from '../tooltip-placement.js'

  /**
   * One themed tooltip for the whole page, mounted once, in place of the
   * native ones (slow, grey, off theme). Delegated: on hover or focus of an
   * element with `title` the text moves to `data-tip` (so the browser shows
   * nothing of its own) and renders in a glass box below — or above — the
   * element, inside the window, on the side that covers less of the
   * elements in `avoid` (the arithmetic is in `tooltip-placement.ts`). While
   * visible the anchor gets `aria-describedby`.
   * Silent on touch: a finger does not hover, and the focus a tap gives on
   * some phones is not a request to read; `InfoButton` explains things there.
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

  let timer: ReturnType<typeof setTimeout> | null = null
  let anchor: Element | null = null
  let describedBefore: string | null = null
  /** When a finger last touched the page: the focus that follows a tap is not a hover */
  let lastTouch = -Infinity
  const TOUCH_FOCUS_WINDOW = 1000

  function claim(target: EventTarget | null): Element | null {
    if (!(target instanceof Element)) return null
    const hit = target.closest('[title], [data-tip]')
    if (!hit) return null
    const title = hit.getAttribute('title')
    if (title !== null) {
      hit.setAttribute('data-tip', title)
      hit.removeAttribute('title')
    }
    return hit.getAttribute('data-tip') ? hit : null
  }

  function obstacles(anchorEl: Element): DOMRect[] {
    if (!avoid) return []
    return [...document.querySelectorAll(avoid)].filter((panel) => !panel.contains(anchorEl)).map((panel) => panel.getBoundingClientRect())
  }

  function place(target: Element): void {
    const p = placeTooltip(
      target.getBoundingClientRect(),
      { width: maxWidth, height: box?.offsetHeight ?? 40 },
      { width: window.innerWidth, height: window.innerHeight },
      gap,
      obstacles(target),
    )
    x = p.x
    y = p.y
    above = p.above
  }

  function show(target: Element): void {
    const tip = target.getAttribute('data-tip')
    if (!tip) return
    anchor = target
    text = tip
    visible = true
    describedBefore = target.getAttribute('aria-describedby')
    target.setAttribute('aria-describedby', tipId)
    requestAnimationFrame(() => anchor && place(anchor))
  }

  function hide(): void {
    if (timer) { clearTimeout(timer); timer = null }
    if (anchor) {
      if (describedBefore === null) anchor.removeAttribute('aria-describedby')
      else anchor.setAttribute('aria-describedby', describedBefore)
    }
    visible = false
    anchor = null
  }

  function onOver(event: PointerEvent): void {
    if (event.pointerType === 'touch') { lastTouch = performance.now(); return }
    const hit = claim(event.target)
    if (!hit || hit === anchor) return
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => show(hit), delay)
  }

  function onOut(event: PointerEvent): void {
    const to = event.relatedTarget
    if (anchor && to instanceof Node && anchor.contains(to)) return
    hide()
  }

  function onDown(event: PointerEvent): void {
    if (event.pointerType === 'touch') lastTouch = performance.now()
    hide()
  }

  function onFocus(event: FocusEvent): void {
    if (performance.now() - lastTouch < TOUCH_FOCUS_WINDOW) return
    const hit = claim(event.target)
    if (hit) show(hit)
  }

  function onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape') hide()
  }

  onMount(() => {
    const opts = { capture: true }
    document.addEventListener('pointerover', onOver, opts)
    document.addEventListener('pointerout', onOut, opts)
    document.addEventListener('pointerdown', onDown, opts)
    document.addEventListener('focusin', onFocus, opts)
    document.addEventListener('focusout', hide, opts)
    document.addEventListener('scroll', hide, opts)
    document.addEventListener('keydown', onKeydown)
    return () => {
      document.removeEventListener('pointerover', onOver, opts)
      document.removeEventListener('pointerout', onOut, opts)
      document.removeEventListener('pointerdown', onDown, opts)
      document.removeEventListener('focusin', onFocus, opts)
      document.removeEventListener('focusout', hide, opts)
      document.removeEventListener('scroll', hide, opts)
      document.removeEventListener('keydown', onKeydown)
      hide()
    }
  })
</script>

{#if visible}
  <div class="p-tip" class:above bind:this={box} role="tooltip" id={tipId} style="left:{x}px; top:{y}px; max-width:{maxWidth}px">{text}</div>
{/if}

<style>
  .p-tip {
    position: fixed; z-index: var(--p-z-tooltip);
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
