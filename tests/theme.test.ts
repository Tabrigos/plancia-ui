import { afterEach, describe, expect, it } from 'vitest'
import { applyStoredTheme, applyTheme, parseTheme, readRequestedTheme, readStoredTheme, rememberTheme } from '../src/index'

const KEY = 'test.theme'

afterEach(() => {
  localStorage.clear()
  delete document.documentElement.dataset.theme
})

describe('theme helpers', () => {
  it('parses any value into a theme, unknown ones into dark', () => {
    expect(parseTheme('light')).toBe('light')
    expect(parseTheme('dark')).toBe('dark')
    expect(parseTheme('blue')).toBe('dark')
    expect(parseTheme(null)).toBe('dark')
  })

  it('applies light as an attribute and dark as no attribute', () => {
    applyTheme('light')
    expect(document.documentElement.dataset.theme).toBe('light')
    applyTheme('dark')
    expect(document.documentElement.dataset.theme).toBeUndefined()
  })

  it('remembers the preference under the consumer key, the default as nothing', () => {
    rememberTheme('light', KEY)
    expect(localStorage.getItem(KEY)).toBe('light')
    expect(readStoredTheme(KEY)).toBe('light')
    rememberTheme('dark', KEY)
    expect(localStorage.getItem(KEY)).toBeNull()
    expect(readStoredTheme(KEY)).toBe('dark')
  })

  it('applies the stored preference in one call and returns it', () => {
    localStorage.setItem(KEY, 'light')
    expect(applyStoredTheme(KEY)).toBe('light')
    expect(document.documentElement.dataset.theme).toBe('light')
  })

  it('reads a theme requested in the URL, or nothing', () => {
    expect(readRequestedTheme('?theme=light')).toBe('light')
    expect(readRequestedTheme('?theme=dark&x=1')).toBe('dark')
    expect(readRequestedTheme('?theme=blue')).toBeNull()
    expect(readRequestedTheme('')).toBeNull()
  })
})
