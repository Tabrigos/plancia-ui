/**
 * Showcase theme: dark (the value of `:root`) or light.
 *
 * `tokens.css` defines the dark `--p-*` on `:root` and redefines them under
 * `[data-theme="light"]`. This module decides ONLY when to put that
 * attribute on the root element: from the URL (`?theme=light`, for deep
 * links and screenshots) or from the stored preference (`plancia.theme`),
 * read before mount. It is the same scheme a consumer project uses
 * (Sidereus does it with the key `sidereus.theme`, in every entry point).
 */

export type Theme = 'dark' | 'light'

export const THEME_STORAGE_KEY = 'plancia.theme'
export const DEFAULT_THEME: Theme = 'dark'

/** Stored preference → theme; any unknown value → default. */
export function parseTheme(raw: string | null | undefined): Theme {
  return raw === 'light' || raw === 'dark' ? raw : DEFAULT_THEME
}

/** `?theme=light` in the URL wins over the stored preference, without replacing it. */
export function readRequestedTheme(): Theme | null {
  try {
    const raw = new URLSearchParams(location.search).get('theme')
    return raw === 'light' || raw === 'dark' ? raw : null
  } catch {
    return null
  }
}

export function readStoredTheme(): Theme {
  try {
    return parseTheme(localStorage.getItem(THEME_STORAGE_KEY))
  } catch {
    return DEFAULT_THEME
  }
}

/** The theme to show on load: URL first, then the stored preference. */
export function readInitialTheme(): Theme {
  return readRequestedTheme() ?? readStoredTheme()
}

/**
 * Puts (or removes) `data-theme` on the root element. The dark theme does
 * NOT leave the attribute: it is the value of `:root`.
 */
export function applyTheme(theme: Theme): void {
  if (typeof document === 'undefined') return
  if (theme === DEFAULT_THEME) delete document.documentElement.dataset.theme
  else document.documentElement.dataset.theme = theme
}

export function applyInitialTheme(): Theme {
  const theme = readInitialTheme()
  applyTheme(theme)
  return theme
}

export function rememberTheme(theme: Theme): void {
  try {
    if (theme === DEFAULT_THEME) localStorage.removeItem(THEME_STORAGE_KEY)
    else localStorage.setItem(THEME_STORAGE_KEY, theme)
  } catch { /* storage unavailable: the choice lasts for this session */ }
}
