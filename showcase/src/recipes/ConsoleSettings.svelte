<script lang="ts">
  // Recipe: the settings of a console, in two tabs. Tabs mounts only the
  // chosen panel, afresh on every change, so every choice lives here, in
  // the app, and survives a switch. The observer is a Select in a row that
  // names it (the row's text is its label); units and clock are choices
  // with words, so RadioGroup, inline; the filters are checkboxes under a
  // legend, with an "all" that is indeterminate while the choice is partial.
  import { Button, Checkbox, Fieldset, RadioGroup, Select, SettingRow, Tabs } from 'plancia-ui'

  const places = [
    { id: 'rome', label: 'Rome' }, { id: 'kiruna', label: 'Kiruna' }, { id: 'svalbard', label: 'Svalbard' },
    { id: 'mauna-kea', label: 'Mauna Kea' }, { id: 'atacama', label: 'Atacama' },
  ]
  const kinds = [
    { id: 'stations', label: 'Space stations' },
    { id: 'satellites', label: 'Active satellites', hint: 'About 9,000: slower on an old phone' },
    { id: 'debris', label: 'Debris' },
    { id: 'bodies', label: 'Rocket bodies' },
  ]
  const orbits = ['LEO', 'MEO', 'GEO']

  let tab = $state('display')
  // A point picked on the globe is none of the places: the select shows its placeholder
  let observer = $state('lat-41.9-lon-12.5')
  let units = $state('km')
  let clock = $state('utc')
  let shown = $state<Record<string, boolean>>({ stations: true, satellites: false, debris: true, bodies: false })
  let orbit = $state<Record<string, boolean>>({ LEO: true, MEO: true, GEO: false })

  const all = $derived(kinds.every((kind) => shown[kind.id]))
  const some = $derived(kinds.some((kind) => shown[kind.id]))

  function reset(): void {
    shown = { stations: true, satellites: true, debris: true, bodies: true }
    orbit = { LEO: true, MEO: true, GEO: true }
  }
</script>

<Tabs label="Settings" bind:value={tab} items={[{ id: 'display', label: 'Display' }, { id: 'filters', label: 'Filters' }]}>
  {#snippet panel(id)}
    {#if id === 'display'}
      <div class="panel">
        <div class="p-inset">
          <SettingRow label="Observer">
            <Select label="Observer" size="sm" class="observer" items={places} bind:value={observer} placeholder="Choose a place" />
          </SettingRow>
        </div>
        <RadioGroup legend="Units" inline bind:value={units} items={[{ id: 'km', label: 'Kilometres' }, { id: 'mi', label: 'Miles' }]} />
        <RadioGroup legend="Clock" inline bind:value={clock} items={[{ id: 'utc', label: 'UTC' }, { id: 'local', label: 'Local time' }]} />
      </div>
    {:else}
      <div class="panel">
        <Fieldset legend="Objects" hint="What the globe draws">
          <Checkbox label="All objects" checked={all} indeterminate={some && !all}
                    onchange={(on) => { shown = Object.fromEntries(kinds.map((kind) => [kind.id, on])) }} />
          {#each kinds as kind (kind.id)}
            <Checkbox label={kind.label} hint={kind.hint} bind:checked={shown[kind.id]} />
          {/each}
        </Fieldset>
        <Fieldset legend="Orbits" inline>
          {#each orbits as name (name)}<Checkbox label={name} bind:checked={orbit[name]} />{/each}
        </Fieldset>
        <div><Button variant="secondary" size="sm" onclick={reset}>Show everything</Button></div>
      </div>
    {/if}
  {/snippet}
</Tabs>

<style>
  .panel { display: flex; flex-direction: column; gap: 16px; }
  .p-inset { padding: 4px 0; }
  :global(.observer) { width: 140px; }
</style>
