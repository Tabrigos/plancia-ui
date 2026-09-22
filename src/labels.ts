/**
 * Default texts the components speak by themselves: the accessible name of
 * the close button of `PanelHead`, of the `Skeleton` region, of the (i) of
 * `InfoButton`; and the locale of what they format with `Intl`. English by
 * default; an app in another language sets them once, before mount, with
 * `setLabels()`, instead of passing `closeLabel`, `label` and `locale`
 * everywhere. A prop passed to a component still wins.
 *
 * A store rather than a rune, on purpose: this module ships as plain
 * JavaScript (`plancia-ui/labels`) and loads in Node without the Svelte
 * compiler; the components subscribe, so a change at runtime (a language
 * switch) reaches every mounted one.
 */
import { get, writable } from 'svelte/store'

export interface Labels {
  /** Accessible name and tooltip of the close button of `PanelHead` */
  close: string
  /** Accessible name of the `Skeleton` loading region */
  loading: string
  /** Accessible name of `InfoButton`, the (i) that opens an explanation */
  info: string
  /** BCP 47 locale of what `Age` formats; the page's `lang`, then the browser's, when absent */
  locale?: string
}

/** The current defaults, as a readable store the components subscribe to. */
export const labels = writable<Labels>({ close: 'Close', loading: 'Loading', info: 'What is this' })

export function setLabels(partial: Partial<Labels>): void {
  labels.update((current) => ({ ...current, ...partial }))
}

/** A snapshot of the current defaults. */
export function getLabels(): Labels {
  return get(labels)
}
