# Changelog

Tutte le modifiche rilevanti di plancia-ui. Il formato segue
[Keep a Changelog](https://keepachangelog.com/it/1.1.0/), le versioni
[SemVer](https://semver.org/lang/it/).

## [0.3.0] — 2026-09-14

Prima versione pubblicata su npm.

### Aggiunto
- **Tema chiaro**: il blocco `light` di `tokens.json` ridefinisce ogni token
  di colore sotto `[data-theme="light"]`; lo script di generazione rifiuta
  una chiave presente in un solo tema. È il progetto a mettere l'attributo
  sull'elemento radice, il pacchetto non decide quando.
- Rampa `--p-scale-0..5` (livelli 0–5 delle scale NOAA) e `--p-yellow`,
  entrambi in tutti e due i temi.
- Confezionamento con `@sveltejs/package`: `dist/` con i `.svelte` così come
  sono, i `.ts` compilati e i `.d.ts`; `tokens.css`, `base.css` e
  `tokens.json` copiati come asset. `prepublishOnly` rigenera i token e il
  pacchetto.
- `LICENSE` (MIT) e questo changelog.

### Cambiato
- `Segmented`: l'ombra della voce attiva usa il token del bordo invece di un
  nero fisso (nel tema chiaro il nero stonava).

## [0.2.0] — 2026-09-11

### Aggiunto
- `MetaRow`, `ControlRow`, `SettingRow`, `LegendDots`.
- `Segmented` con la variante `size="sm"` in linea.
- Utilità `p-help` e `p-sr-only`.

### Cambiato
- `KeyValue` manda a capo intero il valore che non entra accanto
  all'etichetta invece di sovrapporlo o troncarlo.
- Scala tipografica con minimo 11 px: tutti i consumatori passano dai token.
- `SettingRow` conserva la propria classe quando chi lo usa ne passa una e
  inoltra gli attributi `data-*`.

## [0.1.0] — 2026-09-10

Prima estrazione dal cockpit di Sidereus: token (`tokens.json` →
`tokens.css`), stili base e dieci componenti (`Button`, `Chip`, `Toggle`,
`KeyValue`, `Stat`, `PanelHead`, `Skeleton`, `Notice`, `Legend`,
`Segmented`), più `scaleTone()`.
