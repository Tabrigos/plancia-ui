<script lang="ts">
  /**
   * plancia-ui showcase: every component in every state, with the tokens.
   * Born as the /plancia page of Sidereus; since 2026-09-16 it lives here,
   * in the package repository, and reads the sources in ../src (alias in
   * vite.config.ts), so it always shows what is on the main branch.
   */
  import { Button, Chip, ControlRow, KeyValue, Legend, LegendDots, MetaRow, Notice, PanelHead, Segmented, SettingRow, Skeleton, Stat, Toggle, scaleTone } from 'plancia-ui'
  import tokens from 'plancia-ui/tokens.json'
  import { version } from '../../package.json'

  import { applyTheme, readRequestedTheme, readStoredTheme, rememberTheme, type Theme } from 'plancia-ui'
  import { THEME_STORAGE_KEY } from './config'

  let mode = $state('tracking')
  let on = $state(true)
  let density = $state<'compact' | 'comfortable'>('compact')
  // The showcase is where the theme gets tried: the URL wins on load, the
  // stored preference (`plancia.theme`) remembers the user's own choice.
  let theme = $state<Theme>(readRequestedTheme() ?? readStoredTheme(THEME_STORAGE_KEY))
  $effect(() => { applyTheme(theme) })
  const colors = Object.entries(tokens.color as Record<string, string>)
  const lightColors = tokens.light.color as Record<string, string>
  const sizes = Object.entries(tokens.size as Record<string, string>)
</script>

<svelte:head><title>plancia-ui · showcase</title></svelte:head>

<main data-density={density}>
  <header class="head">
    <div>
      <h1>plancia-ui</h1>
      <p class="p-dim p-t13">Design system for dense consoles: tokens, base styles and Svelte 5 components. Version {version}, built from the main branch.</p>
      <p class="p-dim p-t12 links"><a href="https://github.com/Tabrigos/plancia-ui">GitHub</a> · <a href="https://www.npmjs.com/package/plancia-ui">npm</a></p>
    </div>
    <div class="head-ctl">
      <span class="p-t12 p-dim">theme</span>
      <Segmented items={[{ id: 'dark', label: 'dark' }, { id: 'light', label: 'light' }]} bind:value={theme} onchange={(id) => rememberTheme(id as Theme, THEME_STORAGE_KEY)} label="Theme" />
      <span class="p-t12 p-dim">density</span>
      <Segmented items={[{ id: 'compact', label: 'compact' }, { id: 'comfortable', label: 'comfortable' }]} bind:value={density} label="Density" />
    </div>
  </header>

  <section>
    <h2 class="p-sec-title">Colors · dark and light</h2>
    <p class="p-dim p-t12 sw-note">Same variables in both themes: light redefines every color <span class="p-mono">--p-*</span> under <span class="p-mono">[data-theme="light"]</span>; typography, spacing, radii and motion do not change. Left box the dark value, right box the light one.</p>
    <div class="swatches">
      {#each colors as [name, value] (name)}
        <div class="sw">
          <div class="sw-pair"><div class="sw-box" style="background:{value}"></div><div class="sw-box" style="background:{lightColors[name]}"></div></div>
          <span class="p-mono p-t11 p-hi">--p-{name}</span><span class="p-mono p-t11 p-dim">{value} · {lightColors[name]}</span>
        </div>
      {/each}
    </div>
    <div class="scale-row">
      <span class="p-t11 p-dim">NOAA scale ramp (--p-scale-0..5, follows the theme)</span>
      {#each [0, 1, 2, 3, 4, 5] as level (level)}<i class="scale-box" style="background:var(--p-scale-{level})" title="--p-scale-{level}"></i>{/each}
    </div>
  </section>

  <section>
    <h2 class="p-sec-title">Typography</h2>
    <div class="p-card type">
      {#each sizes as [name, px] (name)}
        <div class="type-row"><span class="p-mono p-t11 p-dim">{name} · {px}</span><span class="p-hi" style="font-size:{px}">Space stations · 2026-09-10 21:26 UTC</span></div>
      {/each}
    </div>
  </section>

  <section class="grid2">
    <div>
      <h2 class="p-sec-title">Buttons</h2>
      <div class="p-card demo">
        <div class="row-wrap">
          <Button variant="primary">Follow satellite</Button>
          <Button variant="secondary">transit view</Button>
          <Button variant="quiet">show all</Button>
          <Button variant="icon" title="Settings">⚙</Button>
          <Button variant="primary" disabled>disabled</Button>
          <Button variant="secondary" active>active</Button>
        </div>
        <div class="row-wrap">
          <Button variant="primary" size="sm">primary sm</Button>
          <Button variant="secondary" size="sm">secondary sm</Button>
          <Button variant="quiet" size="sm">quiet sm</Button>
          <Button variant="icon" size="sm" title="Close">×</Button>
        </div>
      </div>
    </div>
    <div>
      <h2 class="p-sec-title">Toggle · Chip</h2>
      <div class="p-card demo">
        <div class="row-wrap">
          <Toggle bind:checked={on} label="Test layer" /><span class="p-t12 p-dim">{on ? 'on' : 'off'}</span>
          <Toggle checked={true} disabled label="Disabled on" />
          <Toggle checked={false} disabled label="Disabled off" />
        </div>
        <div class="row-wrap">
          <Chip>neutral</Chip><Chip tone="accent">304 Å</Chip><Chip tone="ok">G0</Chip><Chip tone="warn">G2</Chip><Chip tone="orange">G3</Chip><Chip tone="danger">G5</Chip><Chip tone="info">info</Chip><Chip count>235</Chip><Chip color="#a3e635">NEW</Chip>
        </div>
        <div class="row-wrap">
          {#each [0, 1, 2, 3, 4, 5] as level (level)}<Chip tone={scaleTone(level)}>R{level}</Chip>{/each}
          <span class="p-t11 p-dim">scaleTone(level)</span>
        </div>
      </div>
    </div>
  </section>

  <section class="grid2">
    <div>
      <h2 class="p-sec-title">Label / value rows · Stats</h2>
      <div class="p-card demo">
        <div class="p-inset" style="padding:4px 12px">
          <KeyValue label="Air at 547 km" sub="−34 % vs. global median">0.21 ng/m³</KeyValue>
          <KeyValue label="Air at 35781 km">outside the model (100–1000 km)</KeyValue>
          <KeyValue label="Launch" sub="Andøya · operator to be assigned">Sep 5</KeyValue>
          <KeyValue label="Radiation" tone="ok">outside SAA and oval</KeyValue>
          <KeyValue label="Enlil" tone="warn">ambient run · 17 h</KeyValue>
        </div>
        <div class="stats">
          <Stat label="Latitude">41.9012°</Stat>
          <Stat label="Altitude">420.6 km</Stat>
          <Stat label="Speed">7.36 km/s</Stat>
          <Stat label="Kp" tone="ok" sub="quiet">1.3</Stat>
        </div>
      </div>
    </div>
    <div>
      <h2 class="p-sec-title">Panel head</h2>
      <div class="p-card demo">
        <div class="p-panel">
          <PanelHead title="Sun now" subtitle="304 Å · 3 min ago" onclose={() => {}} closeLabel="Close">
            {#snippet actions()}<Button variant="icon" size="sm" title="Details">i</Button>{/snippet}
          </PanelHead>
          <div class="body p-dim p-t12">body</div>
        </div>
        <div class="p-panel">
          <PanelHead title="ISS (ZARYA)" onclose={() => {}} closeLabel="Close">
            {#snippet chips()}<Chip tone="accent">STATIONS</Chip><Chip>NORAD 25544</Chip>{/snippet}
          </PanelHead>
          <div class="body p-dim p-t12">body</div>
        </div>
        <div class="p-panel">
          <PanelHead title="CME transit" subtitle="Sun → Earth" onclose={() => {}} closeLabel="Close">
            {#snippet actions()}<Button variant="secondary" size="sm">Sun</Button><Button variant="secondary" size="sm">view</Button>{/snippet}
          </PanelHead>
          <div class="body p-dim p-t12">body</div>
        </div>
      </div>
    </div>
  </section>

  <section class="grid2">
    <div>
      <h2 class="p-sec-title">States</h2>
      <div class="p-card demo">
        <Skeleton lines={3} label="Loading" />
        <Notice kind="empty" title="No relevant CME in flight" text="3 slow or not Earth-directed · data from 4 min ago" />
        <Notice kind="info" title="The Enlil run follows the Heliosphere frame" />
        <Notice kind="warn" title="Ambient Enlil run: no CME inserted" />
        <Notice kind="error" title="DONKI events unavailable"><Button variant="quiet" size="sm">retry</Button></Notice>
      </div>
    </div>
    <div>
      <h2 class="p-sec-title">Legend · Meta row · Segmented</h2>
      <div class="p-card demo">
        <Legend gradient="linear-gradient(90deg,#0f172a,#7e22ce,#f97316,#fde68a)" min="0" max="35" unit="MHz" />
        <MetaRow>
          <span title="Observation time at the source">data from 8 min ago</span>
          <span title="Below this threshold the layer is transparent">transparent below 1 MHz</span>
        </MetaRow>
        <Legend gradient="linear-gradient(90deg,#1d4ed8,#0b1220,#dc2626)" min="−15" max="+15" unit="TECU" />
        <MetaRow>
          <span>data from 12 min ago</span>
          <span>≥100 MeV <b>0.4 pfu</b></span>
          <Segmented size="sm" label="Rendering" items={[{ id: 'ground', label: 'on ground' }, { id: 'lifted', label: 'lifted' }]} value="lifted" />
        </MetaRow>
        <Segmented items={[{ id: 'tracking', label: 'Tracking' }, { id: 'spaceweather', label: 'Space Wx' }, { id: 'system', label: 'System' }]} bind:value={mode} label="Mode" />
        <span class="p-t12 p-dim">mode: <span class="p-mono p-hi">{mode}</span></span>
      </div>
    </div>
  </section>

  <section class="grid2">
    <div>
      <h2 class="p-sec-title">Console rows</h2>
      <div class="p-card demo">
        <ControlRow label="Auroral oval (OVATION)" help title="Probability of seeing the aurora, point by point on the globe">
          <Button variant="icon" size="sm" aria-label="What is this datum">i</Button>
          <Toggle checked />
        </ControlRow>
        <ControlRow label="Thermospheric density at 400 km (WAM-IPE): a long name that does not fit" tone="dim">
          <Toggle />
        </ControlRow>
        <div class="p-inset rows">
          <SettingRow label="Orbit lines">
            {#snippet icon()}<span class="p-dot accent"></span>{/snippet}
            <Toggle checked />
          </SettingRow>
          <SettingRow label="Starlink" help title="Constellation, 11 877 objects in the catalog">
            {#snippet icon()}<span class="p-dot"></span>{/snippet}
            <Chip count>1,000</Chip>
            <Toggle />
          </SettingRow>
        </div>
      </div>
    </div>
    <div>
      <h2 class="p-sec-title">Dot legend</h2>
      <div class="p-card demo">
        <LegendDots label="Field line colors" items={[
          { color: '#38bdf8', label: 'closed' },
          { color: '#fbbf24', label: 'open' },
          { color: '#a78bfa', label: 'tail' },
          { color: '#94a3b8', label: 'magnetopause' },
          { color: '#ef4444', label: 'SAA contour (dashed)', opacity: 0.7, title: 'From the IGRF-14 model' },
        ]} />
      </div>
    </div>
  </section>
</main>

<style>
  main { max-width: 1240px; margin: 0 auto; padding: 32px 24px 64px; display: flex; flex-direction: column; gap: 32px; }
  .head { display: flex; align-items: flex-start; justify-content: space-between; gap: 24px; }
  .head-ctl { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; justify-content: flex-end; max-width: 560px; }
  h1 { margin: 0 0 4px; font-size: var(--p-t28); font-weight: 600; color: var(--p-text-hi); letter-spacing: -0.02em; }
  p { margin: 0; }
  .links { margin-top: 4px; }
  h2 { margin: 0 0 12px; }
  section { display: flex; flex-direction: column; }
  .rows { padding: 4px 0; }
  .grid2 { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 32px; }
  .swatches { display: grid; grid-template-columns: repeat(6, minmax(0, 1fr)); gap: 12px; }
  .sw { display: flex; flex-direction: column; gap: 4px; }
  .sw-note { margin: -4px 0 12px; max-width: 80ch; }
  .sw-pair { display: grid; grid-template-columns: 1fr 1fr; gap: 4px; }
  .sw-box { height: 40px; border-radius: var(--p-r2); border: 1px solid var(--p-border); }
  .scale-row { display: flex; align-items: center; gap: 6px; margin-top: 12px; }
  .scale-box { display: inline-block; width: 28px; height: 16px; border-radius: var(--p-r1); border: 1px solid var(--p-border); }
  .type { padding: 4px 16px; }
  .type-row { display: grid; grid-template-columns: 120px 1fr; gap: 16px; align-items: baseline; padding: 8px 0; }
  .type-row + .type-row { border-top: 1px solid var(--p-border); }
  .demo { padding: 16px; display: flex; flex-direction: column; gap: 12px; }
  .row-wrap { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
  .stats { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 8px; }
  .body { padding: 12px 14px; }
  @media (max-width: 900px) { .grid2 { grid-template-columns: 1fr; } .swatches { grid-template-columns: repeat(3, minmax(0, 1fr)); } }
</style>
