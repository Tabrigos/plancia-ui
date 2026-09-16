import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/svelte'
import { PanelHead } from '../../src/index'
import { html } from '../helpers'

describe('PanelHead', () => {
  it('renders title and subtitle, with the tooltip on the subtitle', () => {
    const { container } = render(PanelHead, { props: { title: 'Sun now', subtitle: '304 Å · 3 min ago', subtitleTitle: 'Image time' } })
    expect(container.querySelector('.title')?.textContent).toBe('Sun now')
    const sub = container.querySelector('.sub') as HTMLElement
    expect(sub.textContent).toBe('304 Å · 3 min ago')
    expect(sub.title).toBe('Image time')
    expect(sub.classList.contains('help')).toBe(true)
  })

  it('renders the close button only with onclose, named "Close" by default', async () => {
    const { unmount } = render(PanelHead, { props: { title: 'ISS' } })
    expect(screen.queryByRole('button')).toBeNull()
    unmount()
    const onclose = vi.fn()
    render(PanelHead, { props: { title: 'ISS', onclose } })
    const close = screen.getByRole('button', { name: 'Close' })
    expect(close.title).toBe('Close')
    close.click()
    expect(onclose).toHaveBeenCalledTimes(1)
  })

  it('takes the close label in the language of the app', () => {
    render(PanelHead, { props: { title: 'ISS', onclose: () => {}, closeLabel: 'Chiudi' } })
    expect(screen.getByRole('button', { name: 'Chiudi' })).not.toBeNull()
  })

  it('renders the chips and actions snippets, close button last', () => {
    const { container } = render(PanelHead, {
      props: { title: 'ISS', onclose: () => {}, chips: html('<i class="chip">STATIONS</i>'), actions: html('<b class="act">i</b>') },
    })
    expect(container.querySelector('.chips .chip')?.textContent).toBe('STATIONS')
    expect(container.querySelector('.actions .act')?.textContent).toBe('i')
    const head = container.querySelector('.p-ph') as HTMLElement
    expect(head.lastElementChild?.classList.contains('close')).toBe(true)
  })
})
