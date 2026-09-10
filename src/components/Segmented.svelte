<script lang="ts" module>
  export interface SegmentedItem { id: string; label: string; title?: string }
</script>

<script lang="ts">
  /**
   * Controllo segmentato (le modalità del cockpit): un gruppo di bottoni
   * con `aria-pressed`, uno solo attivo. `value` è bindabile.
   */
  let {
    items,
    value = $bindable(),
    onchange,
    label,
  }: { items: SegmentedItem[]; value?: string; onchange?: (id: string) => void; label?: string } = $props()

  function pick(id: string): void {
    if (id === value) return
    value = id
    onchange?.(id)
  }
</script>

<div class="p-seg" role="group" aria-label={label}>
  {#each items as it (it.id)}
    <button type="button" class:on={it.id === value} aria-pressed={it.id === value} title={it.title} onclick={() => pick(it.id)}>{it.label}</button>
  {/each}
</div>

<style>
  .p-seg { display: flex; gap: 2px; padding: 3px; border-radius: var(--p-r2); background: var(--p-inset); border: 1px solid var(--p-border); }
  .p-seg button {
    flex: 1; padding: 6px 8px; border: none; border-radius: 6px; background: transparent;
    font-family: var(--p-font-ui); font-size: var(--p-t12); font-weight: 500; color: var(--p-text-dim); cursor: pointer;
    transition: background var(--p-motion-fast) var(--p-motion-ease), color var(--p-motion-fast) var(--p-motion-ease);
  }
  .p-seg button:hover { color: var(--p-text); }
  .p-seg button.on { background: var(--p-s3); color: var(--p-text-hi); box-shadow: 0 1px 0 rgba(0, 0, 0, 0.4); }
</style>
