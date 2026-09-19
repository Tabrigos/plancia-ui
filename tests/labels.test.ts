import { afterEach, describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/svelte'
import { flushSync } from 'svelte'
import { PanelHead, Skeleton, getLabels, setLabels } from '../src/index'

afterEach(() => setLabels({ close: 'Close', loading: 'Loading', info: 'What is this' }))

describe('setLabels', () => {
  it('getLabels returns a snapshot of the current defaults', () => {
    expect(getLabels()).toEqual({ close: 'Close', loading: 'Loading', info: 'What is this' })
    setLabels({ close: 'Chiudi' })
    expect(getLabels()).toEqual({ close: 'Chiudi', loading: 'Loading', info: 'What is this' })
  })

  it('changes the default accessible names of PanelHead and Skeleton', () => {
    setLabels({ close: 'Chiudi', loading: 'Caricamento' })
    render(PanelHead, { props: { title: 'ISS', onclose: () => {} } })
    render(Skeleton)
    expect(screen.getByRole('button', { name: 'Chiudi' })).not.toBeNull()
    expect(screen.getByRole('status', { name: 'Caricamento' })).not.toBeNull()
  })

  it('a prop passed to the component still wins', () => {
    setLabels({ close: 'Chiudi' })
    render(PanelHead, { props: { title: 'ISS', onclose: () => {}, closeLabel: 'Fermer' } })
    expect(screen.getByRole('button', { name: 'Fermer' })).not.toBeNull()
  })

  it('reaches components already on screen', () => {
    render(PanelHead, { props: { title: 'ISS', onclose: () => {} } })
    expect(screen.getByRole('button', { name: 'Close' })).not.toBeNull()
    setLabels({ close: 'Schließen' })
    flushSync()
    expect(screen.getByRole('button', { name: 'Schließen' })).not.toBeNull()
  })
})
