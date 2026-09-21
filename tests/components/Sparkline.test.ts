import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/svelte'
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

  it('draws no line for a single value', () => {
    const { container } = render(Sparkline, { props: { values: [7], label: 'One' } })
    expect(container.querySelector('polyline')).toBeNull()
    expect(container.querySelector('.dot')).not.toBeNull()
  })
})
