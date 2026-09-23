<script lang="ts">
  /**
   * plancia-ui recipes: compositions built only from the package, each one
   * a file of its own that runs here and whose source is printed under it
   * (`?raw`), so the code to copy is always the code that runs. The phone
   * layout needs a phone-sized viewport for its media queries: on a wide
   * screen it runs in a 390 px frame, on a phone it opens full screen.
   */
  import { LiveRegion, Segmented, Tooltip, applyTheme, readRequestedTheme, readStoredTheme, rememberTheme, type Theme } from 'plancia-ui'
  import { THEME_STORAGE_KEY } from './config'
  import RecipeCode from './RecipeCode.svelte'
  import ConsoleSection from './recipes/ConsoleSection.svelte'
  import LayerList from './recipes/LayerList.svelte'
  import LayerRows from './recipes/LayerRows.svelte'
  import PanelOverStage from './recipes/PanelOverStage.svelte'
  import phoneLayoutSource from './recipes/PhoneLayout.svelte?raw'
  import consoleSectionSource from './recipes/ConsoleSection.svelte?raw'
  import layerListSource from './recipes/LayerList.svelte?raw'
  import layerRowsSource from './recipes/LayerRows.svelte?raw'
  import panelOverStageSource from './recipes/PanelOverStage.svelte?raw'

  let theme = $state<Theme>(readRequestedTheme() ?? readStoredTheme(THEME_STORAGE_KEY))
  $effect(() => { applyTheme(theme) })
</script>

<svelte:head><title>plancia-ui · recipes</title></svelte:head>

<Tooltip avoid=".p-floating" />
<LiveRegion />

<main>
  <header class="head">
    <div>
      <h1>Recipes</h1>
      <p class="p-dim p-t13">Compositions built only from the package, live and with their code: what an app, or an agent, copies. The state is always the app's; the package gives the shapes.</p>
      <p class="p-dim p-t12 links"><a href="./">Components</a> · <a href="https://github.com/Tabrigos/plancia-ui">GitHub</a> · <a href="https://github.com/Tabrigos/plancia-ui/blob/main/skills/plancia-ui/SKILL.md">the skill for agents</a></p>
    </div>
    <div class="head-ctl">
      <span class="p-t12 p-dim">theme</span>
      <Segmented items={[{ id: 'dark', label: 'dark' }, { id: 'light', label: 'light' }]} bind:value={theme} onchange={(id) => rememberTheme(id as Theme, THEME_STORAGE_KEY)} label="Theme" />
    </div>
  </header>

  <section>
    <h2 class="p-sec-title">Phone layout · a drawer and one sheet at a time</h2>
    <p class="p-dim p-t12 note">The stage takes the screen, a pill keeps the few controls at hand, the navigation is a modal <span class="p-mono">Drawer</span>, the content comes up in bottom sheets, one at a time; a choice made in the drawer that opens a sheet closes the drawer. Wider than 700 px, the same code gives a column and floating panels.</p>
    <div class="phone">
      <div class="device"><iframe src="?only=phone&theme={theme}" title="The phone layout recipe, at the width of a phone" loading="lazy"></iframe></div>
      <a class="device-link" href="?only=phone&theme={theme}">Open the phone layout full screen</a>
      <RecipeCode label="PhoneLayout.svelte" source={phoneLayoutSource} />
    </div>
  </section>

  <section class="grid2">
    <div>
      <h2 class="p-sec-title">Console section · a reading, rows, a chart</h2>
      <div class="p-card demo"><div class="p-inset section-frame"><ConsoleSection /></div></div>
      <RecipeCode label="ConsoleSection.svelte" source={consoleSectionSource} />
    </div>
    <div>
      <h2 class="p-sec-title">Layers with details · a list and its states</h2>
      <div class="p-card demo"><LayerList /></div>
      <RecipeCode label="LayerList.svelte" source={layerListSource} />
    </div>
    <div>
      <h2 class="p-sec-title">Layer rows · many layers, one line each</h2>
      <div class="p-card demo"><LayerRows /></div>
      <RecipeCode label="LayerRows.svelte" source={layerRowsSource} />
    </div>
    <div>
      <h2 class="p-sec-title">Panel over a stage · whole</h2>
      <div class="p-card demo"><PanelOverStage /></div>
      <RecipeCode label="PanelOverStage.svelte" source={panelOverStageSource} />
    </div>
  </section>
</main>

<style>
  main { max-width: 1240px; margin: 0 auto; padding: 32px 24px 64px; display: flex; flex-direction: column; gap: 32px; }
  .head { display: flex; align-items: flex-start; justify-content: space-between; gap: 24px; }
  .head-ctl { display: flex; align-items: center; gap: 10px; }
  h1 { margin: 0 0 4px; font-size: var(--p-t28); font-weight: 600; color: var(--p-text-hi); letter-spacing: -0.02em; }
  h2 { margin: 0 0 12px; }
  p { margin: 0; }
  .links { margin-top: 4px; }
  .note { margin: -4px 0 12px; max-width: 80ch; }
  section { display: flex; flex-direction: column; }
  .grid2 { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 32px; align-items: start; }
  .grid2 > div { display: flex; flex-direction: column; gap: 12px; min-width: 0; }
  .demo { padding: 16px; }
  .section-frame { padding: 0 12px; }
  .phone { display: grid; grid-template-columns: 390px minmax(0, 1fr); gap: 32px; align-items: start; }
  .device { width: 390px; height: 760px; overflow: hidden; border: 1px solid var(--p-border-strong); border-radius: var(--p-r3); box-shadow: var(--p-sh2); }
  .device iframe { display: block; width: 100%; height: 100%; border: 0; }
  .device-link { display: none; }
  @media (max-width: 900px) {
    .grid2, .phone { grid-template-columns: minmax(0, 1fr); }
  }
  /* A phone has no room for a phone-sized frame: the recipe opens full screen */
  @media (max-width: 700px) {
    main { padding: 24px 16px 48px; gap: 24px; }
    .head { flex-direction: column; gap: 12px; }
    .device { display: none; }
    .device-link { display: inline-flex; align-items: center; min-height: var(--p-control-h); }
  }
</style>
