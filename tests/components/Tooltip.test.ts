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
  })

  it('shows at once on focus and hides on Escape, restoring aria-describedby', async () => {
    render(Tooltip)
    const el = button('Source unreachable')
    el.setAttribute('aria-describedby', 'other')
    await fireEvent.focusIn(el)
    flushSync()
    expect(screen.getByRole('tooltip').textContent).toBe('Source unreachable')
    await fireEvent.keyDown(document, { key: 'Escape' })
    flushSync()
    expect(screen.queryByRole('tooltip')).toBeNull()
    expect(el.getAttribute('aria-describedby')).toBe('other')
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
