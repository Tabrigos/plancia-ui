import { describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/svelte'
import { Toggle } from '../../src/index'

describe('Toggle', () => {
  it('is a real checkbox with an accessible name', () => {
    render(Toggle, { props: { label: 'Orbit lines' } })
    const input = screen.getByRole('checkbox', { name: 'Orbit lines' }) as HTMLInputElement
    expect(input.type).toBe('checkbox')
    expect(input.checked).toBe(false)
  })

  it('reflects checked and disabled', () => {
    render(Toggle, { props: { checked: true, disabled: true, label: 'Starlink' } })
    const input = screen.getByRole('checkbox') as HTMLInputElement
    expect(input.checked).toBe(true)
    expect(input.disabled).toBe(true)
    expect(input.closest('.p-toggle')?.classList.contains('disabled')).toBe(true)
  })

  it('emits onchange with the new value', async () => {
    const onchange = vi.fn()
    render(Toggle, { props: { label: 'Layer', onchange } })
    const input = screen.getByRole('checkbox') as HTMLInputElement
    await fireEvent.click(input)
    expect(input.checked).toBe(true)
    expect(onchange).toHaveBeenCalledWith(true)
    await fireEvent.click(input)
    expect(onchange).toHaveBeenLastCalledWith(false)
  })

  it('puts the tooltip on the label element', () => {
    const { container } = render(Toggle, { props: { label: 'Layer', title: 'Show the layer' } })
    expect(container.querySelector('label.p-toggle')?.getAttribute('title')).toBe('Show the layer')
  })
})
