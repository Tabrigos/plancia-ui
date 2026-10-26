# plancia-ui — recipes

Contents: [A console section](#a-console-section) ·
[A list of layers and its states](#a-list-of-layers-and-its-states) ·
[Layer rows, compact](#layer-rows-compact) ·
[Rows that open for a finger](#rows-that-open-for-a-finger) ·
[The settings of a console, in two tabs](#the-settings-of-a-console-in-two-tabs) ·
[The playback of an animation](#the-playback-of-an-animation) ·
[A console on a phone](#a-console-on-a-phone)

Compositions of the package, each the exact file the showcase compiles
(svelte-check in the package's CI) and shows live with its code at
https://tabrigos.github.io/plancia-ui/recipes.html; a test in the package
fails when a block here and its file differ. The path under each heading is
in the library's repository (https://github.com/Tabrigos/plancia-ui), not in
the installed package: the block is the whole file. The comment at the top
of each says what it shows and why it is built so. The panel over a stage is in
`SKILL.md`, as the usual shape.

## A console section

`showcase/src/recipes/ConsoleSection.svelte`:

```svelte
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
```

## A list of layers and its states

`showcase/src/recipes/LayerList.svelte`:

```svelte
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
```

## Layer rows, compact

`showcase/src/recipes/LayerRows.svelte`:

```svelte
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
```

## Rows that open for a finger

`showcase/src/recipes/ExpandableRows.svelte`:

```svelte
<script lang="ts">
  // Recipe: rows that open their detail below themselves. On touch the
  // tooltip is silent, so a fact that lives only in a row's title (the full
  // text of a message, the end and the geometry of a pass) needs a place a
  // finger reaches. The whole row is the button; the tooltip stays for the
  // mouse. One row open at a time is the app's rule, kept in its own state.
  import { Chip, ExpandableRow, type Tone } from 'plancia-ui'

  const alerts: Array<{ id: string; kind: string; tone: Tone; text: string; age: string; issued: string }> = [
    { id: 'w1', kind: 'Warning', tone: 'orange', text: 'Geomagnetic K-index of 6 expected, G2 storm level, until 21:00 UTC', age: '12m', issued: '15:48 UTC' },
    { id: 'a1', kind: 'Alert', tone: 'warn', text: 'Geomagnetic K-index of 5 reached at 15:30 UTC', age: '31m', issued: '15:29 UTC' },
    { id: 's1', kind: 'Summary', tone: 'info', text: 'X-ray event exceeded M1: M1.4 peaking at 13:12 UTC from region 3914', age: '3h', issued: '13:20 UTC' },
  ]
  const passes = [
    { id: '1', start: '19:02', max: 64, from: 'W', to: 'SE', minutes: 6, detail: '19:02–19:08 local · culminates at 64° to the S, 452 km away · visible to the naked eye' },
    { id: '2', start: '20:38', max: 23, from: 'WNW', to: 'E', minutes: 5, detail: '20:38–20:43 local · culminates at 23° to the N, 890 km away · in the Earth\'s shadow' },
  ]
  let openAlert = $state<string | null>(null)
  let openPass = $state<string | null>(null)
</script>

<div class="alerts">
  {#each alerts as alert (alert.id)}
    <ExpandableRow class="alert-row" title={alert.text} open={openAlert === alert.id} onchange={(open) => { openAlert = open ? alert.id : null }}>
      <Chip uppercase small tone={alert.tone}>{alert.kind}</Chip>
      <span class="text">{alert.text}</span>
      <span class="age">{alert.age}</span>
      {#snippet detail()}Issued {alert.issued} by NOAA SWPC{/snippet}
    </ExpandableRow>
  {/each}
</div>

<!-- A list with columns: each row is a subgrid of the list, the detail spans it -->
<div class="passes">
  <span class="p-sec-title">Start</span><span class="p-sec-title num">Max</span><span class="p-sec-title">From → to</span><span class="p-sec-title num">Min</span>
  {#each passes as pass (pass.id)}
    <ExpandableRow class="pass-row" title={pass.detail} open={openPass === pass.id} onchange={(open) => { openPass = open ? pass.id : null }}>
      <span class="hi">{pass.start}</span><span class="num hi">{pass.max}°</span><span class="dim">{pass.from} → {pass.to}</span><span class="num dim">{pass.minutes}′</span>
      {#snippet detail()}{pass.detail}{/snippet}
    </ExpandableRow>
  {/each}
</div>

<style>
  .alerts { display: flex; flex-direction: column; gap: 2px; font-size: var(--p-t11); }
  :global(.alert-row) { align-items: center; }
  .text { flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; color: var(--p-text); }
  /* Open, the whole text wraps where the ellipsis was */
  :global(.alert-row[aria-expanded='true']) .text { white-space: normal; }
  .age { flex: none; font-family: var(--p-font-mono); color: var(--p-text-dim); }
  .passes { display: grid; grid-template-columns: auto auto 1fr auto; gap: 2px 12px; margin-top: 16px; font-family: var(--p-font-mono); font-size: var(--p-t11); color: var(--p-text); }
  /* gap: normal, the list's own column gap, or the row's default would shift the cells */
  :global(.pass-row) { display: grid; grid-template-columns: subgrid; gap: normal; }
  .num { text-align: right; }
  .hi { color: var(--p-text-hi); }
  .dim { color: var(--p-text-dim); }
</style>
```

## The settings of a console, in two tabs

`showcase/src/recipes/ConsoleSettings.svelte`:

```svelte
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
```

## The playback of an animation

`showcase/src/recipes/Playback.svelte`:

```svelte
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
```

## A console on a phone

`showcase/src/recipes/PhoneLayout.svelte`:

```svelte
<script lang="ts">
  // Recipe: a console on a phone. The stage takes the whole screen, a pill
  // at the top holds the few controls that must stay at hand, the
  // navigation lives in a modal Drawer, and the content comes up in bottom
  // sheets, one at a time. The package gives the shapes; which sheet is
  // open, and the rule that opening one closes the others and the drawer,
  // belong to the app. On a wide screen the same code gives a column and
  // floating panels.
  import { Button, Chip, Drawer, FloatingPanel, KeyValue, List, ListItem, MetaRow, PanelHead, Segmented, Toggle, isPhone, PHONE_MEDIA } from 'plancia-ui'

  type Sheet = 'sun' | 'station'
  let sheet = $state<Sheet | null>(null)
  let navOpen = $state(false)
  let phone = $state(isPhone())
  let view = $state('globe')
  let layers = $state({ oval: true, density: false })

  // Rotating the phone or resizing the window crosses the breakpoint: listen, do not read once
  $effect(() => {
    const media = matchMedia(PHONE_MEDIA)
    const update = () => { phone = media.matches }
    media.addEventListener('change', update)
    return () => media.removeEventListener('change', update)
  })

  // One sheet at a time, and a choice that opens a sheet closes the drawer
  function openSheet(id: Sheet): void {
    sheet = id
    navOpen = false
  }
</script>

<div class="app">
  <div class="stage" aria-hidden="true"><div class="globe"></div></div>

  <div class="pill p-panel">
    <Button id="open-nav" variant="icon" title="Menu" aria-label="Menu" aria-expanded={navOpen} onclick={() => { navOpen = true }}>
      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16" /></svg>
    </Button>
    <Segmented size="sm" label="View" items={[{ id: 'globe', label: 'globe' }, { id: 'map', label: 'map' }]} bind:value={view} />
  </div>

  <!-- On the stage, what a tap on an object does in the real app -->
  <div class="picks">
    <Button id="pick-station" variant="secondary" size="sm" onclick={() => openSheet('station')}>ISS</Button>
    <Button id="pick-sun" variant="secondary" size="sm" onclick={() => openSheet('sun')}>Sun</Button>
  </div>

  <Drawer open={navOpen} modal={phone} label="Navigation" opener="open-nav" onclose={() => { navOpen = false }} class="nav">
    <PanelHead title="Console" subtitle="space weather" onclose={() => { navOpen = false }} />
    <div class="nav-body">
      <List label="Layers">
        <ListItem label="Auroral oval">
          {#snippet controls()}<Toggle bind:checked={layers.oval} label="Auroral oval" />{/snippet}
          {#if layers.oval}<MetaRow><span>data from 6 min ago</span><span>aurora down to <b>58° N</b></span></MetaRow>{/if}
        </ListItem>
        <ListItem label="Density at 400 km">
          {#snippet controls()}<Toggle bind:checked={layers.density} label="Density at 400 km" />{/snippet}
        </ListItem>
      </List>
      <Button variant="quiet" onclick={() => openSheet('sun')}>Sun now →</Button>
    </div>
  </Drawer>

  {#if sheet === 'station'}
    <FloatingPanel title="ISS (ZARYA)" subtitle="NORAD 25544" class="sheet" opener="pick-station" onclose={() => { sheet = null }}>
      {#snippet chips()}<Chip tone="accent">stations</Chip>{/snippet}
      <KeyValue label="Altitude">420.6 km</KeyValue>
      <KeyValue label="Speed">7.66 km/s</KeyValue>
      <KeyValue label="Next pass" sub="max 64° · lit">21:14</KeyValue>
    </FloatingPanel>
  {:else if sheet === 'sun'}
    <FloatingPanel title="Sun now" subtitle="304 Å · 3 min ago" class="sheet" opener="pick-sun" onclose={() => { sheet = null }}>
      <KeyValue label="X-ray class" tone="warn">M1.2</KeyValue>
      <KeyValue label="Regions">4 · largest 3914</KeyValue>
      <KeyValue label="Wind">412 km/s</KeyValue>
    </FloatingPanel>
  {/if}
</div>

<style>
  /* The app's container: the drawer, its scrim and the sheets are placed against it */
  .app { position: fixed; inset: 0; overflow: hidden; background: var(--p-bg); }
  .stage { position: absolute; inset: 0; display: grid; place-items: center; background: radial-gradient(circle at 50% 42%, var(--p-s3) 0, var(--p-bg) 70%); }
  .globe { width: min(70vw, 60vh); aspect-ratio: 1; border-radius: 50%; border: 1px solid var(--p-border-strong); background: radial-gradient(circle at 35% 30%, var(--p-s2), var(--p-inset)); }
  .pill {
    position: absolute; top: max(12px, env(safe-area-inset-top)); left: 50%; transform: translateX(-50%); z-index: var(--p-z-overlay);
    display: flex; align-items: center; gap: 8px; padding: 4px 6px; border-radius: var(--p-r-pill);
  }
  .picks { position: absolute; top: 45%; left: 50%; transform: translateX(-50%); z-index: var(--p-z-overlay); display: flex; gap: 8px; }
  :global(.nav) { width: min(86vw, 300px); }
  .nav-body { flex: 1; min-height: 0; overflow-y: auto; display: flex; flex-direction: column; gap: 12px; padding: 12px; }
  /* A floating panel on a wide screen; under 700 px the package makes it a bottom sheet */
  :global(.sheet) { position: absolute; top: 72px; right: 16px; width: 320px; z-index: var(--p-z-panel); }
</style>
```
