import { describe, expect, it } from 'vitest'
import { render } from '@testing-library/svelte'
import { Age, formatAge } from '../../src/index'

const NOW = Date.UTC(2026, 8, 18, 12, 0, 0)
const MIN = 60_000

describe('formatAge', () => {
  it('picks the largest whole unit, in the locale', () => {
    expect(formatAge(0, 'en')).toBe('now')
    expect(formatAge(40_000, 'en')).toBe('40s ago')
    expect(formatAge(3 * MIN, 'en')).toBe('3m ago')
    expect(formatAge(2 * 60 * MIN, 'en')).toBe('2h ago')
    expect(formatAge(3 * 24 * 60 * MIN, 'en')).toBe('3d ago')
    expect(formatAge(3 * MIN, 'it')).toBe('3 min fa')
  })

  it('never goes negative', () => {
    expect(formatAge(-5000, 'en')).toBe('now')
  })
})

describe('Age', () => {
  it('renders the age as a chip with the absolute time as tooltip', () => {
    const { container } = render(Age, { props: { updatedAt: NOW - 8 * MIN, now: NOW, locale: 'en' } })
    const chip = container.querySelector('.p-chip') as HTMLElement
    expect(chip.textContent).toBe('8m ago')
    expect(chip.classList.contains('neutral')).toBe(true)
    expect(chip.title).toContain('2026')
    expect(container.querySelector('time')?.getAttribute('datetime')).toBe(new Date(NOW - 8 * MIN).toISOString())
  })

  it('turns warn past staleAfter and danger past deadAfter', () => {
    const fresh = render(Age, { props: { updatedAt: NOW - 8 * MIN, now: NOW, staleAfter: 10 * MIN, deadAfter: 60 * MIN } })
    expect(fresh.container.querySelector('.p-chip.neutral')).not.toBeNull()
    const stale = render(Age, { props: { updatedAt: NOW - 12 * MIN, now: NOW, staleAfter: 10 * MIN, deadAfter: 60 * MIN } })
    expect(stale.container.querySelector('.p-chip.warn')).not.toBeNull()
    const dead = render(Age, { props: { updatedAt: NOW - 90 * MIN, now: NOW, staleAfter: 10 * MIN, deadAfter: 60 * MIN } })
    expect(dead.container.querySelector('.p-chip.danger')).not.toBeNull()
  })

  it('accepts an ISO string and a consumer title', () => {
    const { container } = render(Age, { props: { updatedAt: new Date(NOW - 2 * 3_600_000).toISOString(), now: NOW, locale: 'en', title: 'Observation time' } })
    const chip = container.querySelector('.p-chip') as HTMLElement
    expect(chip.textContent).toBe('2h ago')
    expect(chip.title).toBe('Observation time')
  })
})
