<script lang="ts">
  // Recipe: a panel over a stage, whole. The head with its chips and the
  // (i), the values, a warning that says what the data is worth, metadata
  // and a small action at the bottom. The stage is the app's container; on
  // a phone the package turns the panel into a sheet from the bottom.
  import { Button, Chip, FloatingPanel, InfoButton, InfoCard, KeyValue, MetaRow, Notice, scaleTone } from 'plancia-ui'

  let open = $state(true)
  let info = $state(false)
</script>

<div class="stage">
  {#if open}
    <FloatingPanel title="ISS (ZARYA)" subtitle="NORAD 25544" class="station-panel" opener="reopen-station" onclose={() => { open = false }}>
      {#snippet chips()}<Chip tone="accent">stations</Chip><Chip tone={scaleTone(2)}>G2</Chip>{/snippet}
      {#snippet actions()}<InfoButton active={info} controls="station-info" onclick={() => { info = !info }} />{/snippet}
      {#if info}
        <InfoCard id="station-info" label="About the orbit" onclose={() => { info = false }}>
          <p>Propagated from the latest element set with SGP4: a few kilometres of error after a day.</p>
        </InfoCard>
      {/if}
      <KeyValue label="Altitude">420.6 km</KeyValue>
      <KeyValue label="Speed">7.66 km/s</KeyValue>
      <KeyValue label="Air at 420 km" sub="−34 % vs. global median" subTone="ok">0.21 ng/m³</KeyValue>
      <Notice kind="warn" title="Element set 3 days old" text="The position drifts by a few kilometres" compact />
      <MetaRow><span>elements from Sep 20</span><Button variant="secondary" size="sm">follow</Button></MetaRow>
    </FloatingPanel>
  {:else}
    <Button id="reopen-station" variant="secondary" size="sm" onclick={() => { open = true }}>open the panel</Button>
  {/if}
</div>

<style>
  .stage { position: relative; min-height: 400px; padding: 16px; border-radius: var(--p-r2); background: radial-gradient(circle at 30% 40%, var(--p-s3) 0, var(--p-bg) 70%); }
  /* A class, not an id: under 700 px the package's sheet rule must win */
  :global(.station-panel) { position: absolute; top: 16px; right: 16px; width: min(320px, calc(100% - 32px)); }
</style>
