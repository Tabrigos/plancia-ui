import { describe, expect, it } from 'vitest'
import { render } from '@testing-library/svelte'
import { ControlRow } from '../../src/index'
import { html } from '../helpers'
// The component source as text (Vite `?raw`), to assert on its scoped CSS rules.
import source from '../../src/components/ControlRow.svelte?raw'

describe('ControlRow', () => {
  it('puts the label on the left and the controls on the right', () => {
    const { container } = render(ControlRow, { props: { label: 'Auroral oval', children: html('<button>i</button>') } })
    const label = container.querySelector('.p-ctl-label') as HTMLElement
    expect(label.textContent).toBe('Auroral oval')
    expect(label.classList.contains('hi')).toBe(true)
    expect(container.querySelector('.ctl button')?.textContent).toBe('i')
  })

  it('takes the dim tone, the help cursor and the tooltip', () => {
    const { container } = render(ControlRow, { props: { label: 'Density', tone: 'dim', help: true, title: 'Model density at 400 km' } })
    const label = container.querySelector('.p-ctl-label') as HTMLElement
    expect(label.classList.contains('dim')).toBe(true)
    expect(label.classList.contains('help')).toBe(true)
    expect(label.title).toBe('Model density at 400 km')
    expect(container.querySelector('.ctl')).toBeNull()
  })

  it('never wraps the label', () => {
    // Asserted on the scoped CSS rule: jsdom does not lay out.
    const css = source
    expect(css).toMatch(/\.p-ctl-label \{[^}]*white-space: nowrap/)
  })
})
