<script lang="ts">
  // Recipe: a row per layer, compact, for many of them (a catalog of
  // satellite groups). SettingRow with a color sample, the state of the
  // layer as a glance, a counter and the toggle. Not a component of its
  // own: the composition is enough. The color is data of the app.
  import { Chip, SettingRow, Status, Toggle, type StatusKind } from 'plancia-ui'

  let groups = $state<Array<{ id: string; name: string; color: string; count: number; on: boolean; state: StatusKind }>>([
    { id: 'stations', name: 'Space stations', color: '#38bdf8', count: 12, on: true, state: 'ok' },
    { id: 'starlink', name: 'Starlink', color: '#a78bfa', count: 1000, on: false, state: 'idle' },
    { id: 'debris', name: 'Debris', color: '#f97316', count: 2340, on: true, state: 'loading' },
    { id: 'weather', name: 'Weather', color: '#34d399', count: 57, on: true, state: 'stale' },
  ])
</script>

<div class="p-inset rows">
  {#each groups as group (group.id)}
    <SettingRow label={group.name} data-group={group.id}>
      {#snippet icon()}<span class="sample" style:background={group.color}></span>{/snippet}
      <Status kind={group.state} title={group.state === 'stale' ? 'The catalog is 3 days old' : `${group.name}: ${group.state}`} />
      <Chip count>{group.count.toLocaleString('en')}</Chip>
      <Toggle bind:checked={group.on} label={group.name} />
    </SettingRow>
  {/each}
</div>

<style>
  .rows { padding: 4px 0; }
  .sample { width: 10px; height: 10px; margin: auto; border-radius: 50%; }
</style>
