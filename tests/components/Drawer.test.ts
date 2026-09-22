import { describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/svelte'
import { flushSync, tick } from 'svelte'
import { Drawer } from '../../src/index'
import { html } from '../helpers'

// jsdom has no `inert` property: Svelte sets it as a property in browsers and as an attribute here
const isInert = (element: Element): boolean => element.hasAttribute('inert') || (element as unknown as { inert?: boolean }).inert === true

const content = html('<nav><button>Tracking</button><button>Space weather</button></nav>')

describe('Drawer', () => {
  it('as a column: a named region, no scrim, inert while closed', async () => {
    const { container, rerender } = render(Drawer, { props: { open: false, label: 'Console', onclose: () => {}, children: content } })
    const drawer = container.querySelector('.p-drawer') as HTMLElement
    expect(drawer.getAttribute('role')).toBe('region')
    expect(drawer.getAttribute('aria-label')).toBe('Console')
    expect(drawer.classList.contains('closed')).toBe(true)
    expect(isInert(drawer)).toBe(true)
    expect(container.querySelector('.p-drawer-scrim')).toBeNull()
    await rerender({ open: true })
    expect(isInert(drawer)).toBe(false)
    expect(document.activeElement).toBe(drawer)
  })

  it('as a modal: a dialog over a scrim, closed by the scrim and by Esc', async () => {
    const onclose = vi.fn()
    const { container } = render(Drawer, { props: { open: true, modal: true, label: 'Console', onclose, children: content } })
    const dialog = screen.getByRole('dialog', { name: 'Console' })
    expect(dialog.getAttribute('aria-modal')).toBe('true')
    const scrim = container.querySelector('.p-drawer-scrim') as HTMLElement
    expect(scrim.classList.contains('on')).toBe(true)
    await fireEvent.click(scrim)
    expect(onclose).toHaveBeenCalledTimes(1)
    await fireEvent.keyDown(dialog, { key: 'Escape' })
    expect(onclose).toHaveBeenCalledTimes(2)
  })

  it('traps Tab inside while modal, and only then', async () => {
    const { rerender } = render(Drawer, { props: { open: true, modal: true, label: 'Console', onclose: () => {}, children: content } })
    // jsdom lays nothing out: every button counts as visible
    for (const button of screen.getAllByRole('button')) button.getClientRects = () => [{}] as unknown as DOMRectList
    const [first, last] = screen.getAllByRole('button')
    last.focus()
    await fireEvent.keyDown(last, { key: 'Tab' })
    expect(document.activeElement).toBe(first)
    await fireEvent.keyDown(first, { key: 'Tab', shiftKey: true })
    expect(document.activeElement).toBe(last)
    await rerender({ modal: false })
    const unhandled = new KeyboardEvent('keydown', { key: 'Tab', bubbles: true, cancelable: true })
    last.dispatchEvent(unhandled)
    expect(unhandled.defaultPrevented).toBe(false)
  })

  it('gives focus back to the opener on close, if it was inside', async () => {
    const opener = document.createElement('button')
    opener.id = 'open-console'
    document.body.append(opener)
    const { rerender } = render(Drawer, { props: { open: false, modal: true, label: 'Console', opener: 'open-console', onclose: () => {}, children: content } })
    await rerender({ open: true })
    screen.getAllByRole('button')[0].focus()
    await rerender({ open: false })
    await tick()
    flushSync()
    expect(document.activeElement).toBe(opener)
    opener.remove()
  })

  it('slides from the side it is given and forwards the consumer attributes and class', () => {
    const { container } = render(Drawer, { props: { open: true, side: 'right', label: 'Filters', onclose: () => {}, id: 'filters', 'data-layout': 'phone', class: 'mine' } })
    const drawer = container.querySelector('.p-drawer') as HTMLElement
    expect(drawer.classList.contains('right')).toBe(true)
    expect(drawer.classList.contains('mine')).toBe(true)
    expect(drawer.id).toBe('filters')
    expect(drawer.dataset.layout).toBe('phone')
  })
})
