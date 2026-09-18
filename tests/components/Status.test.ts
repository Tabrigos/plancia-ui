import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/svelte'
import { Status } from '../../src/index'

describe('Status', () => {
  it('shows a spinner while loading and marks the region busy', () => {
    const { container } = render(Status, { props: { kind: 'loading', text: 'loading' } })
    const status = screen.getByRole('status')
    expect(status.getAttribute('aria-busy')).toBe('true')
    expect(container.querySelector('.p-spinner')).not.toBeNull()
    expect(container.querySelector('.p-dot')).toBeNull()
    expect(container.querySelector('.text')?.textContent).toBe('loading')
  })

  it('shows a dot with the tone of the state otherwise', () => {
    for (const [kind, tone] of [['ok', 'ok'], ['stale', 'warn'], ['error', 'danger']] as const) {
      const { container, unmount } = render(Status, { props: { kind, text: kind } })
      expect(container.querySelector(`.p-dot.${tone}`)).not.toBeNull()
      expect(screen.getByRole('status').hasAttribute('aria-busy')).toBe(false)
      unmount()
    }
    const { container } = render(Status)
    expect(container.querySelector('.p-status.idle .p-dot')).not.toBeNull()
  })

  it('is named by the title when it has no text, and takes the help cursor', () => {
    render(Status, { props: { kind: 'error', title: 'Source unreachable', help: true } })
    const status = screen.getByRole('status', { name: 'Source unreachable' })
    expect(status.title).toBe('Source unreachable')
    expect(status.classList.contains('help')).toBe(true)
  })
})
