import { describe, expect, it } from 'vitest'
import { render } from '@testing-library/svelte'
import { Stat } from '../../src/index'
import { html } from '../helpers'

describe('Stat', () => {
  it('renders label, value and note', () => {
    const { container } = render(Stat, { props: { label: 'Kp', sub: 'quiet', children: html('<span>1.3</span>') } })
    expect(container.querySelector('.p-stat .k')?.textContent).toBe('Kp')
    expect(container.querySelector('.p-stat .v')?.textContent).toBe('1.3')
    expect(container.querySelector('.p-stat .sub')?.textContent).toBe('quiet')
  })

  it('colors the value with the tone and forwards title and id', () => {
    const { container } = render(Stat, { props: { label: 'Kp', tone: 'danger', title: 'Planetary index', id: 'kp', children: html('<span>7</span>') } })
    expect(container.querySelector('.v.danger')).not.toBeNull()
    const stat = container.querySelector('.p-stat') as HTMLElement
    expect(stat.title).toBe('Planetary index')
    expect(stat.id).toBe('kp')
    expect(container.querySelector('.sub')).toBeNull()
  })

  it('maps every tone, orange and neutral included', () => {
    for (const tone of ['neutral', 'accent', 'ok', 'warn', 'orange', 'danger', 'info'] as const) {
      const { container, unmount } = render(Stat, { props: { label: 'Kp', tone, children: html('<span>3</span>') } })
      expect(container.querySelector(`.v.${tone}`)).not.toBeNull()
      unmount()
    }
  })
})
