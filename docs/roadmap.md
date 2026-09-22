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

## 0.8.0 — consoles at scale

Driven by the reference consumer adopting 0.7.0 (touch, the sheet, the
sparkline readout): what it finds missing or awkward while replacing its
local lists and rows becomes an issue here, and the answers ship together.

1. **`List` / `Row` vocabulary** — the inventory is in #29: the main shape
   is a framed list, a stack of inset cards whose head row is already
   `ControlRow` and whose body often shows only while the item is on; six
   console sections use it, and a dozen plainer lists sit next to them. A
   proposal in the showcase first, then the component or components. It
   overlaps `SettingRow`, `ControlRow` and `KeyValue`: the design decides
   what is a new shape and what is a recipe.
2. **`LayerRow`, or a recipe** — `SettingRow` + `Status` + a color sample.
   If the composition is enough, it is documented as a recipe rather than
   shipped as a component.
3. **Recipes page in the showcase** — a phone layout with a sheet first
   (one sheet at a time, the navigation in a side drawer, the controls in
   a pill), then a full floating panel, a console section with rows and a
   chart, a list with states: the compositions an app (or an agent)
   copies, built only from the package.
4. **Uppercase `Chip` variant** — the short label of a chip in spaced
   uppercase (LIVE, an alert type), the shape a `Badge` would have had.
   The design rules change with it: spaced uppercase is allowed in section
   titles and in the short label of a chip, never in running text.
5. **`Drawer`, a shape** — the frame, the scrim, Esc, focus trapped inside
   and given back, `inert` while closed; the app decides the side, the
   content and when it opens. Extracted from the reference consumer's
   drawer once it is rebuilt there for the phone, as `Tooltip` and
   `FloatingPanel` were.
6. **`Toggle.label` required** — a **Breaking** entry with its migration
   line. Rows are `div`s and give the toggle no name: in the reference
   consumer 12 toggles out of 14 have no accessible name, and the showcase
   has two. SemVer allows the break in 0.x, and 0.4.0 set the precedent.
7. **Fixes and small props** surfaced by the adoption: the focus ring on
   `<summary>` (#30) and the note on an app's own outline rule (#34);
   `LiveRegion` taking an `id` and attributes (#31); a locale for `Age`
   from `setLabels()` and from the page's `lang` (#32); the list of the
   texts the package speaks, guarded by a test (#33).
8. **Phone-width checks in CI** (nothing changes for consumers) — the
   showcase at 390 px with touch emulation, in both themes: nothing
   overflowing, the density tokens in effect, touch targets of at least
   40 px, an axe audit. Measured in the DOM, not compared as pixels;
   screenshots are saved with the results to look at.

## 0.9.0 — inputs

A console design system needs form controls even if the reference
consumer uses few: `Select`, `NumberField`, `Checkbox`, `Radio`, `Tabs`
with panels and keyboard. Designed as one family (same heights as `Button`
and `Toggle`, same focus ring, same tones, touch density from the first
sketch), shipped together.

## Later — waiting for a second use

- `Combobox` (the satellite search), `Transport` (playback pill),
  `Scrubber` (frame slider), `DataTable` (passes list, system console):
  one use each in Sidereus today. When `DataTable` comes, its first column
  must be able to wrap on request: with `nowrap`, a long first column
  squeezes every other one.
- Icon set (close, info, sun/moon, locate, play/pause, expand).
- A high-contrast third theme (`forced-colors`) as a block in `tokens.json`.
- A documented CSS-only path for non-Svelte consumers; a web-components
  build if someone asks.
- An installable PWA is the consumer's job (manifest, service worker);
  the package's part is the touch density and the sheet, in 0.7.0.
- Token export in Style Dictionary / Figma Tokens format.

## Infrastructure, whenever it fits

- Publishing from CI with npm trusted publishing plus staged approval, so
  no token lives on a machine.
- The dataviz palette search (six hue families in OKLCH, every ordering
  scored on the worst adjacent colorblind pair, one order for both themes)
  lives outside the repository for now; if the ramps change, it becomes a
  script here.

## Toward 1.0.0

The major freezes the contract. Before it: every component with tests and
a visual-regression baseline (pixel comparison of the showcase in both
themes, on one operating system, since pixels differ between Windows and
Linux); the reference consumer using the package for every shape it
ships; the skill and the docs complete for an agent to build a console
without reading the code; no open question left.

## Decided

The open questions of 0.7.0, decided on 2026-09-22:

- **`Badge` is a `Chip` variant** (0.8.0, point 4). Spaced uppercase is a
  genre of consoles, the reference consumer uses it in four different
  places, and governing it in the package costs one variant. Rejected: no
  badge at all (the rule stays strict and the visual signal is lost) and a
  separate `Badge` component (two components for one shape).
- **`Drawer` yes, as a shape; `ConsoleShell` never.** Application layout
  stays out of the package, and the rule is only made clearer: layout is
  page grids and page skeletons, while a panel laid over the page with its
  own behavior is a shape, like `FloatingPanel`. A shell that has to bend
  to three applications becomes a pile of props; the reference consumer no
  longer asks for it.
- **`Toggle.label` required in 0.8.0**, not in 1.0 (0.8.0, point 6).
  Rejected: a warning now with the requirement in 1.0, and a name given
  by the row through `aria-labelledby`.
