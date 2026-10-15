import { describe, expect, it } from 'vitest'
import { tabAfterKey } from '../src/tab-keys'

const items = [{ id: 'a' }, { id: 'b', disabled: true }, { id: 'c' }]

describe('tabAfterKey', () => {
  it('follows the arrows along the list, skipping a disabled tab and wrapping', () => {
    expect(tabAfterKey(items, 'a', 'ArrowRight')?.id).toBe('c')
    expect(tabAfterKey(items, 'c', 'ArrowRight')?.id).toBe('a')
    expect(tabAfterKey(items, 'a', 'ArrowDown', true)?.id).toBe('c')
    expect(tabAfterKey(items, 'a', 'ArrowUp', true)?.id).toBe('c')
    expect(tabAfterKey(items, 'c', 'Home')?.id).toBe('a')
    expect(tabAfterKey(items, 'a', 'End', true)?.id).toBe('c')
  })

  it('leaves alone the arrows across the list and every other key', () => {
    expect(tabAfterKey(items, 'a', 'ArrowDown')).toBeUndefined()
    expect(tabAfterKey(items, 'a', 'ArrowRight', true)).toBeUndefined()
    expect(tabAfterKey(items, 'a', 'Enter')).toBeUndefined()
    expect(tabAfterKey([{ id: 'x', disabled: true }], undefined, 'Home')).toBeUndefined()
  })
})
