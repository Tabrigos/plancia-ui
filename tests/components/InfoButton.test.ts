import { afterEach, describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/svelte'
import { InfoButton, setLabels } from '../../src/index'

afterEach(() => setLabels({ info: 'What is this' }))

describe('InfoButton', () => {
  it('is a disclosure button named "What is this" by default', () => {
    const onclick = vi.fn()
    render(InfoButton, { props: { onclick, controls: 'kp-info' } })
    const button = screen.getByRole('button', { name: 'What is this' })
    expect(button.getAttribute('aria-expanded')).toBe('false')
    expect(button.getAttribute('aria-controls')).toBe('kp-info')
    expect(button.title).toBe('What is this')
    button.click()
    expect(onclick).toHaveBeenCalledTimes(1)
  })

  it('shows the active state and takes its label from setLabels or from the prop', () => {
    setLabels({ info: "Cos'è questo dato" })
    render(InfoButton, { props: { active: true } })
    const button = screen.getByRole('button', { name: "Cos'è questo dato" })
    expect(button.getAttribute('aria-expanded')).toBe('true')
    expect(button.classList.contains('active')).toBe(true)
    render(InfoButton, { props: { label: 'About Kp' } })
    expect(screen.getByRole('button', { name: 'About Kp' })).not.toBeNull()
  })
})
