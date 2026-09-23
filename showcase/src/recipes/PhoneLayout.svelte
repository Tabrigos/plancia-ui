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
