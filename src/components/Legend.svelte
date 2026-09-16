<script lang="ts">
  /**
   * Legend of a raster layer: gradient bar with minimum and maximum in
   * monospace and the note (transparency threshold, unit). `gradient` is a
   * CSS value (`linear-gradient(...)`) already oriented left to right.
   */
  let {
    gradient,
    min,
    max,
    unit = '',
    note,
  }: { gradient: string; min: string | number; max: string | number; unit?: string; note?: string } = $props()
</script>

<div class="p-legend">
  <div class="bar-row">
    <span class="lim">{min}</span>
    <div class="bar" style="background:{gradient}"></div>
    <span class="lim">{max} {unit}</span>
  </div>
  {#if note}<div class="note">{note}</div>{/if}
</div>

<style>
  .p-legend { display: flex; flex-direction: column; gap: 4px; }
  .bar-row { display: flex; align-items: center; gap: 8px; }
  .bar { flex: 1; height: 8px; border-radius: 4px; }
  .lim { font-family: var(--p-font-mono); font-size: var(--p-t11); color: var(--p-text-dim); white-space: nowrap; }
  .note { font-size: var(--p-t11); color: var(--p-text-dim); }
</style>
