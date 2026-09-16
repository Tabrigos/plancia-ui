<script lang="ts">
  /**
   * Vetrina di plancia-ui: ogni componente in ogni stato, con i token.
   * Nata come pagina /plancia di Sidereus; dal 2026-09-16 vive qui, nel repo
   * del pacchetto, e legge i sorgenti di ../src (alias in vite.config.ts).
   */
  import { Button, Chip, ControlRow, KeyValue, Legend, LegendDots, MetaRow, Notice, PanelHead, Segmented, SettingRow, Skeleton, Stat, Toggle, scaleTone } from 'plancia-ui'
  import tokens from 'plancia-ui/tokens.json'
  import { version } from '../../package.json'

  import { applyTheme, readStoredTheme, rememberTheme, type Theme } from './theme'

  let mode = $state('tracking')
  let on = $state(true)
  let density = $state<'compact' | 'comfortable'>('compact')
  // Preferenza `plancia.theme`: la vetrina è il posto dove si prova il tema.
  let theme = $state<Theme>(readStoredTheme())
  $effect(() => { applyTheme(theme); rememberTheme(theme) })
  const colors = Object.entries(tokens.color as Record<string, string>)
  const lightColors = tokens.light.color as Record<string, string>
  const sizes = Object.entries(tokens.size as Record<string, string>)
</script>

<svelte:head><title>plancia-ui · componenti</title></svelte:head>

<main data-density={density}>
  <header class="head">
    <div>
      <h1>plancia-ui</h1>
      <p class="p-dim p-t13">Tema "plancia": token, stili base e componenti Svelte 5. Versione {version}</p>
    </div>
    <div class="head-ctl">
      <span class="p-t12 p-dim">tema</span>
      <Segmented items={[{ id: 'dark', label: 'scuro' }, { id: 'light', label: 'chiaro' }]} bind:value={theme} label="Tema" />
      <span class="p-t12 p-dim">densità</span>
      <Segmented items={[{ id: 'compact', label: 'compatta' }, { id: 'comfortable', label: 'comoda' }]} bind:value={density} label="Densità" />
    </div>
  </header>

  <section>
    <h2 class="p-sec-title">Colori · scuro e chiaro</h2>
    <p class="p-dim p-t12 sw-note">Stesse variabili nei due temi: il chiaro ridefinisce ogni <span class="p-mono">--p-*</span> di colore sotto <span class="p-mono">[data-theme="light"]</span>; tipografia, spazi, raggi e movimento non cambiano. Casella a sinistra il valore scuro, a destra il chiaro.</p>
    <div class="swatches">
      {#each colors as [name, value] (name)}
        <div class="sw">
          <div class="sw-pair"><div class="sw-box" style="background:{value}"></div><div class="sw-box" style="background:{lightColors[name]}"></div></div>
          <span class="p-mono p-t11 p-hi">--p-{name}</span><span class="p-mono p-t11 p-dim">{value} · {lightColors[name]}</span>
        </div>
      {/each}
    </div>
    <div class="scale-row">
      <span class="p-t11 p-dim">rampa delle scale NOAA (--p-scale-0..5, segue il tema)</span>
      {#each [0, 1, 2, 3, 4, 5] as level (level)}<i class="scale-box" style="background:var(--p-scale-{level})" title="--p-scale-{level}"></i>{/each}
    </div>
  </section>

  <section>
    <h2 class="p-sec-title">Tipografia</h2>
    <div class="p-card type">
      {#each sizes as [name, px] (name)}
        <div class="type-row"><span class="p-mono p-t11 p-dim">{name} · {px}</span><span class="p-hi" style="font-size:{px}">Stazioni spaziali · 2026-09-10 21:26 UTC</span></div>
      {/each}
    </div>
  </section>

  <section class="grid2">
    <div>
      <h2 class="p-sec-title">Bottoni</h2>
      <div class="p-card demo">
        <div class="row-wrap">
          <Button variant="primary">Segui satellite</Button>
          <Button variant="secondary">vista transito</Button>
          <Button variant="quiet">mostra tutti</Button>
          <Button variant="icon" title="Impostazioni">⚙</Button>
          <Button variant="primary" disabled>disabilitato</Button>
          <Button variant="secondary" active>attivo</Button>
        </div>
        <div class="row-wrap">
          <Button variant="primary" size="sm">primario sm</Button>
          <Button variant="secondary" size="sm">secondario sm</Button>
          <Button variant="quiet" size="sm">silenzioso sm</Button>
          <Button variant="icon" size="sm" title="Chiudi">×</Button>
        </div>
      </div>
    </div>
    <div>
      <h2 class="p-sec-title">Toggle · Chip</h2>
      <div class="p-card demo">
        <div class="row-wrap">
          <Toggle bind:checked={on} label="Layer di prova" /><span class="p-t12 p-dim">{on ? 'acceso' : 'spento'}</span>
          <Toggle checked={true} disabled label="Disabilitato acceso" />
          <Toggle checked={false} disabled label="Disabilitato spento" />
        </div>
        <div class="row-wrap">
          <Chip>neutro</Chip><Chip tone="accent">304 Å</Chip><Chip tone="ok">G0</Chip><Chip tone="warn">G2</Chip><Chip tone="orange">G3</Chip><Chip tone="danger">G5</Chip><Chip tone="info">info</Chip><Chip count>235</Chip><Chip color="#a3e635">NOVITÀ</Chip>
        </div>
        <div class="row-wrap">
          {#each [0, 1, 2, 3, 4, 5] as level (level)}<Chip tone={scaleTone(level)}>R{level}</Chip>{/each}
          <span class="p-t11 p-dim">scaleTone(livello)</span>
        </div>
      </div>
    </div>
  </section>

  <section class="grid2">
    <div>
      <h2 class="p-sec-title">Righe etichetta / valore · Statistiche</h2>
      <div class="p-card demo">
        <div class="p-inset" style="padding:4px 12px">
          <KeyValue label="Aria a 547 km" sub="−34 % sulla mediana globale">0.21 ng/m³</KeyValue>
        <KeyValue label="Aria a 35781 km">fuori dal modello (100–1000 km)</KeyValue>
          <KeyValue label="Lancio" sub="Andøya · operatore da assegnare">5 set</KeyValue>
          <KeyValue label="Radiazione" tone="ok">fuori da SAA e ovale</KeyValue>
          <KeyValue label="Enlil" tone="warn">run ambientale · 17 h</KeyValue>
        </div>
        <div class="stats">
          <Stat label="Latitudine">41.9012°</Stat>
          <Stat label="Altitudine">420.6 km</Stat>
          <Stat label="Velocità">7.36 km/s</Stat>
          <Stat label="Kp" tone="ok" sub="quiete">1.3</Stat>
        </div>
      </div>
    </div>
    <div>
      <h2 class="p-sec-title">Testa di pannello</h2>
      <div class="p-card demo">
        <div class="p-panel">
          <PanelHead title="Sole adesso" subtitle="304 Å · 3 min fa" onclose={() => {}}>
            {#snippet actions()}<Button variant="icon" size="sm" title="Informazioni">i</Button>{/snippet}
          </PanelHead>
          <div class="body p-dim p-t12">corpo</div>
        </div>
        <div class="p-panel">
          <PanelHead title="ISS (ZARYA)" onclose={() => {}}>
            {#snippet chips()}<Chip tone="accent">STAZIONI</Chip><Chip>NORAD 25544</Chip>{/snippet}
          </PanelHead>
          <div class="body p-dim p-t12">corpo</div>
        </div>
        <div class="p-panel">
          <PanelHead title="Transito CME" subtitle="Sole → Terra" onclose={() => {}}>
            {#snippet actions()}<Button variant="secondary" size="sm">Sole</Button><Button variant="secondary" size="sm">vista</Button>{/snippet}
          </PanelHead>
          <div class="body p-dim p-t12">corpo</div>
        </div>
      </div>
    </div>
  </section>

  <section class="grid2">
    <div>
      <h2 class="p-sec-title">Stati</h2>
      <div class="p-card demo">
        <Skeleton lines={3} />
        <Notice kind="empty" title="Nessuna CME rilevante in volo" text="3 lente o non verso la Terra · dato di 4 min fa" />
        <Notice kind="info" title="Il run Enlil segue il fotogramma dell'Eliosfera" />
        <Notice kind="warn" title="Run Enlil ambientale: nessuna CME inserita" />
        <Notice kind="error" title="Eventi DONKI non disponibili"><Button variant="quiet" size="sm">riprova</Button></Notice>
      </div>
    </div>
    <div>
      <h2 class="p-sec-title">Legenda · Riga meta · Segmentato</h2>
      <div class="p-card demo">
        <Legend gradient="linear-gradient(90deg,#0f172a,#7e22ce,#f97316,#fde68a)" min="0" max="35" unit="MHz" />
        <MetaRow>
          <span title="Ora di osservazione alla fonte">dato di 8 min fa</span>
          <span title="Sotto questa soglia il layer è trasparente">trasparente sotto 1 MHz</span>
        </MetaRow>
        <Legend gradient="linear-gradient(90deg,#1d4ed8,#0b1220,#dc2626)" min="−15" max="+15" unit="TECU" />
        <MetaRow>
          <span>dato di 12 min fa</span>
          <span>≥100 MeV <b>0.4 pfu</b></span>
          <Segmented size="sm" label="Resa" items={[{ id: 'ground', label: 'a terra' }, { id: 'lifted', label: 'sollevato' }]} value="lifted" />
        </MetaRow>
        <Segmented items={[{ id: 'tracking', label: 'Tracking' }, { id: 'spaceweather', label: 'Space Wx' }, { id: 'system', label: 'Sistema' }]} bind:value={mode} label="Modalità" />
        <span class="p-t12 p-dim">modalità: <span class="p-mono p-hi">{mode}</span></span>
      </div>
    </div>
  </section>

  <section class="grid2">
    <div>
      <h2 class="p-sec-title">Righe di console</h2>
      <div class="p-card demo">
        <ControlRow label="Ovale aurorale (OVATION)" help title="Probabilità di vedere l'aurora, punto per punto sul globo">
          <Button variant="icon" size="sm" aria-label="Cos'è questo dato">i</Button>
          <Toggle checked />
        </ControlRow>
        <ControlRow label="Densità termosferica a 400 km (WAM-IPE): un nome lungo che non entra" tone="dim">
          <Toggle />
        </ControlRow>
        <div class="p-inset rows">
          <SettingRow label="Linee orbitali">
            {#snippet icon()}<span class="p-dot accent"></span>{/snippet}
            <Toggle checked />
          </SettingRow>
          <SettingRow label="Starlink" help title="Costellazione, 11 877 oggetti a catalogo">
            {#snippet icon()}<span class="p-dot"></span>{/snippet}
            <Chip count>1.000</Chip>
            <Toggle />
          </SettingRow>
        </div>
      </div>
    </div>
    <div>
      <h2 class="p-sec-title">Legenda a pallini</h2>
      <div class="p-card demo">
        <LegendDots label="Colori delle linee di campo" items={[
          { color: '#38bdf8', label: 'chiuse' },
          { color: '#fbbf24', label: 'aperte' },
          { color: '#a78bfa', label: 'coda' },
          { color: '#94a3b8', label: 'magnetopausa' },
          { color: '#ef4444', label: 'contorno SAA (tratteggiato)', opacity: 0.7, title: 'Dal modello IGRF-14' },
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
