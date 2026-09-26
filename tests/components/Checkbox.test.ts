import { describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/svelte'
import { Checkbox } from '../../src/index'
// The shared row as text (Vite `?raw`), to assert on its scoped CSS rules.
import source from '../../src/components/Choice.svelte?raw'

describe('Checkbox', () => {
  it('is a native checkbox named by its visible text, with the hint as its description', () => {
    render(Checkbox, { props: { label: 'Orbit lines', hint: 'Only for the selected object' } })
    const input = screen.getByRole('checkbox', { name: 'Orbit lines', description: 'Only for the selected object' }) as HTMLInputElement
    expect(input.type).toBe('checkbox')
    expect(input.checked).toBe(false)
    expect(input.closest('label')?.textContent).toContain('Orbit lines')
  })

  it('has no description without a hint', () => {
    render(Checkbox, { props: { label: 'Debris' } })
    expect(screen.getByRole('checkbox', { name: 'Debris' }).hasAttribute('aria-describedby')).toBe(false)
  })

  it('reports the new state, from the box or from its text', async () => {
    const onchange = vi.fn()
    render(Checkbox, { props: { label: 'Stations', onchange } })
    const input = screen.getByRole('checkbox') as HTMLInputElement
    await fireEvent.click(input)
    expect(input.checked).toBe(true)
    expect(onchange).toHaveBeenLastCalledWith(true)
    await fireEvent.click(screen.getByText('Stations'))
    expect(input.checked).toBe(false)
    expect(onchange).toHaveBeenLastCalledWith(false)
  })

  it('shows neither on nor off, until a tap clears it', async () => {
    render(Checkbox, { props: { label: 'All layers', indeterminate: true } })
    const input = screen.getByRole('checkbox') as HTMLInputElement
    expect(input.indeterminate).toBe(true)
    await fireEvent.click(input)
    expect(input.indeterminate).toBe(false)
    expect(input.checked).toBe(true)
  })

  it('reflects checked, disabled, name and value', () => {
    render(Checkbox, { props: { label: 'Weather', checked: true, disabled: true, name: 'layers', value: 'weather' } })
    const input = screen.getByRole('checkbox') as HTMLInputElement
    expect(input.checked).toBe(true)
    expect(input.disabled).toBe(true)
    expect(input.name).toBe('layers')
    expect(input.value).toBe('weather')
  })

  it('grows to a tap target on touch and outlines an empty box at 3:1', () => {
    // Asserted on the scoped CSS: jsdom does not lay out
    expect(source).toContain('padding-block: max(0px, calc((var(--p-tap-h) - 1lh) / 2));')
    expect(source).toContain('border: 1px solid var(--p-text-dim);')
  })
})
