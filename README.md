# plancia-ui

[![npm](https://img.shields.io/npm/v/plancia-ui)](https://www.npmjs.com/package/plancia-ui)
[![ci](https://github.com/Tabrigos/plancia-ui/actions/workflows/ci.yml/badge.svg)](https://github.com/Tabrigos/plancia-ui/actions/workflows/ci.yml)
[![license MIT](https://img.shields.io/badge/license-MIT-blue)](LICENSE)

A design system for dense consoles: CSS tokens, base styles and Svelte 5
components, **dark by birth and light by choice**. "Plancia" is the bridge
of a ship. It was born in the mission-control cockpit of
[Sidereus](https://github.com/Tabrigos/Sidereus) (satellite tracking and
space weather) and is made to be reused in other consoles, dashboards and
control panels.

[![The plancia-ui showcase in the dark and light theme](https://raw.githubusercontent.com/Tabrigos/plancia-ui/main/docs/images/showcase.png)](https://tabrigos.github.io/plancia-ui/)

**Live showcase**: [tabrigos.github.io/plancia-ui](https://tabrigos.github.io/plancia-ui/)
(every component in every state; add `?theme=light` for the light theme).

- **No runtime dependencies**: `svelte` ≥ 5 as the only peer dependency.
- **One tokens file, two themes**: every color lives in `tokens.json`; the
  light theme redefines the same variables, and the build refuses a token
  that exists in one theme only.
- **Twenty-five small components**, each readable in a minute, accessible by
  default.
- **Agent-ready**: a complete usage guide for AI coding agents ships inside
  the package (see below).

## Install

```bash
npm install plancia-ui
```

Load the two stylesheets once, in the entry point, before the project CSS:

```ts
import 'plancia-ui/tokens.css'
import 'plancia-ui/base.css'
import './styles/app.css'
```

Then use the components:

```svelte
<script lang="ts">
  import { Chip, KeyValue, PanelHead, scaleTone } from 'plancia-ui'
</script>

<section class="p-panel">
  <PanelHead title="ISS (ZARYA)" subtitle="NORAD 25544">
    {#snippet chips()}<Chip tone={scaleTone(2)}>G2</Chip>{/snippet}
  </PanelHead>
  <KeyValue label="Altitude">420.6 km</KeyValue>
</section>
```

Light theme: put `data-theme="light"` on the root element, or call
`applyStoredTheme('myapp.theme')` from `plancia-ui/theme` before mount and
`rememberTheme()` when the user switches. Density: `data-density="comfortable"`
or `"touch"` (rows and controls sized for a finger); a phone or a tablet gets
`touch` by itself when the root sets none. The package never decides the
theme; the project does. In another language, set
the default labels once, from `plancia-ui/labels`:
`setLabels({ close: 'Chiudi', loading: 'Caricamento', info: "Cos'è questo dato" })`. Both entries are
plain JavaScript, usable from Node and in tests without the Svelte compiler.
Tokens, themes, density and fonts are explained in
[`docs/tokens.md`](docs/tokens.md).

## Components

| Component | What it is for | Main props |
|---|---|---|
| `Button` | actions | `variant` primary · secondary · quiet · icon, `size` md · sm, `active`, native attributes |
| `Chip` | status, scale level, band, counter | `tone`, `count`, `small`, `color` |
| `Toggle` | accessible switch (a real checkbox) | `checked` (bindable), `disabled`, `label`, `onchange` |
| `KeyValue` | label / value row | `label`, `sub`, `subTone`, `tone`, `title`; the value is the content |
| `Stat` | big number with a label | `label`, `sub`, `tone`, `title`; the value is the content |
| `PanelHead` | head of a floating panel | `title`, `subtitle`, snippets `chips` and `actions`, `onclose`, `closeLabel` |
| `Skeleton` | loading | `lines`, `label`, `compact` |
| `Notice` | empty / info / warning / error states | `kind`, `title`, `text`, `compact`; the action is the content |
| `Legend` | gradient legend of a layer | `gradient`, `min`, `max`, `unit`, `note` |
| `LegendDots` | dot legend of what is drawn elsewhere | `items` `{ color, label, opacity?, title? }`, `label` |
| `MetaRow` | metadata under a card | `align`; the items are the content, `<b>` highlights a value |
| `Segmented` | exclusive choice among a few options | `items` `{ id, label, title? }`, `value` (bindable), `onchange`, `label`, `size` |
| `ControlRow` | head of a card: label left, controls right | `label`, `title`, `help`, `tone`; the controls are the content |
| `SettingRow` | list row: icon, name, control | `label`, `title`, `help`, snippet `icon`; forwards `data-*` and `id` |
| `Section` | collapsible console section | `title`, `summary`, `open` (bindable), `onchange`, snippet `actions`; the content is the body |
| `Status` | inline state of a datum or a layer | `kind` loading · ok · stale · error · idle, `text`, `title`, `help` |
| `Age` | freshness chip ("3m ago") | `updatedAt`, `staleAfter`, `deadAfter`, `locale`, `title` |
| `FloatingPanel` | panel over a stage: frame, head, scrolling body, Esc, focus return | `title`, `subtitle`, snippets `chips` and `actions`, `onclose`, `opener`, `autofocus`, `label`; the content is the body |
| `Tooltip` | themed tooltip for every `title` on the page, mounted once | `delay`, `maxWidth`, `gap`, `avoid` |
| `InfoButton` | the (i) that opens an explanation | `active`, `onclick`, `controls`, `label` |
| `InfoCard` | frame of an explanation: paragraph, `<dl>` of facts, link | `summary` (native details) or always open with `onclose`; the content is the body |
| `Kbd` | a key in a hint ("Esc closes") | the key is the content |
| `LiveRegion` | the polite live region `announce()` writes into, mounted once | |
| `Sparkline` | a line in a box, no axes | `values`, `label`, `color`, `area`, `endDot`, `min`, `max`, `width`, `height` |
| `Bars` | a short series of bars, zero baseline, no axes | `bars` `{ value, label?, color? }`, `label`, `color`, `max`, `width`, `height` |

Plus `scaleTone(level)`, the semantic tone of NOAA scale levels 0–5, to pass
to `Chip`; `setLabels()` for the default labels; the theme helpers
`applyTheme`, `applyStoredTheme`, `readStoredTheme`, `rememberTheme`,
`readRequestedTheme`, `parseTheme`; `announce(text)` from `plancia-ui/live`
for screen readers. The full reference of every prop, base class and token is in
[`skills/plancia-ui/SKILL.md`](skills/plancia-ui/SKILL.md); the design rules
the components embody are in [`docs/design-rules.md`](docs/design-rules.md).

## For AI agents

The package ships a complete usage guide written for coding agents:
`node_modules/plancia-ui/skills/plancia-ui/SKILL.md`. It lists every
component, prop, class and token, with the rules of the system, so an agent
can build UI with plancia-ui without reading the library's code and spending
context on it. It follows the [Agent Skills](https://agentskills.io) format
and is updated with every release, next to the changelog.

Agents do not read files inside `node_modules` on their own, so point yours
at it once:

- Claude Code and other skill-aware agents: `npx skills add Tabrigos/plancia-ui`
  installs it as a skill;
- any agent with a rules file (`AGENTS.md`, `.cursorrules`, …): add a line
  such as "before touching the UI, read
  `node_modules/plancia-ui/skills/plancia-ui/SKILL.md`".

## Documentation

- [`docs/tokens.md`](docs/tokens.md) — tokens, themes, density, fonts.
- [`docs/design-rules.md`](docs/design-rules.md) — the rules of the system
  and what does not belong in the package.
- [`CHANGELOG.md`](CHANGELOG.md) — what changed in each version.
- [`docs/roadmap.md`](docs/roadmap.md) — what is likely to come next.
- [`AGENTS.md`](AGENTS.md) — how to change, version and publish the package;
  [`CONTRIBUTING.md`](CONTRIBUTING.md) for the short version.
- [Showcase](https://tabrigos.github.io/plancia-ui/) — every component in
  every state, in both themes and both densities, built from `main`.
  Locally: `cd showcase && npm install && npm run dev`.

## License

MIT, © Sidereus Team. See [`LICENSE`](LICENSE).
