<script lang="ts">
  import type { Snippet } from 'svelte'
  import type { Tone } from '../index'

  /**
   * Label / value row: the 12 px label on the left NEVER wraps; the
   * monospace value on the right stays on one line; extra information
   * (`sub`) goes on a secondary second line, never by splitting the
   * value. `tone` colors the value (e.g. ok/danger).
   *
   * When the two do not fit on one line (a long value such as "outside
   * the model (100–1000 km)") the value drops to its own line, whole and
   * right-aligned: it never overlaps the label.
   */
  let {
    label,
    sub,
    subTone,
    tone,
    title,
    id,
    children,
  }: {
    label: string
    sub?: string
    /** Tone of the secondary line (e.g. warn when above the median) */
    subTone?: Tone
    tone?: Tone
    id?: string
    /** Native tooltip (explanation of the datum) */
    title?: string
    children?: Snippet
  } = $props()
</script>

<div class="p-kv" {title} {id}>
  <span class="k">{label}</span>
  <span class="v {tone ?? ''}">
    <span class="main">{@render children?.()}</span>
    {#if sub}<span class="sub {subTone ?? ''}">{sub}</span>{/if}
  </span>
</div>

<style>
  .p-kv { display: flex; flex-wrap: wrap; align-items: baseline; justify-content: space-between; gap: 2px 12px; padding: 6px 0; }
  :global(.p-kv + .p-kv) { border-top: 1px solid var(--p-border); }
  .k { flex: 0 1 auto; min-width: 0; font-size: var(--p-t12); color: var(--p-text-dim); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .v { display: flex; flex-direction: column; align-items: flex-end; margin-left: auto; max-width: 100%; min-width: 0; font-family: var(--p-font-mono); font-size: var(--p-t12); color: var(--p-text-hi); text-align: right; }
  .main { max-width: 100%; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .sub { max-width: 100%; font-family: var(--p-font-ui); font-size: var(--p-t11); font-weight: 400; color: var(--p-text-dim); }
  /* Every Tone, for the value and for the secondary line alike */
  .v.ok, .sub.ok { color: var(--p-ok); }
  .v.warn, .sub.warn { color: var(--p-warn); }
  .v.orange, .sub.orange { color: var(--p-orange); }
  .v.danger, .sub.danger { color: var(--p-danger); }
  .v.accent, .sub.accent { color: var(--p-accent); }
  .v.info, .sub.info { color: var(--p-info); }
  .v.neutral, .sub.neutral { color: var(--p-text-dim); }
</style>
