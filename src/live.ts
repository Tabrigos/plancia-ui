/**
 * Announcements for screen readers. A console changes by itself all the
 * time (telemetry, polling): announcing everything would be noise. What
 * goes through here is only what follows an action of the user and cannot
 * be seen without looking at the stage: an object selected, a panel
 * closed with Esc. `announce()` writes into the `LiveRegion` component,
 * mounted once; the text empties after five seconds, and the same text
 * announced twice is emptied and rewritten, or the reader would stay
 * silent. Plain JavaScript (`plancia-ui/live`): call it from a store.
 */
import { writable } from 'svelte/store'

export const liveMessage = writable('')

const CLEAR_AFTER_MS = 5000
let clear: ReturnType<typeof setTimeout> | null = null

export function announce(text: string): void {
  liveMessage.set('')
  queueMicrotask(() => liveMessage.set(text))
  if (clear) clearTimeout(clear)
  clear = setTimeout(() => {
    liveMessage.set('')
    clear = null
  }, CLEAR_AFTER_MS)
}
