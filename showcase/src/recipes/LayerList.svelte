<script lang="ts">
  // Recipe: layers the user turns on and reads. A List of framed items:
  // the head names the layer and holds its controls, the body shows while
  // the layer is on and carries its legend, its readings and its state.
  // A list with nothing to show gives way to a Notice.
  import { Legend, List, ListItem, MetaRow, Notice, Skeleton, Status, Toggle } from 'plancia-ui'

  let layers = $state([
    { id: 'tec', name: 'Total electron content', on: true, state: 'ready' },
    { id: 'drap', name: 'Radio absorption', on: true, state: 'loading' },
    { id: 'density', name: 'Density at 400 km', on: true, state: 'unavailable' },
  ])
</script>

{#if layers.length === 0}
  <Notice kind="empty" title="No layer available" text="The source has not published any" compact />
{:else}
  <List label="Map layers">
    {#each layers as layer (layer.id)}
      <ListItem label={layer.name} data-layer={layer.id}>
        {#snippet controls()}<Toggle bind:checked={layer.on} label={layer.name} />{/snippet}
        {#if layer.on}
          {#if layer.state === 'loading'}
            <Skeleton lines={2} compact label="Loading {layer.name}" />
          {:else if layer.state === 'unavailable'}
            <MetaRow><Status kind="error" text="unavailable" title="The source did not answer: retrying in 5 min" /></MetaRow>
          {:else}
            <Legend gradient="linear-gradient(90deg, var(--p-div-1), var(--p-div-4), var(--p-div-7))" min="−15" max="+15" unit="TECU" />
            <MetaRow><span>data from 12 min ago</span><span>at the point <b>+4.2 TECU</b></span></MetaRow>
          {/if}
        {/if}
      </ListItem>
    {/each}
    {#snippet footer()}Space weather data: NOAA SWPC{/snippet}
  </List>
{/if}
