<script lang="ts">
  // Recipe: a section of a console. Closed, it still reads (the summary,
  // explained by its title); open, the rows carry the values, the chart
  // carries the shape and its numbers stay in text, the meta row says how
  // old the data is. The (i) opens the explanation in place.
  import { Age, InfoButton, InfoCard, KeyValue, MetaRow, Section, Sparkline } from 'plancia-ui'

  const speeds = [380, 392, 410, 405, 430, 455, 448, 470, 462, 440, 452, 461]
  const updatedAt = Date.now() - 4 * 60_000
  let open = $state(true)
  let info = $state(false)
  let width = $state(0)
</script>

<Section title="Solar wind" summary="461 km/s · Bz −3 nT" summaryTitle="Speed and Bz now at L1" bind:open>
  {#snippet actions()}<InfoButton active={info} controls="wind-info" onclick={() => { info = !info }} />{/snippet}
  {#if info}
    <InfoCard id="wind-info" label="About the solar wind" onclose={() => { info = false }}>
      <p>The stream of particles from the Sun, measured at L1, about an hour before it reaches the Earth.</p>
    </InfoCard>
  {/if}
  <KeyValue label="Speed">461 km/s</KeyValue>
  <KeyValue label="Density">4.2 p/cm³</KeyValue>
  <KeyValue label="Bz" tone="warn" sub="southward for 40 min">−3 nT</KeyValue>
  <!-- The chart takes the width of the column it sits in -->
  <div class="chart" bind:clientWidth={width}>
    <Sparkline values={speeds} label="Solar wind speed, last 24 h" width={width || 240} height={32} area readout={(i, v) => `${String(i * 2).padStart(2, '0')}:00 UTC · ${v} km/s`} />
  </div>
  <MetaRow><Age {updatedAt} staleAfter={15 * 60_000} deadAfter={60 * 60_000} /><span>max 24 h <b>470 km/s</b></span></MetaRow>
</Section>

<style>
  .chart { margin-top: 8px; }
</style>
