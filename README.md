# plancia-ui

Tema "plancia" — la sala di comando di una nave — per console dense e scure:
token, stili base e componenti Svelte 5. Nato dal cockpit "mission control"
di Sidereus; pensato per essere riusato in altri progetti.

## Tre strati

1. **Token** (`plancia-ui/tokens.css`, generato da `src/tokens.json` con
   `npm run tokens`): variabili CSS `--p-*` — superfici a livelli, testo,
   colori semantici con varianti `-soft` e `-glow`, tipografia (scala a 7
   corpi, minimo 11 px), spaziatura a 4 px, raggi, ombre, z-index nominati,
   movimento. Usabili in qualunque progetto, anche senza Svelte. Due
   densità (`data-density="comfortable"` sull'elemento radice) e il posto
   per il tema chiaro (`data-theme="light"`, ancora vuoto per scelta).
2. **Stili base** (`plancia-ui/base.css`): reset minimo, tipografia,
   classi delle superfici (`p-panel`, `p-card`, `p-inset`), titolo di
   sezione (`p-sec-title`: l'unico uso del maiuscolo spaziato), utilità di
   testo (`p-mono`, `p-dim`, `p-hi`, `p-t11`…`p-t28`, `p-nowrap`,
   `p-ellipsis`), `p-help` (cursore da spiegazione, va con un `title`),
   `p-sr-only` (visibile solo agli screen reader), anello di focus,
   `prefers-reduced-motion`.
3. **Componenti Svelte 5** (ognuno con il suo CSS scoped, solo token):

   | Componente | A cosa serve | Prop principali |
   |---|---|---|
   | `Button` | azioni | `variant` primary · secondary · quiet · icon, `size` md · sm, `active`, più gli attributi nativi (`title`, `disabled`, `id`, `onclick`) |
   | `Chip` | stato, scala, banda, contatore | `tone` neutral · accent · ok · warn · orange · danger · info, `count`, `small`, `color` (colore libero, es. quello di un gruppo) |
   | `Toggle` | interruttore accessibile (vero checkbox) | `checked` bindabile, `disabled`, `label`, `title`, `onchange(v)` |
   | `KeyValue` | riga etichetta / valore | `label`, `sub` (seconda riga secondaria), `subTone`, `tone`, `title`, `id`; il valore è il contenuto |
   | `Stat` | numero grande con etichetta | `label`, `unit`, `id`; il valore è il contenuto |
   | `PanelHead` | testa di un pannello flottante | `title`, `subtitle`, `subtitleTitle`, snippet `chips` e `actions`, `onclose`, `closeLabel` |
   | `Skeleton` | attesa | `lines` |
   | `Notice` | stati vuoto / info / avviso / errore | `kind` empty · info · warn · error, `title`, `text`, `compact`; il contenuto è l'azione a destra |
   | `Legend` | legenda di un layer a gradiente | `gradient` (CSS), `min`, `max`, `unit`, `note` |
   | `MetaRow` | riga di metadati sotto una card (età del dato, soglie, note, piccole azioni) | `align` between · start; le voci sono il contenuto, ognuna con il suo `title`; un `<b>` è il valore in evidenza |
   | `Segmented` | scelta esclusiva fra poche voci | `items` `{ id, label, title? }`, `value` bindabile, `onchange(id)`, `label`, `size` md · sm (pillola in linea) |
   | `ControlRow` | testa di una scheda: etichetta a sinistra, comandi a destra | `label`, `title`, `help` (cursore da spiegazione), `tone` hi · dim; i comandi sono il contenuto |
   | `SettingRow` | riga di elenco di una console: icona, nome, comando | `label`, `title`, `help`, snippet `icon`, più gli attributi propri (`data-*`, `id`); il comando è il contenuto |
   | `LegendDots` | legenda a pallini di ciò che è disegnato altrove (globo, canvas) | `items` `{ color, label, opacity?, title? }`, `label` del gruppo |

   Più `scaleTone(level)`: il tono semantico dei livelli delle scale NOAA
   (R/S/G 0–5), da passare a `Chip`.

## Uso in un progetto

1. **Installare**. Finché il pacchetto non è su npm, dipendenza locale
   (`"plancia-ui": "file:../packages/plancia-ui"` in `package.json`, poi
   `npm install`: npm crea un link). Il pacchetto espone i sorgenti Svelte
   (`svelte` in `exports`), quindi il progetto deve avere `svelte` ≥ 5 e
   `@sveltejs/vite-plugin-svelte`; con `svelte-check` va aggiunto in
   `tsconfig` `"paths": { "svelte/*": ["./node_modules/svelte/*"] }` e i
   sorgenti del pacchetto in `include`, e in Vite `server.fs.allow: ['..']`
   se il pacchetto sta fuori dalla radice del progetto. In un'immagine
   Docker copiare la cartella del pacchetto prima di `npm ci`.
2. **Caricare i fogli di stile una volta**, nell'entry point, in
   quest'ordine:

   ```ts
   import 'plancia-ui/tokens.css'
   import 'plancia-ui/base.css'
   import './styles/app.css'   // il CSS del progetto: layout e casi propri
   ```

3. **Usare i componenti**:

   ```svelte
   <script lang="ts">
     import { Button, Chip, KeyValue, MetaRow, Notice, scaleTone } from 'plancia-ui'
   </script>

   <KeyValue label="Aria a 547 km" sub="−34 % sulla mediana globale">0.21 ng/m³</KeyValue>
   <Chip tone={scaleTone(2)}>G2</Chip>
   <Button variant="primary" onclick={follow}>Segui satellite</Button>
   <MetaRow>
     <span title="Ora di osservazione alla fonte">dato di 8 min fa</span>
     <span>≥100 MeV <b>0.4 pfu</b></span>
   </MetaRow>
   <Notice kind="warn" title="Fonte non raggiungibile: dati di 40 min fa" />
   ```

4. **Nel CSS del progetto usare i token, mai valori a mano**: colori
   `var(--p-text-dim)`, `var(--p-accent)`, superfici `var(--p-s3a)`,
   bordi `var(--p-border)`, raggi `var(--p-r2)`, ombre `var(--p-sh2)`,
   corpi `var(--p-t12)`. Chi ha già dei token propri può dichiararli come
   alias dei `--p-*` (è quello che fa Sidereus in `styles/tokens.css`) e
   migrare con calma.
5. **Cambiare il tema**: si modifica `src/tokens.json` e si rigenera
   `tokens.css` con `npm run tokens` (nel pacchetto). Densità:
   `<html data-density="comfortable">`. Tema chiaro: il blocco
   `[data-theme="light"]` esiste ed è vuoto, da riempire con gli stessi
   nomi di variabile.
6. **Verificare**: la vetrina `/plancia` di Sidereus
   (`frontend/app/src/pages/PlanciaPage.svelte`) mostra ogni componente
   in ogni stato ed è il posto dove si prova una modifica prima di
   toccare l'app.

## Regole del sistema (dalla revisione del 2026-09-10)

- corpo minimo 11 px; maiuscolo spaziato solo nei titoli di sezione;
- etichetta a sinistra mai a capo, valore in monospazio a destra su una
  riga, eventuale seconda riga secondaria (`sub`); se un valore non entra
  accanto all'etichetta scende su una riga sua, intero: **mai spezzato,
  mai troncato, mai sovrapposto all'etichetta** (`KeyValue` lo fa da sé;
  chi scrive righe proprie usi la stessa regola);
- un chip solo (22 px) per stati, scale e bande; il contatore è la variante
  bassa; un primario per pannello;
- una testa di pannello sola: titolo 14/600, sottotitolo mono facoltativo,
  chip facoltativi, azioni a destra, chiusura sempre ultima;
- stati vuoto / errore / avviso con un solo vocabolario (`Notice`); i
  metadati sotto una card con `MetaRow`; le scelte esclusive con
  `Segmented`;
- ogni elemento interattivo ha il focus visibile; niente movimento con
  `prefers-reduced-motion`;
- niente colori a mano nel CSS del progetto: se manca un token si aggiunge
  a `tokens.json`.

## Cosa NON sta nel pacchetto

Il contenuto: testi, schede informative dei prodotti, attribuzioni delle
fonti, layout del cockpit. Un componente entra nel pacchetto quando la
stessa forma serve in più posti e non sa niente del dominio.

## Stato

0.2.0 (2026-09-11) — token, base, **quattordici componenti**. Sidereus è il
primo consumatore: la migrazione dell'app è finita il 2026-09-10 e la
rifinitura l'11 (diario in `docs/plancia-ui-migrazione.md`).

Dalla 0.1.0: `MetaRow`, `ControlRow`, `SettingRow`, `LegendDots`; `Segmented`
ha la variante `size="sm"` in linea; utilità `p-help` e `p-sr-only`;
`KeyValue` manda a capo il valore che non entra invece di sovrapporlo
all'etichetta; tutta la tipografia dei consumatori passa dalla scala
(`--p-t*`), nessun corpo sotto gli 11 px.

Non ancora pronto per npm: il pacchetto espone i sorgenti invece di un
`dist` costruito con `@sveltejs/package`, e i componenti non hanno test
propri (la garanzia oggi è indiretta, dallo smoke test di Sidereus). Il
lavoro che manca è elencato in `docs/plancia-ui-pubblicazione.md`.
