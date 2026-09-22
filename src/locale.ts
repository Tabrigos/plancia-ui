/**
 * The language of what the package formats with `Intl` (ages, times): the
 * component's own prop, then the `locale` set with `setLabels()`, then the
 * `lang` of the page, then the browser's. A page written in one language
 * should not get another one from the browser (#32). Internal: not in the
 * package's `exports`.
 */
export function resolveLocale(prop: string | undefined, fromLabels: string | undefined): string | undefined {
  if (prop) return prop
  if (fromLabels) return fromLabels
  if (typeof document === 'undefined') return undefined
  return document.documentElement.lang || undefined
}
