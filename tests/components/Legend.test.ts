import { describe, expect, it } from 'vitest'
import { render } from '@testing-library/svelte'
import { Legend } from '../../src/index'

describe('Legend', () => {
  it('draws the gradient bar between minimum and maximum with the unit', () => {
    const gradient = 'linear-gradient(90deg,#0f172a,#fde68a)'
    const { container } = render(Legend, { props: { gradient, min: 0, max: 35, unit: 'MHz', note: 'transparent below 1 MHz' } })
    const limits = [...container.querySelectorAll('.lim')].map((e) => e.textContent)
    expect(limits).toEqual(['0', '35 MHz'])
    // jsdom normalizes the colors to rgb(): the gradient is there, in that form
    expect((container.querySelector('.bar') as HTMLElement).style.background).toContain('linear-gradient(90deg, rgb(15, 23, 42), rgb(253, 230, 138))')
    expect(container.querySelector('.note')?.textContent).toBe('transparent below 1 MHz')
  })

  it('omits the note when there is none', () => {
    const { container } = render(Legend, { props: { gradient: 'linear-gradient(90deg,#000,#fff)', min: '−15', max: '+15' } })
    expect(container.querySelector('.note')).toBeNull()
    expect(container.querySelectorAll('.lim')[1].textContent).toBe('+15 ')
  })
})
