# plancia-ui — audit visivo del tema "mission control" (2026-09-10)

Punto di partenza del pacchetto **`plancia-ui`** (nome scelto dal maintainer il
2026-09-10: la plancia è la sala di comando di una nave; `plancia` nudo è
occupato su npm, `plancia-ui` è libero; scope personale possibile in
seguito). Tema chiaro: dopo, ma i token nascono già con i due set.

Misure prese su `frontend/app/src/styles/` al commit `99d36bf` e sulle
schermate di regressione del 2026-09-09 (Tracking, Space Wx con layer,
3D e pannelli flottanti, Sistema).

## 1. Cosa funziona e va conservato

- **Identità**: navy profondo, un solo accento ciano, verde "live", numeri
  in monospazio, pannelli scuri semitrasparenti sul globo. È riconoscibile
  e adatto al soggetto.
- **Densità**: la console mostra molto in 280 px senza sembrare affollata;
  le righe con etichetta a sinistra e valore monospazio a destra sono una
  buona convenzione da promuovere a componente.
- **Pattern ricorrenti già quasi componenti**: sezione collassabile con
  riga di sintesi, toggle, chip di stato (R0/S0/G0), scheda (i), skeleton,
  tooltip a tema, pill del clock, pannello flottante con titolo e chiusura.
- **Attribuzioni e sorgenti** sempre visibili: da tenere come regola del
  sistema, non solo di Sidereus.

## 2. Incoerenze misurate

| Aspetto | Oggi | Nota |
|---|---|---|
| Corpi tipografici | **12 valori** fra 9 e 22 px; 33 usi di 11 px, 27 di 10, 19 di 10,5, 12 di 9, 9 di 9,5 | nessuna scala; il 9 px (timeline, didascalie) è sotto ogni soglia di leggibilità |
| Pesi | 600 in 30 punti, 500 in 4, 700 in 1 | quasi solo un peso: la gerarchia è affidata al colore e al maiuscolo |
| Maiuscolo spaziato | 12 `text-transform`, 21 `letter-spacing` | usato per titoli di sezione E per etichette di riga E per chip: tre ruoli, uno stile |
| Spaziature | **18 valori** distinti (1–24 px), 45 usi di 6 px e 20 di 7 px | niente griglia; 5/6/7/9/11/13 px sono aggiustamenti locali |
| Raggi | **12 valori** (3, 4, 5, 6, 8, 9, 10, 12, 14, 50 %, 999, misti) | tre basterebbero: piccolo, medio, pillola |
| Colori | 18 token in `tokens.css`, ma **21 esadecimali** e **55 `rgba(...)`** fissi in `main.css` | ambra `#fbbf24` in 11 punti, giallo, arancio, rosso, verdi: i colori di stato e delle scale NOAA non sono token |
| Ombre | 2 token + 6 ombre locali (aloni colorati degli stati) | gli aloni sono una buona idea, ma vanno come token semantici |
| z-index | 11 valori (1, 2, 10, 30, 60, 90, 100, 101, 105, 108, 110) | scala non nominata: ogni nuovo pannello "aggiunge 5" |
| Transizioni | 6 durate diverse (120–250 ms), curve miste | un token `motion-fast/base` basta |
| Accessibilità | 7 `focus-visible`, 2 `prefers-reduced-motion` su 257 classi | i toggle e le righe cliccabili spesso non hanno focus visibile; contrasto di `--text-dim` (#6d7889 su navy) sotto AA per il testo piccolo |
| Foglio | `main.css` 1 905 righe, 257 classi, layout e componenti mescolati | non estraibile così com'è |

## 3. Incoerenze viste nelle schermate

- **Cinque teste di pannello diverse** per lo stesso ruolo: sezione della
  sidebar (maiuscolo spaziato + sintesi mono), pannello satellite (titolo
  bold + chip), "Sole adesso" (titolo bold + sottotitolo mono + ×),
  "Transito CME" (titolo bold + sottotitolo + bottoni pill), scheda del
  Punto (etichetta maiuscola + coordinate mono + due icone). Serve UNA
  testa di pannello con varianti.
- **Tooltip che si sovrappongono**: nella vista Space Wx il tooltip della
  riga del Punto copre la scheda del Punto e un secondo tooltip (legenda
  dei layer) si impila sul primo. Regola mancante: un tooltip per volta e
  posizionamento che evita i pannelli.
- **Etichette 3D sovrapposte** al centro del globo ("Sole allo zenit",
  "GOES-West", "subsolare") quando la camera è lontana: manca una regola di
  collisione o di priorità per le etichette del globo.
- **Bottoni**: uno solo "primario" pieno (Segui satellite); gli altri sono
  pill di testo (`mag-btn`) con tre varianti di padding. Manca la scala
  primario / secondario / silenzioso / icona.
- **Liste**: le righe dei lanci hanno un bordo e uno sfondo, quelle dei
  layer no, quelle dei passaggi sono tabelle mono: tre stili di riga.
- **Timeline** in basso: testo mono a 9 px su fondo scuro, quasi
  illeggibile; è l'elemento più "grezzo" della schermata.
- **Chip**: le bande del Sole (304 Å, 193 Å…) e le scale NOAA (R0 S0 G0)
  sono entrambe chip ma con altezze e colori diversi.
- **Vuoti e stati**: skeleton presente ma "non disponibile" ed "errore"
  hanno testi e colori decisi caso per caso.

## 4. Fondamenta proposte per plancia-ui (bozza dei token)

- **Tipografia**: scala a 7 corpi — 11 (didascalie e mono piccolo, minimo
  assoluto), 12 (corpo compatto), 13 (corpo), 14 (titoli di pannello), 16,
  20, 28 (valori in evidenza); pesi 400/500/600; maiuscolo spaziato SOLO
  per i titoli di sezione; etichette di riga in 12 px normale, valori in
  mono 12/13.
- **Spaziatura**: griglia a 4 px — 4, 8, 12, 16, 24, 32 — e due densità
  (`compact` = quella di oggi, `comfortable` = +4 px per riga).
- **Raggi**: 4 (chip, input), 8 (card, righe), 12 (pannelli flottanti),
  pillola.
- **Superfici**: `bg` (fondo), `surface-1` (sidebar/console), `surface-2`
  (card, righe), `surface-3` (pannelli flottanti, più opachi), `inset`
  (campi), con `border` e `border-strong`; testo `text-hi / text / text-dim`
  con `text-dim` alzato fino al contrasto AA.
- **Colori semantici**: `accent` (ciano), `ok/live` (verde), `warn`
  (ambra), `danger` (rosso), `info` (azzurro), `neutral`; ognuno con
  `-soft` (sfondo) e `-glow` (alone); le scale NOAA R/S/G mappano su
  questi, non su esadecimali propri.
- **Elevazione e livelli**: `shadow-1/2`, z-index nominati (`base`,
  `overlay`, `panel`, `popover`, `tooltip`, `modal`).
- **Movimento**: `motion-fast` 120 ms, `motion-base` 200 ms, una curva;
  tutto sotto `prefers-reduced-motion`.
- **Focus**: anello di 2 px in `accent` su qualunque elemento interattivo.
- **Set di icone**: uno solo (i glifi SVG attuali, normalizzati a 16/20 px).

## 5. Componenti del pacchetto (prima lista)

Shell del cockpit (sidebar, barra modalità, area globo, footer sorgenti),
`Section` con sintesi, `Toggle`, `Chip` (stato, scala, banda), `Button`
(4 varianti), `Row` etichetta/valore, `Card` informativa (i), `Skeleton`,
`Tooltip`, `FloatingPanel` con testa unica, `Gauge`, `Sparkline`, `Pill`
del clock, `Timeline`, `EmptyState`, `Legend` (gradiente + soglie).

## 6. Stato (2026-09-10)

- Mockup approvati dal maintainer sul canvas di Claude Design (token,
  componenti, tre schermate); una regola nata lì: etichetta mai a capo,
  valore su una riga, seconda riga secondaria per l'informazione in più.
- **Pacchetto**: `frontend/packages/plancia-ui` **0.2.0** (token da JSON,
  base.css, quattordici componenti Svelte 5: Button, Chip, Toggle, KeyValue,
  Stat, PanelHead, Skeleton, Notice, Legend, Segmented, MetaRow, ControlRow,
  SettingRow, LegendDots), README con le istruzioni d'uso e le regole;
  dipendenza `file:` dell'app; vetrina su `/plancia`.
- **Migrazione di Sidereus completata** in dieci passi (0–9) nella stessa
  giornata, smoke test verde a ogni passo; diario in
  `docs/archivio/plancia-ui-migrazione.md`. `main.css` non contiene più chip,
  bottoni, toggle, teste, stati, legende, righe meta, selettori: restano
  il layout del cockpit e i casi propri dell'app, sui token.
- Della prima lista del §5 non sono diventati componenti: la shell del
  cockpit, `Section`, `Tooltip`, `FloatingPanel`, `Gauge`, `Sparkline`,
  la pill del clock e la `Timeline` (specifici di Sidereus o senza un
  secondo caso d'uso); `Row` è `KeyValue`, `EmptyState` è `Notice`, la
  `Card` informativa resta nell'app (contenuto).
- **Rifinitura (11/09)**: tipografia tutta sulla scala (niente sotto gli
  11 px), un vocabolario solo di token (`--p-*`, spariti i nomi storici),
  plancia usabile da telefono, accessibilità (ricerca dei satelliti, Esc a
  strati, regione live, ritorno del focus) e le due voci rimaste aperte del
  §3: il tooltip ora evita i pannelli agganciati e le etichette del globo
  hanno un declutter dichiarato. Con questo il §3 è chiuso per intero.
- Prossimi: pubblicazione npm del pacchetto
  (`docs/plancia-ui-pubblicazione.md`), tema chiaro (blocco
  `[data-theme="light"]` da riempire, rimandato per scelta).

## 7. Prossimi passi (piano originale)

1. Mockup sul canvas di Claude Design: token, componenti negli stati, e
   tre schermate (Tracking, Space Wx con pannelli, Sistema) nella nuova
   veste, da approvare visivamente.
2. Pacchetto `frontend/packages/plancia-ui` (workspace npm): `tokens.json`
   → `tokens.css`, `base.css`, componenti Svelte 5, pagina vetrina.
3. Migrazione di Sidereus pannello per pannello con `npm run verify` a
   guardia; `main.css` si svuota man mano.
