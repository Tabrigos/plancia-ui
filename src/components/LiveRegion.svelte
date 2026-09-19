<script lang="ts">
  import { liveMessage } from '../live.js'

  /**
   * The polite live region `announce()` writes into: mount it once, near the
   * root. Visually hidden (`p-sr-only`), read by screen readers when its
   * text changes.
   */
</script>

<div class="p-sr-only" role="status" aria-live="polite" aria-atomic="true">{$liveMessage}</div>
