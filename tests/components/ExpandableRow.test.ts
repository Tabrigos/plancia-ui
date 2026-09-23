import { describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/svelte'
import { ExpandableRow } from '../../src/index'
import { html } from '../helpers'
// The component source as text (Vite `?raw`), to assert on its scoped CSS rules.
import source from '../../src/components/ExpandableRow.svelte?raw'

const row = html('<span>AR 3914 · N12E34 · βγ</span>')
const detail = html('<span>Class Ekc, area 540 millionths, 23 spots</span>')

describe('ExpandableRow', () => {
  it('is a button that opens its detail below itself, and reports the change', async () => {
    const onchange = vi.fn()
    const { container } = render(ExpandableRow, { props: { title: 'Class Ekc, 540 millionths', onchange, children: row, detail } })
    const button = screen.getByRole('button', { name: 'AR 3914 · N12E34 · βγ' })
    const panel = container.querySelector('.p-expandable-detail') as HTMLElement
    expect(button.getAttribute('aria-expanded')).toBe('false')
    expect(button.getAttribute('aria-controls')).toBe(panel.id)
    expect(button.title).toBe('Class Ekc, 540 millionths')
    expect(panel.hidden).toBe(true)
    await fireEvent.click(button)
    expect(button.getAttribute('aria-expanded')).toBe('true')
    expect(panel.hidden).toBe(false)
    expect(panel.textContent).toBe('Class Ekc, area 540 millionths, 23 spots')
    expect(onchange).toHaveBeenLastCalledWith(true)
    await fireEvent.click(button)
    expect(panel.hidden).toBe(true)
    expect(onchange).toHaveBeenLastCalledWith(false)
  })

  it('follows the state the app gives it: one row open at a time is the app\'s rule', async () => {
    const { rerender } = render(ExpandableRow, { props: { open: false, children: row, detail } })
    await rerender({ open: true })
    expect(screen.getByRole('button').getAttribute('aria-expanded')).toBe('true')
  })

  it('takes an id for the detail, a class and attributes of the app on the button', () => {
    const { container } = render(ExpandableRow, { props: { id: 'region-3914', class: 'region', 'data-region': '3914', children: row, detail } })
    const button = screen.getByRole('button')
    expect(button.classList.contains('p-expandable')).toBe(true)
    expect(button.classList.contains('region')).toBe(true)
    expect(button.dataset.region).toBe('3914')
    expect(container.querySelector('#region-3914')?.classList.contains('p-expandable-detail')).toBe(true)
  })

  it('leaves the layout to a class of the app, and grows to a tap target on touch', () => {
    // Asserted on the scoped CSS: jsdom does not lay out
    expect(source).toContain(':where(.p-expandable) {')
    expect(source).toContain(':where(.p-expandable-detail) {')
    expect(source).toContain('padding: max(0px, calc((var(--p-tap-h) - 1lh) / 2)) 0;')
  })
})
