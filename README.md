# plancia-ui

[![npm](https://img.shields.io/npm/v/plancia-ui)](https://www.npmjs.com/package/plancia-ui)
[![ci](https://github.com/Tabrigos/plancia-ui/actions/workflows/ci.yml/badge.svg)](https://github.com/Tabrigos/plancia-ui/actions/workflows/ci.yml)
[![license MIT](https://img.shields.io/badge/license-MIT-blue)](LICENSE)

A design system for dense consoles — mission control, monitoring,
dashboards, control panels — in Svelte 5: CSS tokens, base styles and
thirty-six components, **dark by birth and light by choice**, sized for a
mouse and for a finger. "Plancia" is the bridge of a ship. It was born in
the cockpit of [Sidereus](https://github.com/Tabrigos/Sidereus), satellite
tracking and space weather, and is made to be reused.

[![The plancia-ui showcase in the dark and light theme](https://raw.githubusercontent.com/Tabrigos/plancia-ui/main/docs/images/showcase.png)](https://tabrigos.github.io/plancia-ui/)

**See it live**: the [showcase](https://tabrigos.github.io/plancia-ui/),
every component in every state, in both themes and three densities; and
the [recipes](https://tabrigos.github.io/plancia-ui/recipes.html), whole
compositions running with their code, a phone layout among them.

**Build with it**: the reference starts at
[`skills/plancia-ui/SKILL.md`](skills/plancia-ui/SKILL.md), which component
for which need and the rules of the system, and goes on in
[`references/`](skills/plancia-ui/references/): every component and prop,
every class and token, whole recipes. It ships inside the package and is
written so that a coding agent can build a console without reading the
code; it reads just as well for a person.

## What you get

- **Two themes from one file.** Every color lives in `tokens.json`; the
  light theme redefines the same variables, and the build refuses a color
  that exists in one theme only. Every text color reaches 4.5:1 on every
  surface, in both.
- **A console that works on a phone.** Three densities, and a phone or a
  tablet gets the touch one by itself: 44 px rows, 40 px buttons, 16 px
  inputs, no tap target under 32 px. A floating panel becomes a sheet from
  the bottom, the navigation a drawer; one breakpoint, exported.
- **Data at a glance.** Status dots and spinners, freshness chips that turn
  amber and red with age, the NOAA scale tones, legends, sparklines and bars
  on a colorblind-safe palette, with a readout a finger can drag along.
- **Accessible by default, and checked.** Native controls with accessible
  names, one focus ring, live announcements, nothing reachable only by
  hovering. Every pull request runs the showcase at phone width in a real
  Chrome: touch targets, contrast and an axe audit.
- **Small, and yours to read.** No runtime dependencies, `svelte` ≥ 5 as
  the only peer. One component per file, a minute to read. The package
  knows nothing about your domain: the text and the data stay in your app.
- **Ready for coding agents.** The reference above follows the
  [Agent Skills](https://agentskills.io) format, so an agent learns the
  system from one short file, opens the rest only when it needs it, and
  keeps its context for your code.

[![Three phone screens: a sheet over the stage, the drawer in the light theme, a list of layers and its states](https://raw.githubusercontent.com/Tabrigos/plancia-ui/main/docs/images/phone.png)](https://tabrigos.github.io/plancia-ui/recipes.html)

## What is in the box

**Panels and shapes** — `FloatingPanel`, a panel over a stage that becomes
a bottom sheet on a phone; `Drawer`, the navigation sliding in from a side;
`PanelHead`; `Section`, a collapsible part of a console that still reads
when closed.

**Rows and lists** — `KeyValue` and `Stat` for values; `ControlRow` and
`SettingRow` for controls; `List` and `ListItem` for layers and sources
with their details; `ExpandableRow`, a row that opens its detail for a
finger; `MetaRow` for the age and the fine print under a card.

**States and data** — `Chip`, also as a short uppercase label; `Status`;
`Age`; `Notice` for empty, warning and error states; `Skeleton`; `Legend`
and `LegendDots`; `Sparkline` and `Bars`.

**Controls** — `Button`, `Toggle`, `Segmented`, `InfoButton` with its
`InfoCard`, `Kbd`; `Checkbox` and `RadioGroup` with their text beside them,
`Fieldset` to put the controls of one question under a legend,
`Select`, a native select with the look of the theme, `Slider`, a native
range for scrubbing a value, with its value in words and a few marks, and
`Tabs` that swap the panel under them, with one tab stop and the arrow
keys, and `Rail`, the same in a narrow column of icons beside the panel,
for more modes than a row holds.

**For the whole page** — `Tooltip`, one themed tooltip for every `title`,
silent on touch; `LiveRegion` with `announce()` for screen readers; the
theme helpers; `setLabels()` for an app in another language.

## Quick start

```bash
npm install plancia-ui
```

```ts
// the entry point, before the project's own CSS
import 'plancia-ui/tokens.css'
import 'plancia-ui/base.css'
```

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

Light theme: `data-theme="light"` on the root element. `base.css` draws the
focus ring on every focusable element, so drop the project's own `outline`
rules on focus, or the rings become two. The theme helpers, the densities,
labels in another language and every prop are in the
[reference](skills/plancia-ui/SKILL.md).

## For coding agents

The package ships a skill for AI coding assistants in
`skills/plancia-ui/`, versioned with the package: the `metadata.version`
of its `SKILL.md` is the version you installed. Agents do not read
`node_modules` on their own, so a project copies the skill into
`.claude/skills/plancia-ui/`, keeps the copy in git and checks it against
the installed version by content hash after every upgrade, so the agent
reads the guide of the version it actually uses:

```bash
mkdir -p .claude/skills && cp -r node_modules/plancia-ui/skills/plancia-ui .claude/skills/
```

Then read the diff of the copy as you would read code: it is instructions
for your agent. A tool that installs the skill from GitHub
(`npx skills add`) takes the `main` branch, not your version, so it may
describe props you do not have yet. An agent without skills gets a line in
its rules file (`AGENTS.md`, `.cursorrules`): "before touching the UI,
read `node_modules/plancia-ui/skills/plancia-ui/SKILL.md`".

## Documentation

- [`skills/plancia-ui/SKILL.md`](skills/plancia-ui/SKILL.md) — the
  reference: which component for which need, the rules, the usual shape;
  [`references/`](skills/plancia-ui/references/) holds every component and
  prop, every class and token, and the recipes.
- [Showcase](https://tabrigos.github.io/plancia-ui/) and
  [recipes](https://tabrigos.github.io/plancia-ui/recipes.html) — built
  from `main`; locally `cd showcase && npm install && npm run dev`.
- [`docs/tokens.md`](docs/tokens.md) — tokens, themes, densities, fonts.
- [`docs/design-rules.md`](docs/design-rules.md) — the rules the components
  embody, and what does not belong in the package.
- [`CHANGELOG.md`](CHANGELOG.md) — what changed in each version.
- [`docs/roadmap.md`](docs/roadmap.md) — what is likely to come next.
- [`AGENTS.md`](AGENTS.md) — how to change, version and publish the package;
  [`CONTRIBUTING.md`](CONTRIBUTING.md) for the short version.

## License

MIT, © Sidereus Team. See [`LICENSE`](LICENSE).
