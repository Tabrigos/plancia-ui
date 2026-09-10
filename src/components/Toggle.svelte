<script lang="ts">
  /**
   * Interruttore accessibile: un vero <input type="checkbox"> con l'aspetto
   * del sistema (34×20, pomello che scorre), focus visibile, stato
   * disabilitato. `checked` è bindabile; `onchange` riceve il nuovo valore.
   */
  let {
    checked = $bindable(false),
    disabled = false,
    label,
    onchange,
  }: {
    checked?: boolean
    disabled?: boolean
    /** Etichetta accessibile (il testo visibile sta di solito nella riga accanto) */
    label?: string
    onchange?: (checked: boolean) => void
  } = $props()
</script>

<label class="p-toggle" class:disabled>
  <input type="checkbox" bind:checked {disabled} aria-label={label}
         onchange={() => onchange?.(checked)} />
  <span class="track" aria-hidden="true"></span>
</label>

<style>
  .p-toggle { position: relative; display: inline-block; width: 34px; height: 20px; flex: none; cursor: pointer; }
  .p-toggle.disabled { opacity: 0.4; cursor: default; }
  .p-toggle input { position: absolute; inset: 0; margin: 0; opacity: 0; cursor: inherit; }
  .track {
    position: absolute; inset: 0; border-radius: var(--p-r-pill);
    background: var(--p-border-strong); border: 1px solid transparent;
    transition: background var(--p-motion-fast) var(--p-motion-ease);
  }
  .track::before {
    content: ''; position: absolute; top: 3px; left: 3px; width: 12px; height: 12px; border-radius: 50%;
    background: var(--p-text);
    transition: transform var(--p-motion-fast) var(--p-motion-ease), background var(--p-motion-fast) var(--p-motion-ease);
  }
  .p-toggle:hover .track { box-shadow: 0 0 0 3px var(--p-hover); }
  input:checked + .track { background: var(--p-accent); }
  input:checked + .track::before { transform: translateX(14px); background: var(--p-accent-ink); }
  input:focus-visible + .track { box-shadow: var(--p-focus); }
</style>
