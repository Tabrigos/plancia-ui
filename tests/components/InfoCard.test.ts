import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/svelte'
import { InfoCard } from '../../src/index'
import { html } from '../helpers'

describe('InfoCard', () => {
  it('is a native details with a summary when given one, closed by default', () => {
    const { container } = render(InfoCard, { props: { summary: 'what is this datum', children: html('<p>The planetary Kp index.</p>') } })
    const details = container.querySelector('details.p-info-card') as HTMLDetailsElement
    expect(details.open).toBe(false)
    expect(container.querySelector('summary')?.textContent).toBe('what is this datum')
    expect(container.querySelector('.body p')?.textContent).toBe('The planetary Kp index.')
  })

  it('opens from the prop', () => {
    const { container } = render(InfoCard, { props: { summary: 'more', open: true, id: 'kp-info' } })
    const details = container.querySelector('details') as HTMLDetailsElement
    expect(details.open).toBe(true)
    expect(details.id).toBe('kp-info')
  })

  it('is an always-open region without a summary, with a close button when asked', () => {
    const onclose = vi.fn()
    const { container } = render(InfoCard, { props: { label: 'About Kp', onclose, children: html('<dl><dt>Source</dt><dd>SWPC</dd></dl>') } })
    expect(screen.getByRole('region', { name: 'About Kp' }).classList.contains('inline')).toBe(true)
    expect(container.querySelector('details')).toBeNull()
    expect(container.querySelector('dd')?.textContent).toBe('SWPC')
    screen.getByRole('button', { name: 'Close' }).click()
    expect(onclose).toHaveBeenCalledTimes(1)
  })

  it('has no close button without onclose', () => {
    render(InfoCard, { props: { label: 'About Kp' } })
    expect(screen.queryByRole('button')).toBeNull()
  })
})
