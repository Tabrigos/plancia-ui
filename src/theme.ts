/**
 * Theme helpers: the small, pure functions every consumer ends up writing to
 * put `data-theme` on the root element. The package still never decides
 * WHEN the light theme applies: the app calls these, before mount, with a
 * storage key of its own (`'myapp.theme'`), so two apps on the same origin
 * do not share the preference.
 *
 * Dark is the value of `:root`, so it leaves no attribute; light sets
 * `data-theme="light"`, which `tokens.css` redefines the colors under.
 */

export type Theme = 'dark' | 'light'

export const DEFAULT_THEME: Theme = 'dark'

/**
 * The one breakpoint of the package, in CSS pixels: below it a screen is a
 * phone and `FloatingPanel` becomes a bottom sheet. The app that lays out
 * its console around the package uses the same number (in JavaScript
 * through `PHONE_MEDIA`, in CSS by writing it: a custom property cannot
 * enter a media query), so the two never drift apart.
 */
export const PHONE_BREAKPOINT = 700

/** The media query of a phone screen, for `matchMedia(PHONE_MEDIA)`. */
export const PHONE_MEDIA = `(max-width: ${PHONE_BREAKPOINT}px)`

/** Whether the screen is a phone right now; `false` without a window (SSR, Node). */
export function isPhone(): boolean {
  return typeof matchMedia === 'function' && matchMedia(PHONE_MEDIA).matches
}

/** Any stored or requested value → a theme; unknown values → the default. */
export function parseTheme(raw: string | null | undefined): Theme {
  return raw === 'light' || raw === 'dark' ? raw : DEFAULT_THEME
}

/** Puts (or removes) `data-theme` on the root element; dark leaves no attribute. */
export function applyTheme(theme: Theme, root: HTMLElement | null = typeof document === 'undefined' ? null : document.documentElement): void {
  if (!root) return
  if (theme === DEFAULT_THEME) delete root.dataset.theme
  else root.dataset.theme = theme
}

/** The preference saved under `storageKey`; the default when there is none or storage is unavailable. */
export function readStoredTheme(storageKey: string): Theme {
  try {
    return parseTheme(localStorage.getItem(storageKey))
  } catch {
    return DEFAULT_THEME
  }
}

/** Saves the preference; the default is saved as "nothing", so a cleared choice is the default again. */
export function rememberTheme(theme: Theme, storageKey: string): void {
  try {
    if (theme === DEFAULT_THEME) localStorage.removeItem(storageKey)
    else localStorage.setItem(storageKey, theme)
  } catch { /* storage unavailable: the choice lasts for this session */ }
}

/** `?theme=light` (or `dark`) in a URL, for deep links and screenshots; `null` when absent or unknown. */
export function readRequestedTheme(search: string = typeof location === 'undefined' ? '' : location.search): Theme | null {
  const raw = new URLSearchParams(search).get('theme')
  return raw === 'light' || raw === 'dark' ? raw : null
}

/** Reads the saved preference and applies it: the one call an entry point needs before mount. */
export function applyStoredTheme(storageKey: string): Theme {
  const theme = readStoredTheme(storageKey)
  applyTheme(theme)
  return theme
}
