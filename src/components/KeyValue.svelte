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
  <span class="v" class:ok={tone === 'ok'} class:warn={tone === 'warn'} class:danger={tone === 'danger'} class:accent={tone === 'accent'} class:info={tone === 'info'}>
    <span class="main">{@render children?.()}</span>
    {#if sub}<span class="sub" class:s-ok={subTone === 'ok'} class:s-warn={subTone === 'warn'} class:s-danger={subTone === 'danger'} class:s-info={subTone === 'info'}>{sub}</span>{/if}
  </span>
</div>

<style>
  .p-kv { display: flex; flex-wrap: wrap; align-items: baseline; justify-content: space-between; gap: 2px 12px; padding: 6px 0; }
  :global(.p-kv + .p-kv) { border-top: 1px solid var(--p-border); }
  .k { flex: 0 1 auto; min-width: 0; font-size: var(--p-t12); color: var(--p-text-dim); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .v { display: flex; flex-direction: column; align-items: flex-end; margin-left: auto; max-width: 100%; min-width: 0; font-family: var(--p-font-mono); font-size: var(--p-t12); color: var(--p-text-hi); text-align: right; }
  .main { max-width: 100%; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .sub { max-width: 100%; font-family: var(--p-font-ui); font-size: var(--p-t11); font-weight: 400; color: var(--p-text-dim); }
  .v.ok { color: var(--p-ok); } .v.warn { color: var(--p-warn); } .v.danger { color: var(--p-danger); }
  .v.accent { color: var(--p-accent); } .v.info { color: var(--p-info); }
  .sub.s-ok { color: var(--p-ok); } .sub.s-warn { color: var(--p-warn); } .sub.s-danger { color: var(--p-danger); } .sub.s-info { color: var(--p-info); }
</style>
