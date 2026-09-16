import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/svelte'
import { Button } from '../../src/index'
import { html } from '../helpers'

describe('Button', () => {
  it('is a native button, secondary and medium by default', () => {
    render(Button, { props: { children: html('<span>show all</span>') } })
    const button = screen.getByRole('button', { name: 'show all' })
    expect(button.tagName).toBe('BUTTON')
    expect(button.getAttribute('type')).toBe('button')
    expect(button.classList.contains('secondary')).toBe(true)
    expect(button.classList.contains('md')).toBe(true)
  })

  it('applies variant and size as classes', () => {
    render(Button, { props: { variant: 'primary', size: 'sm', children: html('<span>go</span>') } })
    const button = screen.getByRole('button')
    expect(button.classList.contains('primary')).toBe(true)
    expect(button.classList.contains('sm')).toBe(true)
  })

  it('marks the active state with aria-pressed, and only then', () => {
    const { unmount } = render(Button, { props: { active: true, children: html('<span>view</span>') } })
    expect(screen.getByRole('button').getAttribute('aria-pressed')).toBe('true')
    unmount()
    render(Button, { props: { children: html('<span>view</span>') } })
    expect(screen.getByRole('button').hasAttribute('aria-pressed')).toBe(false)
  })

  it('forwards native attributes and the click handler', async () => {
    const onclick = vi.fn()
    render(Button, { props: { title: 'Settings', disabled: true, onclick, children: html('<span>⚙</span>') } })
    const button = screen.getByRole('button') as HTMLButtonElement
    expect(button.title).toBe('Settings')
    expect(button.disabled).toBe(true)
    button.click()
    expect(onclick).not.toHaveBeenCalled()
  })
})
