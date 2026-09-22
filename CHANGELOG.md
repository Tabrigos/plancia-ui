# Changelog

All notable changes to plancia-ui. The format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/), versions follow
[SemVer](https://semver.org/).

## [Unreleased]

### Added
- `List` and `ListItem`: the framed list of a console, for layers, sources
  and instruments. `List` is a real list for screen readers, named by
  `label`, items 10 px apart, with an optional `footer` line for the
  attribution. `ListItem` is an inset card with a head (the `ControlRow`
  shape: `label`, `title`, `help`, `controls` on the right) and the body
  under it, often shown only while the item is on; without a label the
  body is the whole card. The body spaces its blocks by itself: 8 px after
  the head, `MetaRow` and `LegendDots` keep their 6 px. Designed on the
  inventory of the reference consumer's lists (#29).
- `LiveRegion` forwards attributes to its region: an app gives it an `id`
  (`<LiveRegion id="live" />`) and a smoke test finds what screen readers
  would hear without guessing a selector. Role, politeness and class stay
  the package's (#31).
- `setLabels({ locale })`: the language of what the package formats with
  `Intl` (`Age`, `formatAge`), set once with the labels instead of on
  every `Age` (#32).

### Changed
- `Age` and `formatAge` without a `locale` follow the page: the `locale` of
  `setLabels()`, then the `lang` of the root element, then the browser's.
  A page written in Italian no longer shows "3m ago" to a browser set to
  English. An app whose `lang` does not match its text sees the ages change
  language: the fix is the `lang` (#32).

### Fixed
- `base.css`: a `<summary>` gets the themed focus ring instead of the
  browser's outline, so the native `InfoCard` and any `<details>` of the
  app match the other controls; in `InfoCard` the ring follows the card's
  rounded corners (#30).

## [0.7.0] — 2026-09-21

### Added
- `touch` density: `data-density="touch"` sizes rows, buttons, toggles and
  input text for a finger (44 px rows, 40 px buttons, 32 px small buttons,
  44×26 toggles, 16 px inputs so iOS does not zoom on focus). A coarse
  pointer (phone, tablet) gets it by itself when the root element sets no
  density; an app that sets one keeps it.
- Density tokens `--p-control-h`, `--p-control-h-sm`, `--p-toggle-w`,
  `--p-toggle-h`, `--p-input-size`, defined for the three densities:
  `Button`, `Toggle`, `Segmented`, the close of `PanelHead` and `InfoCard`
  and the tap target of `InfoButton` read them instead of fixed sizes.
- `base.css`: inputs, selects and textareas take their text size from
  `--p-input-size` (zero-specificity rule, any app rule wins).
- `Section`: `summaryTitle` puts a tooltip on the summary, with the help
  cursor, for the app to explain a compressed reading ("512 km/s · Bz −4").
  Requested by the reference consumer (#19).
- `Sparkline`: a `null` value is a gap (the pen lifts, a lone sample is a
  dot, the end dot sits on the last real value); `zeroLine` draws a thin
  line at 0 with the scale stretched to hold it; `markIndex` draws a dashed
  vertical marker at an index; `readout` shows the sample under the pointer
  (a mouse hovers, a finger drags along the line, the arrow keys move it on
  a focused sparkline) as a dot on the line and a monospace box that stays
  inside the width. Requested by the reference consumer (#20).
- `plancia-ui/theme` exports the phone breakpoint: `PHONE_BREAKPOINT`
  (700), `PHONE_MEDIA` for `matchMedia` and `isPhone()`, so an app stops
  repeating the number the package's own rules use.

### Changed
- `FloatingPanel` under 700 px is a bottom sheet: anchored to the bottom
  edge at full width, top corners rounded, the head fixed and the body
  scrolling inside `60dvh` by default, padded by the safe-area inset of a
  phone (add `viewport-fit=cover` to the viewport meta). It used to keep
  the app's `top` and take the width with gutters. Heights use `dvh`, so
  the address bar of a phone browser no longer hides the bottom of a panel.
- Hover styles of every component and of `base.css` apply only under
  `@media (hover: hover)`: on a touch screen a tap no longer leaves the
  highlight stuck on buttons, rows, toggles and section titles.
- `Tooltip` is silent on touch: a finger shows no tooltip, and neither does
  the focus a tap gives on some phones; keyboard focus and a hovering
  pointer work as before. A `title` must not be the only place a fact
  lives (`InfoButton` is the way on a phone).
- `SettingRow` honors `--p-row-h` as its minimum height: 40 px in the
  comfortable density (it stayed at 32), 44 on touch; compact is unchanged.
- `InfoCard`: the close button of an inline card is 26 px like the close
  of `PanelHead`, instead of 22.

## [0.6.0] — 2026-09-19

### Added
- `FloatingPanel`: a panel floating over a stage, with the frame, a
  `PanelHead` touching the edges, a body that scrolls inside a bounded
  height, Esc closing while focus is inside, focus returning to the
  `opener` on close, full width with gutters under 700 px. The app positions
  it with a class of its own and decides when it exists.
- `Tooltip`: one themed tooltip for the whole page, mounted once at the
  root, delegated on `title`: the text moves to `data-tip` and renders in a
  glass box below or above the element, on the side that covers less of
  the elements in `avoid`; focus shows it at once, Esc hides it, the anchor
  gets `aria-describedby` while visible. Apps keep writing `title`.
- Dataviz tokens, in both themes: `--p-viz-1..6` (categorical, six hues in
  a fixed order: blue, rose, lime, violet, orange, teal), `--p-seq-1..7`
  (sequential, the accent hue from near-zero to full) and `--p-div-1..7`
  (diverging, blue to red through a neutral midpoint at `--p-div-4`).
  Computed and validated per theme on the card surface: lightness band,
  chroma floor, colorblind separation of adjacent slots (worst pair ΔE 12.4,
  target 8), 3:1 contrast. Series colors: never the status tokens.
- `Sparkline` and `Bars`: a line and a short series of bars in a box, no
  axes, on the dataviz tokens (2 px stroke, optional area and end dot;
  thin bars with rounded data-ends anchored to a zero baseline and a 2 px
  surface gap, a color per bar when it means a level). Named for assistive
  technology by `label`; text and axes stay outside, in the text tokens.
- `Kbd`: a key as shown in hints ("Esc closes"), monospace on a raised
  inset.
- `announce(text)` and `LiveRegion`: the polite live region for what
  follows an action of the user and cannot be seen on the stage; the text
  empties after five seconds and the same text is read again. `announce`
  is plain JavaScript from `plancia-ui/live`, to call from a store;
  `LiveRegion` is mounted once.
- `InfoButton` and `InfoCard`: the (i) that opens the explanation of a
  datum (a disclosure button: `active`, `controls`, name from `setLabels()`)
  and the frame of the explanation, an inset card with the typography for a
  paragraph, a `<dl>` of facts and a link, either a native `<details>` with
  a `summary` or an always-open region with a close button. The text stays
  in the app.
- `setLabels()` gains `info`, the accessible name of `InfoButton`
  ("What is this").
- `plancia-ui/theme` and `plancia-ui/labels`: the theme helpers and
  `setLabels()` as plain-JavaScript entries, loadable from Node without the
  Svelte compiler (an entry point tested in Node, a vitest run without the
  Svelte plugin). The package index still re-exports them; it also pulls in
  the `.svelte` components, which plain Node cannot load.

### Changed
- `Section` opens and closes with a height transition on the motion tokens
  (off under `prefers-reduced-motion`); closed content stays mounted,
  `inert` and hidden from readers, instead of `hidden`. `FloatingPanel`
  fades in on mount.
- `getLabels()` returns a snapshot; the reactive form is the `labels` store
  (`svelte/store`), which the components subscribe to. `setLabels()` is
  unchanged.

## [0.5.0] — 2026-09-18

### Added
- `Section`: a collapsible console section with the `p-sec-title` title, a
  one-line `summary` readable while closed, optional `actions` on the right
  and the content under it. `open` is bindable and `onchange` reports the
  click: the state belongs to the app, the package stores nothing. Closed
  content stays mounted and hidden, so its state survives.
- `Status`: the inline state of a datum or a layer, a spinner while
  `loading` and a status dot with the tone otherwise (`ok`, `stale`,
  `error`, `idle`), a short `text`, a `title` that explains. `Notice` is
  the block message, `Status` the glance inside a row.
- `Age`: the freshness of a datum as a chip ("3m ago"), neutral while fresh,
  `warn` past `staleAfter`, `danger` past `deadAfter`; text from
  `Intl.RelativeTimeFormat` in the app's locale, absolute time as tooltip,
  refreshed every thirty seconds. `formatAge(ms, locale)` is exported.
- `p-spinner`: the 12 px loading spinner as a base class.
- `setLabels({ close, loading })`: the default accessible names of the
  `PanelHead` close button and of the `Skeleton` region are set once, before
  mount, in the language of the app, instead of passing `closeLabel` and
  `label` everywhere; a prop passed to a component still wins. Reactive: a
  change at runtime reaches the components on screen.
- Theme helpers exported from the package: `parseTheme`, `applyTheme`,
  `readStoredTheme(key)`, `rememberTheme(theme, key)`, `applyStoredTheme(key)`,
  `readRequestedTheme()` and the `Theme` type. The app still decides when to
  apply the light theme and under which storage key; it no longer writes the
  same six functions itself.

### Fixed
- `KeyValue` and `Stat`: every `Tone` now colors the value (`orange` and
  `neutral` did nothing); `KeyValue.subTone` too.
- `SettingRow`: a `class` passed by the consumer is added next to the
  component's own instead of being dropped.

## [0.4.0] — 2026-09-16

### Breaking
- `PanelHead` and `Skeleton`: the default accessible labels are now in
  English (`closeLabel` "Close", `label` "Loading") instead of Italian. How
  to migrate: an app in another language passes its own text, for example
  `<PanelHead closeLabel="Chiudi" …>` and `<Skeleton label="Caricamento" />`;
  an app that already passes them sees no change.

### Added
- Own repository for the package (`github.com/Tabrigos/plancia-ui`): the
  showcase in `showcase/`, the documents in `docs/`, CI (tokens regenerated
  identical to the committed ones, build, svelte-check and build of the
  showcase, `npm pack`).
- `skills/plancia-ui/SKILL.md`, in the tarball: the complete usage guide
  for AI coding agents (every component, prop, class and token, with the
  rules of the system), in the Agent Skills format. Installable with
  `npx skills add Tabrigos/plancia-ui`.
- `AGENTS.md`, in the tarball: how to get into the project, write the code,
  version it, keep the changelog and publish. `CONTRIBUTING.md`.
- The showcase is online at https://tabrigos.github.io/plancia-ui/ (GitHub
  Pages, rebuilt from `main` on every push), in English, with `?theme=light`
  in the URL to open it in the light theme.
- README rewritten as a short entry point, with the `repository`,
  `homepage` and `bugs` fields in `package.json`; `docs/tokens.md` and
  `docs/design-rules.md` take the details.

### Changed
- Documentation, changelog and commit messages are in English from now on;
  files still in Italian get translated whole when they are touched.

## [0.3.0] — 2026-09-14

First version published on npm.

### Added
- **Light theme**: the `light` block of `tokens.json` redefines every color
  token under `[data-theme="light"]`; the build script refuses a key present
  in one theme only. The project puts the attribute on the root element, the
  package never decides when.
- `--p-scale-0..5` ramp (NOAA scale levels 0–5) and `--p-yellow`, both in
  both themes.
- Packaging with `@sveltejs/package`: `dist/` with the `.svelte` files as
  they are, the compiled `.ts` and the `.d.ts`; `tokens.css`, `base.css` and
  `tokens.json` copied as assets. `prepublishOnly` regenerates tokens and
  package.
- `LICENSE` (MIT) and this changelog.

### Changed
- `Segmented`: the shadow of the active item uses the border token instead
  of a fixed black (it clashed in the light theme).

## [0.2.0] — 2026-09-11

### Added
- `MetaRow`, `ControlRow`, `SettingRow`, `LegendDots`.
- `Segmented` with the inline `size="sm"` variant.
- `p-help` and `p-sr-only` utilities.

### Changed
- `KeyValue` drops a value that does not fit next to the label to its own
  full line instead of overlapping or truncating it.
- Typographic scale with an 11 px minimum: every consumer goes through the
  tokens.
- `SettingRow` keeps its own class when the consumer passes one and forwards
  `data-*` attributes.

## [0.1.0] — 2026-09-10

First extraction from the Sidereus cockpit: tokens (`tokens.json` →
`tokens.css`), base styles and ten components (`Button`, `Chip`, `Toggle`,
`KeyValue`, `Stat`, `PanelHead`, `Skeleton`, `Notice`, `Legend`,
`Segmented`), plus `scaleTone()`.
