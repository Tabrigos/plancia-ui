import { describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/svelte'
import { Select, type SelectItem } from '../../src/index'
// The component source as text (Vite `?raw`), to assert on its scoped CSS rules.
import source from '../../src/components/Select.svelte?raw'

const items: SelectItem[] = [
  { id: 'rome', label: 'Rome' },
  { id: 'kiruna', label: 'Kiruna' },
  { id: 'baikonur', label: 'Baikonur', disabled: true },
]

describe('Select', () => {
  it('is a native select named by its label, one option per item', () => {
    render(Select, { props: { label: 'Observer', items, value: 'kiruna' } })
    const select = screen.getByRole('combobox', { name: 'Observer' }) as HTMLSelectElement
    expect(select.tagName).toBe('SELECT')
    expect([...select.options].map((option) => option.value)).toEqual(['rome', 'kiruna', 'baikonur'])
    expect(select.value).toBe('kiruna')
    expect(select.options[2].disabled).toBe(true)
  })

  it('reports the item chosen', async () => {
    const onchange = vi.fn()
    render(Select, { props: { label: 'Observer', items, value: 'rome', onchange } })
    const select = screen.getByRole('combobox') as HTMLSelectElement
    select.value = 'kiruna'
    await fireEvent.change(select)
    expect(onchange).toHaveBeenLastCalledWith('kiruna')
  })

  it('shows the placeholder while the value is none of the items, and drops it once one is chosen', async () => {
    render(Select, { props: { label: 'Observer', items, value: 'lat-41.9', placeholder: 'Choose a place' } })
    const select = screen.getByRole('combobox') as HTMLSelectElement
    expect(select.value).toBe('')
    expect(select.selectedOptions[0].textContent).toBe('Choose a place')
    expect(select.options[0].disabled).toBe(true)
    select.value = 'rome'
    await fireEvent.change(select)
    expect([...select.options].map((option) => option.value)).toEqual(['rome', 'kiruna', 'baikonur'])
    expect(select.value).toBe('rome')
  })

  it('follows the value the app gives it', async () => {
    const { rerender } = render(Select, { props: { label: 'Observer', items, value: 'rome' } })
    await rerender({ value: 'kiruna' })
    expect((screen.getByRole('combobox') as HTMLSelectElement).value).toBe('kiruna')
  })

  it('takes a size, a class on its frame, and attributes of the app on the select', () => {
    const { container } = render(Select, { props: { label: 'Observer', items, size: 'sm', class: 'places', id: 'observer', name: 'place', disabled: true } })
    const frame = container.querySelector('.p-select') as HTMLElement
    expect(frame.classList.contains('sm')).toBe(true)
    expect(frame.classList.contains('places')).toBe(true)
    const select = screen.getByRole('combobox') as HTMLSelectElement
    expect(select.id).toBe('observer')
    expect(select.name).toBe('place')
    expect(select.disabled).toBe(true)
  })

  it('keeps the text at the input size, so iOS does not zoom, and lets a tap through its arrow', () => {
    // Asserted on the scoped CSS: jsdom does not lay out
    expect(source).toContain('font-size: var(--p-input-size);')
    expect(source).toContain('pointer-events: none;')
    expect(source).toMatch(/^\s*label: string$/m)
  })
})
