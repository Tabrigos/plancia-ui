/**
 * The keys of a list of tabs, shared by `Tabs` (a row) and `Rail` (a
 * column): the two arrows along the list move and choose at once, and wrap;
 * Home and End go to the ends; a disabled tab is skipped. Internal: not in
 * the package's `exports`.
 */
export interface Tab { id: string; disabled?: boolean }

/** The tab a key leads to from the chosen one; none when the key is not the list's or every tab is disabled */
export function tabAfterKey<T extends Tab>(items: T[], chosenId: string | undefined, key: string, vertical = false): T | undefined {
  const enabled = items.filter((item) => !item.disabled)
  const at = enabled.findIndex((item) => item.id === chosenId)
  const [back, forward] = vertical ? ['ArrowUp', 'ArrowDown'] : ['ArrowLeft', 'ArrowRight']
  const to = ({ [back]: at - 1, [forward]: at + 1, Home: 0, End: enabled.length - 1 } as Record<string, number>)[key]
  if (to === undefined || !enabled.length) return undefined
  return enabled[(to + enabled.length) % enabled.length]
}
