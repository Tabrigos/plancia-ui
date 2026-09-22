import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/svelte'
import { List } from '../../src/index'
import { html } from '../helpers'

describe('List', () => {
  it('is a list named by its label, the items are its children', () => {
    render(List, { props: { label: 'Map layers', children: html('<li>Auroral oval</li>') } })
    const list = screen.getByRole('list', { name: 'Map layers' })
    // Explicit: Safari drops the semantics of a list without bullets
    expect(list.getAttribute('role')).toBe('list')
    expect(screen.getAllByRole('listitem').map((item) => item.textContent)).toEqual(['Auroral oval'])
  })

  it('puts the footer line after the list', () => {
    const { container } = render(List, { props: { children: html('<li>TEC</li>'), footer: html('<span>Data: NOAA SWPC</span>') } })
    const footer = container.querySelector('.p-list-footer') as HTMLElement
    expect(footer.textContent).toBe('Data: NOAA SWPC')
    expect(container.querySelector('.p-list')?.nextElementSibling).toBe(footer)
  })

  it('has no footer without one', () => {
    const { container } = render(List, { props: { children: html('<li>TEC</li>') } })
    expect(container.querySelector('.p-list-footer')).toBeNull()
  })
})
