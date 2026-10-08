import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/svelte'
import { flushSync } from 'svelte'
import { Tooltip } from '../../src/index'

function button(title: string): HTMLButtonElement {
  const el = document.createElement('button')
  el.textContent = 'i'
  el.title = title
  document.body.appendChild(el)
  return el
}

beforeEach(() => {
  vi.useFakeTimers()
  vi.stubGlobal('requestAnimationFrame', (cb: FrameRequestCallback) => { cb(0); return 0 })
})
afterEach(() => {
  vi.useRealTimers()
  vi.unstubAllGlobals()
  document.body.innerHTML = ''
})

describe('Tooltip', () => {
  it('shows the title of the hovered element after the delay, and claims it', async () => {
    render(Tooltip, { props: { delay: 100 } })
    const el = button('What is Kp')
    await fireEvent.pointerOver(el)
    expect(screen.queryByRole('tooltip')).toBeNull()
    expect(el.getAttribute('title')).toBeNull()
    expect(el.dataset.tip).toBe('What is Kp')
    vi.advanceTimersByTime(100)
    flushSync()
    const tip = screen.getByRole('tooltip')
    expect(tip.textContent).toBe('What is Kp')
    expect(el.getAttribute('aria-describedby')).toBe(tip.id)
    // jsdom has no Popover API: no `popover`, so the box shows as it always did
    expect(tip.hasAttribute('popover')).toBe(false)
  })

  it('shows at once on focus next to the element\'s own descriptions, and hides on Escape', async () => {
    render(Tooltip)
    const el = button('Source unreachable')
    el.setAttribute('aria-describedby', 'hint error')
    await fireEvent.focusIn(el)
    flushSync()
    const tip = screen.getByRole('tooltip')
    expect(tip.textContent).toBe('Source unreachable')
    expect(el.getAttribute('aria-describedby')).toBe(`hint error ${tip.id}`)
    await fireEvent.keyDown(document, { key: 'Escape' })
    flushSync()
    expect(screen.queryByRole('tooltip')).toBeNull()
    expect(el.getAttribute('aria-describedby')).toBe('hint error')
  })

  it('takes away only its own id, keeping a description the app changed while it showed', async () => {
    render(Tooltip)
    const el = button('Kp index')
    el.setAttribute('aria-describedby', 'hint')
    await fireEvent.focusIn(el)
    flushSync()
    const tip = screen.getByRole('tooltip')
    // The app writes the whole attribute again, as Svelte does when an error appears
    el.setAttribute('aria-describedby', `hint error ${tip.id}`)
    await fireEvent.focusOut(el)
    flushSync()
    expect(el.getAttribute('aria-describedby')).toBe('hint error')
  })

  it('hides on pointerdown and on pointerout, and ignores elements without a title', async () => {
    render(Tooltip, { props: { delay: 0 } })
    const el = button('Details')
    await fireEvent.pointerOver(el)
    vi.advanceTimersByTime(0)
    flushSync()
    expect(screen.getByRole('tooltip')).not.toBeNull()
    await fireEvent.pointerDown(el)
    flushSync()
    expect(screen.queryByRole('tooltip')).toBeNull()
    expect(el.hasAttribute('aria-describedby')).toBe(false)
    const plain = document.createElement('span')
    document.body.appendChild(plain)
    await fireEvent.pointerOver(plain)
    vi.advanceTimersByTime(0)
    flushSync()
    expect(screen.queryByRole('tooltip')).toBeNull()
  })

  it('stays silent on touch: no tooltip from a finger, nor from the focus a tap gives', async () => {
    render(Tooltip, { props: { delay: 0 } })
    const el = button('Only for a pointer that hovers')
    await fireEvent.pointerOver(el, { pointerType: 'touch' })
    vi.advanceTimersByTime(0)
    flushSync()
    expect(screen.queryByRole('tooltip')).toBeNull()
    expect(el.getAttribute('title')).toBe('Only for a pointer that hovers')
    await fireEvent.pointerDown(el, { pointerType: 'touch' })
    await fireEvent.focusIn(el)
    flushSync()
    expect(screen.queryByRole('tooltip')).toBeNull()
    vi.advanceTimersByTime(1000)
    await fireEvent.focusIn(el)
    flushSync()
    expect(screen.getByRole('tooltip').textContent).toBe('Only for a pointer that hovers')
  })

  it('shows its box as a manual popover, in the top layer, where the browser has the Popover API', async () => {
    // jsdom has no Popover API: the method is given here, and since it opens
    // nothing, jsdom keeps the closed popover hidden (`hidden: true` finds it)
    const showPopover = vi.fn()
    const own = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'showPopover')
    Object.defineProperty(HTMLElement.prototype, 'showPopover', { value: showPopover, configurable: true, writable: true })
    try {
      render(Tooltip)
      await fireEvent.focusIn(button('Zoom in'))
      flushSync()
      const tip = screen.getByRole('tooltip', { hidden: true })
      expect(tip.getAttribute('popover')).toBe('manual')
      expect(showPopover).toHaveBeenCalledOnce()
      expect(showPopover.mock.contexts[0]).toBe(tip)
    } finally {
      if (own) Object.defineProperty(HTMLElement.prototype, 'showPopover', own)
      else delete (HTMLElement.prototype as Partial<HTMLElement>).showPopover
    }
  })

  it('hides when an element enters or leaves fullscreen, since a box shown before would stay under it', async () => {
    render(Tooltip)
    const el = button('Back to the whole disc')
    await fireEvent.focusIn(el)
    flushSync()
    expect(screen.getByRole('tooltip')).not.toBeNull()
    document.dispatchEvent(new Event('fullscreenchange'))
    flushSync()
    expect(screen.queryByRole('tooltip')).toBeNull()
    expect(el.hasAttribute('aria-describedby')).toBe(false)
  })

  it('finds the title on an ancestor of the hovered node', async () => {
    render(Tooltip, { props: { delay: 0 } })
    const el = button('Ancestor title')
    const inner = document.createElement('span')
    inner.textContent = 'x'
    el.appendChild(inner)
    await fireEvent.pointerOver(inner)
    vi.advanceTimersByTime(0)
    flushSync()
    expect(screen.getByRole('tooltip').textContent).toBe('Ancestor title')
  })
})
