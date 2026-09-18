import { describe, expect, it } from 'vitest'
import { render } from '@testing-library/svelte'
import { SettingRow } from '../../src/index'
import { html } from '../helpers'

describe('SettingRow', () => {
  it('renders icon, name and controls', () => {
    const { container } = render(SettingRow, {
      props: { label: 'Orbit lines', icon: html('<span class="glyph"></span>'), children: html('<input type="checkbox" />') },
    })
    expect(container.querySelector('.p-setting-row .ic .glyph')).not.toBeNull()
    expect(container.querySelector('.ic')?.getAttribute('aria-hidden')).toBe('true')
    expect(container.querySelector('.name')?.textContent).toBe('Orbit lines')
    expect(container.querySelector('.ctl input')).not.toBeNull()
  })

  it('forwards the consumer attributes and adds the consumer class next to its own', () => {
    const { container } = render(SettingRow, {
      props: { label: 'Starlink', title: 'Constellation', help: true, id: 'row-starlink', 'data-group': 'starlink', class: 'mine' },
    })
    const row = container.querySelector('.p-setting-row') as HTMLElement
    expect(row.id).toBe('row-starlink')
    expect(row.dataset.group).toBe('starlink')
    expect(row.title).toBe('Constellation')
    expect(row.classList.contains('p-setting-row')).toBe(true)
    expect(row.classList.contains('mine')).toBe(true)
    expect(container.querySelector('.name.help')).not.toBeNull()
  })
})
