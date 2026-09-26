<script lang="ts" module>
  // Ids that tie the group to its hint
  let counter = 0
</script>
<script lang="ts">
  import type { Snippet } from 'svelte'

  /**
   * Controls that answer one question, under one name: a native
   * <fieldset> whose <legend> a screen reader reads on entering the group,
   * and a hint under it read as the group's description. For a set of
   * `Checkbox`; `RadioGroup` is one already. The controls stack in a
   * column, or sit in a wrapping row with `inline`.
   */
  let {
    legend,
    hint,
    legendHidden = false,
    inline = false,
    disabled = false,
    children,
    class: consumerClass,
    ...rest
  }: {
    /** The question the controls answer: always there, for a screen reader */
    legend: string
    /** A line under the legend, dim, read as the group's description */
    hint?: string
    /** The legend is read but not shown, when a heading or a row beside the group already says it */
    legendHidden?: boolean
    /** The controls in a wrapping row instead of a column */
    inline?: boolean
    /** Disables every control inside, natively */
    disabled?: boolean
    children: Snippet
    /** A class of the consumer, added next to the component's own */
    class?: string
    /** The consumer's own attributes (`id`, `role`, `data-*`), on the fieldset */
    [key: string]: unknown
  } = $props()

  const hintId = `p-fieldset-hint-${++counter}`
</script>

<fieldset {...rest} class="p-fieldset {consumerClass ?? ''}" {disabled} aria-describedby={hint ? hintId : undefined}>
  <legend class:p-sr-only={legendHidden}>{legend}</legend>
  {#if hint}<p class="hint" id={hintId}>{hint}</p>{/if}
  <div class="p-fieldset-body" class:inline>{@render children()}</div>
</fieldset>

<style>
  .p-fieldset { min-width: 0; margin: 0; padding: 0; border: 0; }
  legend { padding: 0; margin-bottom: 4px; font-size: var(--p-t12); font-weight: 500; color: var(--p-text-hi); }
  .hint { margin: -2px 0 6px; font-size: var(--p-t11); color: var(--p-text-dim); }
  .p-fieldset-body { display: flex; flex-direction: column; gap: 4px; }
  .p-fieldset-body.inline { flex-direction: row; flex-wrap: wrap; column-gap: 16px; }
</style>
