<script lang="ts">
  import { labels } from '../labels.js'

  /** Loading skeleton: breathing lines in place of a "Loading…" text. `label` is the accessible name; the default comes from `setLabels()`. */
  let { lines = 3, label, compact = false }: { lines?: number; label?: string; compact?: boolean } = $props()
  const widths = ['86%', '62%', '74%', '48%', '68%']
</script>

<div class="p-skel" class:compact role="status" aria-label={label ?? $labels.loading}>
  {#each Array.from({ length: lines }) as _, i (i)}
    <span class="line" style="width:{widths[i % widths.length]}"></span>
  {/each}
</div>

<style>
  .p-skel { display: grid; gap: 8px; padding: 12px 16px 10px; }
  .p-skel.compact { padding: 4px 0; }
  .line {
    height: 12px; border-radius: 6px;
    background: linear-gradient(90deg, var(--p-s2) 0%, var(--p-s3) 50%, var(--p-s2) 100%);
    background-size: 200% 100%;
    animation: p-shimmer 1.4s var(--p-motion-ease) infinite;
  }
  @keyframes p-shimmer { from { background-position: 200% 0; } to { background-position: -200% 0; } }
</style>
