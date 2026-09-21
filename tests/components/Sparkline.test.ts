import { describe, expect, it } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/svelte'
import { flushSync } from 'svelte'
import { Sparkline } from '../../src/index'

describe('Sparkline', () => {
  it('is an image named by its label, with a 2 px line on the first dataviz token and an end dot', () => {
    const { container } = render(Sparkline, { props: { values: [1, 3, 2, 5], label: 'X-ray flux, last hour' } })
    const svg = screen.getByRole('img', { name: 'X-ray flux, last hour' })
    expect(svg.getAttribute('viewBox')).toBe('0 0 120 32')
    expect(svg.getAttribute('style')).toContain('var(--p-viz-1)')
    const line = container.querySelector('polyline.line') as SVGPolylineElement
    expect(line.getAttribute('points')?.split(' ').length).toBe(4)
    const dot = container.querySelector('circle.dot') as SVGCircleElement
    expect(dot.getAttribute('cx')).toBe('117')
    expect(container.querySelector('.area')).toBeNull()
  })

  it('takes a color, an area, a pinned scale and a title, and can drop the end dot', () => {
    const { container } = render(Sparkline, { props: { values: [0, 5, 10], min: 0, max: 20, color: 'var(--p-viz-3)', area: true, endDot: false, label: 'Wind', title: 'km/s' } })
    expect(container.querySelector('svg')?.getAttribute('style')).toContain('var(--p-viz-3)')
    expect(container.querySelector('.area')).not.toBeNull()
    expect(container.querySelector('.dot')).toBeNull()
    expect(container.querySelector('title')?.textContent).toBe('km/s')
    // 10 of a 0–20 scale sits halfway: y = 3 + 26 / 2
    expect(container.querySelector('polyline')?.getAttribute('points')?.split(' ')[2]).toBe('117,16')
  })

  it('lifts the pen at a null sample: one polyline per run, a dot for a lone sample, the end dot on the last real value', () => {
    const { container } = render(Sparkline, { props: { values: [1, 2, null, 4, null, 6, 7], label: 'Bz' } })
    expect(container.querySelectorAll('polyline.line').length).toBe(2)
    expect(container.querySelectorAll('circle.lone').length).toBe(1)
    expect(container.querySelector('circle.dot')?.getAttribute('cx')).toBe('117')
  })

  it('draws the zero line on a stretched scale and a dashed marker at an index', () => {
    const { container } = render(Sparkline, { props: { values: [-2, -1, 1, 2, 1], zeroLine: true, markIndex: 2, label: 'Bz' } })
    const zero = container.querySelector('line.zero') as SVGLineElement
    expect(zero.getAttribute('y1')).toBe('16')
    expect(zero.getAttribute('x2')).toBe('120')
    const mark = container.querySelector('line.mark') as SVGLineElement
    expect(mark.getAttribute('x1')).toBe('60')
    expect(mark.getAttribute('y2')).toBe('32')
    const out = render(Sparkline, { props: { values: [1, 2], markIndex: 5, label: 'Out of range' } })
    expect(out.container.querySelector('line.mark')).toBeNull()
    expect(out.container.querySelector('line.zero')).toBeNull()
  })

  it('reads out the nearest sample under a pointer, a finger or the arrow keys, and only with a readout', async () => {
    const readout = (i: number, v: number) => `#${i} · ${v} km/s`
    const { container } = render(Sparkline, { props: { values: [400, 410, null, 430, 440], readout, label: 'Wind' } })
    const box = screen.getByRole('slider', { name: 'Wind' })
    expect(box.getAttribute('tabindex')).toBe('0')
    expect(box.getAttribute('aria-valuenow')).toBe('4')
    expect(box.getAttribute('aria-valuetext')).toBe('#4 · 440 km/s')
    const status = container.querySelector('.readout') as HTMLElement
    expect(status.hidden).toBe(true)
    // a mouse hovers: x = 60 is the middle, a gap, so its neighbor at 3
    await fireEvent.pointerMove(box, { clientX: 60, pointerType: 'mouse', buttons: 0 })
    flushSync()
    expect(status.hidden).toBe(false)
    expect(status.textContent).toBe('#3 · 430 km/s')
    expect(box.getAttribute('aria-valuetext')).toBe('#3 · 430 km/s')
    expect(container.querySelector('circle.pick')?.getAttribute('cx')).toBe('88.5')
    await fireEvent.pointerLeave(box, { pointerType: 'mouse' })
    flushSync()
    expect(status.hidden).toBe(true)
    // a finger: down, then a move with the button held; lifting keeps the reading
    box.setPointerCapture = () => {}
    await fireEvent.pointerDown(box, { clientX: 3, pointerType: 'touch', pointerId: 1, buttons: 1 })
    await fireEvent.pointerMove(box, { clientX: 30, pointerType: 'touch', pointerId: 1, buttons: 1 })
    flushSync()
    expect(status.textContent).toBe('#1 · 410 km/s')
    await fireEvent.pointerMove(box, { clientX: 117, pointerType: 'touch', pointerId: 1, buttons: 0 })
    await fireEvent.pointerLeave(box, { pointerType: 'touch' })
    flushSync()
    expect(status.textContent).toBe('#1 · 410 km/s')
    // keys: left from the last sample, Escape hides
    await fireEvent.keyDown(box, { key: 'ArrowLeft' })
    flushSync()
    expect(status.textContent).toBe('#0 · 400 km/s')
    await fireEvent.keyDown(box, { key: 'Escape' })
    flushSync()
    expect(status.hidden).toBe(true)
    // without a readout the svg is the image and nothing is focusable
    const plain = render(Sparkline, { props: { values: [1, 2], label: 'Plain' } })
    expect(plain.container.querySelector('svg')?.getAttribute('role')).toBe('img')
    expect(plain.container.querySelector('[tabindex]')).toBeNull()
  })

  it('draws no line for a single value', () => {
    const { container } = render(Sparkline, { props: { values: [7], label: 'One' } })
    expect(container.querySelector('polyline')).toBeNull()
    expect(container.querySelector('.dot')).not.toBeNull()
  })
})
