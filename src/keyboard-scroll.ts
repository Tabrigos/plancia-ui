/**
 * A Svelte action for a box that scrolls: while its content overflows and
 * holds nothing focusable, the box itself becomes a tab stop, so a keyboard
 * can reach it and scroll it with the arrows. Chrome and Firefox do this by
 * themselves; Safari does not, and axe flags the box. Internal: not in the
 * package's `exports`.
 */
const FOCUSABLE = 'a[href], button, input, select, textarea, summary, [tabindex]:not([tabindex="-1"])'

export function keyboardScroll(element: HTMLElement): { destroy(): void } {
  const measure = () => {
    const reachable = element.scrollHeight > element.clientHeight && !element.querySelector(FOCUSABLE)
    if (reachable) element.setAttribute('tabindex', '0')
    else element.removeAttribute('tabindex')
  }
  // The box resizes with the viewport; the content changes without resizing it
  const resize = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(measure)
  const mutation = new MutationObserver(measure)
  resize?.observe(element)
  mutation.observe(element, { childList: true, subtree: true, characterData: true })
  measure()
  return {
    destroy() {
      resize?.disconnect()
      mutation.disconnect()
    },
  }
}
