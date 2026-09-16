import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/svelte'
import { Segmented } from '../../src/index'

const items = [
  { id: 'map', label: 'map', title: 'Map view' },
  { id: 'list', label: 'list' },
]

describe('Segmented', () => {
  it('is a named group of buttons, the active one pressed', () => {
    render(Segmented, { props: { items, value: 'map', label: 'View' } })
    expect(screen.getByRole('group', { name: 'View' })).not.toBeNull()
    const buttons = screen.getAllByRole('button')
    expect(buttons.length).toBe(2)
    expect(buttons[0].getAttribute('aria-pressed')).toBe('true')
    expect(buttons[0].classList.contains('on')).toBe(true)
    expect(buttons[0].title).toBe('Map view')
    expect(buttons[1].getAttribute('aria-pressed')).toBe('false')
  })

  it('changes the value on click and emits onchange once per real change', async () => {
    const onchange = vi.fn()
    render(Segmented, { props: { items, value: 'map', onchange } })
    const [map, list] = screen.getAllByRole('button')
    list.click()
    await Promise.resolve()
    expect(onchange).toHaveBeenCalledWith('list')
    expect(list.getAttribute('aria-pressed')).toBe('true')
    expect(map.getAttribute('aria-pressed')).toBe('false')
    list.click()
    expect(onchange).toHaveBeenCalledTimes(1)
  })

  it('has an inline small variant', () => {
    const { container } = render(Segmented, { props: { items, size: 'sm' } })
    expect(container.querySelector('.p-seg.sm')).not.toBeNull()
  })
})
