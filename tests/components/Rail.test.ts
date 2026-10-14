import { describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/svelte'
import { createRawSnippet } from 'svelte'
import { Rail, type TabItem } from '../../src/index'
import { html } from '../helpers'
// The component source as text (Vite `?raw`), to assert on its scoped CSS rules.
import source from '../../src/components/Rail.svelte?raw'

const items: TabItem[] = [
  { id: 'sky', label: 'Geography', title: 'Geography of the sky' },
  { id: 'wx', label: 'Space weather' },
  { id: 'sun', label: 'Sun', disabled: true },
  { id: 'sys', label: 'System' },
]
// The icon and panel snippets receive the id of their item
const icon = createRawSnippet((id: () => string) => ({ render: () => `<svg data-icon="${id()}"></svg>` }))
const panel = createRawSnippet((id: () => string) => ({ render: () => `<p>Panel ${id()}</p>` }))

describe('Rail', () => {
  it('is a named vertical tab list, an icon over a label for each, whose chosen item labels the one panel', () => {
    const { container } = render(Rail, { props: { items, value: 'wx', label: 'Modes', icon, panel } })
    const list = screen.getByRole('tablist', { name: 'Modes' })
    expect(list.getAttribute('aria-orientation')).toBe('vertical')
    const tabs = screen.getAllByRole('tab')
    expect(tabs.map((tab) => tab.querySelector('.label')?.textContent)).toEqual(['Geography', 'Space weather', 'Sun', 'System'])
    expect(tabs[0].querySelector('.icon')?.getAttribute('aria-hidden')).toBe('true')
    expect(container.querySelector('[data-icon="sys"]')).not.toBeNull()
    expect(tabs.map((tab) => tab.getAttribute('tabindex'))).toEqual(['-1', '0', '-1', '-1'])
    const shown = screen.getByRole('tabpanel', { name: 'Space weather' })
    expect(shown.textContent?.trim()).toBe('Panel wx')
    expect(tabs[1].getAttribute('aria-controls')).toBe(shown.id)
  })

  it('names an item by its title, longer than the label it holds, shown as its tooltip', () => {
    render(Rail, { props: { items, icon, panel } })
    const tab = screen.getByRole('tab', { name: 'Geography of the sky' })
    expect(tab.title).toBe('Geography of the sky')
    expect(screen.getByRole('tab', { name: 'System' }).hasAttribute('aria-label')).toBe(false)
  })

  it('moves and chooses with up and down, Home and End, skipping a disabled item and wrapping', async () => {
    const onchange = vi.fn()
    render(Rail, { props: { items, value: 'sky', icon, panel, onchange } })
    const selected = () => screen.getByRole('tab', { selected: true }).querySelector('.label')?.textContent
    const press = (key: string) => fireEvent.keyDown(document.activeElement as HTMLElement, { key })
    screen.getAllByRole('tab')[0].focus()
    await press('ArrowDown')
    expect(selected()).toBe('Space weather')
    await press('ArrowDown')
    expect(selected()).toBe('System')
    await press('ArrowDown')
    expect(selected()).toBe('Geography')
    await press('ArrowUp')
    expect(selected()).toBe('System')
    // The arrows across the list are not its keys
    await press('ArrowRight')
    expect(selected()).toBe('System')
    await press('Home')
    expect(selected()).toBe('Geography')
    await press('End')
    expect(document.activeElement?.querySelector('.label')?.textContent).toBe('System')
    expect(onchange).toHaveBeenLastCalledWith('sys')
  })

  it('hides the panel while the rail stays, and opens it again on a choice, the chosen item included', async () => {
    render(Rail, { props: { items, value: 'wx', open: false, icon, panel } })
    expect(screen.queryByRole('tabpanel')).toBeNull()
    expect(screen.getByRole('tab', { selected: true }).hasAttribute('aria-controls')).toBe(false)
    await fireEvent.click(screen.getByRole('tab', { selected: true }))
    expect(screen.getByRole('tabpanel', { name: 'Space weather' })).not.toBeNull()
    // The chosen item, clicked again, does not close it
    await fireEvent.click(screen.getByRole('tab', { selected: true }))
    expect(screen.getByRole('tabpanel')).not.toBeNull()
  })

  it('keeps a brand above the items and actions below them, outside the list', () => {
    const { container } = render(Rail, { props: { items, icon, panel, header: html('<b class="brand">H</b>'), actions: html('<button class="hide">Hide</button>') } })
    const list = screen.getByRole('tablist')
    expect(container.querySelector('.header .brand')).not.toBeNull()
    expect(list.contains(container.querySelector('.hide'))).toBe(false)
    expect(container.querySelector('.actions .hide')).not.toBeNull()
  })

  it('is as wide as the rail token, and draws the focus rings inside: the frame would clip them', () => {
    // Asserted on the scoped CSS: jsdom does not lay out
    expect(source).toContain('width: var(--p-rail-w);')
    expect(source).toContain('.p-railpanel { flex: 1; min-width: 0; min-height: 0; overflow: auto;')
    expect(source).toContain('outline-offset: -2px;')
  })

  it('takes a class and attributes of the app on its frame', () => {
    const { container } = render(Rail, { props: { items, icon, panel, class: 'modes', id: 'console-rail' } })
    const frame = container.querySelector('.p-rail') as HTMLElement
    expect(frame.classList.contains('modes')).toBe(true)
    expect(frame.id).toBe('console-rail')
  })
})
