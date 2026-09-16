import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/svelte'
import { Skeleton } from '../../src/index'

describe('Skeleton', () => {
  it('is a status region named "Loading" with three lines by default', () => {
    const { container } = render(Skeleton)
    expect(screen.getByRole('status', { name: 'Loading' })).not.toBeNull()
    expect(container.querySelectorAll('.line').length).toBe(3)
  })

  it('counts the lines and takes the label in the language of the app', () => {
    const { container } = render(Skeleton, { props: { lines: 5, label: 'Caricamento', compact: true } })
    expect(screen.getByRole('status', { name: 'Caricamento' })).not.toBeNull()
    expect(container.querySelectorAll('.line').length).toBe(5)
    expect(container.querySelector('.p-skel.compact')).not.toBeNull()
  })
})
