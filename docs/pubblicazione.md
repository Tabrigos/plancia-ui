# plancia-ui — che cosa manca per pubblicarlo su npm

Stato: **PUBBLICATO** — `plancia-ui@0.3.0` su npm il 2026-09-14 alle 09:31
UTC (37 file, 62 kB scompattati, maintainer `tabrigos` con il recapito del
progetto). Il nome è quindi riservato: su npm lo si riserva SOLO
pubblicando. Fatti i punti 1 e 3 sotto: `@sveltejs/package` con `dist/`, `exports` puntati a `dist`,
`prepublishOnly`, `LICENSE`, `CHANGELOG.md`, versione 0.3.0, `sideEffects`
per i CSS, `publishConfig.access: public`. L'app NON consuma `dist`: alias
verso `src/` in `vite.config.ts`, `vitest.config.ts` e `paths` in
`tsconfig.app.json`, così Dockerfile e dev server restano com'erano (e
`.dockerignore` esclude `packages/*/dist` e `packages/*/node_modules`).
Restano il punto 2 (test dei componenti) e il job CI: non bloccano.
**Come si pubblica la prossima versione** (imparato il 14/09/2026, alla
prima): da agosto 2026 npm ha le pubblicazioni *in staging*. Un token
granulare "Read and write (stage only)" NON può creare un pacchetto che
non esiste (`E_STAGE_REQUIRED`): la 0.3.0 è uscita con un token "Read and
write (publish and stage)". Da qui in poi il flusso previsto da npm è
`npm stage publish` col token stage-only e poi l'approvazione della
versione sul sito con il secondo fattore: i token a pubblicazione diretta
vengono ritirati a gennaio 2027, quindi non conviene affezionarsi al
`npm publish` diretto. In ogni caso: alzare la versione in `package.json`
e in `CHANGELOG.md` (una versione pubblicata non si ripubblica: una
correzione è sempre una patch), `npm pack --dry-run` per vedere cosa
parte, il token sta in `~/.npmrc` e mai nel repo.
Il pacchetto vive in questo repo dal 2026-09-16 (prima in
`frontend/packages/plancia-ui` di Sidereus, che ora lo installa da npm); la
migrazione dell'app è finita (`docs/archivio/migrazione.md`). Quello che segue è il lavoro che separa
"pacchetto interno che funziona" da "pacchetto che un altro progetto può
installare".

## 1. Confezionamento (`@sveltejs/package`)

Oggi il `package.json` punta ai **sorgenti**: `"svelte": "./src/index.ts"`.
Funziona perché il consumatore è nello stesso repo e usa Vite con il plugin
Svelte; un progetto qualunque che installa da npm si trova TypeScript non
compilato e nessun tipo `.d.ts` generato.

Da fare:

- aggiungere `@sveltejs/package` (dev) e lo script `"build": "svelte-package
  -i src -o dist"`, che copia i `.svelte` così come sono, compila i `.ts` in
  `.js` e genera i `.d.ts`;
- puntare `exports`/`svelte`/`types` a `dist/` e mettere `dist` in `files`
  (togliendo `src`), con `"sideEffects": ["**/*.css"]`;
- `prepublishOnly` che ricostruisce token e pacchetto (`npm run tokens &&
  npm run build`), così `tokens.css` non parte mai disallineato da
  `tokens.json`;
- decidere se pubblicare con `svelte-package` anche `base.css` e
  `tokens.css` (vanno copiati: sono asset, non moduli);
- `publishConfig.access: "public"` se il nome resta senza scope, oppure
  passare a `@guerrera/plancia-ui` (da decidere: `plancia-ui` su npm è
  libero oggi, ma non è riservato).

Attenzione: l'app deve continuare a funzionare durante il passaggio. Il modo
pulito è tenere la dipendenza `file:` puntata alla cartella del pacchetto e
lasciare che Vite risolva `dist` come farebbe npm; se questo complica lo
sviluppo (niente hot reload sui sorgenti del pacchetto) si può aggiungere un
alias in `vite.config.ts` solo in dev.

## 2. Test dei componenti

Oggi i test del repo coprono i moduli puri dell'app (vitest, 103 test) ma
**nessuno dei quattordici componenti del pacchetto**: la garanzia è indiretta
(lo smoke test di Sidereus, che li usa tutti).

Da fare, dentro il pacchetto:

- `vitest` + `@testing-library/svelte` + `jsdom` (o `@vitest/browser` se si
  vuole provare il focus visibile davvero);
- un test per componente sulle cose che il README promette: `Toggle` emette
  `onchange` col nuovo valore ed è un vero checkbox (ruolo, `aria-label`,
  `disabled`); `Button` applica variante, dimensione e `active`
  (`aria-pressed`); `Chip` mappa i toni e la variante contatore; `KeyValue`
  non manda a capo l'etichetta, mostra `sub` e manda a capo intero il valore
  lungo invece di sovrapporlo all'etichetta (regressione vera dell'11/09);
  `Notice` sceglie
  `role="alert"` solo per `error`; `Segmented` cambia valore e marca
  `aria-pressed`; `MetaRow` distribuisce le voci; `Legend` orienta il
  gradiente; `PanelHead` rende chiusura e snippet; `Skeleton` conta le righe;
  `ControlRow` non manda a capo l'etichetta e mette i comandi a destra;
  `SettingRow` non perde la propria classe quando chi lo usa ne passa una
  (regressione vera dell'11/09) e inoltra gli attributi `data-*`;
  `LegendDots` rende un pallino per voce con l'opacità richiesta;
  `scaleTone` copre i cinque livelli NOAA (questo è già puro: test banale).
- un test di regressione dei token: `tokens.css` rigenerato da `tokens.json`
  è identico a quello committato (evita il disallineamento silenzioso).

## 3. Contorno della pubblicazione

- `LICENSE` (MIT, già dichiarata nel `package.json`) come file;
- `CHANGELOG.md` (la 0.2.0 dell'11/09 è già un taglio: va scritta lì) e
  versione `0.3.0` al primo pubblicato su npm;
- README già pronto come guida d'uso (installazione, ordine dei CSS,
  requisiti Svelte 5, token, regole del sistema);
- CI: un job che builda il pacchetto e ne gira i test (questo repo non ha
  ancora un workflow);
- peer dependency `svelte: ^5` già dichiarata; verificare che non finisca
  niente di Sidereus dentro `dist` (il pacchetto non deve conoscere il
  dominio: nessun testo di prodotti, nessuna fonte dati).

## 4. Prima di pubblicare, due decisioni aperte

1. ~~**Nome su npm**~~ — `plancia-ui` nudo (era libero il 2026-09-14; lo
   scope `@tabrigos/plancia-ui` è l'alternativa se qualcuno lo prende prima).
2. ~~**Tema chiaro**~~ — FATTO il 2026-09-14 (versione 0.3.0): il blocco
   `light` di `tokens.json` ridefinisce ogni token di colore, lo script di
   generazione rifiuta una chiave presente da un lato solo, e la vetrina
   `/plancia` mostra le due tavolozze affiancate con il selettore del tema.
   Resta da decidere solo il nome su npm.
