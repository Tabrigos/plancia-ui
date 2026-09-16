<script lang="ts" module>
  export interface LegendDot {
    color: string
    label: string
    /** Opacity of the dot (contours, faint elements) */
    opacity?: number
    title?: string
  }
</script>

<script lang="ts">
  /**
   * Dot legend: what the colors drawn elsewhere mean (on the globe, on a
   * canvas). Wraps by itself when the items do not fit on one line.
   */
  let { items, label }: { items: LegendDot[]; label?: string } = $props()
</script>

<div class="p-legend-dots" role="list" aria-label={label}>
  {#each items as it (it.label)}
    <span role="listitem" title={it.title}>
      <i style="background:{it.color}{it.opacity != null ? `;opacity:${it.opacity}` : ''}"></i>{it.label}
    </span>
  {/each}
</div>

<style>
  .p-legend-dots {
    display: flex; flex-wrap: wrap; gap: 3px 10px;
    margin-top: 6px;
    font-size: var(--p-t11); color: var(--p-text-dim);
  }
  .p-legend-dots span { display: inline-flex; align-items: center; gap: 5px; }
  i { width: 7px; height: 7px; border-radius: 50%; flex: none; }
</style>
