import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/svelte'
import { Notice } from '../../src/index'
import { html } from '../helpers'

describe('Notice', () => {
  it('is an alert only for errors, a status otherwise', () => {
    const { unmount } = render(Notice, { props: { kind: 'error', title: 'DONKI events unavailable' } })
    expect(screen.getByRole('alert').textContent).toContain('DONKI events unavailable')
    unmount()
    for (const kind of ['empty', 'info', 'warn'] as const) {
      const { unmount: done } = render(Notice, { props: { kind, title: kind } })
      expect(screen.queryByRole('alert')).toBeNull()
      expect(screen.getByRole('status').classList.contains(kind)).toBe(true)
      done()
    }
  })

  it('renders title, text and the action on the right', () => {
    const { container } = render(Notice, {
      props: { kind: 'warn', title: 'Source unreachable', text: 'data from 40 min ago', children: html('<button>retry</button>') },
    })
    expect(container.querySelector('.title')?.textContent).toBe('Source unreachable')
    expect(container.querySelector('.text')?.textContent).toBe('data from 40 min ago')
    expect(container.querySelector('.action button')?.textContent).toBe('retry')
  })

  it('shows an icon for info, warn and error but not for empty, and has a compact variant', () => {
    for (const [kind, icon] of [['info', true], ['warn', true], ['error', true], ['empty', false]] as const) {
      const { container, unmount } = render(Notice, { props: { kind, title: kind, compact: true } })
      expect(container.querySelector('svg.ic') !== null).toBe(icon)
      expect(container.querySelector('.p-notice.compact')).not.toBeNull()
      unmount()
    }
  })
})
