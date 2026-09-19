import { describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/svelte'
import { FloatingPanel } from '../../src/index'
import { html } from '../helpers'

describe('FloatingPanel', () => {
  it('is a dialog named by its title, with the head and a scrolling body', () => {
    const { container } = render(FloatingPanel, { props: { title: 'Sun now', subtitle: '304 Å', children: html('<p>body</p>') } })
    const dialog = screen.getByRole('dialog', { name: 'Sun now' })
    expect(dialog.classList.contains('p-floating')).toBe(true)
    expect(container.querySelector('.p-ph .title')?.textContent).toBe('Sun now')
    expect(container.querySelector('.body p')?.textContent).toBe('body')
    expect(screen.queryByRole('button')).toBeNull()
  })

  it('closes from the head button and from Esc while focus is inside', async () => {
    const onclose = vi.fn()
    render(FloatingPanel, { props: { title: 'Sun now', onclose, children: html('<button id="inner">in</button>') } })
    screen.getByRole('button', { name: 'Close' }).click()
    expect(onclose).toHaveBeenCalledTimes(1)
    const inner = document.getElementById('inner') as HTMLElement
    inner.focus()
    await fireEvent.keyDown(inner, { key: 'Escape' })
    expect(onclose).toHaveBeenCalledTimes(2)
    await fireEvent.keyDown(inner, { key: 'Enter' })
    expect(onclose).toHaveBeenCalledTimes(2)
  })

  it('returns focus to the opener on close, only if focus was inside', async () => {
    const opener = document.createElement('button')
    opener.id = 'open-sun'
    document.body.appendChild(opener)
    render(FloatingPanel, { props: { title: 'Sun now', onclose: () => {}, opener: 'open-sun', children: html('<button id="inner">in</button>') } })
    ;(document.getElementById('inner') as HTMLElement).focus()
    screen.getByRole('button', { name: 'Close' }).click()
    expect(document.activeElement).toBe(opener)
    opener.blur()
    document.body.focus()
    screen.getByRole('button', { name: 'Close' }).click()
    expect(document.activeElement).not.toBe(opener)
    opener.remove()
  })

  it('takes focus on mount when asked, and forwards consumer attributes', () => {
    render(FloatingPanel, { props: { title: 'Sun now', autofocus: true, id: 'sun-disk', class: 'top-right', 'data-panel': 'sun' } })
    const dialog = screen.getByRole('dialog')
    expect(document.activeElement).toBe(dialog)
    expect(dialog.id).toBe('sun-disk')
    expect(dialog.classList.contains('top-right')).toBe(true)
    expect(dialog.dataset.panel).toBe('sun')
  })

  it('uses the label over the title for the accessible name', () => {
    render(FloatingPanel, { props: { title: 'Sun now', label: 'Sun now, SDO image' } })
    expect(screen.getByRole('dialog', { name: 'Sun now, SDO image' })).not.toBeNull()
  })
})
