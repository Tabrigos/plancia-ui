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
| typography | `font-ui`, `font-mono`; `t11` `t12` `t13` `t14` `t16` `t20` `t28` | seven sizes, 11 px minimum |
| spacing | `space-1` (4 px) `space-2` (8) `space-3` (12) `space-4` (16) `space-6` (24) `space-8` (32) | a 4 px grid |
| radii | `r1` (4 px) `r2` (8) `r3` (12) `r-pill` | |
| density | `row`, `row-h` | row padding and row height, see below |
| z-index | `z-base` `z-overlay` `z-panel` `z-popover` `z-tooltip` `z-modal` | named layers, never a number in a component |
| motion | `motion-fast` (120 ms), `motion-base` (200 ms), `motion-ease` | |
| focus | `focus` | the focus ring shadow used by `base.css` |

A project that already has tokens of its own can declare them as aliases of
the `--p-*` ones and migrate at its own pace; that is what Sidereus does.

## 2. Base styles (`plancia-ui/base.css`)

A minimal reset, body typography and colors, links, the surface classes
(`p-panel`, `p-card`, `p-inset`, `p-divider`), the section title
(`p-sec-title`, the only spaced uppercase in the system), text utilities
(`p-mono`, `p-dim`, `p-hi`, `p-t11` … `p-t28`, `p-w500`, `p-w600`,
`p-nowrap`, `p-ellipsis`), `p-help` (help cursor, goes with a `title`),
`p-sr-only` (screen readers only), `p-dot` (status dot with its glow), the
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
render (Sidereus reads a preference from `localStorage` in every entry
point). In light the semantic colors are darker (amber, yellow and green
readable on white): whatever draws with those colors on a `<canvas>` or in
a 3D engine, which do not read custom properties, decides by itself whether
to follow the theme. In Sidereus the globe, the Sun disk and the heliosphere
stay dark because they are space.

## Density

Two densities: compact (default) and comfortable. `data-density="comfortable"`
on the root element or on any container switches `--p-row` and `--p-row-h`
for everything inside it. Components read those two tokens for their row
padding and height, so a comfortable list and a compact list can coexist on
the same page.

## Fonts

The tokens name `Inter` for the interface and `JetBrains Mono` for
telemetry, each with system fallbacks (`Segoe UI`, `system-ui`, `Consolas`).
The package ships no font files: the project loads them if it wants them.
The showcase self-hosts both (SIL Open Font License).

## Changing the tokens

Edit `src/tokens.json` and run `npm run tokens`; `npm run build` does it
before `svelte-package`, and `prepublishOnly` before every publication, so
the committed `tokens.css` can never drift from the JSON (CI checks the two
are identical). A new token goes in both themes. Renaming a token is a
breaking change: consumers such as Sidereus test the token names of the
installed package on purpose.
