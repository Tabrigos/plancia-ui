import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/svelte'
import { flushSync } from 'svelte'
import { LiveRegion, announce } from '../src/index'

beforeEach(() => vi.useFakeTimers())
afterEach(() => vi.useRealTimers())

async function settle(): Promise<void> {
  await Promise.resolve()
  flushSync()
}

describe('announce and LiveRegion', () => {
  it('is a polite status region, empty until something is announced', () => {
    render(LiveRegion)
    const region = screen.getByRole('status')
    expect(region.getAttribute('aria-live')).toBe('polite')
    expect(region.classList.contains('p-sr-only')).toBe(true)
    expect(region.textContent).toBe('')
  })

  it('shows the announced text and empties it after five seconds', async () => {
    render(LiveRegion)
    announce('Panel closed')
    await settle()
    expect(screen.getByRole('status').textContent).toBe('Panel closed')
    vi.advanceTimersByTime(5000)
    flushSync()
    expect(screen.getByRole('status').textContent).toBe('')
  })

  it('empties and rewrites the same text so it is read again', async () => {
    render(LiveRegion)
    announce('ISS selected')
    await settle()
    const seen: string[] = []
    const observer = new MutationObserver(() => seen.push(screen.getByRole('status').textContent ?? ''))
    observer.observe(screen.getByRole('status'), { childList: true, characterData: true, subtree: true })
    announce('ISS selected')
    flushSync()
    await settle()
    observer.disconnect()
    expect(seen).toContain('')
    expect(screen.getByRole('status').textContent).toBe('ISS selected')
  })
})
