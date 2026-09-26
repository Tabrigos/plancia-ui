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

## 0.9.0 — inputs

A console design system needs form controls even if the reference
consumer uses few: `Select`, `NumberField`, `Checkbox`, `Radio`, `Tabs`
with panels and keyboard. Designed as one family (same heights as `Button`
and `Toggle`, same focus ring, same tones, touch density from the first
sketch), shipped together, each with its recipe and checked at phone
width in CI from the start.

Decided on 2026-09-26, with the band:

- **`Field`**, the one way a control is named: a visible label bound
  with `<label for>`, a hint and an error message tied to the control
  with `aria-describedby`, hint first. It generates the ids, so no control
  repeats `label`/`hint`/`error` props of its own. `SettingRow` stays the
  label-left, control-right shape of a setting;
- **an error state for a field**, set by the app after it validates (the
  package never validates): `aria-invalid` and the message tied to the
  control, not a `role="alert"` of its own; a border token for it in both
  themes, 3:1 against the surface; the skill says to validate on submit,
  not when the user leaves a field;
- **`Tooltip` adds its id to the anchor's `aria-describedby`** instead of
  replacing it while it shows, so a field's hint and error are still read
  on focus;
- the order: `Tooltip`, then `Checkbox` and `Radio` (short lists go to
  radios, so `Select` is for long ones), `Field` and the error state,
  `Select`, `NumberField` (`type="text"` with `inputmode`, none when a
  negative value is allowed), `Tabs` last, then the recipes "a settings
  form" and "a filter bar". The inventory of the reference consumer's
  form controls, asked for as an issue, adjusts `Select`, `NumberField`
  and `Field` when it comes.

Next to them, what the reference consumer finds while it adopts 0.8.0
(its lists on `List` and `ExpandableRow`, its drawer on `Drawer`) becomes
issues here, as `Bars.readout` and `ExpandableRow` came from its phone work
for 0.8.0.

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

The open questions of 0.7.0, decided on 2026-09-22 and shipped in 0.8.0:

- **`Badge` is a `Chip` variant** (`Chip uppercase`). Spaced uppercase is a
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
- **`Toggle.label` required in 0.8.0**, not in 1.0: rows are `div`s and
  do not name the toggle, and 12 toggles out of 14 in the reference
  consumer had no accessible name. Rejected: a warning now with the requirement in 1.0, and a name given
  by the row through `aria-labelledby`.
