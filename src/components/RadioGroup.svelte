<script lang="ts" module>
  export interface RadioItem { id: string; label: string; hint?: string; disabled?: boolean }
  // One name per group, so the browser keeps one radio checked and moves it with the arrows
  let counter = 0
</script>
<script lang="ts">
  import Choice from './Choice.svelte'
  import Fieldset from './Fieldset.svelte'

  /**
   * One choice among a few, each with its text: native radios sharing a
   * name inside a `Fieldset` with `role="radiogroup"`, so Tab enters on the
   * checked one, the arrow keys move the choice and a screen reader reads
   * the legend and the position. For options that need words or a hint;
   * two to four short words in a row are a `Segmented`, a long list is a
   * `Select`. `value` is the `id` of the checked item, bindable.
   */
  let {
    legend,
    items,
    value = $bindable(),
    hint,
    legendHidden = false,
    inline = false,
    disabled = false,
    name,
    onchange,
  }: {
    /** The question the choice answers: always there, for a screen reader */
    legend: string
    items: RadioItem[]
    value?: string
    /** A line under the legend, dim, read as the group's description */
    hint?: string
    /** The legend is read but not shown, when a heading or a row beside the group already says it */
    legendHidden?: boolean
    /** The options in a wrapping row instead of a column */
    inline?: boolean
    disabled?: boolean
    /** Name submitted with a native form; generated when absent */
    name?: string
    onchange?: (id: string) => void
  } = $props()

  const fallbackName = `p-radio-${++counter}`

  function pick(id: string): void {
    value = id
    onchange?.(id)
  }
</script>

<Fieldset role="radiogroup" {legend} {hint} {legendHidden} {inline} {disabled}>
  {#each items as item (item.id)}
    <Choice type="radio" name={name ?? fallbackName} value={item.id} checked={item.id === value}
            label={item.label} hint={item.hint} disabled={item.disabled} onchange={() => pick(item.id)} />
  {/each}
</Fieldset>
