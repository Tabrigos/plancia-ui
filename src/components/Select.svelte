<script lang="ts" module>
  export interface SelectItem { id: string; label: string; disabled?: boolean }
</script>
<script lang="ts">
  /**
   * A choice from a long list: a native <select> with the look of the
   * theme, so a phone opens its own picker and a typed letter jumps to the
   * item. Named by `label`, like `Toggle`: the row it sits in does not name
   * it. A short list with words is a `RadioGroup`, two to four words in a
   * row a `Segmented`. `value` is the `id` of the chosen item; while it is
   * none of them, the `placeholder` shows, and cannot be chosen back.
   */
  let {
    items,
    value = $bindable(),
    label,
    placeholder,
    size = 'md',
    disabled = false,
    title,
    onchange,
    class: consumerClass,
    ...rest
  }: {
    items: SelectItem[]
    value?: string
    /** Accessible name, usually the text of the row it sits in */
    label: string
    /** Shown while `value` is none of the items ("Choose a place") */
    placeholder?: string
    /** `sm`: the small control height, for a row */
    size?: 'md' | 'sm'
    disabled?: boolean
    title?: string
    onchange?: (id: string) => void
    /** A class of the consumer (a width), on the frame */
    class?: string
    /** The consumer's own attributes (`id`, `name`, `required`, `data-*`), on the select */
    [key: string]: unknown
  } = $props()

  const known = $derived(items.some((item) => item.id === value))
</script>

<span class="p-select {consumerClass ?? ''}" class:sm={size === 'sm'}>
  <select {...rest} aria-label={label} {disabled} {title} value={known ? value : ''}
          onchange={(event) => { value = event.currentTarget.value; onchange?.(value) }}>
    {#if placeholder && !known}<option value="" disabled>{placeholder}</option>{/if}
    {#each items as item (item.id)}<option value={item.id} disabled={item.disabled}>{item.label}</option>{/each}
  </select>
</span>

<style>
  .p-select { position: relative; display: inline-flex; min-width: 0; max-width: 100%; vertical-align: middle; }
  .p-select:has(select:disabled) { opacity: 0.4; }
  /* The text is 16 px on touch (--p-input-size), at every size: iOS zooms into a smaller one */
  select {
    appearance: none; width: 100%; min-width: 0; height: var(--p-control-h); margin: 0; padding: 0 28px 0 10px;
    border: 1px solid var(--p-border-strong); border-radius: var(--p-r2); background: var(--p-inset);
    font-family: var(--p-font-ui); font-size: var(--p-input-size); color: var(--p-text-hi);
    text-overflow: ellipsis; cursor: pointer;
    transition: border-color var(--p-motion-fast) var(--p-motion-ease);
  }
  .sm select { height: var(--p-control-h-sm); padding-left: 8px; border-radius: var(--p-r1); }
  select:disabled { cursor: default; }
  /* The arrow is drawn over the select, and lets the tap through to it */
  .p-select::after {
    content: ''; position: absolute; top: 50%; right: 12px; width: 6px; height: 6px; margin-top: -5px;
    border: solid var(--p-text-dim); border-width: 0 1.5px 1.5px 0; transform: rotate(45deg); pointer-events: none;
  }
  /* Hover only for a pointer that hovers: on touch a tap would leave it stuck */
  @media (hover: hover) {
    .p-select:hover select:enabled { border-color: var(--p-text-dim); }
  }
</style>
