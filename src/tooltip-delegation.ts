/**
 * How `Tooltip` finds what to show: listeners delegated on the document, so
 * any element with `title` gets the themed box without a wrapper. On hover
 * after a delay, or on focus at once, the element's `title` moves to
 * `data-tip` (so the browser shows nothing of its own); a pointer that
 * leaves or presses, Escape, a scroll or a change of fullscreen hides it.
 * Silent on touch: a finger does not hover, and the focus a tap gives on
 * some phones is not a request to read. The box itself, its place and its
 * popover stay in the component. Internal: not in the package's `exports`.
 */

/** How long after a touch a focus is taken as the tap's, in milliseconds */
const TOUCH_FOCUS_WINDOW = 1000

export interface Delegation {
  /** Milliseconds between hover and tooltip */
  delay: () => number
  /** The element whose tooltip shows, if any */
  anchor: () => Element | null
  show: (target: Element) => void
  hide: () => void
}

/** The element with a tooltip at an event's target or above it, its `title` moved to `data-tip` */
export function claim(target: EventTarget | null): Element | null {
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

/** The tip says what the anchor's name already says: `aria-labelledby`, `aria-label` or its own text */
function repeatsName(target: Element): boolean {
  const flat = (text: string | null | undefined) => (text ?? '').replace(/\s+/g, ' ').trim().toLowerCase()
  const labels = (target.getAttribute('aria-labelledby') ?? '').split(/\s+/).map((id) => (id && document.getElementById(id)?.textContent) || '')
  const name = flat(labels.join(' ')) || flat(target.getAttribute('aria-label')) || flat(target.textContent)
  return name === flat(target.getAttribute('data-tip'))
}

// Next to the anchor's own descriptions, never in their place, and taken
// away alone: a field's hint and error are still read with the tooltip,
// and a description the app changes meanwhile is not rolled back. A tip
// that only repeats the name is left out: it would be read twice
export function describe(target: Element, tipId: string, withTip: boolean): void {
  const ids = (target.getAttribute('aria-describedby') ?? '').split(/\s+/).filter((id) => id && id !== tipId)
  if (withTip && !repeatsName(target)) ids.push(tipId)
  if (ids.length) target.setAttribute('aria-describedby', ids.join(' '))
  else target.removeAttribute('aria-describedby')
}

/** Listens on the document and calls `show` and `hide`; returns what stops it */
export function delegate(on: Delegation): () => void {
  let timer: ReturnType<typeof setTimeout> | null = null
  let lastTouch = -Infinity
  // A title the app writes again while the tip shows, as a button naming its
  // next action does on click, is claimed and shown at once; emptied, it hides
  const watcher = new MutationObserver(() => {
    const anchor = on.anchor()
    if (!anchor?.hasAttribute('title')) return
    if (claim(anchor)) show(anchor)
    else hide()
  })

  function show(target: Element): void {
    on.show(target)
    watcher.disconnect()
    watcher.observe(target, { attributes: true, attributeFilter: ['title'] })
  }

  function hide(): void {
    if (timer) { clearTimeout(timer); timer = null }
    watcher.disconnect()
    on.hide()
  }

  function onOver(event: PointerEvent): void {
    if (event.pointerType === 'touch') { lastTouch = performance.now(); return }
    const hit = claim(event.target)
    if (!hit || hit === on.anchor()) return
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => show(hit), on.delay())
  }

  function onOut(event: PointerEvent): void {
    const to = event.relatedTarget
    const anchor = on.anchor()
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

  const stop = new AbortController()
  const opts = { capture: true, signal: stop.signal }
  document.addEventListener('pointerover', onOver, opts)
  document.addEventListener('pointerout', onOut, opts)
  document.addEventListener('pointerdown', onDown, opts)
  document.addEventListener('focusin', onFocus, opts)
  document.addEventListener('focusout', hide, opts)
  document.addEventListener('scroll', hide, opts)
  document.addEventListener('keydown', onKeydown, { signal: stop.signal })
  // A box shown before an element went fullscreen would stay under it
  document.addEventListener('fullscreenchange', hide, { signal: stop.signal })
  return () => { stop.abort(); hide() }
}
