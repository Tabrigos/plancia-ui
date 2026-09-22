import { describe, expect, it } from 'vitest'
import { keyboardScroll } from '../src/keyboard-scroll'

// jsdom does not lay out: the overflow is stubbed on the element
function box(scrollHeight: number, clientHeight: number, markup = '<p>text</p>'): HTMLElement {
  const element = document.createElement('div')
  element.innerHTML = markup
  Object.defineProperty(element, 'scrollHeight', { configurable: true, get: () => scrollHeight })
  Object.defineProperty(element, 'clientHeight', { configurable: true, get: () => clientHeight })
  document.body.append(element)
  return element
}

const settle = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('keyboardScroll', () => {
  it('makes a box that scrolls with nothing focusable a tab stop', () => {
    const element = box(400, 200)
    const action = keyboardScroll(element)
    expect(element.getAttribute('tabindex')).toBe('0')
    action.destroy()
  })

  it('leaves alone a box that does not scroll', () => {
    const element = box(200, 200)
    keyboardScroll(element).destroy()
    expect(element.hasAttribute('tabindex')).toBe(false)
  })

  it('stops being a tab stop when focusable content arrives, the content can be reached instead', async () => {
    const element = box(400, 200)
    const action = keyboardScroll(element)
    element.append(Object.assign(document.createElement('button'), { textContent: 'Follow' }))
    await settle()
    expect(element.hasAttribute('tabindex')).toBe(false)
    action.destroy()
  })
})
