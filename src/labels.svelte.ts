/**
 * Default texts the components speak by themselves: the accessible name of
 * the close button of `PanelHead` and of the `Skeleton` region. English by
 * default; an app in another language sets them once, before mount, with
 * `setLabels()`, instead of passing `closeLabel` and `label` everywhere. A
 * prop passed to a component still wins over the default.
 *
 * Reactive state: a change at runtime (a language switch) reaches every
 * mounted component.
 */

export interface Labels {
  /** Accessible name and tooltip of the close button of `PanelHead` */
  close: string
  /** Accessible name of the `Skeleton` loading region */
  loading: string
}

const labels: Labels = $state({ close: 'Close', loading: 'Loading' })

export function setLabels(partial: Partial<Labels>): void {
  Object.assign(labels, partial)
}

/** The current defaults, read reactively by the components. */
export function getLabels(): Readonly<Labels> {
  return labels
}
