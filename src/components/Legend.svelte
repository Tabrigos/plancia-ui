<script lang="ts">
  /**
   * Legenda di un layer raster: barra del gradiente con minimo e massimo in
   * monospazio e la nota (soglia di trasparenza, unità). `gradient` è un
   * valore CSS (`linear-gradient(...)`) già orientato da sinistra a destra.
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
