import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/svelte'
import { Fieldset } from '../../src/index'
import { html } from '../helpers'

const boxes = html('<div><input type="checkbox" aria-label="Stations"><input type="checkbox" aria-label="Debris"></div>')

describe('Fieldset', () => {
  it('is a group named by its legend, holding the controls', () => {
    render(Fieldset, { props: { legend: 'Layers', children: boxes } })
    const group = screen.getByRole('group', { name: 'Layers' })
    expect(group.tagName).toBe('FIELDSET')
    expect(group.contains(screen.getByRole('checkbox', { name: 'Debris' }))).toBe(true)
  })

  it('describes the group with its hint', () => {
    render(Fieldset, { props: { legend: 'Layers', hint: 'Shown on the globe', children: boxes } })
    expect(screen.getByRole('group', { name: 'Layers', description: 'Shown on the globe' })).toBeTruthy()
  })

  it('keeps a hidden legend for a screen reader', () => {
    const { container } = render(Fieldset, { props: { legend: 'Layers', legendHidden: true, children: boxes } })
    expect(container.querySelector('legend')?.classList.contains('p-sr-only')).toBe(true)
    expect(screen.getByRole('group', { name: 'Layers' })).toBeTruthy()
  })

  it('disables every control inside, and lays them in a row on request', () => {
    const { container } = render(Fieldset, { props: { legend: 'Layers', disabled: true, inline: true, children: boxes } })
    expect((screen.getByRole('group') as HTMLFieldSetElement).disabled).toBe(true)
    expect((screen.getByRole('checkbox', { name: 'Stations' }) as HTMLInputElement).matches(':disabled')).toBe(true)
    expect(container.querySelector('.p-fieldset-body')?.classList.contains('inline')).toBe(true)
  })

  it('takes a class and attributes of the app on the fieldset', () => {
    render(Fieldset, { props: { legend: 'Layers', class: 'filters', id: 'layer-filters', children: boxes } })
    const group = screen.getByRole('group')
    expect(group.classList.contains('p-fieldset')).toBe(true)
    expect(group.classList.contains('filters')).toBe(true)
    expect(group.id).toBe('layer-filters')
  })
})
