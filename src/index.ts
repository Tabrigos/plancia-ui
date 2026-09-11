/**
 * plancia-ui — componenti Svelte 5 del tema "plancia".
 * Gli stili di base e i token si importano a parte:
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

export type Tone = 'neutral' | 'accent' | 'ok' | 'warn' | 'orange' | 'danger' | 'info'
export type { ButtonVariant, ButtonSize } from './components/Button.svelte'
export type { NoticeKind } from './components/Notice.svelte'
export type { SegmentedItem } from './components/Segmented.svelte'
export type { LegendDot } from './components/LegendDots.svelte'

/** Tono semantico dei livelli delle scale NOAA (R/S/G 0–5). */
export function scaleTone(level: number): Tone {
  if (level <= 0) return 'ok'
  if (level <= 2) return 'warn'
  if (level === 3) return 'orange'
  return 'danger'
}
