<script lang="ts">
  /**
   * Accessible switch: a real <input type="checkbox"> with the look of the
   * system (34×20, sliding knob), visible focus, disabled state.
   * `checked` is bindable; `onchange` receives the new value.
   */
  let {
    checked = $bindable(false),
    disabled = false,
    label,
    title,
    onchange,
  }: {
    checked?: boolean
    disabled?: boolean
    /** Accessible label (the visible text usually sits in the row next to it) */
    label?: string
    /** Native tooltip */
    title?: string
    onchange?: (checked: boolean) => void
  } = $props()
</script>

<label class="p-toggle" class:disabled {title}>
  <input type="checkbox" bind:checked {disabled} aria-label={label}
         onchange={() => onchange?.(checked)} />
  <span class="track" aria-hidden="true"></span>
</label>

<style>
  .p-toggle { position: relative; display: inline-block; width: var(--p-toggle-w); height: var(--p-toggle-h); flex: none; cursor: pointer; }
  .p-toggle.disabled { opacity: 0.4; cursor: default; }
  .p-toggle input { position: absolute; inset: 0; margin: 0; opacity: 0; cursor: inherit; }
  .track {
    position: absolute; inset: 0; border-radius: var(--p-r-pill);
    background: var(--p-border-strong); border: 1px solid transparent;
    transition: background var(--p-motion-fast) var(--p-motion-ease);
  }
  .track::before {
    content: ''; position: absolute; top: 3px; left: 3px; width: calc(var(--p-toggle-h) - 8px); height: calc(var(--p-toggle-h) - 8px); border-radius: 50%;
    background: var(--p-text);
    transition: transform var(--p-motion-fast) var(--p-motion-ease), background var(--p-motion-fast) var(--p-motion-ease);
  }
  input:checked + .track { background: var(--p-accent); }
  input:checked + .track::before { transform: translateX(calc(var(--p-toggle-w) - var(--p-toggle-h))); background: var(--p-accent-ink); }
  input:focus-visible + .track { box-shadow: var(--p-focus); }
  /* Hover only for a pointer that hovers: on touch a tap would leave it stuck */
  @media (hover: hover) {
    .p-toggle:hover .track { box-shadow: 0 0 0 3px var(--p-hover); }
  }
</style>
