/**
 * Tema della vetrina: scuro (il valore di `:root`) o chiaro.
 *
 * `tokens.css` definisce i `--p-*` scuri su `:root` e li ridefinisce sotto
 * `[data-theme="light"]`. Qui si decide SOLO quando mettere quell'attributo
 * sull'elemento radice: dalla preferenza salvata (`plancia.theme`), letta
 * prima del mount. È lo stesso schema che usa un progetto consumatore
 * (Sidereus lo fa con la chiave `sidereus.theme`, in ogni entry).
 */

export type Theme = 'dark' | 'light'

export const THEME_STORAGE_KEY = 'plancia.theme'
export const DEFAULT_THEME: Theme = 'dark'

/** Preferenza salvata → tema; qualunque valore ignoto → predefinito. */
export function parseTheme(raw: string | null | undefined): Theme {
  return raw === 'light' || raw === 'dark' ? raw : DEFAULT_THEME
}

export function readStoredTheme(): Theme {
  try {
    return parseTheme(localStorage.getItem(THEME_STORAGE_KEY))
  } catch {
    return DEFAULT_THEME
  }
}

/**
 * Mette (o toglie) `data-theme` sull'elemento radice. Il tema scuro NON
 * lascia l'attributo: è il valore di `:root`.
 */
export function applyTheme(theme: Theme): void {
  if (typeof document === 'undefined') return
  if (theme === DEFAULT_THEME) delete document.documentElement.dataset.theme
  else document.documentElement.dataset.theme = theme
}

export function applyStoredTheme(): Theme {
  const theme = readStoredTheme()
  applyTheme(theme)
  return theme
}

export function rememberTheme(theme: Theme): void {
  try {
    if (theme === DEFAULT_THEME) localStorage.removeItem(THEME_STORAGE_KEY)
    else localStorage.setItem(THEME_STORAGE_KEY, theme)
  } catch { /* storage non disponibile: vale per questa sessione */ }
}
