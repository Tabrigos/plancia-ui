<script lang="ts">
  import Choice from './Choice.svelte'

  /**
   * A checkbox with its text beside it: a native <input type="checkbox">
   * named by its visible `label`, with a hint under it read as its
   * description. For an option the user sets in a form or a list of
   * filters; a setting that acts at once, in a row that names it, is a
   * `Toggle`. The checkboxes of one question go in a `Fieldset`.
   */
  let {
    checked = $bindable(false),
    indeterminate = $bindable(false),
    label,
    hint,
    disabled = false,
    name,
    value,
    title,
    onchange,
  }: {
    checked?: boolean
    /** Bindable: neither on nor off (a "select all" over a partial selection); a tap clears it */
    indeterminate?: boolean
    /** The visible text beside the box, and its accessible name */
    label: string
    /** A second line under the text, dim, read as the description */
    hint?: string
    disabled?: boolean
    /** Name and value submitted with a native form */
    name?: string
    value?: string
    title?: string
    onchange?: (checked: boolean) => void
  } = $props()
</script>

<Choice type="checkbox" {checked} {indeterminate} {label} {hint} {disabled} {name} {value} {title}
        onchange={(on) => { checked = on; indeterminate = false; onchange?.(on) }} />
