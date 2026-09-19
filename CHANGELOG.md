# Changelog

All notable changes to plancia-ui. The format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/), versions follow
[SemVer](https://semver.org/).

## [Unreleased]

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
