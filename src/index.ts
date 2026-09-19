/**
 * plancia-ui — the Svelte 5 components of the "plancia" theme.
 * Base styles and tokens are imported separately:
 *   import 'plancia-ui/tokens.css'; import 'plancia-ui/base.css'
 */
export { default as Button } from './components/Button.svelte'
export { default as Chip } from './components/Chip.svelte'
export { default as Toggle } from './components/Toggle.svelte'
export { default as KeyValue } from './components/KeyValue.svelte'
export { default as Stat } from './components/Stat.svelte'
export { default as PanelHead } from './components/PanelHead.svelte'
export { default as Skeleton } from './components/Skeleton.svelte'
export { default as Notice } from './components/Notice.svelte'
export { default as Legend } from './components/Legend.svelte'
export { default as Segmented } from './components/Segmented.svelte'
export { default as MetaRow } from './components/MetaRow.svelte'
export { default as ControlRow } from './components/ControlRow.svelte'
export { default as LegendDots } from './components/LegendDots.svelte'
export { default as SettingRow } from './components/SettingRow.svelte'
export { default as Section } from './components/Section.svelte'
export { default as Status } from './components/Status.svelte'
export { default as Age, formatAge } from './components/Age.svelte'
export { default as FloatingPanel } from './components/FloatingPanel.svelte'
export { default as Tooltip } from './components/Tooltip.svelte'
export { default as InfoButton } from './components/InfoButton.svelte'
export { default as InfoCard } from './components/InfoCard.svelte'
export { default as Kbd } from './components/Kbd.svelte'
export { default as LiveRegion } from './components/LiveRegion.svelte'
export { default as Sparkline } from './components/Sparkline.svelte'
export { default as Bars } from './components/Bars.svelte'

export type Tone = 'neutral' | 'accent' | 'ok' | 'warn' | 'orange' | 'danger' | 'info'
export type { ButtonVariant, ButtonSize } from './components/Button.svelte'
export type { NoticeKind } from './components/Notice.svelte'
export type { SegmentedItem } from './components/Segmented.svelte'
export type { LegendDot } from './components/LegendDots.svelte'
export type { StatusKind } from './components/Status.svelte'
export type { Bar } from './components/Bars.svelte'

export { setLabels, getLabels, labels, type Labels } from './labels.js'
export { announce, liveMessage } from './live.js'
export {
  applyTheme,
  applyStoredTheme,
  parseTheme,
  readRequestedTheme,
  readStoredTheme,
  rememberTheme,
  DEFAULT_THEME,
  type Theme,
} from './theme.js'

/** Semantic tone of the NOAA scale levels (R/S/G 0–5). */
export function scaleTone(level: number): Tone {
  if (level <= 0) return 'ok'
  if (level <= 2) return 'warn'
  if (level === 3) return 'orange'
  return 'danger'
}
