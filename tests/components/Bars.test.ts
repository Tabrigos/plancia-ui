import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/svelte'
import { Bars } from '../../src/index'

describe('Bars', () => {
  it('draws one bar per value, from a zero baseline, on the first dataviz token', () => {
    const { container } = render(Bars, { props: { bars: [{ value: 1 }, { value: 2 }, { value: 4 }], width: 60, height: 40, label: 'Kp today' } })
    expect(screen.getByRole('img', { name: 'Kp today' })).not.toBeNull()
    const paths = [...container.querySelectorAll('path')]
    expect(paths.length).toBe(3)
    expect(paths[0].getAttribute('style')).toContain('var(--p-viz-1)')
    // the tallest bar reaches the top (y 0), the first one a quarter of the height
    expect(paths[2].getAttribute('d')).toMatch(/^M41,40 V2 /)
    expect(paths[0].getAttribute('d')).toMatch(/^M1,40 V32 /)
  })

  it('colors a bar by itself, names it, and scales on a pinned maximum', () => {
    const { container } = render(Bars, { props: { bars: [{ value: 3, label: '03 UTC · Kp 3', color: 'var(--p-scale-1)' }, { value: 9 }], max: 9, label: 'Kp' } })
    const paths = [...container.querySelectorAll('path')]
    expect(paths[0].getAttribute('style')).toContain('var(--p-scale-1)')
    expect(paths[0].querySelector('title')?.textContent).toBe('03 UTC · Kp 3')
    expect(paths[1].querySelector('title')).toBeNull()
  })

  it('keeps a surface gap between bars', () => {
    const { container } = render(Bars, { props: { bars: [{ value: 1 }, { value: 1 }], width: 20, height: 10, gap: 4, label: 'Two' } })
    const [a, b] = [...container.querySelectorAll('path')].map((p) => p.getAttribute('d') ?? '')
    expect(a.startsWith('M2,10')).toBe(true)
    expect(b.startsWith('M12,10')).toBe(true)
    expect(a).toContain('H')
  })
})
