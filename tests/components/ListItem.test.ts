import { describe, expect, it } from 'vitest'
import { render } from '@testing-library/svelte'
import { ListItem } from '../../src/index'
import { html } from '../helpers'
// The component source as text (Vite `?raw`), to assert on its scoped CSS rules.
import source from '../../src/components/ListItem.svelte?raw'

describe('ListItem', () => {
  it('is a list item with a head, label left and controls right, and the body under it', () => {
    const { container } = render(ListItem, {
      props: { label: 'Auroral oval', controls: html('<button>i</button>'), children: html('<p>legend</p>') },
    })
    const item = container.querySelector('li.p-list-item') as HTMLElement
    const head = item.querySelector('.p-ctl-row') as HTMLElement
    expect(head.querySelector('.p-ctl-label')?.textContent).toBe('Auroral oval')
    expect(head.querySelector('.ctl button')?.textContent).toBe('i')
    expect(head.nextElementSibling?.matches('.p-list-body')).toBe(true)
    expect(item.querySelector('.p-list-body p')?.textContent).toBe('legend')
  })

  it('without a label has no head, and the body is the whole card', () => {
    const { container } = render(ListItem, { props: { children: html('<p>protons 12 pfu</p>') } })
    expect(container.querySelector('.p-ctl-row')).toBeNull()
    expect(container.querySelector('.p-list-item > .p-list-body p')?.textContent).toBe('protons 12 pfu')
  })

  it('puts the tooltip and the help cursor on the label, and no empty controls', () => {
    const { container } = render(ListItem, { props: { label: 'Van Allen belts', title: 'Two shells of trapped particles', help: true } })
    const label = container.querySelector('.p-ctl-label') as HTMLElement
    expect(label.title).toBe('Two shells of trapped particles')
    expect(label.classList.contains('help')).toBe(true)
    expect(container.querySelector('.ctl')).toBeNull()
    expect(container.querySelector('.p-list-body')).toBeNull()
  })

  it('forwards the consumer attributes and adds the consumer class next to its own', () => {
    const { container } = render(ListItem, { props: { label: 'TEC', id: 'layer-tec', 'data-product': 'tec', class: 'mine' } })
    const item = container.querySelector('li') as HTMLElement
    expect(item.id).toBe('layer-tec')
    expect(item.dataset.product).toBe('tec')
    expect(item.classList.contains('p-list-item')).toBe(true)
    expect(item.classList.contains('mine')).toBe(true)
  })

  it('spaces the body with margins a component can keep', () => {
    // Asserted on the scoped CSS: jsdom does not lay out. The body is a block,
    // so its margin merges with the first block's; the rule between blocks has
    // zero specificity, so MetaRow and LegendDots keep their own 6 px.
    expect(source).toMatch(/\.p-list-body \{ margin-top: 8px; \}/)
    expect(source).toContain(':global(:where(.p-list-body) > * + *) { margin-top: 8px; }')
  })
})
