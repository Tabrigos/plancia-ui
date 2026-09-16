import { describe, expect, it } from 'vitest'
import { render } from '@testing-library/svelte'
import { MetaRow } from '../../src/index'
import { html } from '../helpers'

describe('MetaRow', () => {
  it('renders the items between the two ends by default', () => {
    const { container } = render(MetaRow, { props: { children: html('<span title="Observation time">data from 8 min ago</span>') } })
    const row = container.querySelector('.p-meta') as HTMLElement
    expect(row.classList.contains('start')).toBe(false)
    expect(row.querySelector('span')?.title).toBe('Observation time')
  })

  it('lines the items up with align="start"', () => {
    const { container } = render(MetaRow, { props: { align: 'start', children: html('<span>≥100 MeV <b>0.4 pfu</b></span>') } })
    expect(container.querySelector('.p-meta.start')).not.toBeNull()
    expect(container.querySelector('b')?.textContent).toBe('0.4 pfu')
  })
})
