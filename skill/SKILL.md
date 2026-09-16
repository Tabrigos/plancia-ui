---
name: plancia-ui
description: Usare il design system plancia-ui (token CSS, stili base e componenti Svelte 5 per console dense, tema scuro e chiaro) in un progetto. Da usare quando si costruisce o si ritocca interfaccia in un progetto Svelte 5 che usa plancia-ui, o quando serve scegliere un tema per una console, una dashboard o un pannello di controllo.
---

# plancia-ui — come usarlo in un progetto

Pacchetto npm `plancia-ui` (MIT, Svelte 5). Prima di scrivere codice:
`npm view plancia-ui version` per sapere l'ultima versione, e leggere
`node_modules/plancia-ui/README.md` per la tabella completa delle prop: è la
fonte di verità, questa skill è il riassunto operativo.

## Installare (una volta per progetto)

1. `npm install plancia-ui` (peer: `svelte` ≥ 5; il bundler deve compilare i
   `.svelte`, quindi `@sveltejs/vite-plugin-svelte` o equivalente).
2. Nell'entry point, PRIMA del CSS del progetto e in quest'ordine:
   ```ts
   import 'plancia-ui/tokens.css'
   import 'plancia-ui/base.css'
   import './styles/app.css'
   ```
3. Tema: lo scuro è `:root`; il chiaro si attiva mettendo
   `data-theme="light"` sull'elemento radice PRIMA del mount (il pacchetto
   non lo decide mai). Densità: `data-density="comfortable"` sulla radice o su
   un contenitore.
4. Font: i token nominano Inter (ui) e JetBrains Mono (mono) con fallback di
   sistema; il pacchetto non porta i file dei font, il progetto li carica se
   li vuole.

Non fare un alias verso i sorgenti del pacchetto: il contratto è `dist`.

## Quale componente per quale caso

| Serve… | Usa | Nota |
|---|---|---|
| un'azione | `Button` | `variant` primary · secondary · quiet · icon, `size` md · sm, `active`; un primario per pannello; accetta gli attributi nativi (`onclick`, `title`, `disabled`, `aria-*`) |
| stato, scala, banda, contatore | `Chip` | `tone` neutral · accent · ok · warn · orange · danger · info; `count` per il contatore; `small`; `color` per un colore libero; `scaleTone(livello)` per i livelli NOAA 0–5 |
| interruttore | `Toggle` | `bind:checked`, `label` (nome accessibile), `disabled`, `onchange(v)` |
| riga etichetta / valore | `KeyValue` | `label`, valore come contenuto, `sub` riga secondaria, `tone`/`subTone`, `title` tooltip; l'etichetta non va a capo, il valore lungo scende intero |
| numero grande con etichetta | `Stat` | `label`, `sub`, `tone`; il valore è il contenuto |
| testa di un pannello flottante | `PanelHead` | `title`, `subtitle`, snippet `chips` e `actions`, `onclose` |
| attesa | `Skeleton` | `lines` |
| vuoto / info / avviso / errore | `Notice` | `kind` empty · info · warn · error, `title`, `text`, `compact`; il contenuto è l'azione a destra |
| legenda a gradiente | `Legend` | `gradient` CSS, `min`, `max`, `unit`, `note` |
| legenda a pallini | `LegendDots` | `items` `{ color, label, opacity?, title? }`, `label` |
| metadati sotto una card | `MetaRow` | voci come contenuto, `<b>` per il valore in evidenza, `align` |
| scelta esclusiva | `Segmented` | `items` `{ id, label, title? }`, `bind:value`, `onchange(id)`, `size="sm"` in linea |
| testa di una scheda: etichetta + comandi | `ControlRow` | `label`, `help` + `title`, `tone` hi · dim; i comandi sono il contenuto |
| riga di elenco: icona, nome, comando | `SettingRow` | `label`, snippet `icon`, comandi come contenuto, inoltra `data-*` e `id` |

Classi di `base.css`: `p-panel`, `p-card`, `p-inset` (superfici),
`p-sec-title` (titolo di sezione, l'unico maiuscolo spaziato), `p-mono`,
`p-dim`, `p-hi`, `p-t11`…`p-t28` (corpi), `p-nowrap`, `p-ellipsis`, `p-help`,
`p-sr-only`.

## Un pannello tipo (Svelte 5)

```svelte
<script lang="ts">
  import { Button, Chip, KeyValue, MetaRow, Notice, PanelHead, Segmented, Toggle } from 'plancia-ui'
  let { onclose }: { onclose: () => void } = $props()
  let vista = $state('mappa')
  let seguiOggetto = $state(true)
</script>

<section class="p-panel">
  <PanelHead title="ISS (ZARYA)" subtitle="NORAD 25544" {onclose}>
    {#snippet chips()}<Chip tone="accent">STAZIONI</Chip>{/snippet}
    {#snippet actions()}<Button variant="icon" size="sm" title="Informazioni">i</Button>{/snippet}
  </PanelHead>

  <div class="p-inset" style="padding: 4px 12px">
    <KeyValue label="Altitudine">420.6 km</KeyValue>
    <KeyValue label="Aria a 420 km" sub="−34 % sulla mediana" subTone="warn">0.21 ng/m³</KeyValue>
  </div>

  <MetaRow>
    <span title="Ora del dato alla fonte">dato di 8 min fa</span>
    <Segmented size="sm" label="Vista" items={[{ id: 'mappa', label: 'mappa' }, { id: 'lista', label: 'lista' }]} bind:value={vista} />
    <Toggle bind:checked={seguiOggetto} label="Segui l'oggetto" />
  </MetaRow>

  <Notice kind="warn" title="Fonte non raggiungibile: dati di 40 min fa">
    <Button variant="quiet" size="sm">riprova</Button>
  </Notice>
</section>
```

## Regole che il progetto deve rispettare

- nel CSS del progetto solo token: `var(--p-text-dim)`, `var(--p-accent)`,
  `var(--p-s3a)`, `var(--p-border)`, `var(--p-r2)`, `var(--p-sh2)`,
  `var(--p-t12)`; mai un colore o un corpo scritto a mano, mai testo sotto gli
  11 px; una trasparenza è `color-mix(in srgb, var(--p-ok) 35%, transparent)`;
- chi ha già token propri li dichiara alias dei `--p-*` e migra con calma;
- maiuscolo spaziato solo con `p-sec-title`; un chip solo per stato; un
  primario per pannello; una testa di pannello sola;
- stati vuoto/errore/avviso solo con `Notice`; metadati con `MetaRow`;
  scelte esclusive con `Segmented`;
- un componente del progetto tiene il suo `<style>` scoped; il CSS globale
  resta per layout e per il DOM che non si controlla;
- ciò che disegna su un `<canvas>` o in un motore 3D non legge le custom
  property: decide da sé se seguire il tema (di solito resta scuro).

## Verificare

`svelte-check` pulito; guardare la pagina nei due temi (`data-theme="light"`
sulla radice) e, se il progetto le usa, nelle due densità. Se qualcosa manca
nel pacchetto (un componente, un token), NON si ricostruisce nel progetto: si
apre una issue o una PR su plancia-ui seguendo il suo `AGENTS.md`.
