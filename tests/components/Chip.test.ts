import { describe, expect, it } from 'vitest'
import { render } from '@testing-library/svelte'
import { Chip } from '../../src/index'
import { html } from '../helpers'

describe('Chip', () => {
  it('is neutral by default and carries the tone as a class', () => {
    const { container, unmount } = render(Chip, { props: { children: html('<span>G0</span>') } })
    expect(container.querySelector('.p-chip.neutral')?.textContent).toBe('G0')
    unmount()
    const second = render(Chip, { props: { tone: 'danger', children: html('<span>G5</span>') } })
    expect(second.container.querySelector('.p-chip.danger')).not.toBeNull()
  })

  it('has a low counter variant and a small variant', () => {
    const { container } = render(Chip, { props: { count: true, children: html('<span>235</span>') } })
    expect(container.querySelector('.p-chip.count')).not.toBeNull()
    const small = render(Chip, { props: { small: true, tone: 'warn', children: html('<span>G2</span>') } })
    expect(small.container.querySelector('.p-chip.small.warn')).not.toBeNull()
  })

  it('takes a free color that overrides the tone', () => {
    const { container } = render(Chip, { props: { color: '#a3e635', children: html('<span>NEW</span>') } })
    const chip = container.querySelector('.p-chip.custom') as HTMLElement
    expect(chip).not.toBeNull()
    expect(chip.style.getPropertyValue('--chip-fg').trim()).toBe('#a3e635')
    expect(chip.style.getPropertyValue('--chip-bg')).toContain('color-mix')
  })

  it('forwards native attributes such as title', () => {
    const { container } = render(Chip, { props: { title: 'NORAD id', children: html('<span>25544</span>') } })
    expect(container.querySelector('.p-chip')?.getAttribute('title')).toBe('NORAD id')
  })
})
