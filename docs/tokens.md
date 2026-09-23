# Tokens, themes, density, fonts

plancia-ui is three layers. Each one can be used without the next: the
tokens alone work in any project, even without Svelte.

## 1. Tokens (`plancia-ui/tokens.css`)

CSS custom properties, all prefixed `--p-`, generated from
`src/tokens.json` by `npm run tokens` (`scripts/build-tokens.mjs`).
`tokens.json` is the single source: a color, a size or a z-index is never
written by hand anywhere else. Each group of the JSON becomes a prefix:

| Group | Tokens | Notes |
|---|---|---|
| surfaces | `bg`, `s1`, `s2`, `s3`, `inset`, `s1a`, `s3a`, `hover` | `s1a` and `s3a` are translucent, for floating panels |
| borders | `border`, `border-soft`, `border-strong` | |
| text | `text-hi`, `text`, `text-dim` | |
| semantic colors | `accent` (+ `accent-ink`), `ok`, `warn`, `yellow`, `orange`, `danger`, `info`, `neutral`, each with a `-soft` background variant | `accent-ink` is the text color on an accent background |
| glows | `accent-glow`, `ok-glow`, `warn-glow`, `danger-glow` | box shadows for status dots and active states |
| shadows | `sh1`, `sh2` | |
| NOAA scale | `scale-0` … `scale-5` | the ramp of the R/S/G scale levels |
| dataviz, categorical | `viz-1` … `viz-6` | series identity, in a fixed order (see below) |
| dataviz, sequential | `seq-1` … `seq-7` | magnitude, one hue, from near-zero (`seq-1`) to full |
| dataviz, diverging | `div-1` … `div-7` | polarity, blue to red, `div-4` the neutral midpoint |
| typography | `font-ui`, `font-mono`; `t11` `t12` `t13` `t14` `t16` `t20` `t28` | seven sizes, 11 px minimum |
| spacing | `space-1` (4 px) `space-2` (8) `space-3` (12) `space-4` (16) `space-6` (24) `space-8` (32) | a 4 px grid |
| radii | `r1` (4 px) `r2` (8) `r3` (12) `r-pill` | |
| density | `row`, `row-h`, `control-h`, `control-h-sm`, `toggle-w`, `toggle-h`, `input-size` | row padding and height, control sizes, input text: three densities, see below |
| z-index | `z-base` `z-overlay` `z-panel` `z-popover` `z-modal` `z-tooltip` | named layers, bottom to top, never a number in a component; a tooltip is above everything, a modal included |
| motion | `motion-fast` (120 ms), `motion-base` (200 ms), `motion-ease` | |
| focus | `focus` | the focus ring shadow used by `base.css` |

A project that already has tokens of its own can declare them as aliases of
the `--p-*` ones and migrate at its own pace; that is what Sidereus does.

## 2. Base styles (`plancia-ui/base.css`)

A minimal reset, body typography and colors, links, the surface classes
(`p-panel`, `p-card`, `p-inset`, `p-divider`), the section title
(`p-sec-title`, the only spaced uppercase in the system with `Chip
uppercase`), text utilities
(`p-mono`, `p-dim`, `p-hi`, `p-t11` … `p-t28`, `p-w500`, `p-w600`,
`p-nowrap`, `p-ellipsis`), `p-help` (help cursor, goes with a `title`),
`p-sr-only` (screen readers only), `p-dot` (status dot with its glow),
`p-spinner` (12 px loading spinner), the
focus ring on every focusable element, `prefers-reduced-motion` and thin
scrollbars. Everything is written with tokens; no fixed color anywhere.

## 3. Components

Fourteen Svelte 5 components, one per file, each with its own scoped CSS
written with tokens only. The list with the main props is in the root
`README.md`; the complete reference is `skills/plancia-ui/SKILL.md`.

## Loading order

In the entry point, once, before the project CSS:

```ts
import 'plancia-ui/tokens.css'
import 'plancia-ui/base.css'
import './styles/app.css'
```

The order matters: the project CSS may rely on the tokens and override the
base styles, never the other way around.

## The two themes

Dark is the native theme and lives on `:root`. Light lives under
`[data-theme="light"]` and redefines **the same** color variables: surfaces,
text, semantic colors, glows, shadows and the NOAA scale ramp. Typography,
spacing, radii, z-index and motion do not change with the theme.

In `tokens.json` the `light` block mirrors the `color`, `scale`, `glow` and
`shadow` groups key by key; the generator stops if a key exists on one side
only, so a new color token cannot be born without its light counterpart.
The light block also sets `color-scheme: light`.

**The package never decides when to apply the light theme.** The project
puts `data-theme="light"` on the root element, ideally before the first
render. The helpers exported from `plancia-ui/theme` (plain JavaScript, no
component behind them) do the mechanical part with
a storage key the project chooses: `applyStoredTheme('myapp.theme')` in the
entry point before mount, `rememberTheme(theme, 'myapp.theme')` when the
user switches, `readRequestedTheme()` for a `?theme=light` deep link,
`parseTheme` and `applyTheme` for the pieces. The same entry exports the
phone breakpoint, `PHONE_BREAKPOINT` (700 CSS pixels), `PHONE_MEDIA` for
`matchMedia` and `isPhone()`: the project's own phone CSS writes the same
number, since a custom property cannot enter a media query. In light the semantic colors are darker: every text color reaches 4.5:1
on every surface and on its own `-soft` background (a chip, a pressed
button), which the phone-width check in CI verifies with axe. Whatever
draws with those colors on a `<canvas>` or in a 3D engine, which do not
read custom properties, decides by itself whether to follow the theme. In Sidereus the globe, the Sun disk and the heliosphere
stay dark because they are space.

## Density

Three densities: compact (default), comfortable and touch. `data-density`
on the root element or on any container switches the density tokens for
everything inside it, so a comfortable list and a compact list can coexist
on the same page. Components read the tokens for their row padding and
height (`row`, `row-h`), the height of buttons and small icon buttons
(`control-h`, `control-h-sm`), the size of the switch (`toggle-w`,
`toggle-h`) and the text size of inputs (`input-size`).

| | compact | comfortable | touch |
|---|---|---|---|
| `row` / `row-h` | 8 / 32 px | 12 / 40 px | 12 / 44 px |
| `control-h` / `control-h-sm` | 32 / 26 px | 32 / 26 px | 40 / 32 px |
| `toggle-w` × `toggle-h` | 34 × 20 px | 34 × 20 px | 44 × 26 px |
| `input-size` | 13 px | 13 px | 16 px |

Touch is sized for a finger: a 44 px row, a 40 px button, a small button
of 32 px (the close of a panel, the info circle's tap target), and 16 px
input text because iOS zooms the page when a focused input is smaller. A
coarse pointer (a phone, a tablet: `@media (pointer: coarse)`) gets the
touch density by itself, unless the root element sets a density, so a
console reads well on a phone without the app doing anything. The app that
wants to decide sets `data-density` on the root and wins.

## Fonts

The tokens name `Inter` for the interface and `JetBrains Mono` for
telemetry, each with system fallbacks (`Segoe UI`, `system-ui`, `Consolas`).
The package ships no font files: the project loads them if it wants them.
The showcase self-hosts both (SIL Open Font License).

## Dataviz tokens

Charts take their colors from three ramps, redefined by the light theme like
every other color, and computed rather than picked: each theme's set was
validated on the card surface (`--p-s2`) for lightness band, chroma floor,
colorblind separation between adjacent slots (protan and deutan simulated;
worst adjacent pair ΔE 12.4 in OKLab ×100, target 8) and 3:1 contrast.

- **Categorical** `--p-viz-1` … `--p-viz-6`: blue, rose, lime, violet,
  orange, teal. Assign in this order, never cycled, and let the color follow
  the entity (a filter that removes series must not repaint the survivors);
  a seventh series folds into "Other" or becomes a small multiple. With
  more than three series where any two marks can touch (scatter, maps), keep
  a secondary encoding: labels, gaps, texture.
- **Sequential** `--p-seq-1` … `--p-seq-7`: the accent hue from near-zero,
  which recedes toward the surface, to full. For discrete ordered marks
  (tiers, buckets) start at `--p-seq-2`: the first step sits under 2:1 on
  purpose.
- **Diverging** `--p-div-1` … `--p-div-7`: blue for one side, red for the
  other, three steps each, `--p-div-4` a neutral gray that reads as
  "nothing". Equal steps per arm.

The status tokens (`ok`, `warn`, `orange`, `danger`) keep their meaning in
charts: a series that *means* good or bad wears them, with an icon or a
label, and a series that is just "series 5" never does. Slot 5 sits close
to the status orange in the dark theme, so that rule matters there. Text in
a chart wears the text tokens, never the series color.

## Changing the tokens

Edit `src/tokens.json` and run `npm run tokens`; `npm run build` does it
before `svelte-package`, and `prepublishOnly` before every publication, so
the committed `tokens.css` can never drift from the JSON (CI checks the two
are identical). A new token goes in both themes. Renaming a token is a
breaking change: consumers such as Sidereus test the token names of the
installed package on purpose.
