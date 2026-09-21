<script lang="ts" module>
  export type ButtonVariant = 'primary' | 'secondary' | 'quiet' | 'icon'
  export type ButtonSize = 'md' | 'sm'
</script>

<script lang="ts">
  import type { Snippet } from 'svelte'
  import type { HTMLButtonAttributes } from 'svelte/elements'

  /**
   * Button in four variants (primary, secondary, quiet, icon) and two
   * sizes. One primary per panel. Accepts every native attribute
   * (onclick, title, aria-*, type, disabled).
   */
  let {
    variant = 'secondary',
    size = 'md',
    active = false,
    children,
    ...rest
  }: HTMLButtonAttributes & {
    variant?: ButtonVariant
    size?: ButtonSize
    /** "Pressed" state for the buttons that toggle a view */
    active?: boolean
    children?: Snippet
  } = $props()
</script>

<button type="button" class="p-btn {variant} {size}" class:active aria-pressed={active ? true : undefined} {...rest}>
  {@render children?.()}
</button>

<style>
  .p-btn {
    display: inline-flex; align-items: center; justify-content: center; gap: 8px;
    height: var(--p-control-h); padding: 0 14px;
    border-radius: var(--p-r2); border: 1px solid transparent;
    font-family: var(--p-font-ui); font-size: var(--p-t13); font-weight: 600; line-height: 1;
    color: var(--p-text); background: transparent; cursor: pointer; white-space: nowrap;
    transition: background var(--p-motion-fast) var(--p-motion-ease), color var(--p-motion-fast) var(--p-motion-ease), border-color var(--p-motion-fast) var(--p-motion-ease);
  }
  .p-btn.sm { height: var(--p-control-h-sm); padding: 0 10px; font-size: var(--p-t12); }
  .p-btn.primary { background: var(--p-accent); color: var(--p-accent-ink); }
  .p-btn.primary:hover { filter: brightness(1.08); }
  .p-btn.secondary { background: var(--p-s2); border-color: var(--p-border-strong); color: var(--p-text-hi); }
  .p-btn.secondary:hover { background: var(--p-s3); }
  .p-btn.quiet { font-weight: 500; }
  .p-btn.quiet:hover { background: var(--p-hover); color: var(--p-text-hi); }
  .p-btn.icon { width: var(--p-control-h); padding: 0; border-color: var(--p-border); }
  .p-btn.icon.sm { width: var(--p-control-h-sm); }
  .p-btn.icon:hover { background: var(--p-hover); color: var(--p-text-hi); }
  .p-btn.active { border-color: var(--p-accent); color: var(--p-accent); background: var(--p-accent-soft); }
  .p-btn:disabled { opacity: 0.4; cursor: default; filter: none; }
</style>
