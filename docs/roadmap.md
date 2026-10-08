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

## 0.11.0 — fullscreen, and a range for scrubbing a value

0.10.0 shipped on 2026-09-29 and the reference consumer adopted it on
2026-09-30. The band was decided on 2026-10-08 from the two issues it
opened since, building a viewer that goes fullscreen and three controls
that scrub through time:

- **`Tooltip` in fullscreen** (#76): an element in fullscreen is drawn
  alone with its subtree, so the tooltip, mounted at the root, is built and
  placed but stays behind it, and the native one is gone too because
  `title` has moved to `data-tip`. The box goes to the top layer with the
  Popover API (`popover="manual"`, `showPopover()`), which also frees it
  from the `overflow` and `z-index` of its ancestors;
- **`Slider`** (#77): a native `<input type="range">` with the look of the
  package, the same in Chromium, Firefox and Safari: a required `label`,
  `min`/`max`/`step`, a bindable `value`, `valueText` for
  `aria-valuetext`, a few `marks` with an optional short label; the track
  filled up to the thumb in the accent; on touch a thumb and a hit area of
  at least `--p-tap-h`, and dragging along the track never scrolls the
  page. It is the `Scrubber` of Later, now with two uses in the reference
  consumer and a third coming;
- **a playback recipe**: play/pause and "now" as `Button`s around a
  `Slider`, the shape the reference consumer draws twice. The buttons stay
  the app's, so the recipe takes the place of a `Transport` component.

Not in this band: the section of the skill on dressing the theme in
another brand (Later), the infrastructure toward 1.0.

## Later — waiting for a second use

- `Field`, the error state of a field and `NumberField`, waiting for a
  first use: the reference consumer asks for no typed input (#59). Designed
  on 2026-09-26 so they start from somewhere: `Field` binds a visible label
  with `<label for>` and ties a hint and an error to the control with
  `aria-describedby`, hint first; the error is set by the app after it
  validates, with `aria-invalid` and a border token at 3:1 in both themes,
  never a `role="alert"` of its own; `NumberField` is `type="text"` with
  `inputmode`, none when a negative value is allowed.
- `Combobox` (the satellite search), `DataTable` (passes list, system
  console), `Steps` (the steps of a lesson: "step 4 of 10" read by screen
  readers too, back and next, an index, the keys of a presentation remote,
  the buttons always in view on a phone): one use each in Sidereus today.
  When `DataTable` comes, its first column must be able to wrap on
  request: with `nowrap`, a long first column squeezes every other one.
- A section of the skill on dressing the theme in another brand: the app
  overrides the tokens from a sheet of its own switched on by
  `data-brand`, rebuilds `soft` and `glow` with `color-mix` and checks the
  contrast again; `base.css` is global, so a console embedded in a portal
  goes in an `<iframe>`.
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

The major freezes the contract, and it is not the next step after 0.9: the
package goes on by minors (0.10.0, 0.11.0, …) until it has several
consumers, not only the reference one, and a feature set that has stopped
moving (decided on 2026-09-27). Before it, besides: every component with
tests and a visual-regression baseline (pixel comparison of the showcase in
both themes, on one operating system, since pixels differ between Windows
and Linux); every shape it ships used by at least one consumer; the skill
and the docs complete for an agent to build a console without reading the
code; no open question left.

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
