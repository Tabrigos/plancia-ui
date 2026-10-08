import { describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/svelte'
import { Slider, type SliderMark } from '../../src/index'
// The component source as text (Vite `?raw`), to assert on its scoped CSS rules.
import source from '../../src/components/Slider.svelte?raw'

const frame = (container: HTMLElement) => container.querySelector('.p-slider') as HTMLElement

describe('Slider', () => {
  it('is a native range named by its label, with its bounds, its step and its value', () => {
    render(Slider, { props: { label: 'Time of the view', min: 0, max: 364, step: 1, value: 171 } })
    const range = screen.getByRole('slider', { name: 'Time of the view' }) as HTMLInputElement
    expect(range.type).toBe('range')
    expect([range.min, range.max, range.step]).toEqual(['0', '364', '1'])
    expect(range.value).toBe('171')
    expect(range.hasAttribute('aria-valuetext')).toBe(false)
  })

  it('starts at its minimum when the app gives no value', () => {
    const { container } = render(Slider, { props: { label: 'Frame', min: 10, max: 20 } })
    expect((screen.getByRole('slider') as HTMLInputElement).value).toBe('10')
    expect(frame(container).style.getPropertyValue('--at')).toBe('0')
  })

  it('says the value in words, in place of the number', () => {
    render(Slider, { props: { label: 'Time of the view', max: 364, value: 78, valueText: '20 March' } })
    expect(screen.getByRole('slider').getAttribute('aria-valuetext')).toBe('20 March')
  })

  it('reports the value as a number while it moves and when let go, and fills up to it', async () => {
    const oninput = vi.fn()
    const onchange = vi.fn()
    const { container } = render(Slider, { props: { label: 'Opacity', value: 20, oninput, onchange } })
    const range = screen.getByRole('slider') as HTMLInputElement
    range.value = '40'
    await fireEvent.input(range)
    expect(oninput).toHaveBeenLastCalledWith(40)
    expect(frame(container).style.getPropertyValue('--at')).toBe('0.4')
    await fireEvent.change(range)
    expect(onchange).toHaveBeenLastCalledWith(40)
  })

  it('follows the value the app gives it, and keeps the fill inside the track', async () => {
    const { container, rerender } = render(Slider, { props: { label: 'Frame', min: 0, max: 6, value: 0 } })
    await rerender({ value: 3 })
    expect((screen.getByRole('slider') as HTMLInputElement).value).toBe('3')
    expect(frame(container).style.getPropertyValue('--at')).toBe('0.5')
    await rerender({ value: 9 })
    expect(frame(container).style.getPropertyValue('--at')).toBe('1')
    await rerender({ min: 6, value: 6 })
    expect(frame(container).style.getPropertyValue('--at')).toBe('0')
  })

  it('ticks its marks along the track, with their labels, hidden from a screen reader', () => {
    const marks: SliderMark[] = [{ value: 91, label: 'Apr' }, { value: 182 }, { value: 364, label: 'Dec' }]
    const { container } = render(Slider, { props: { label: 'Time of the view', max: 364, value: 0, marks } })
    const ticks = container.querySelector('.marks') as HTMLElement
    expect(ticks.getAttribute('aria-hidden')).toBe('true')
    const each = [...ticks.querySelectorAll<HTMLElement>('.mark')]
    expect(each.map((mark) => mark.textContent)).toEqual(['Apr', '', 'Dec'])
    expect(each.map((mark) => mark.style.getPropertyValue('--at'))).toEqual(['0.25', '0.5', '1'])
    expect(screen.getByRole('slider', { name: 'Time of the view' })).not.toBeNull()
  })

  it('draws no marks without them', () => {
    const { container } = render(Slider, { props: { label: 'Opacity' } })
    expect(container.querySelector('.marks')).toBeNull()
  })

  it('takes a class on its frame, and attributes of the app on the range', () => {
    const { container } = render(Slider, { props: { label: 'Frame', class: 'grow', id: 'frame', name: 'frame', title: 'Drag to a frame', disabled: true } })
    expect(frame(container).classList.contains('grow')).toBe(true)
    const range = screen.getByRole('slider') as HTMLInputElement
    expect(range.id).toBe('frame')
    expect(range.name).toBe('frame')
    expect(range.title).toBe('Drag to a frame')
    expect(range.disabled).toBe(true)
  })

  it('gives the thumb a finger on touch and keeps a drag along it off the page', () => {
    // Asserted on the scoped CSS: jsdom does not lay out
    expect(source).toContain('max(var(--p-space-4), var(--p-tap-h))')
    expect(source).toContain('height: var(--p-control-h-sm)')
    expect(source).toContain('touch-action: pan-y;')
    expect(source).toMatch(/^\s*label: string$/m)
  })
})
