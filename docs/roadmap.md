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

## 0.7.0 — the phone is the first screen

Most people open the reference consumer on a phone: a shared link, the
device at hand. The band is touch, plus the first two requests that came
from adopting 0.6.0. The package stays out of application layout: what it
adds are shapes and tokens, and the app decides where they go.

1. **`touch` density** — a third `data-density`, applied by itself on
   `pointer: coarse` when the app sets none: rows of 44 px, taller
   buttons and toggles, 16 px text in inputs (so iOS does not zoom on
   focus). Control heights become tokens on the way, instead of numbers
   written in the components. (#21)
2. **Hover and tooltip on touch** — hover styles behind `hover: hover`
   everywhere, so a tap does not leave a stuck highlight; `Tooltip` stays
   silent on touch, where `InfoButton` is the way to explain something.
   (#22)
3. **`FloatingPanel` as a bottom sheet** under the phone breakpoint: the
   head fixed, the body scrolling, closed from the button; safe-area
   insets and dynamic viewport height. Drag gestures only if a consumer
   asks. (#24)
4. **One breakpoint, exported** — 700 px separates a phone from the rest
   and is exported from `plancia-ui/theme` as a constant, so the consumer
   stops repeating the number. A component adapts to its content and to
   the space it is in (`KeyValue` drops a long value to a full line,
   `MetaRow` wraps), never to the screen: only `FloatingPanel` looks at
   the screen, because the screen is its container. Container queries
   were tried on paper and left out: `container-type` zeroes the
   min-content width of a flex item, a trap for consumers. (#25)
5. **Showcase on a phone** — fits 390 px, the density switch gains `auto`
   and `touch`, `?density=` in the URL, a readout of the tokens the page
   really got; every change is looked at in Chrome's device emulation
   while working and on a real phone before a release. (#23)
6. **From the adoption of 0.6.0** — `Section.summaryTitle` (#19);
   `Sparkline` with gaps (`null` lifts the pen), a zero baseline, a marker
   at an index, and a readout that follows the pointer and, on a phone,
   the finger (#20).

## 0.8.0 — consoles at scale

Driven by the reference consumer adopting 0.7.0: what it finds missing or
awkward while replacing its local lists and rows becomes an issue here,
and the answers ship together.

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
   section with rows and a chart, a list with states, a phone layout with
   a sheet: the compositions an app (or an agent) copies, built only from
   the package.
4. **Fixes and small props** surfaced by the adoption.

## 0.9.0 — inputs

A console design system needs form controls even if the reference
consumer uses few: `Select`, `NumberField`, `Checkbox`, `Radio`, `Tabs`
with panels and keyboard. Designed as one family (same heights as `Button`
and `Toggle`, same focus ring, same tones, touch density from the first
sketch), shipped together.

## Later — waiting for a second use, or for a decision

- `Combobox` (the satellite search), `Transport` (playback pill),
  `Scrubber` (frame slider), `DataTable` (passes list, system console):
  one use each in Sidereus today.
- Icon set (close, info, sun/moon, locate, play/pause, expand).
- A high-contrast third theme (`forced-colors`) as a block in `tokens.json`.
- A documented CSS-only path for non-Svelte consumers; a web-components
  build if someone asks.
- An installable PWA is the consumer's job (manifest, service worker);
  the package's part is the touch density and the sheet, in 0.7.0.
- Token export in Style Dictionary / Figma Tokens format.

## Infrastructure, whenever it fits

- Visual regression of the showcase in both themes and at phone width
  (Playwright screenshots) and an axe audit in CI.
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
