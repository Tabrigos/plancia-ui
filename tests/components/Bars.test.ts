import { describe, expect, it } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/svelte'
import { flushSync } from 'svelte'
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

  it('reads out the bar under a pointer, a finger or the arrow keys, and only with a readout', async () => {
    const kp = [2, 3, 5, 4].map((value, i) => ({ value, label: `${String(i * 3).padStart(2, '0')} UTC · Kp ${value}` }))
    const readout = (_: number, bar: { label?: string }) => bar.label ?? ''
    const { container } = render(Bars, { props: { bars: kp, width: 80, height: 20, readout, label: 'Kp today' } })
    const box = screen.getByRole('slider', { name: 'Kp today' })
    expect(box.getAttribute('aria-valuenow')).toBe('3')
    expect(box.getAttribute('aria-valuetext')).toBe('09 UTC · Kp 4')
    // with a readout the box speaks: no tooltip per bar, the svg is hidden
    expect(container.querySelector('title')).toBeNull()
    expect(container.querySelector('svg')?.getAttribute('aria-hidden')).toBe('true')
    const status = container.querySelector('.readout') as HTMLElement
    expect(status.hidden).toBe(true)
    // a mouse over the second bar (slots of 20 px): it stays whole, the others fade
    await fireEvent.pointerMove(box, { clientX: 25, pointerType: 'mouse', buttons: 0 })
    flushSync()
    expect(status.textContent).toBe('03 UTC · Kp 3')
    expect([...container.querySelectorAll('path')].map((path) => path.classList.contains('faded'))).toEqual([true, false, true, true])
    await fireEvent.pointerLeave(box, { pointerType: 'mouse' })
    flushSync()
    expect(status.hidden).toBe(true)
    expect(container.querySelector('path.faded')).toBeNull()
    // a finger drags to the third bar and lifts: the reading stays
    box.setPointerCapture = () => {}
    await fireEvent.pointerDown(box, { clientX: 5, pointerType: 'touch', pointerId: 1, buttons: 1 })
    await fireEvent.pointerMove(box, { clientX: 45, pointerType: 'touch', pointerId: 1, buttons: 1 })
    await fireEvent.pointerLeave(box, { pointerType: 'touch' })
    flushSync()
    expect(status.textContent).toBe('06 UTC · Kp 5')
    // keys move it, and stop at the ends; Escape hides
    await fireEvent.keyDown(box, { key: 'ArrowRight' })
    await fireEvent.keyDown(box, { key: 'ArrowRight' })
    flushSync()
    expect(status.textContent).toBe('09 UTC · Kp 4')
    await fireEvent.keyDown(box, { key: 'Escape' })
    flushSync()
    expect(status.hidden).toBe(true)
  })
})
