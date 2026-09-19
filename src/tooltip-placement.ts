/**
 * Where a tooltip goes: centered under its anchor, inside the viewport with
 * an 8 px margin; above when there is no room below; when both sides fit,
 * on the side that covers less of the obstacles (floating panels), below
 * on a tie. Pure, so it is tested without a layout engine.
 */

export interface Box { left: number; top: number; width: number; height: number }

export interface Placement { x: number; y: number; above: boolean }

const MARGIN = 8

function overlap(a: Box, b: Box): number {
  const w = Math.min(a.left + a.width, b.left + b.width) - Math.max(a.left, b.left)
  const h = Math.min(a.top + a.height, b.top + b.height) - Math.max(a.top, b.top)
  return w > 0 && h > 0 ? w * h : 0
}

export function placeTooltip(
  anchor: Box,
  tip: { width: number; height: number },
  viewport: { width: number; height: number },
  gap: number,
  obstacles: Box[] = [],
): Placement {
  const width = Math.min(tip.width, viewport.width - 2 * MARGIN)
  let x = anchor.left + anchor.width / 2 - width / 2
  x = Math.max(MARGIN, Math.min(x, viewport.width - width - MARGIN))

  const belowY = anchor.top + anchor.height + gap
  const aboveY = Math.max(MARGIN, anchor.top - gap - tip.height)
  const fitsBelow = belowY + tip.height <= viewport.height - MARGIN
  const fitsAbove = anchor.top - gap - tip.height >= MARGIN

  let below = fitsBelow || !fitsAbove
  if (fitsBelow && fitsAbove && obstacles.length) {
    const covered = (top: number): number =>
      obstacles.reduce((area, o) => area + overlap({ left: x, top, width, height: tip.height }, o), 0)
    below = covered(belowY) <= covered(aboveY)
  }
  return { x, y: below ? belowY : aboveY, above: !below }
}
