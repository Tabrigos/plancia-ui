import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/svelte'
import { flushSync } from 'svelte'
import { Section } from '../../src/index'
import { html } from '../helpers'

describe('Section', () => {
  it('is open by default, with a button that controls the content region', () => {
    const { container } = render(Section, { props: { title: 'Solar wind', summary: '412 km/s · Bz −3', children: html('<p>content</p>') } })
    const button = screen.getByRole('button', { name: /Solar wind/ })
    expect(button.getAttribute('aria-expanded')).toBe('true')
    const body = container.querySelector('.body') as HTMLElement
    expect(body.id).toBe(button.getAttribute('aria-controls'))
    expect(body.hidden).toBe(false)
    expect(body.querySelector('p')?.textContent).toBe('content')
    expect(container.querySelector('.summary')?.textContent).toBe('412 km/s · Bz −3')
    expect(container.querySelector('.p-sec-title')?.textContent).toBe('Solar wind')
  })

  it('closes and reopens on click, keeping the content mounted, and reports the change', () => {
    const onchange = vi.fn()
    const { container } = render(Section, { props: { title: 'Kp', onchange, children: html('<p>content</p>') } })
    const button = screen.getByRole('button')
    button.click()
    flushSync()
    expect(button.getAttribute('aria-expanded')).toBe('false')
    const body = container.querySelector('.body') as HTMLElement
    expect(body.hidden).toBe(true)
    expect(body.querySelector('p')).not.toBeNull()
    expect(onchange).toHaveBeenLastCalledWith(false)
    button.click()
    flushSync()
    expect(body.hidden).toBe(false)
    expect(onchange).toHaveBeenLastCalledWith(true)
  })

  it('starts closed when the consumer says so and takes a consumer id', () => {
    const { container } = render(Section, { props: { title: 'Regions', open: false, id: 'regions' } })
    expect(screen.getByRole('button').getAttribute('aria-expanded')).toBe('false')
    expect(screen.getByRole('button').getAttribute('aria-controls')).toBe('regions')
    expect((container.querySelector('#regions') as HTMLElement).hidden).toBe(true)
  })

  it('renders the actions outside the toggle button', () => {
    const { container } = render(Section, { props: { title: 'Kp', actions: html('<b class="act">i</b>') } })
    expect(container.querySelector('.actions .act')).not.toBeNull()
    expect(container.querySelector('button .act')).toBeNull()
  })

  it('gives sibling sections distinct generated ids', () => {
    const a = render(Section, { props: { title: 'A' } })
    const b = render(Section, { props: { title: 'B' } })
    const idA = a.container.querySelector('.body')?.id
    const idB = b.container.querySelector('.body')?.id
    expect(idA).toMatch(/^p-section-\d+$/)
    expect(idA).not.toBe(idB)
  })
})
