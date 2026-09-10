# plancia-ui

Tema "plancia" — la sala di comando di una nave — per console dense e scure:
token, stili base e componenti Svelte 5. Nato dal cockpit "mission control"
di OrbitView; pensato per essere riusato in altri progetti.

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
   sezione (`p-sec-title`: l'unico uso del maiuscolo spaziato), anello di
   focus, `prefers-reduced-motion`.
3. **Componenti Svelte 5**: `Button`, `Chip`, `Toggle`, `KeyValue`, `Stat`,
   `PanelHead`, `Skeleton`, `Notice`, `Legend`, `Segmented`. Ognuno porta
   il suo CSS scoped e usa solo i token.

## Uso

```ts
import 'plancia-ui/tokens.css'
import 'plancia-ui/base.css'
import { Button, Chip, KeyValue } from 'plancia-ui'
```

```svelte
<KeyValue label="Aria a 547 km" sub="−34 % sulla mediana globale">0.21 ng/m³</KeyValue>
<Chip tone="ok">G0</Chip>
<Button variant="primary" onclick={follow}>Segui satellite</Button>
```

Regole del sistema (dalla revisione del 2026-09-10):

- corpo minimo 11 px; maiuscolo spaziato solo nei titoli di sezione;
- etichetta a sinistra mai a capo, valore in monospazio a destra su una
  riga, eventuale seconda riga secondaria (`sub`);
- un chip solo (22 px) per stati, scale e bande; il contatore è la variante
  bassa; un primario per pannello;
- una testa di pannello sola: titolo 14/600, sottotitolo mono facoltativo,
  chip facoltativi, azioni a destra, chiusura sempre ultima;
- stati vuoto / errore / avviso con un solo vocabolario (`Notice`);
- ogni elemento interattivo ha il focus visibile; niente movimento con
  `prefers-reduced-motion`.

La vetrina dei componenti in ogni stato è la pagina `/plancia` di OrbitView
(`frontend/app/src/pages/PlanciaPage.svelte`).

## Stato

0.1.0 — primo taglio: token, base, dieci componenti. OrbitView è il primo
consumatore e migra pannello per pannello.
