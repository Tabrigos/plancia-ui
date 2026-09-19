<script lang="ts">
  import { labels } from '../labels.js'

  /**
   * The (i) button that opens and closes the explanation of a datum, next to
   * a value or in a head: 20 px, quiet, accent when active. A disclosure:
   * `aria-expanded` follows `active`, `controls` names the card it opens.
   * The text of the explanation belongs to the app (`InfoCard` is the frame).
   */
  let {
    active = false,
    onclick,
    label,
    controls,
  }: {
    active?: boolean
    onclick?: () => void
    /** Accessible name and tooltip; the default comes from `setLabels()` */
    label?: string
    /** Id of the `InfoCard` this button opens (`aria-controls`) */
    controls?: string
  } = $props()
</script>

<button type="button" class="p-info-btn" class:active aria-expanded={active} aria-controls={controls} aria-label={label ?? $labels.info} title={label ?? $labels.info} {onclick}>
  <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true">
    <circle cx="12" cy="12" r="9"/><line x1="12" y1="11" x2="12" y2="16.5"/><circle cx="12" cy="7.8" r="0.6" fill="currentColor"/>
  </svg>
</button>

<style>
  .p-info-btn {
    display: inline-flex; align-items: center; justify-content: center; flex: none;
    width: 20px; height: 20px; padding: 0;
    border: 1px solid transparent; border-radius: 6px; background: none;
    color: var(--p-text-dim); cursor: pointer;
    transition: color var(--p-motion-fast) var(--p-motion-ease), background var(--p-motion-fast) var(--p-motion-ease);
  }
  .p-info-btn:hover { color: var(--p-accent); background: var(--p-accent-soft); }
  .p-info-btn.active { color: var(--p-accent); border-color: var(--p-accent-soft); background: var(--p-accent-soft); }
</style>
