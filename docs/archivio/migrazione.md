# plancia-ui — diario della migrazione di Sidereus

Regola: un pannello alla volta, `npm run check` + vitest + `npm run verify`
+ screenshot a ogni passo, `main.css` che si svuota man mano. Il pacchetto
è in `frontend/packages/plancia-ui`, la vetrina su `/plancia`, il rapporto
di partenza in `docs/archivio/plancia-ui-audit-visivo.md`.

## Ordine e stato

**Migrazione completata il 2026-09-10** (passi 0–9). Resta nell'app, per
scelta, solo ciò che è contenuto di Sidereus: le schede `DataInfo` (testi
dei prodotti, link alle fonti — sui token ma non nel pacchetto), le card
informative e il layout del cockpit. Prossimo: pubblicazione npm e tema
chiaro. Le istruzioni d'uso del pacchetto sono nel suo README
(`frontend/packages/plancia-ui/README.md`).

| # | Passo | Componenti | Stato |
|---|---|---|---|
| 0 | Token dell'app come alias dei `--p-*`; `Skeleton` | `Skeleton` | fatto 2026-09-10 (`7c4b8bd`) |
| 1 | Teste dei pannelli flottanti: satellite, Sole adesso, Transito CME, Eliosfera | `PanelHead`, `Chip`, `Button` | fatto 2026-09-10 |
| 2 | Pannello satellite: griglia telemetria e righe aria / lancio / radiazione / passaggi | `Stat`, `KeyValue`, `Button` | fatto 2026-09-10 |
| 3 | Chip e bottoni sparsi (scale NOAA, bande del Sole, `mag-btn`, "Segui satellite") | `Chip`, `Button`, `scaleTone` | fatto 2026-09-10 (3a chip, 3b bottoni) |
| 4 | Timeline a 11 px e pill del clock | (CSS) | fatto 2026-09-10 |
| 5 | Sezioni e toggle della sidebar, righe dei layer | `Toggle`, `Chip` | fatto 2026-09-10 |
| 6 | Stati vuoto / errore / avviso dei pannelli | `Notice`, `Chip` | fatto 2026-09-10 |
| 7 | Scheda del Punto e tooltip (uno per volta) | `Button`, regole di `KeyValue` | fatto 2026-09-10 |
| 8 | Legende dei layer raster | `Legend` | fatto 2026-09-10 |
| 9 | Righe meta delle card, selettori a due voci, aspetto delle schede DataInfo | `MetaRow`, `Segmented size="sm"` | fatto 2026-09-10 |

## Passo 1 — teste dei pannelli (2026-09-10)

- `PanelHead` ha guadagnato `subtitleTitle` (tooltip sul sottotitolo, con
  sottolineatura puntinata come le altre `swx-help`).
- Satellite: titolo = nome, chip del gruppo con il colore del gruppo
  (`Chip color=`) e il glifo, chip NORAD; chiusura → `hideSatellite`.
- Sole adesso: sottotitolo "banda · età", chip `warn` "immagine vecchia"
  quando la fonte è stale.
- Transito CME: sottotitolo con il tooltip del modello lineare, azioni
  "Sole" e "vista" come `Button secondary sm`, chiusura → `setTransit(false)`.
- Eliosfera: sottotitolo "run N · età" (o "run ambientale"), azioni = (i) +
  segmentato delle inquadrature (`rwx-seg`, ancora dell'app: lo smoke test
  lo cerca), chiusura → `closeHeliosphere`.
- CSS tolto da `main.css`: `#info-header`, `.info-title`, `#info-close`,
  `.chip`, `#info-norad-chip`, `.group-chip`, `.sd-head/.sd-title/.sd-sub/
  .sd-close`, `.ts-head/.ts-title/.ts-sub/.ts-btn`. Aggiunto `.p-head-wrap`
  (annulla il padding del pannello così la testa tocca i bordi).
- Verifica: check 0 errori, vitest 74, smoke test verde, screenshot dei
  quattro pannelli.

## Passo 2 — corpo del pannello satellite (2026-09-10)

- Telemetria: quattro `Stat` in griglia 2×2 (etichetta maiuscola 11 px,
  valore mono 16 px) al posto delle `tile` con etichetta a 9 px.
- Righe aria / lancio / radiazione: `KeyValue` dentro un `p-inset`; il
  confronto con la mediana e "sito · operatore" sono la riga secondaria
  (`sub`), mai il valore spezzato. `KeyValue` ha guadagnato `id` e
  `subTone` (la riga secondaria in warn/info quando la densità è sopra o
  sotto la mediana); `Stat` ha `id`. Radiazione colorata per tono: danger
  nella SAA, warn sopra l'ovale, ok altrimenti.
- "Segui satellite" è il `Button primary` del sistema (stato `active` =
  "Smetti di seguire"). Titolo "Passa sopra" in `p-sec-title`; lista dei
  passaggi a 11 px (era 10,5).
- Gli id che lo smoke test legge (`#info-drag b`, `.pass-row`,
  `.passes-next`) sono conservati.
- CSS tolto: `.telemetry-grid`, `.tile*`, `.drag-row*`, `#info-track*`,
  `.passes-title`. Aggiunti `.info-stats`, `.info-rows`.
- Verifica: check 0 errori, vitest 74, smoke test verde, screenshot con la
  ISS e con un satellite delle novità (riga Lancio).

## Passo 3a — chip (2026-09-10)

- Scale NOAA "adesso" (R/S/G) nella card Kp e scala S nel pannello
  radiazione: `Chip tone={scaleTone(livello)}` al posto degli span con
  `--scale-color`; livelli 1–2 in ambra, 3 in arancio, 4–5 in rosso (prima
  giallo/ambra/arancio/rosso/bordeaux da `SCALE_COLORS`, che resta per la
  gauge e le barre del Kp).
- Previsione a 3 giorni: il pallino colorato + "G0" diventa un `Chip small`
  (18 px col tono). `Chip` ha guadagnato `small`.
- Bande del Sole (304 Å, 193 Å, …, LASCO): `Button secondary sm` con
  `active` sulla banda corrente e bordo tratteggiato per i coronografi;
  restano `<button>` dentro `.sd-bands` (lo smoke test li conta).
- Corpi 10/10,5 px della card Kp portati a 11.
- CSS tolto: `.swx-scale`, `.swx-fc3-g`, `.sd-bands button*`.
- Verifica: check 0 errori, vitest 74, smoke test verde, screenshot della
  console Space Wx e del disco solare.

## Passo 3b — bottoni (2026-09-10)

- I dodici `mag-btn` (testo in accento, mono 10,5 px, sottolineatura al
  passaggio) sono `Button secondary sm` del sistema: Eliosfera (play,
  adesso), Previsione Enlil ("eliosfera"), Eventi solari ("modello:
  eliosfera", "vista transito"), Magnetosfera (vista magnetosfera, vista
  SAA, vista fasce), Sole ("Sole adesso", "vista dal Sole"), Tracking
  (preset GEO). "Mostra tutti" delle Novità è `quiet sm`. Gli stati
  `class:active` sono diventati `active={…}` (bordo e testo in accento),
  gli id (`sun-disk-open`, `heliosphere-open`, `preset-geo`) sono passati
  intatti al `<button>`.
- CSS tolto: `.mag-btn`, `.mag-btn:hover`, `.mag-btn.active`.
- Verifica: check 0 errori, vitest 74, smoke test verde (apre il disco dal
  bottone migrato), screenshot dell'Eliosfera e delle console.

## Passo 4 — timeline e pill del clock (2026-09-10)

- Timeline di Cesium: etichette delle tacche a 11 px (erano 9,5), sfondo
  `--p-s1a` con bordo superiore, tacche sui token dei bordi, ago in accento
  con alone. Nessuna modifica al widget: solo gli override in `main.css`.
- Pill del clock: superficie `--p-s3a`, bordo e ombra del sistema,
  bottoni a 30 px e 12 px, clock in `--p-text-hi`, "Live" a 11 px maiuscolo
  spaziato con dot in `--p-ok` e alone; transizioni sui token di movimento.
- Verifica: smoke test verde, screenshot della pill e della timeline.

## Passo 5 — sidebar: toggle, sezioni, righe dei layer (2026-09-10)

- I dodici `<label class="switch">` (layer satellitari, impostazioni di
  visualizzazione, layer raster, linee di campo, fasce, riferimenti,
  sentinelle, esposizione, Sole, transito CME) sono `Toggle` del pacchetto:
  vero checkbox 34×20 con focus visibile; `bind:checked` dove il valore
  era bindato, `onchange={(v) => …}` altrove. `Toggle` ha guadagnato
  `title`. Lo smoke test cliccava `.switch input`: ora `.p-toggle input`.
- Titoli di sezione a 11 px con tracking .08em (unico maiuscolo spaziato),
  sintesi a 11 px in `--p-text-dim` (`--p-text-hi` a sezione chiusa); il
  titolo non si accorcia più, si accorcia la sintesi.
- Contatore dei layer come `Chip count`; preset "vista dall'alto" della
  riga GEO come `Button quiet sm` per non schiacciare l'etichetta.
- CSS tolto: tutte le regole `.switch*`, `.layer-count`.
- Verifica: check 0 errori, vitest 74, smoke test verde (accende il
  transito dal toggle migrato), screenshot delle due sidebar.

## Passo 6 — stati vuoto / errore / avviso (2026-09-10)

- Le nove righe "… non disponibile" (`swx-unavailable`: allerte, Enlil,
  DONKI, particelle, regioni, vento solare, space weather, lanci,
  eliosfera) sono `Notice kind="error"` in un wrapper `.p-state`.
- Le due attribuzioni "SWPC non raggiungibile" (allerte, regioni) sono
  `Notice kind="warn"`; i sei avvisi inline "dati vecchi", "dati di Nh fa",
  "regioni calde", "elevati" sono `Chip tone="warn"` con il tooltip.
- Stati vuoti con `Notice kind="empty" compact` (variante nuova, 6 px di
  padding, titolo 12 px normale): "Nessuna CME rilevante in volo" (con
  l'età come testo secondario), "Nessun lancio con data nota", e le note dei
  passaggi (Punto mancante, calcolo, nessun passaggio; "non disponibili" è
  `warn`).
- CSS tolto: `.swx-unavailable`, entrambe le `.swx-warn`, `.passes-note`.
  Aggiunti `.p-state` e `.p-state-tight`.
- Verifica: check 0 errori, vitest 74, smoke test verde, screenshot del
  pannello satellite senza Punto, della card Kp e del disco solare.

## Passo 7 — scheda del Punto e tooltip (2026-09-10)

- `GlobeProbe.svelte`: titolo "Punto" come `p-sec-title` (11 px, l'unico
  maiuscolo del sistema), i due bottoni (geolocalizza, togli) sono
  `Button variant="icon" size="sm"` con icone SVG a 12 px; la scheda passa
  da 240 a 280 px, superficie `--p-s3a`, bordo/ombra/raggio dai token, testa
  con riga di separazione invece del gradiente.
- Righe etichetta/valore con le regole di `KeyValue` ma senza il componente
  (le classi `.gp-row`, `.gp-coords`, `.gp-pass` restano: le legge lo smoke
  test): etichetta 12 px dim con ellissi, valore mono 12 px hi mai spezzato;
  se non entra accanto all'etichetta ("passa tra 25 min · NO→NE · 17°")
  scende su una riga sua allineato a destra (`flex-wrap`), che è la stessa
  regola chiesta sui mockup per "aria a 547 km".
- Tooltip (`styles/tooltip.css`): superficie, bordo forte, raggio e ombra dai
  token, 12 px, testo hi. "Uno per volta" era già garantito da
  `Tooltip.svelte` (istanza unica delegata su `data-tip`): nessuna logica
  aggiunta.
- Verifica: check 0 errori, vitest 74, smoke test verde (il deep-link
  `passes` legge la scheda), screenshot della scheda con e senza tooltip.

## Passo 8 — legende dei layer raster (2026-09-10)

- `SpaceWeatherConsole.svelte`: la legenda di ogni layer attivo (minimo,
  barra del gradiente, massimo con unità, segno "+" per i prodotti
  `signed`) è `Legend` del pacchetto; `gradientFor` resta nell'app (legge
  la colormap dal manifest e inverte le `*_r`). Il wrapper `.rwx-legend`
  tiene solo il margine.
- CSS tolto: la `.rwx-legend` a 10 px e `.rwx-gradient` (la barra è del
  componente: 8 px, limiti mono 11 px dim).
- La riga `.rwx-meta` (età, soglie di trasparenza, valore nel Punto) resta
  com'era: ogni voce ha il suo tooltip, `Legend.note` non basterebbe.
- Verifica: check 0 errori, vitest 74, smoke test verde, screenshot della
  sezione "Layer sul globo" con anomalia TEC, IGRF e OVATION attivi.

## Passo 9 — righe meta, selettori, schede DataInfo (2026-09-10)

- Le 24 righe `.rwx-meta` di 9 file (età del dato, soglie, note di metodo,
  bottoni piccoli, chip) sono `MetaRow`, componente nuovo del pacchetto:
  11 px dim, voci ai due estremi, a capo per voce intera se non entrano, un
  `<b>` è il valore in evidenza. Il componente è un contenitore con
  contenuto libero perché le righe reali mescolano testo, tooltip, Button e
  Chip: un elenco di voci a prop non le avrebbe coperte. La conversione ha
  chiuso i `div` in modo bilanciato (script `mig9_meta.py`).
- I due selettori `.rwx-seg` (ovale a terra / sollevato, inquadratura
  dell'Eliosfera) sono `Segmented size="sm"`: variante nuova, pillola in
  linea a 11 px con la voce attiva in accento; erano gli ultimi controlli a
  10 px.
- `DataInfo` resta nell'app (contenuto di Sidereus) ma la scheda è sui
  token: riquadro `--p-inset`, etichette 11 px senza maiuscolo, link alle
  fonti a 11 px.
- CSS tolto: `.rwx-seg` (4 regole), `.rwx-meta`. Smoke test aggiornato ai
  selettori nuovi (`.p-meta span`, `.p-seg button.on`).
- Vetrina `/plancia`: esempi di `MetaRow` e di `Segmented sm`.
- Verifica: check 0 errori, vitest 74, smoke test verde (viewline letta
  dalla riga meta, "sollevato" dal segmentato), screenshot della sezione
  layer con OVATION e scheda (i) aperta, della magnetosfera e della vetrina.

## Dopo la migrazione — riordino del frontend (2026-09-10)

Rilettura delle pratiche Svelte a valle della migrazione, con tre interventi
(il quarto, la pubblicazione npm, è solo documentato in
`docs/plancia-ui-pubblicazione.md`).

1. **Console spezzate.** `SpaceWeatherConsole.svelte` (444 righe) conteneva
   la card Kp e la lista dei layer raster mentre gli altri dieci pannelli
   erano già file propri: ora sono `KpPanel.svelte` e `RastersPanel.svelte`,
   e la console è l'ordine delle sezioni (31 righe). Markup copiato
   verbatim: nessun cambiamento di DOM.
2. **Logica pura fuori dagli store**, dove i test possono raggiungerla:
   `lib/auroraReach.ts` (viewline dell'ovale), `lib/sun/regionMarkers.ts`
   (regioni attive proiettate sul disco) e `lib/sun/cmeDisc.ts` (sorgente,
   arco sul lembo, anello delle halo, raggi a cipolla). Gli store restano
   involucri sottili che leggono lo stato e chiamano il modulo. 22 test
   nuovi (96 in tutto); due asserzioni sbagliate scritte per prime hanno
   fatto emergere che a settembre l'inclinazione B0 porta l'equatore solare
   sotto il centro del disco: ora è un test. Nello stesso giro il manifest
   dei raster è passato dal suo `setInterval` privato al poll condiviso
   (`subscribePoll`), che è la regola della plancia dal C4.
3. **CSS nei componenti.** `main.css` da 1635 a 365 righe: ogni pannello,
   la sidebar, le sezioni, la barra playback, la card Kp, le schede dati
   hanno il loro `<style>` scoped. Restano globali reset, contenitore del
   globo, override dei widget Cesium (DOM non nostro), classi sul `<body>`
   e il vocabolario condiviso delle console (`.rwx-*`, `.swx-help`,
   `.p-state`, `.setting-item`…), che è il prossimo candidato a diventare
   componenti del pacchetto. `:global()` solo dove un selettore deve
   attraversare un confine (`body.sidebar-collapsed`, `.rwx-item .pinfo`).
   Nove regole morte lasciate dalla migrazione sono sparite.

Verifica a ogni passo: check 0 errori e 0 selettori inutilizzati, vitest,
build nginx, smoke test verde, screenshot dei pannelli toccati.

## Rifinitura — tipografia, token, telefono (2026-09-11)

4. **Tipografia sulla scala.** 90 dichiarazioni normalizzate: ogni corpo è un
   token `--p-t*` e non c'è più niente sotto gli 11 px (prima 38
   dichiarazioni fra 9 e 10,5 px). Le scritte dentro gli SVG (striscia del
   transito, sparkline, tacche dei raggi X) usano gli stessi token: lì sono
   unità del `viewBox`, quindi vanno lette alla scala di resa. Tolto il
   maiuscolo spaziato dall'intestazione della tabella a 3 giorni (resta solo
   nei titoli di sezione, più i badge LIVE e tipo di allerta) e accorciata la
   sua prima colonna a "3 gg", che a 11 px non andava più a capo.
5. **Un vocabolario solo di token.** I nomi storici (`--text-dim`,
   `--bg-panel`, `--accent`…) sono spariti da componenti, `main.css`,
   `page.css` e `tooltip.css`: 339 riferimenti riscritti nei `--p-*` del
   pacchetto. `styles/tokens.css` tiene ora solo `--sidebar-w` e
   `--font-display`, cioè ciò che è di Sidereus e non del tema. Il tema
   chiaro avrà quindi un vocabolario solo da riempire.
6. **Telefono usabile** (il desktop resta il target). Sotto i 700 px: la
   sidebar è un cassetto sopra il globo con velo, chiuso all'avvio (lo stato
   iniziale viene da `window.innerWidth`); il globo prende tutto lo schermo;
   la pillola dei comandi va in alto a destra senza orologio, perché in alto
   a sinistra c'è il pulsante del cassetto; i pannelli agganciati diventano a
   tutta larghezza con scorrimento interno (la lista dei passaggi non spinge
   più il bottone fuori dallo schermo); la timeline di Cesium sparisce, col
   dito non si governa.

Verifica: check 0 errori, vitest 96, smoke test verde sul desktop,
screenshot a 390×844 del globo a tutto schermo, del cassetto aperto e della
chiusura toccando il velo.

## Rifinitura — accessibilità, vocabolario, etichette (2026-09-11)

7. **Tastiera e screen reader.** Il globo è un canvas WebGL e non si
   raggiunge da tastiera: ora c'è una **ricerca** dei satelliti in scena per
   nome o NORAD (combobox con frecce, Invio ed Esc; confronto puro in
   `lib/satelliteSearch.ts`, 7 test; elenco delle entity in
   `lib/globe/find.ts`), che è anche comoda col mouse. **Esc** chiude uno
   strato per volta: disco solare o Eliosfera, scheda del satellite, Punto,
   cassetto su schermo stretto. Una sola **regione live** annuncia le
   conseguenze di un'azione (satellite scelto, Punto spostato, pannello
   chiuso) e mai gli aggiornamenti dei poll. Chiudendo un pannello il focus
   torna al pulsante che l'ha aperto. Il pacchetto ha l'utilità `p-sr-only`.
8. **Vocabolario condiviso dentro il pacchetto.** `ControlRow` (etichetta +
   comandi: 8 righe in 7 pannelli), `SettingRow` (icona, nome, comando: le
   righe dei layer, delle impostazioni e del Punto), `LegendDots` (legenda a
   pallini: 6 legende), più le utilità `p-help` e `p-dim` al posto di
   `swx-help`/`swx-dim` (79 occorrenze) e `MetaRow` al posto di `swx-meta`.
   `main.css` scende a 308 righe: restano reset, globo, override di Cesium,
   classi sul `<body>` e il modo in cui le schede sono impilate.
9. **Tooltip e etichette 3D**, le due voci rimaste aperte dall'audit:
   il tooltip misura quanto coprirebbe i pannelli agganciati sopra e sotto
   l'elemento e sceglie il lato che copre meno; le etichette del globo hanno
   un declutter dichiarato (`lib/globe/declutter.ts`): priorità per
   collezione, via quelle dietro il globo e quelle che si sovrappongono a
   una già accettata.

Verifica: check 0 errori, vitest 103, smoke test verde (ora prova anche la
ricerca da sola tastiera e la chiusura con Esc), screenshot della ricerca,
delle legende, del globo con le etichette del Sole e delle sentinelle.

## Correzioni di sovrapposizione (2026-09-11)

Segnalato da Paolo: con un satellite fuori dalla fascia del modello
termosferico (un geostazionario a 35 781 km) l'etichetta "Aria a 35781 km" e
il valore "fuori dal modello (100–1000 km)" si stampavano uno sopra l'altro.

Causa nel componente, non nel pannello: in `KeyValue` etichetta e valore
erano entrambi `nowrap` in una riga flex senza possibilità di restringersi,
e il valore, allineato a destra, sbordava sopra l'etichetta. Ora la riga va a
capo: **se il valore non entra accanto all'etichetta scende su una riga sua,
intero e a destra** — la stessa regola già applicata alla scheda del Punto.
Vale per tutte le righe etichetta/valore della plancia; la vetrina `/plancia`
ha il caso lungo.

Cercati gli altri casi con una scansione del DOM (elementi il cui contenuto
supera il proprio riquadro, a 1600 e a 390 px, nelle tre modalità):

- righe degli ultimi flare: con un id di CME a quattro cifre la colonna
  dell'ora andava a capo → celle su una riga sola, si accorcia la colonna
  della regione (era un effetto della tipografia portata a 11 px);
- piede della CME in volo (distanza · sorgente, arrivo): a capo intero
  invece di accavallarsi;
- resta un solo "sforamento" di 6 px, voluto: le righe CME selezionabili
  hanno `margin: 0 -6px` perché l'evidenziazione tocchi i bordi della
  sezione.

## Pacchetto allineato: 0.2.0 (2026-09-11)

La correzione della sovrapposizione è nel PACCHETTO (`KeyValue`), non
nell'app: vale per ogni riga etichetta/valore e per chiunque userà il tema.
Aggiornati di conseguenza il README del pacchetto (tabella con `ControlRow`,
`SettingRow` e `LegendDots`, utilità `p-help` e `p-sr-only`, regola del
valore lungo scritta per esteso), la versione a **0.2.0** con l'elenco di
cosa è cambiato dalla 0.1.0, e la vetrina `/plancia`, che ora mostra anche
le righe di console e la legenda a pallini.

## Nome e marchio: Sidereus (2026-09-11)

Il progetto si chiamava Sidereus finché non è saltato fuori
`sidereus.world`: stesso nome, stesso scopo (tracking satellitare, tema
scuro, SGP4 nel browser, ricerca per nome e NORAD) e icona vicina alla
nostra. Il tema resta com'è per scelta di Paolo; cambiano nome e segno.

**Sidereus** viene dal *Sidereus Nuncius* di Galileo (1610), il primo
resoconto di quello che si vede puntando uno strumento al cielo. Scelto fra
quattro candidati, tutti verificati contro le collisioni nel settore (Tycho
era già preso: Tycho Tracker; Astrarium pure, è un planetario open source).

**L'icona** è il disegno di Galileo: il disco di Giove e le lune medicee
allineate, uno a sinistra e due a destra. Nessun anello orbitale — è il
segno che usano tutti gli altri, compreso il sito da cui ci separiamo. Le
misure sono scelte perché regga a 16 px, la dimensione della scheda del
browser: disco r 9, satelliti r 3,6 e almeno quattro unità di stacco. Lo
stesso segno, in versione a filo, è nella testa della plancia e della
pagina delle fonti.

Rinominato tutto il **visibile** (interfaccia, titoli, pagina delle fonti,
documenti, README, User-Agent con cui ci presentiamo alle fonti). I nomi
**tecnici** restano quelli vecchi fino al go-live, quando i volumi si
ricreano comunque: la lista è in `docs/deploy-monitoraggio.md`. Nel vault
la scheda tiene il nome del file per non rompere i collegamenti delle altre
note, con `Sidereus` come alias.
