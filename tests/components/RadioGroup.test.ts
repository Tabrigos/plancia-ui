import { describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/svelte'
import { RadioGroup, type RadioItem } from '../../src/index'

const items: RadioItem[] = [
  { id: 'km', label: 'Kilometres' },
  { id: 'mi', label: 'Miles', hint: 'Statute miles' },
  { id: 'nmi', label: 'Nautical miles', disabled: true },
]

describe('RadioGroup', () => {
  it('is a radio group named by its legend, one native radio per item', () => {
    render(RadioGroup, { props: { legend: 'Units', items, value: 'km' } })
    const group = screen.getByRole('radiogroup', { name: 'Units' })
    expect(group.tagName).toBe('FIELDSET')
    const radios = screen.getAllByRole('radio') as HTMLInputElement[]
    expect(radios.map((radio) => radio.value)).toEqual(['km', 'mi', 'nmi'])
    expect(new Set(radios.map((radio) => radio.name)).size).toBe(1)
    expect(radios[0].name).not.toBe('')
    expect(screen.getByRole('radio', { name: 'Kilometres' }).getAttribute('aria-describedby')).toBeNull()
    expect(screen.getByRole('radio', { name: 'Miles', description: 'Statute miles' })).toBeTruthy()
  })

  it('checks the item of its value, and reports the one picked', async () => {
    const onchange = vi.fn()
    render(RadioGroup, { props: { legend: 'Units', items, value: 'km', onchange } })
    const [km, mi] = screen.getAllByRole('radio') as HTMLInputElement[]
    expect(km.checked).toBe(true)
    await fireEvent.click(mi)
    expect(onchange).toHaveBeenLastCalledWith('mi')
    expect(mi.checked).toBe(true)
    expect(km.checked).toBe(false)
  })

  it('follows the value the app gives it', async () => {
    const { rerender } = render(RadioGroup, { props: { legend: 'Units', items, value: 'km' } })
    await rerender({ value: 'mi' })
    expect((screen.getByRole('radio', { name: 'Miles' }) as HTMLInputElement).checked).toBe(true)
  })

  it('disables an item, or the whole group', async () => {
    const { rerender } = render(RadioGroup, { props: { legend: 'Units', items } })
    expect((screen.getByRole('radio', { name: 'Nautical miles' }) as HTMLInputElement).disabled).toBe(true)
    await rerender({ disabled: true })
    expect((screen.getByRole('radiogroup') as HTMLFieldSetElement).disabled).toBe(true)
  })

  it('takes a name for a native form, and describes the group with its hint', () => {
    render(RadioGroup, { props: { legend: 'Units', hint: 'For distances and altitudes', items, name: 'units' } })
    expect((screen.getAllByRole('radio') as HTMLInputElement[]).every((radio) => radio.name === 'units')).toBe(true)
    expect(screen.getByRole('radiogroup', { name: 'Units', description: 'For distances and altitudes' })).toBeTruthy()
  })
})
