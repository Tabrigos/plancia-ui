# AGENTS.md — entrare nel progetto e svilupparlo

Guida per chi lavora su plancia-ui, agente o persona. Il `README.md` dice
cos'è il pacchetto e come si usa in un progetto; questo file dice come si
modifica, si versiona e si pubblica. Se i due differiscono, vince il codice e
va corretto il documento.

## 1. Che cosa stai toccando

plancia-ui è un design system per console dense, scure per nascita e chiare a
scelta: **token** CSS (`--p-*`), **stili base** (classi `p-*`) e
**quattordici componenti Svelte 5**. Ha un solo peer dependency (`svelte`
≥ 5) e **nessuna dipendenza a runtime**: è una regola, non un caso.

```
src/index.ts              esporta i componenti, i tipi e scaleTone()
src/tokens.json           SORGENTE UNICA dei token, tema scuro + blocco `light`
src/tokens.css            GENERATO da tokens.json (npm run tokens); committato
src/base.css              reset, tipografia, superfici, utilità p-*, focus, reduced-motion
src/components/*.svelte   un componente per file, CSS scoped, solo token
scripts/build-tokens.mjs  il generatore; si ferma se un token manca in un tema
showcase/                 vetrina Vite (ogni componente in ogni stato); legge ../src, non dist
skill/                    la skill per Claude Code (come USARE il pacchetto in un altro progetto)
docs/                     pubblicazione.md + archivio/ (storico, non si aggiorna)
dist/                     output di `npm run build`, ignorato da git: è ciò che va su npm
```

Il codice parla inglese (identificatori, prop, classi CSS) e i commenti, i
documenti e i commit parlano italiano. Non cambiare questa convenzione da
soli: è una decisione di progetto.

## 2. Mettersi al lavoro

```bash
npm ci                      # radice: svelte-package, svelte, typescript
npm run tokens              # tokens.json → src/tokens.css
npm run build               # tokens + svelte-package → dist/
cd showcase && npm install  # una volta
cd showcase && npm run dev  # http://localhost:5174, HMR sui sorgenti del pacchetto
cd showcase && npm run check && npm run build   # svelte-check (copre anche ../src) e build
npm pack --dry-run          # cosa partirebbe su npm (37 file attesi, ~60 kB)
```

La vetrina è il banco di prova: **ogni modifica si guarda lì, nei due temi e
nelle due densità, prima di considerarla fatta.** Non ci sono ancora test dei
componenti (il lavoro è descritto in `docs/pubblicazione.md` §2): fino ad
allora la verifica è svelte-check + vetrina + il consumatore di riferimento.

## 3. Come si scrive il codice

Il pacchetto deve restare leggibile da uno sviluppatore umano che lo apre per
la prima volta, senza strumenti. In pratica:

- **un componente, un file, sotto le ~120 righe** stile compreso. Se cresce,
  è due componenti;
- **nomi per esteso**: `subtitle`, non `sub` (dove oggi c'è `sub` è perché
  significa "riga secondaria" e il README lo spiega: non aggiungerne altri);
  niente abbreviazioni nuove, niente sigle;
- **prop tipizzate inline** in `$props()`, con una riga di JSDoc su ogni prop
  che non si spiega da sola (guarda `SettingRow.svelte`);
- **il commento dice perché**, mai cosa: il cosa si legge dal codice. Un
  commento in testa al componente dice a cosa serve e qual è la regola di
  design che incarna;
- **CSS**: solo token (`var(--p-*)`), una dichiarazione per stato, raggruppate
  per selettore; niente `!important`, niente colori o corpi scritti a mano,
  niente `px` sotto gli 11 per il testo. Una trasparenza è
  `color-mix(in srgb, var(--p-x) N%, transparent)`;
- **niente JavaScript dove basta il CSS** e niente dipendenze: se serve una
  libreria, prima si discute in una issue;
- **accessibilità di serie**: ogni elemento interattivo è un elemento nativo
  (`button`, `input`), ha il focus visibile ereditato da `base.css` e un nome
  accessibile; `aria-pressed` per gli stati commutabili; `role="alert"` solo
  per gli errori;
- **il pacchetto non conosce il dominio**: niente testi di prodotto, niente
  fonti dati, niente layout di un'applicazione. Un componente entra quando la
  stessa forma serve in più posti.

### Checklist per un componente nuovo o cambiato

1. il file in `src/components/`, esportato da `src/index.ts` (con i tipi);
2. una sezione nella vetrina che lo mostra in ogni stato;
3. la riga nella tabella del `README.md` (prop principali, a cosa serve);
4. la riga in `CHANGELOG.md` sotto `[Unreleased]`;
5. se aggiunge un token: in `tokens.json` in ENTRAMBI i temi, poi
   `npm run tokens` e commit del CSS rigenerato;
6. `cd showcase && npm run check` pulito, vetrina guardata in scuro e chiaro.

## 4. Versionamento (SemVer, con le regole di un design system)

Il **contratto pubblico** del pacchetto è: i componenti esportati e le loro
prop; i NOMI dei token `--p-*`; le classi `p-*` di `base.css`; le voci di
`exports` (`.`, `./tokens.css`, `./base.css`, `./tokens.json`); gli attributi
`data-theme` e `data-density`; la peer dependency. Tutto il resto è
implementazione.

| Versione | Quando | Esempi |
|---|---|---|
| **patch** `0.3.x` | correzione che non cambia il contratto | un bug, un valore sbagliato, una regressione di accessibilità, un token che nel tema chiaro stonava, documenti, build |
| **minor** `0.x.0` | aggiunta compatibile | componente nuovo, prop facoltativa nuova, token nuovo (nei due temi), classe di utilità nuova, deprecazione (funziona ancora, avvisa) |
| **major** `x.0.0` | rottura | componente, prop, token o classe rimossi o rinominati; un predefinito cambiato su cui i consumatori contano; peer dependency alzata; l'ordine o il nome dei CSS da importare |

Regole in più:

- **cambiare il VALORE di un token** (un colore, un corpo) è *patch* se è una
  correzione e *minor* se è un ridisegno voluto: in entrambi i casi il
  changelog lo dice, perché il consumatore lo vede a schermo;
- **finché siamo in 0.x** SemVer permette rotture nelle minor; noi le
  facciamo solo con una voce **Rompe** nel changelog e la riga "come
  migrare". Dalla 1.0.0 in poi si applica la tabella senza eccezioni;
- **una versione pubblicata non si tocca mai**: un errore è una patch nuova;
- la versione si alza in `package.json` e in `CHANGELOG.md` **nello stesso
  commit**, intitolato `Versione X.Y.Z`, con il tag `vX.Y.Z` su quel commit.

## 5. Changelog

`CHANGELOG.md` segue [Keep a Changelog](https://keepachangelog.com/it/1.1.0/)
in italiano. Regole:

- in testa c'è sempre `## [Unreleased]`; **ogni commit che cambia `src/`
  aggiunge la sua riga lì**, nello stesso commit. Un commit senza riga di
  changelog o è documentazione o è un errore;
- sezioni, in quest'ordine e solo quelle che servono: **Rompe** (con la riga
  "come migrare"), **Aggiunto**, **Cambiato**, **Deprecato**, **Rimosso**,
  **Corretto**, **Sicurezza**;
- una riga descrive **ciò che vede chi usa il pacchetto**, non
  l'implementazione: parte dal nome del componente, del token o della classe
  in backtick, dice cosa cambia e, se non è ovvio, perché.
  Bene: "`KeyValue`: il valore che non entra accanto all'etichetta scende a
  capo intero invece di sovrapporsi". Male: "refactor di KeyValue";
- al rilascio `[Unreleased]` diventa `## [X.Y.Z] — AAAA-MM-GG` e si apre un
  nuovo `[Unreleased]` vuoto; il testo del rilascio su GitHub è quella
  sezione, copiata così com'è.

## 6. Git e GitHub

- ramo `main` sempre pubblicabile; il lavoro va su un ramo e arriva con una
  pull request, anche se sei solo: la PR è dove si rilegge il diff;
- commit piccoli, con un messaggio in italiano che dice cosa cambia per chi
  usa il pacchetto e perché; il titolo è una frase, non una sigla;
- nel messaggio niente **dati personali** (nomi, cognomi, indirizzi e-mail),
  nessun riferimento ad **assistenti AI** — trailer `Co-Authored-By`
  compreso — e niente cronaca del ragionamento: il repository è pubblico e
  la storia di git è la parte che poi non si ripulisce più;
- la CI (`.github/workflows/ci.yml`) su ogni push e PR: `npm ci`, token
  rigenerati identici a quelli committati, `npm run build`, svelte-check e
  build della vetrina, `npm pack --dry-run`. Una PR rossa non si fonde;
- niente file personali nel repo: `CLAUDE.md` è in `.gitignore` di
  proposito (chi lavora con Claude Code se ne tiene uno suo, che importa
  questo file). Le istruzioni condivise stanno QUI.

## 7. Pubblicare su npm

1. `[Unreleased]` → `[X.Y.Z] — data` nel changelog, versione in
   `package.json`, commit `Versione X.Y.Z`, tag `vX.Y.Z`;
2. `npm run build` e `npm pack --dry-run`: nel tarball ci sono solo `dist/`,
   `README.md`, `AGENTS.md`, `CHANGELOG.md`, `LICENSE` (`files` in
   `package.json`); niente di un consumatore, niente sorgenti;
3. pubblicazione **in staging** (npm dall'agosto 2026): `npm stage publish`
   con un token "stage only", poi approvazione della versione sul sito con
   il secondo fattore. Un token stage-only non può creare un pacchetto nuovo
   (`E_STAGE_REQUIRED`), ma il pacchetto esiste già. Il token vive in
   `~/.npmrc` di chi pubblica, mai nel repo;
4. push di commit e tag, rilascio su GitHub con il testo del changelog;
5. nel consumatore di riferimento (Sidereus) alzare la versione e verificare.

Dettagli e storia in `docs/pubblicazione.md`.

## 8. Cosa non fare

- non importare i sorgenti del pacchetto con un alias da un consumatore
  esterno: il contratto è `dist`, la vetrina è l'unica eccezione;
- non aggiungere una dipendenza a runtime;
- non scrivere un colore, un corpo o uno z-index a mano;
- non rinominare un token o una prop "per pulizia": è una major, e va
  discussa;
- non aggiornare i documenti in `docs/archivio/`: sono storia.
