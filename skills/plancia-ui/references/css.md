# plancia-ui — base classes and tokens

Contents: [Base classes](#base-classes-basecss) · [Tokens](#tokens-tokenscss-all---p-) ·
[The light theme](#the-light-theme) · [Densities](#densities)

What `plancia-ui/base.css` and `plancia-ui/tokens.css` give the project's
own CSS. The rules for using them (tokens only, no text under 11 px,
transparency with `color-mix`) are in `SKILL.md`.

## Base classes (`base.css`)

- surfaces: `p-panel` (floating panel: s3a, border, r3, shadow), `p-card`
  (s2, border, r2), `p-inset` (inset, border, r2), `p-divider` (top border);
- section title: `p-sec-title` (11 px, 600, uppercase spaced, the ui font:
  with `Chip uppercase`, the only spaced uppercase in the system); also the
  header of a table column, on the header cell, text written in normal case
  (the package has no table component);
- detail line: `p-detail` (11 px, ui font, dim, 1.45, wraps), under the
  element it explains: the fact that would otherwise live only in a `title`,
  which a touch screen never shows. The look of the detail of
  `ExpandableRow`, for when there is nothing to open;
- text: `p-mono`, `p-hi`, `p-dim`, `p-t11` `p-t12` `p-t13` `p-t14` `p-t16`
  `p-t20` `p-t28`, `p-w500`, `p-w600`, `p-nowrap`, `p-ellipsis`;
- `p-help` (help cursor, goes with a `title`), `p-sr-only` (screen readers
  only: live regions, off-screen labels);
- `p-dot` status dot, with `ok` / `warn` / `danger` / `accent` for the color
  and its glow; `p-spinner`, the 12 px loading spinner;
- inherited: body font and colors, links in accent and underlined, visible
  focus ring on every focusable element, `prefers-reduced-motion`, thin
  scrollbars.

## Tokens (`tokens.css`, all `--p-*`)

Written in full, as the project's CSS uses them: `var(--p-text-dim)`.

- surfaces: `--p-bg`, `--p-s1`, `--p-s2`, `--p-s3`, `--p-inset`, `--p-s1a`,
  `--p-s3a` (translucent), `--p-hover`; borders: `--p-border`,
  `--p-border-soft`, `--p-border-strong`;
- text: `--p-text-hi`, `--p-text`, `--p-text-dim`;
- semantic colors, each with a `-soft` background variant (`--p-ok-soft`):
  `--p-accent` (plus `--p-accent-ink` for text on accent), `--p-ok`,
  `--p-warn`, `--p-yellow`, `--p-orange`, `--p-danger`, `--p-info`,
  `--p-neutral`; glows: `--p-accent-glow`, `--p-ok-glow`, `--p-warn-glow`,
  `--p-danger-glow`; shadows: `--p-sh1`, `--p-sh2`;
- NOAA scale ramp: `--p-scale-0` … `--p-scale-5`;
- dataviz: `--p-viz-1` … `--p-viz-6` (categorical: blue, rose, lime,
  violet, orange, teal, assigned in this order and never cycled; a 7th
  series folds into "Other"), `--p-seq-1` … `--p-seq-7` (sequential, accent
  hue, near-zero to full; discrete marks start at `--p-seq-2`),
  `--p-div-1` … `--p-div-7` (diverging, blue to red, `--p-div-4` the
  neutral midpoint). Validated per theme for colorblind separation and 3:1
  contrast on the card surface. A series that means good or bad wears the
  status tokens with an icon or label, never a `viz` slot; chart text wears
  the text tokens, never the series color;
- typography: `--p-font-ui`, `--p-font-mono`, sizes `--p-t11` `--p-t12`
  `--p-t13` `--p-t14` `--p-t16` `--p-t20` `--p-t28` (11 px minimum, no
  smaller text anywhere);
- spacing (4 px grid): `--p-space-1` (4) `--p-space-2` (8) `--p-space-3`
  (12) `--p-space-4` (16) `--p-space-6` (24) `--p-space-8` (32); radii:
  `--p-r1` (4) `--p-r2` (8) `--p-r3` (12) `--p-r-pill`;
- density (see below): `--p-row`, `--p-row-h`, `--p-control-h`,
  `--p-control-h-sm`, `--p-toggle-w` / `--p-toggle-h`, `--p-input-size`,
  `--p-tap-h`, `--p-rail-w`;
- z-index, bottom to top: `--p-z-base` `--p-z-overlay` `--p-z-panel`
  `--p-z-popover` `--p-z-modal` `--p-z-tooltip`; motion:
  `--p-motion-fast`, `--p-motion-base`, `--p-motion-ease`; `--p-focus` (the
  focus ring shadow).

`--p-floating-max-height` is not a token: a property the app may set on a
`FloatingPanel` for the height its body scrolls inside (when unset,
`calc(100dvh - 110px)`, and `60dvh` on a phone).

## The light theme

The light theme redefines every color token (surfaces, text, semantic,
glows, shadows, scale) under `[data-theme="light"]`; typography, spacing,
radii and motion do not change. Semantic colors are darker in light (amber,
yellow, green readable on white). Every text color reaches 4.5:1 on every
surface, in both themes.

## Densities

`data-density` on the root or on a container switches the density tokens:
`row` (row padding), `row-h` (row height), `control-h` (button height) and
`control-h-sm` (small button), `toggle-w` / `toggle-h`, `input-size` (input
text), `tap-h` (the least height of a line of text that is a tap target),
`rail-w` (the column of a `Rail`).

In px, from `tokens.css`:

| Density | `row` | `row-h` | `control-h` | `control-h-sm` | `toggle-w`×`toggle-h` | `input-size` | `tap-h` | `rail-w` |
|---|---|---|---|---|---|---|---|---|
| `compact` (default) | 8 | 32 | 32 | 26 | 34×20 | 13 | 0, natural | 64 |
| `comfortable` | 12 | 40 | 32 | 26 | 34×20 | 13 | 0, natural | 64 |
| `touch` | 12 | 44 | 40 | 32 | 44×26 | 16 | 32 | 56 |

A coarse pointer (phone, tablet) gets `touch` by itself when the root sets
no density.
