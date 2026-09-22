<script lang="ts">
  import type { HTMLAttributes } from 'svelte/elements'
  import { liveMessage } from '../live.js'

  /**
   * The polite live region `announce()` writes into: mount it once, near the
   * root. Visually hidden (`p-sr-only`), read by screen readers when its
   * text changes. Attributes go to the region, so an app or its tests can
   * find it by `id`; role, politeness and class stay the package's.
   */
  let { ...rest }: Omit<HTMLAttributes<HTMLDivElement>, 'children'> = $props()
</script>

<div {...rest} class="p-sr-only" role="status" aria-live="polite" aria-atomic="true">{$liveMessage}</div>
