import { describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/svelte'
import { createRawSnippet } from 'svelte'
import { Tabs, type TabItem } from '../../src/index'

const items: TabItem[] = [
  { id: 'track', label: 'Tracking' },
  { id: 'wx', label: 'Space weather' },
  { id: 'sky', label: 'Sky', disabled: true },
  { id: 'log', label: 'Log' },
]
// The panel snippet receives the id of the chosen tab
const panel = createRawSnippet((id: () => string) => ({ render: () => `<p>Panel ${id()}</p>` }))

describe('Tabs', () => {
  it('is a named tab list whose chosen tab labels the one panel', () => {
    render(Tabs, { props: { items, value: 'wx', label: 'Console', panel } })
    screen.getByRole('tablist', { name: 'Console' })
    const tabs = screen.getAllByRole('tab')
    expect(tabs.map((tab) => tab.textContent)).toEqual(['Tracking', 'Space weather', 'Sky', 'Log'])
    expect(tabs.map((tab) => tab.getAttribute('aria-selected'))).toEqual(['false', 'true', 'false', 'false'])
    const shown = screen.getByRole('tabpanel', { name: 'Space weather' })
    expect(shown.textContent?.trim()).toBe('Panel wx')
    expect(tabs[1].getAttribute('aria-controls')).toBe(shown.id)
    expect(tabs[0].hasAttribute('aria-controls')).toBe(false)
    expect(shown.getAttribute('tabindex')).toBe('0')
  })

  it('keeps one tab stop, on the chosen tab', () => {
    render(Tabs, { props: { items, value: 'wx', panel } })
    expect(screen.getAllByRole('tab').map((tab) => tab.getAttribute('tabindex'))).toEqual(['-1', '0', '-1', '-1'])
  })

  it('chooses a tab on click and reports it', async () => {
    const onchange = vi.fn()
    render(Tabs, { props: { items, value: 'track', panel, onchange } })
    await fireEvent.click(screen.getByRole('tab', { name: 'Log' }))
    expect(onchange).toHaveBeenLastCalledWith('log')
    expect(screen.getByRole('tabpanel', { name: 'Log' }).textContent?.trim()).toBe('Panel log')
  })

  it('moves and chooses with the arrows, Home and End, skipping a disabled tab and wrapping', async () => {
    render(Tabs, { props: { items, value: 'track', panel } })
    const selected = () => screen.getAllByRole('tab').find((tab) => tab.getAttribute('aria-selected') === 'true')?.textContent
    // The keys reach the tab that has the focus
    const press = (key: string) => fireEvent.keyDown(document.activeElement as HTMLElement, { key })
    screen.getByRole('tab', { name: 'Tracking' }).focus()
    await press('ArrowRight')
    expect(selected()).toBe('Space weather')
    expect(document.activeElement?.textContent).toBe('Space weather')
    await press('ArrowRight')
    expect(selected()).toBe('Log')
    await press('ArrowRight')
    expect(selected()).toBe('Tracking')
    await press('ArrowLeft')
    expect(selected()).toBe('Log')
    await press('Home')
    expect(selected()).toBe('Tracking')
    await press('End')
    expect(selected()).toBe('Log')
    expect(document.activeElement?.textContent).toBe('Log')
  })

  it('shows the first enabled tab while the value is none of them', () => {
    render(Tabs, { props: { items: [{ id: 'a', label: 'A', disabled: true }, ...items], panel } })
    expect(screen.getByRole('tab', { selected: true }).textContent).toBe('Tracking')
    expect(screen.getByRole('tabpanel').textContent?.trim()).toBe('Panel track')
  })

  it('takes a class and attributes of the app on its frame', () => {
    const { container } = render(Tabs, { props: { items, panel, class: 'modes', id: 'console-tabs' } })
    const frame = container.querySelector('.p-tabs') as HTMLElement
    expect(frame.classList.contains('modes')).toBe(true)
    expect(frame.id).toBe('console-tabs')
  })
})
