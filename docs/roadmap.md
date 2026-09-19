# Roadmap

What plancia-ui is likely to grow next, in order. It is a plan, not a
promise: a line moves when a consumer needs it or when the design is clear.
The rule for a new component still applies (`AGENTS.md` §3): the same shape
needed in more than one place, knowing nothing about the domain. Requests
from consumers arrive as GitHub issues; this file is updated with every
release, next to the changelog.

Releases follow the maintainer's policy: a minor collects substantial
work and ships when its whole band is merged; a patch ships only for a
small fix a consumer needs now.

## 0.7.0 — consoles at scale

The band is driven by the reference consumer adopting 0.6.0: what it
finds missing or awkward while replacing its local panels, sections and
charts becomes an issue here, and the answers ship together.

1. **`List` / `Row` vocabulary** — the dense list with label, value,
   controls and attribution row (raster layers, active regions, events in
   Sidereus). Designed first, on the real usages: an inventory of the
   consumer's list markup, a proposal in the showcase, then the component
   or components. It overlaps `SettingRow` and `KeyValue`: the design
   decides what is a new shape and what is a recipe.
2. **`LayerRow`, or a recipe** — `SettingRow` + `Status` + a color sample.
   If the composition is enough, it is documented as a recipe rather than
   shipped as a component.
3. **Recipes page in the showcase** — a full floating panel, a console
   section with rows and a chart, a list with states: the compositions an
   app (or an agent) copies, built only from the package.
4. **Fixes and small props** surfaced by the adoption (`FloatingPanel` in
   three panels, `Section` in eleven, `InfoCard` for the data sheets,
   `Bars` for Kp, `Sparkline` for X-ray and wind).

## 0.8.0 — inputs

A console design system needs form controls even if the reference
consumer uses few: `Select`, `NumberField`, `Checkbox`, `Radio`, `Tabs`
with panels and keyboard. Designed as one family (same heights as `Button`
and `Toggle`, same focus ring, same tones), shipped together.

## Later — waiting for a second use, or for a decision

- `Combobox` (the satellite search), `Transport` (playback pill),
  `Scrubber` (frame slider), `DataTable` (passes list, system console):
  one use each in Sidereus today.
- Icon set (close, info, sun/moon, locate, play/pause, expand).
- A high-contrast third theme (`forced-colors`) as a block in `tokens.json`.
- A documented CSS-only path for non-Svelte consumers; a web-components
  build if someone asks.
- Token export in Style Dictionary / Figma Tokens format.

## Infrastructure, whenever it fits

- Visual regression of the showcase in both themes (Playwright screenshots)
  and an axe audit in CI.
- Publishing from CI with npm trusted publishing plus staged approval, so
  no token lives on a machine.
- The dataviz palette search (six hue families in OKLCH, every ordering
  scored on the worst adjacent colorblind pair, one order for both themes)
  lives outside the repository for now; if the ramps change, it becomes a
  script here.

## Toward 1.0.0

The major freezes the contract. Before it: every open question below
decided; every component with tests and a visual-regression baseline; the
reference consumer using the package for every shape it ships; the skill
and the docs complete for an agent to build a console without reading the
code.

## Open questions

- **`Badge`** (LIVE, alert types) would be the second use of spaced
  uppercase, which the design rules reserve to `p-sec-title`. Either a
  `Chip` variant with the rule amended, or nothing.
- **`Drawer` and `ConsoleShell`** are application layout, which `AGENTS.md`
  keeps out of the package. Taking them means changing that rule on purpose.
- **`Toggle.label`** is optional but a toggle without it has no accessible
  name: required in 1.0, or documented more loudly before.
