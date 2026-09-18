import { describe, expect, it } from 'vitest'
import { render } from '@testing-library/svelte'
import { KeyValue } from '../../src/index'
import { html } from '../helpers'
// The component source as text (Vite `?raw`), to assert on its scoped CSS rules.
import source from '../../src/components/KeyValue.svelte?raw'

describe('KeyValue', () => {
  it('puts the label on the left and the value on the right', () => {
    const { container } = render(KeyValue, { props: { label: 'Altitude', children: html('<span>420.6 km</span>') } })
    expect(container.querySelector('.p-kv .k')?.textContent).toBe('Altitude')
    expect(container.querySelector('.p-kv .v .main')?.textContent).toBe('420.6 km')
    expect(container.querySelector('.sub')).toBeNull()
  })

  it('renders the secondary line with its own tone', () => {
    const { container } = render(KeyValue, {
      props: { label: 'Air at 547 km', sub: '−34 % vs. global median', subTone: 'warn', children: html('<span>0.21 ng/m³</span>') },
    })
    const sub = container.querySelector('.sub') as HTMLElement
    expect(sub.textContent).toBe('−34 % vs. global median')
    expect(sub.classList.contains('warn')).toBe(true)
  })

  it('colors the value with the tone and forwards title and id', () => {
    const { container } = render(KeyValue, {
      props: { label: 'Radiation', tone: 'ok', title: 'Outside the SAA', id: 'radiation', children: html('<span>outside</span>') },
    })
    const row = container.querySelector('.p-kv') as HTMLElement
    expect(row.id).toBe('radiation')
    expect(row.title).toBe('Outside the SAA')
    expect(container.querySelector('.v.ok')).not.toBeNull()
  })

  it('maps every tone, orange and neutral included, on value and secondary line', () => {
    for (const tone of ['neutral', 'accent', 'ok', 'warn', 'orange', 'danger', 'info'] as const) {
      const { container, unmount } = render(KeyValue, { props: { label: 'Kp', tone, sub: 'note', subTone: tone, children: html('<span>3</span>') } })
      expect(container.querySelector(`.v.${tone}`)).not.toBeNull()
      expect(container.querySelector(`.sub.${tone}`)).not.toBeNull()
      unmount()
    }
  })

  it('keeps a long value whole: the row may wrap, label and value never do', () => {
    // The layout rule (a value that does not fit drops to its own line
    // instead of overlapping the label) lives in the scoped CSS, which jsdom
    // neither injects nor lays out: it is asserted on the rules themselves.
    const { container } = render(KeyValue, {
      props: { label: 'Air at 35781 km', children: html('<span>outside the model (100–1000 km)</span>') },
    })
    expect(container.querySelector('.main')?.textContent).toBe('outside the model (100–1000 km)')
    const css = source
    expect(css).toMatch(/\.p-kv \{[^}]*flex-wrap: wrap/)
    expect(css).toMatch(/\.k \{[^}]*white-space: nowrap/)
    expect(css).toMatch(/\.main \{[^}]*white-space: nowrap/)
  })
})
