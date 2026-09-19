import { describe, expect, it } from 'vitest'
import { render } from '@testing-library/svelte'
import { Kbd } from '../../src/index'
import { html } from '../helpers'

describe('Kbd', () => {
  it('renders a native kbd element with the key as content', () => {
    const { container } = render(Kbd, { props: { children: html('<span>Esc</span>') } })
    const kbd = container.querySelector('kbd.p-kbd') as HTMLElement
    expect(kbd.tagName).toBe('KBD')
    expect(kbd.textContent).toBe('Esc')
  })
})
