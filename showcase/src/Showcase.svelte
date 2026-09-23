<script lang="ts">
  /**
   * plancia-ui showcase: every component in every state, with the tokens.
   * Born as the /plancia page of Sidereus; since 2026-09-16 it lives here,
   * in the package repository, and reads the sources in ../src (alias in
   * vite.config.ts), so it always shows what is on the main branch.
   */
  import { Age, Bars, Button, Chip, ControlRow, Drawer, FloatingPanel, InfoButton, InfoCard, Kbd, KeyValue, Legend, LegendDots, List, ListItem, LiveRegion, MetaRow, Notice, PanelHead, Section, Segmented, SettingRow, Skeleton, Sparkline, Stat, Status, Toggle, Tooltip, announce, scaleTone } from 'plancia-ui'
  import tokens from 'plancia-ui/tokens.json'
  import { version } from '../../package.json'

  import { applyTheme, readRequestedTheme, readStoredTheme, rememberTheme, type Theme } from 'plancia-ui'
  import { THEME_STORAGE_KEY } from './config'

  let mode = $state('tracking')
  let on = $state(true)
  // 'auto' leaves the density to the root: touch by itself on a coarse pointer.
  // `?density=touch` picks one from the URL, for screenshots, like `?theme=`.
  type Density = 'auto' | 'compact' | 'comfortable' | 'touch'
  const requestedDensity = new URLSearchParams(location.search).get('density')
  let density = $state<Density>(['compact', 'comfortable', 'touch'].includes(requestedDensity ?? '') ? (requestedDensity as Density) : 'auto')
  // What the page really got: on a phone `auto` resolves to touch through the
  // root, and the only way to see that is to read the tokens back
  let main = $state<HTMLElement | null>(null)
  let effective = $state('')
  $effect(() => {
    void density
    const read = () => {
      if (!main) return
      const style = getComputedStyle(main)
      const coarse = matchMedia('(pointer: coarse)').matches
      effective = `rows ${style.getPropertyValue('--p-row-h').trim()} · controls ${style.getPropertyValue('--p-control-h').trim()} · pointer ${coarse ? 'coarse' : 'fine'}`
    }
    read()
    const media = matchMedia('(pointer: coarse)')
    media.addEventListener('change', read)
    return () => media.removeEventListener('change', read)
  })
  let kpOpen = $state(true)
  let panelOpen = $state(true)
  let kpInfo = $state(true)
  // The list demo: which layers are on and which explanation is open is the page's state
  let ovationOn = $state(true)
  let ovationInfo = $state(false)
  let tecOn = $state(false)
  // The drawer demo: open or closed, and modal or a column, are the page's state
  let drawerOpen = $state(false)
  let drawerMode = $state('modal')
  const now = Date.now()
  const MIN = 60_000
  // The showcase is where the theme gets tried: the URL wins on load, the
  // stored preference (`plancia.theme`) remembers the user's own choice.
  let theme = $state<Theme>(readRequestedTheme() ?? readStoredTheme(THEME_STORAGE_KEY))
  $effect(() => { applyTheme(theme) })
  const colors = Object.entries(tokens.color as Record<string, string>)
  const lightColors = tokens.light.color as Record<string, string>
  const sizes = Object.entries(tokens.size as Record<string, string>)
  const ramps: Array<[string, string[], string]> = [
    ['viz', tokens.viz as string[], 'categorical · blue, rose, lime, violet, orange, teal, in this order'],
    ['seq', tokens.seq as string[], 'sequential · accent hue, near-zero to full'],
    ['div', tokens.div as string[], 'diverging · blue to red through a neutral midpoint'],
  ]
  // Small series for the chart preview: Kp bars colored by level, an X-ray sparkline, wind with an area
  const kp = [1, 2, 2, 3, 5, 4, 6, 3]
  const kpBars = kp.map((v, i) => ({ value: v, label: `${String(i * 3).padStart(2, '0')} UTC · Kp ${v}`, color: `var(--p-scale-${Math.min(5, Math.max(0, v - 4))})` }))
  const xray = [1.2, 1.4, 1.3, 2.8, 5.1, 3.2, 2.1, 1.9, 1.7, 1.6, 2.2, 1.8]
  const wind = [380, 392, 410, 405, 430, 455, 448, 470, 462, 440]
  // Bz: signed, a missing sample in the middle, forecast after the marker
  const bz = [-3, -4.5, -2, null, 1, 3.5, 2, -1, -2.5, -4]
</script>

<svelte:head><title>plancia-ui · showcase</title></svelte:head>

<!-- One themed tooltip for the page: every `title` below goes through it -->
<Tooltip avoid=".p-floating" />
<LiveRegion />

<main data-density={density === 'auto' ? undefined : density} bind:this={main}>
  <header class="head">
    <div>
      <h1>plancia-ui</h1>
      <p class="p-dim p-t13">Design system for dense consoles: tokens, base styles and Svelte 5 components. Version {version}, built from the main branch.</p>
      <p class="p-dim p-t12 links"><a href="recipes.html">Recipes</a> · <a href="https://github.com/Tabrigos/plancia-ui">GitHub</a> · <a href="https://www.npmjs.com/package/plancia-ui">npm</a> · <span title="Every title on this page renders through the package Tooltip, mounted once at the root">hover me for the themed tooltip</span></p>
    </div>
    <div class="head-ctl">
      <span class="p-t12 p-dim">theme</span>
      <Segmented items={[{ id: 'dark', label: 'dark' }, { id: 'light', label: 'light' }]} bind:value={theme} onchange={(id) => rememberTheme(id as Theme, THEME_STORAGE_KEY)} label="Theme" />
      <span class="p-t12 p-dim">density</span>
      <Segmented items={[{ id: 'auto', label: 'auto', title: 'The root decides: touch by itself on a phone or a tablet, compact elsewhere' }, { id: 'compact', label: 'compact' }, { id: 'comfortable', label: 'comfortable' }, { id: 'touch', label: 'touch', title: '44 px rows, 40 px buttons, 44×26 toggles, 16 px inputs' }]} bind:value={density} label="Density" />
      <span class="p-t11 p-dim p-mono" title="The density tokens the page really got, read back from the root">{effective}</span>
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
    <h2 class="p-sec-title">Dataviz tokens</h2>
    <p class="p-dim p-t12 sw-note">Three ramps for charts, computed and validated per theme on the card surface (lightness band, chroma floor, colorblind separation of adjacent slots, 3:1 contrast). Series colors are never the status tokens.</p>
    <div class="ramps">
      {#each ramps as [name, steps, note] (name)}
        <div class="ramp">
          <span class="p-mono p-t11 p-hi">--p-{name}-1..{steps.length}</span>
          <div class="ramp-row">{#each steps as _, i (i)}<i class="scale-box" style="background:var(--p-{name}-{i + 1})" title="--p-{name}-{i + 1}"></i>{/each}</div>
          <span class="p-t11 p-dim">{note}</span>
        </div>
      {/each}
      <div class="p-card chart-demo" aria-label="Chart preview on the dataviz tokens">
        <div class="chart-row"><Bars bars={kpBars} max={9} width={160} height={40} label="Kp, last 24 h" /><span class="p-t11 p-dim">Bars · Kp by 3 h, a status token per bar</span></div>
        <div class="chart-row"><Sparkline values={xray} label="X-ray flux, last 12 h" width={160} height={32} color="var(--p-viz-5)" /><span class="p-t11 p-dim">Sparkline · X-ray, viz-5</span></div>
        <div class="chart-row"><Sparkline values={wind} min={300} label="Solar wind speed" width={160} height={32} area readout={(i, v) => `${String(i * 2).padStart(2, '0')}:00 UTC · ${v} km/s`} /><span class="p-t11 p-dim">Sparkline · wind, area, scale pinned at 300, a readout under the pointer or the finger</span></div>
        <div class="chart-row"><Sparkline values={bz} zeroLine markIndex={6} label="Bz, observed then forecast" width={160} height={32} color="var(--p-viz-4)" /><span class="p-t11 p-dim">Sparkline · Bz: a gap, the zero line, a marker at "now"</span></div>
        <div class="cells">{#each [1, 2, 3, 4, 5, 6, 7] as s (s)}<i style="background:var(--p-seq-{s})"></i>{/each}</div>
        <div class="cells">{#each [1, 2, 3, 4, 5, 6, 7] as s (s)}<i style="background:var(--p-div-{s})"></i>{/each}</div>
      </div>
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
        <div class="row-wrap">
          <Chip uppercase tone="danger">Live</Chip><Chip uppercase tone="warn">Watch</Chip><Chip uppercase tone="orange">Warning</Chip><Chip uppercase tone="danger">Alert</Chip><Chip uppercase tone="info">Summary</Chip><Chip uppercase small>Forecast</Chip>
          <span class="p-t11 p-dim">uppercase: a short label, written in normal case</span>
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
      <h2 class="p-sec-title">Floating panel</h2>
      <div class="p-card demo stage">
        {#if panelOpen}
          <FloatingPanel title="Sun now" subtitle="304 Å · 3 min ago" class="demo-floating" onclose={() => { panelOpen = false }} opener="open-demo-panel" style="--p-floating-max-height: 220px">
            {#snippet chips()}<Chip tone="warn">stale image</Chip>{/snippet}
            {#snippet actions()}<Button variant="icon" size="sm" title="Details">i</Button>{/snippet}
            <KeyValue label="Band">304 Å</KeyValue>
            <KeyValue label="X-ray class" tone="warn">M1.2</KeyValue>
            <KeyValue label="Regions">4 · largest 3914</KeyValue>
            <KeyValue label="Wind">412 km/s</KeyValue>
            <KeyValue label="Bz">−3 nT</KeyValue>
          </FloatingPanel>
        {:else}
          <Button id="open-demo-panel" variant="secondary" size="sm" onclick={() => { panelOpen = true }}>open the panel</Button>
        {/if}
        <span class="p-t11 p-dim stage-note"><Kbd>Esc</Kbd> closes while focus is inside; the body scrolls; the page positions it; under 700 px it is a sheet from the bottom.</span>
      </div>
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
        <div class="row-wrap">
          <Status kind="loading" text="loading" />
          <Status kind="ok" text="updated" />
          <Status kind="stale" text="stale · 40 min" title="The source did not answer, showing the last data" help />
          <Status kind="error" text="unavailable" />
          <Status kind="idle" text="off" />
        </div>
        <div class="row-wrap">
          <Button variant="quiet" size="sm" onclick={() => announce('ISS selected')}>announce to screen readers</Button>
          <span class="p-t11 p-dim">writes "ISS selected" into the LiveRegion, empties after 5 s · keys: <Kbd>↑</Kbd> <Kbd>↓</Kbd> move, <Kbd>Enter</Kbd> picks</span>
        </div>
        <div class="row-wrap">
          <Age updatedAt={now - 3 * MIN} staleAfter={10 * MIN} deadAfter={60 * MIN} />
          <Age updatedAt={now - 25 * MIN} staleAfter={10 * MIN} deadAfter={60 * MIN} />
          <Age updatedAt={now - 3 * 60 * MIN} staleAfter={10 * MIN} deadAfter={60 * MIN} />
          <span class="p-t11 p-dim">Age: fresh · stale · dead, in the language of the page (its lang)</span>
        </div>
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
      <h2 class="p-sec-title">Info button · Info card</h2>
      <div class="p-card demo">
        <ControlRow label="Planetary Kp" help title="Global geomagnetic activity, 0–9">
          <InfoButton active={kpInfo} controls="kp-info" onclick={() => { kpInfo = !kpInfo }} />
          <Chip tone="ok">1.3</Chip>
        </ControlRow>
        {#if kpInfo}
          <InfoCard id="kp-info" label="About Kp" onclose={() => { kpInfo = false }}>
            <p>The <b>planetary Kp index</b> summarizes geomagnetic activity over three hours, from 0 (quiet) to 9 (extreme storm).</p>
            <dl><dt>Quantity</dt><dd>index, 0–9</dd><dt>Source</dt><dd>GFZ Potsdam via SWPC</dd><dt>Cadence</dt><dd>3 h</dd></dl>
            <a href="https://www.swpc.noaa.gov/products/planetary-k-index" title="The product page at SWPC">source and attribution →</a>
          </InfoCard>
        {/if}
        <InfoCard summary="what is this datum">
          <p>The <b>X-ray flux</b> of the Sun in the 0.1–0.8 nm band, the basis of the flare classes A to X.</p>
          <dl><dt>Source</dt><dd>GOES via SWPC</dd><dt>Cadence</dt><dd>1 min</dd></dl>
        </InfoCard>
      </div>
    </div>
    <div>
      <h2 class="p-sec-title">Sections</h2>
      <div class="p-card demo">
        <div class="p-inset" style="padding: 0 12px">
          <Section title="Planetary Kp" summary="1.3 · quiet" bind:open={kpOpen}>
            {#snippet actions()}<Button variant="icon" size="sm" title="What is Kp">i</Button>{/snippet}
            <KeyValue label="Now" tone="ok">1.3</KeyValue>
            <KeyValue label="Forecast 3 h">2.0</KeyValue>
          </Section>
          <Section title="Solar wind" summary="412 km/s · Bz −3 nT" summaryTitle="Speed and Bz now at L1: the summary reads by itself, the title explains it" open={false}>
            <KeyValue label="Speed">412 km/s</KeyValue>
          </Section>
          <Section title="Active regions" summary="4 regions · largest 3914">
            <Notice kind="empty" title="No region with flare potential" compact />
          </Section>
        </div>
        <span class="p-t12 p-dim">Kp section: <span class="p-mono p-hi">{kpOpen ? 'open' : 'closed'}</span> (state owned by the page)</span>
      </div>
    </div>
    <div>
      <h2 class="p-sec-title">Console rows</h2>
      <div class="p-card demo">
        <ControlRow label="Auroral oval (OVATION)" help title="Probability of seeing the aurora, point by point on the globe">
          <Button variant="icon" size="sm" aria-label="What is this datum">i</Button>
          <Toggle checked label="Auroral oval" />
        </ControlRow>
        <ControlRow label="Thermospheric density at 400 km (WAM-IPE): a long name that does not fit" tone="dim">
          <Toggle label="Thermospheric density" />
        </ControlRow>
        <div class="p-inset rows">
          <SettingRow label="Orbit lines">
            {#snippet icon()}<span class="p-dot accent"></span>{/snippet}
            <Toggle checked label="Orbit lines" />
          </SettingRow>
          <SettingRow label="Starlink" help title="Constellation, 11 877 objects in the catalog">
            {#snippet icon()}<span class="p-dot"></span>{/snippet}
            <Chip count>1,000</Chip>
            <Toggle label="Starlink" />
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

  <section class="grid2">
    <div>
      <h2 class="p-sec-title">List · framed items</h2>
      <div class="p-card demo">
        <List label="Map layers">
          <ListItem label="Auroral oval (OVATION)" help title="Probability of seeing the aurora, point by point on the globe" data-product="ovation">
            {#snippet controls()}
              <InfoButton active={ovationInfo} controls="ovation-info" onclick={() => { ovationInfo = !ovationInfo }} />
              <Toggle bind:checked={ovationOn} label="Auroral oval" />
            {/snippet}
            {#if ovationInfo}
              <InfoCard id="ovation-info" label="About the auroral oval" onclose={() => { ovationInfo = false }}>
                <p>The <b>OVATION</b> model turns the solar wind into the probability of seeing the aurora overhead, on a 1° grid.</p>
                <dl><dt>Source</dt><dd>NOAA SWPC</dd><dt>Cadence</dt><dd>5 min</dd></dl>
              </InfoCard>
            {/if}
            {#if ovationOn}
              <Legend gradient="linear-gradient(90deg,#0b1220,#15803d,#a3e635,#fde68a)" min="0" max="100" unit="%" />
              <MetaRow>
                <span title="Observation time at the source">data from 8 min ago</span>
                <span title="Below this threshold the layer is transparent">transparent below 10 %</span>
              </MetaRow>
              <MetaRow>
                <span>aurora down to <b>58° N</b></span>
                <Segmented size="sm" label="Rendering of the oval" items={[{ id: 'ground', label: 'on ground' }, { id: 'lifted', label: 'lifted' }]} value="lifted" />
              </MetaRow>
            {/if}
          </ListItem>
          <ListItem label="Total electron content (TEC)">
            {#snippet controls()}<Toggle bind:checked={tecOn} label="Total electron content" />{/snippet}
            {#if tecOn}
              <Legend gradient="linear-gradient(90deg,#1d4ed8,#0b1220,#dc2626)" min="−15" max="+15" unit="TECU" />
              <MetaRow><span>data from 12 min ago</span><span>at the point <b>+4.2 TECU</b></span></MetaRow>
            {/if}
          </ListItem>
          <ListItem label="Thermospheric density at 400 km (WAM-IPE): a long name that does not fit" title="Thermospheric density at 400 km (WAM-IPE)">
            {#snippet controls()}<Toggle label="Thermospheric density" />{/snippet}
          </ListItem>
          {#snippet footer()}Space weather data: NOAA SWPC · WAM-IPE{/snippet}
        </List>
        <span class="p-t11 p-dim">The body shows while the layer is on: the page decides, with its own <span class="p-mono">if</span>.</span>
      </div>
    </div>
    <div>
      <h2 class="p-sec-title">List · items without a head, states</h2>
      <div class="p-card demo">
        <List label="Particles">
          <ListItem>
            <div class="metric">
              <span title="Protons of 10 MeV and more at geostationary orbit">protons ≥10 MeV <b class="p-mono p-hi">0.42</b> <span class="p-dim">pfu</span></span>
              <Chip tone={scaleTone(0)}>S0</Chip>
            </div>
            <Sparkline values={xray} label="Protons of 10 MeV and more, last 24 h" width={220} height={30} color="var(--p-warn)" />
            <MetaRow><Age updatedAt={now - 4 * MIN} staleAfter={10 * MIN} /><span>max 24 h <b>0.9 pfu</b></span></MetaRow>
          </ListItem>
          <ListItem label="Magnetosphere field lines">
            {#snippet controls()}<Toggle checked label="Magnetosphere field lines" />{/snippet}
            <Skeleton lines={2} compact label="Loading the field lines" />
          </ListItem>
          <ListItem label="Magnetic references">
            {#snippet controls()}<Toggle checked label="Magnetic references" />{/snippet}
            <MetaRow><Status kind="error" text="unavailable" title="The model manifest is missing" /></MetaRow>
          </ListItem>
        </List>
        <Notice kind="empty" title="No layer available" text="An empty list gives way to a Notice" compact />
      </div>
    </div>
    <div>
      <h2 class="p-sec-title">Drawer</h2>
      <div class="p-card demo stage drawer-stage">
        <div class="row-wrap drawer-controls">
          <Button id="open-demo-drawer" variant="secondary" size="sm" onclick={() => { drawerOpen = true }}>open the drawer</Button>
          <Segmented size="sm" label="Drawer mode" items={[{ id: 'modal', label: 'modal', title: 'Over the stage with a scrim: a phone, a short screen' }, { id: 'column', label: 'column', title: 'A column beside the stage that the user retracts' }]} bind:value={drawerMode} />
        </div>
        <Drawer open={drawerOpen} modal={drawerMode === 'modal'} label="Console" opener="open-demo-drawer" onclose={() => { drawerOpen = false }} class="demo-drawer">
          <PanelHead title="Console" subtitle="tracking" onclose={() => { drawerOpen = false }} />
          <div class="drawer-body">
            <SettingRow label="Orbit lines"><Toggle checked label="Orbit lines" /></SettingRow>
            <SettingRow label="Labels"><Toggle label="Labels" /></SettingRow>
            <SettingRow label="Starlink" help title="Constellation, 11 877 objects in the catalog"><Chip count>1,000</Chip><Toggle label="Starlink" /></SettingRow>
          </div>
        </Drawer>
        <span class="p-t11 p-dim drawer-note">The page owns open and closed. Modal: the scrim and <Kbd>Esc</Kbd> close it, <Kbd>Tab</Kbd> stays inside, focus goes back to the button.</span>
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
  .ramps { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px 32px; align-items: start; }
  .ramp { display: flex; flex-direction: column; gap: 4px; }
  .ramp-row { display: flex; gap: 4px; }
  .chart-demo { grid-row: 1 / span 3; grid-column: 2; padding: 12px; display: flex; flex-direction: column; gap: 8px; align-items: flex-start; }
  .cells { display: flex; gap: 2px; }
  .chart-row { display: flex; align-items: center; gap: 12px; }
  .cells i { display: inline-block; width: 28px; height: 12px; border-radius: 2px; }
  .type { padding: 4px 16px; }
  .type-row { display: grid; grid-template-columns: 120px 1fr; gap: 16px; align-items: baseline; padding: 8px 0; }
  .type-row + .type-row { border-top: 1px solid var(--p-border); }
  .demo { padding: 16px; display: flex; flex-direction: column; gap: 12px; }
  .row-wrap { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
  .metric { display: flex; align-items: center; justify-content: space-between; gap: 8px; font-size: var(--p-t12); }
  .stats { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 8px; }
  .body { padding: 12px 14px; }
  .stage { position: relative; min-height: 280px; margin-bottom: 24px; background: radial-gradient(circle at 30% 40%, var(--p-s3) 0, var(--p-bg) 70%); }
  /* A single class, as an app should: the package rule under 700 px must win */
  :global(.demo-floating) { position: absolute; top: 16px; right: 16px; width: 300px; }
  .stage-note { position: absolute; left: 16px; bottom: 12px; }
  /* The drawer slides out of the stage: the stage clips it, as an app's container does */
  .drawer-stage { overflow: hidden; }
  .drawer-controls, .drawer-note { position: relative; max-width: 60ch; }
  :global(.demo-drawer) { width: min(86%, 280px); }
  .drawer-body { display: flex; flex-direction: column; padding: 4px 0; overflow-y: auto; }
  @media (max-width: 900px) { .grid2 { grid-template-columns: minmax(0, 1fr); } .swatches { grid-template-columns: repeat(3, minmax(0, 1fr)); } }
  /* A phone: one column everywhere, a 16 px gutter, the header stacked, and
     no grid track wider than the screen (minmax(0, 1fr), never a bare 1fr,
     or a nowrap label pushes the whole page out) */
  @media (max-width: 700px) {
    main { padding: 24px 16px 48px; gap: 24px; }
    .head { flex-direction: column; gap: 12px; }
    .head-ctl { justify-content: flex-start; max-width: none; }
    .swatches { grid-template-columns: repeat(2, minmax(0, 1fr)); }
    .ramps { grid-template-columns: minmax(0, 1fr); }
    .chart-demo { grid-row: auto; grid-column: auto; align-items: stretch; }
    .cells { flex: 1; min-width: 0; }
    .cells i { flex: 1; min-width: 0; width: auto; }
    .stats { grid-template-columns: repeat(2, minmax(0, 1fr)); }
    .type-row { grid-template-columns: minmax(0, 1fr); gap: 2px; }
    /* The panel is a sheet at the bottom of the stage: the note moves up */
    .stage { min-height: 380px; }
    .stage-note { top: 12px; bottom: auto; }
  }
</style>
