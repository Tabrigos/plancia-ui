import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/svelte'
import { LegendDots } from '../../src/index'

describe('LegendDots', () => {
  it('renders one dot per item, in a named list', () => {
    render(LegendDots, {
      props: {
        label: 'Field line colors',
        items: [
          { color: '#38bdf8', label: 'closed' },
          { color: '#ef4444', label: 'SAA contour', opacity: 0.7, title: 'From the IGRF-14 model' },
        ],
      },
    })
    expect(screen.getByRole('list', { name: 'Field line colors' })).not.toBeNull()
    const items = screen.getAllByRole('listitem')
    expect(items.length).toBe(2)
    expect(items[0].textContent?.trim()).toBe('closed')
    const dots = items.map((item) => item.querySelector('i') as HTMLElement)
    expect(dots[0].style.background).toBe('rgb(56, 189, 248)')
    expect(dots[0].style.opacity).toBe('')
    expect(dots[1].style.background).toBe('rgb(239, 68, 68)')
    expect(dots[1].style.opacity).toBe('0.7')
    expect(items[1].title).toBe('From the IGRF-14 model')
  })
})
