<script lang="ts">
  import { KeyValue, PanelHead, Section } from 'plancia-ui'
  import { latestKp, type KpReading } from './lib/kp'

  let readings: KpReading[] = $state([])
  const kp = $derived(latestKp(readings))

  $effect(() => {
    fetch('/api/kp').then((response) => response.json()).then((rows) => { readings = rows })
  })
</script>

<main class="stage">
  <div class="p-panel console">
    <PanelHead title="Orbit console" />
    <Section title="Geomagnetic">
      <KeyValue label="Kp">{kp?.value ?? '—'}</KeyValue>
    </Section>
  </div>
</main>

<style>
  .stage { position: fixed; inset: 0; background: var(--p-bg); color: var(--p-text); }
  .console { position: absolute; top: 16px; left: 16px; width: 300px; }
</style>
