<script lang="ts" module>
  // Ids that tie the input to its own text and hint
  let counter = 0
</script>
<script lang="ts">
  /**
   * One choice with its text beside it, inside the package only: the row
   * `Checkbox` and `RadioGroup` are made of. A native checkbox or radio in
   * its <label>, a drawn box over it, the text named as the input's label
   * and the hint as its description, so a screen reader does not read the
   * hint as part of the name. The whole row is the tap target: on touch it
   * is as tall as `--p-tap-h`, and a tap on the text toggles the input.
   */
  let {
    type,
    checked,
    indeterminate = false,
    name,
    value,
    label,
    hint,
    disabled = false,
    title,
    onchange,
  }: {
    type: 'checkbox' | 'radio'
    checked: boolean
    indeterminate?: boolean
    name?: string
    value?: string
    label: string
    hint?: string
    disabled?: boolean
    title?: string
    onchange: (checked: boolean) => void
  } = $props()

  const id = `p-choice-${++counter}`
  let input = $state<HTMLInputElement>()

  // A property of the element, with no attribute to write it with
  $effect(() => {
    if (input) input.indeterminate = indeterminate
  })
</script>

<label class="p-choice" {title}>
  <span class="control">
    <input bind:this={input} {type} {checked} {name} {value} {disabled}
           aria-labelledby="{id}-label" aria-describedby={hint ? `${id}-hint` : undefined}
           onchange={(event) => onchange(event.currentTarget.checked)} />
    <span class="box {type}" aria-hidden="true"></span>
  </span>
  <span class="text">
    <span id="{id}-label">{label}</span>
    {#if hint}<span class="hint" id="{id}-hint">{hint}</span>{/if}
  </span>
</label>

<style>
  .p-choice {
    display: flex; align-items: flex-start; gap: 8px;
    padding-block: max(0px, calc((var(--p-tap-h) - 1lh) / 2));
    font-size: var(--p-t12); line-height: 1.45; color: var(--p-text); cursor: pointer;
  }
  .p-choice:has(input:disabled) { opacity: 0.4; cursor: default; }
  /* The box is the toggle's height less its padding (14 px, 20 on touch),
     centered on the first line of the text */
  .control {
    position: relative; display: flex; flex: none;
    width: calc(var(--p-toggle-h) - 6px); height: calc(var(--p-toggle-h) - 6px);
    margin-top: calc((1lh - var(--p-toggle-h) + 6px) / 2);
  }
  .control input { position: absolute; inset: 0; width: 100%; height: 100%; margin: 0; opacity: 0; cursor: inherit; }
  /* The outline of an empty box reaches 3:1 on every surface (WCAG 1.4.11) */
  .box {
    position: relative; width: 100%; height: 100%;
    border: 1px solid var(--p-text-dim); border-radius: var(--p-r1); background: var(--p-inset);
    transition: background var(--p-motion-fast) var(--p-motion-ease), border-color var(--p-motion-fast) var(--p-motion-ease);
  }
  .box.radio { border-radius: 50%; }
  input:checked + .box, input:indeterminate + .box { background: var(--p-accent); border-color: var(--p-accent); }
  /* Marks drawn with borders, which forced colors keep (a background they drop) */
  input:checked + .box.checkbox::after {
    content: ''; position: absolute; left: 34%; top: 12%; width: 32%; height: 56%;
    border: solid var(--p-accent-ink); border-width: 0 2px 2px 0; transform: rotate(45deg);
  }
  input:indeterminate + .box.checkbox::after {
    content: ''; position: absolute; left: 22%; right: 22%; top: calc(50% - 1px);
    border-top: 2px solid var(--p-accent-ink);
  }
  /* A disc about half the box wide, filled by a border as thick as its
     radius; whole pixels, or a rounded-down border leaves a hole in it */
  input:checked + .box.radio::after {
    content: ''; position: absolute; inset: 0; margin: auto; border-radius: 50%;
    width: calc(2 * round(down, (var(--p-toggle-h) - 8px) / 4, 1px));
    height: calc(2 * round(down, (var(--p-toggle-h) - 8px) / 4, 1px));
    border: round(down, (var(--p-toggle-h) - 8px) / 4, 1px) solid var(--p-accent-ink);
  }
  input:focus-visible + .box { box-shadow: var(--p-focus); }
  .text { min-width: 0; }
  .hint { display: block; font-size: var(--p-t11); color: var(--p-text-dim); }
  /* Hover only for a pointer that hovers, and never over the focus ring */
  @media (hover: hover) {
    .p-choice:hover input:enabled:not(:focus-visible) + .box { box-shadow: 0 0 0 3px var(--p-hover); }
  }
</style>
