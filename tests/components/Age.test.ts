import { afterEach, describe, expect, it } from 'vitest'
import { render } from '@testing-library/svelte'
import { flushSync } from 'svelte'
import { Age, formatAge, setLabels } from '../../src/index'

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

describe('Age language', () => {
  afterEach(() => {
    setLabels({ locale: undefined })
    document.documentElement.lang = ''
  })

  const absolute = (locale: string, at: number) => new Intl.DateTimeFormat(locale, { dateStyle: 'medium', timeStyle: 'short' }).format(at)

  it('without the prop, follows the page lang', () => {
    document.documentElement.lang = 'it'
    const { container } = render(Age, { props: { updatedAt: NOW - 3 * MIN, now: NOW } })
    const chip = container.querySelector('.p-chip') as HTMLElement
    expect(chip.textContent).toBe('3 min fa')
    expect(chip.title).toBe(absolute('it', NOW - 3 * MIN))
  })

  it('the locale of setLabels wins over the page lang, the prop over both', () => {
    document.documentElement.lang = 'it'
    setLabels({ locale: 'de' })
    const labelled = render(Age, { props: { updatedAt: NOW - 3 * MIN, now: NOW } })
    expect(labelled.container.textContent).toBe(formatAge(3 * MIN, 'de'))
    const prop = render(Age, { props: { updatedAt: NOW - 3 * MIN, now: NOW, locale: 'en' } })
    expect(prop.container.textContent).toBe('3m ago')
  })

  it('a locale set at runtime reaches an Age on screen', () => {
    const { container } = render(Age, { props: { updatedAt: NOW - 3 * MIN, now: NOW } })
    setLabels({ locale: 'it' })
    flushSync()
    expect(container.textContent).toBe('3 min fa')
  })

  it('formatAge without a locale uses the same order', () => {
    document.documentElement.lang = 'it'
    expect(formatAge(3 * MIN)).toBe('3 min fa')
    setLabels({ locale: 'en' })
    expect(formatAge(3 * MIN)).toBe('3m ago')
  })
})
