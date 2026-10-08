<script lang="ts">
  // Recipe: the playback of an animation over days (a model run, the Sun
  // over a week): play/pause and "now" are Buttons around a Slider. The
  // frame, the timer and the present are the app's; the slider says the
  // frame as a time, and grabbing it stops the playback, so the hand and
  // the timer never pull the thumb two ways.
  import { Button, Slider } from 'plancia-ui'

  // A frame every 3 hours over seven days; the present is the frame of the fourth day
  const HOURS = 3
  const LAST = (7 * 24) / HOURS
  const FIRST = Date.UTC(2026, 9, 5)
  const NOW = 24
  const timeOf = (index: number) =>
    new Date(FIRST + index * HOURS * 3_600_000).toLocaleString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit', timeZone: 'UTC' })
  // The mark is drawn only: the words read for the frame say when it is the present
  const words = (index: number) => `${timeOf(index)} UTC${index === NOW ? ', now' : ''}`

  let frame = $state(NOW)
  let playing = $state(false)

  // A frame every 400 ms while playing, and from the first again after the last
  $effect(() => {
    if (!playing) return
    const timer = setInterval(() => { frame = frame === LAST ? 0 : frame + 1 }, 400)
    return () => clearInterval(timer)
  })
</script>

<div class="playback">
  <div class="p-t12 p-dim">Solar wind model · <span class="p-mono p-hi">{words(frame)}</span></div>
  <div class="transport">
    <Button variant="icon" size="sm" title={playing ? 'Pause' : 'Play'} aria-label={playing ? 'Pause' : 'Play'} onclick={() => { playing = !playing }}>
      {#if playing}
        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" aria-hidden="true"><path d="M8 5v14M16 5v14" /></svg>
      {:else}
        <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" aria-hidden="true"><path d="M7 4.5v15l12.5-7.5z" /></svg>
      {/if}
    </Button>
    <Slider label="Frame of the model" max={LAST} bind:value={frame} valueText={words(frame)} marks={[{ value: NOW, label: 'now' }]}
            oninput={() => { playing = false }} />
    <Button size="sm" title="Back to the frame of the present" onclick={() => { frame = NOW }}>now</Button>
  </div>
</div>

<style>
  .playback { display: flex; flex-direction: column; gap: 8px; }
  /* The buttons line up with the range, and the marks hang under it alone */
  .transport { display: flex; align-items: flex-start; gap: 8px; }
</style>
