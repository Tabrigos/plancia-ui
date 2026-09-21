---
name: plancia-ui
description: Use the plancia-ui design system (CSS tokens, base styles and Svelte 5 components for dense consoles, dark and light theme) in a project. Use it when building or touching UI in a Svelte 5 project that depends on plancia-ui, or when a console, dashboard or control panel needs a theme. Complete reference of props, classes and tokens - no need to read the package sources.
---

# plancia-ui — using it in a project

npm package `plancia-ui` (MIT, Svelte 5, no runtime dependencies). This
file is the complete reference of the public API: components and props, base
classes, tokens, rules. It ships inside the package at
`node_modules/plancia-ui/skills/plancia-ui/SKILL.md`, so the copy next to the
installed version is the one that matches it. `npm view plancia-ui version`
tells the latest published version; `CHANGELOG.md` in the same folder says
what changed.

## Install (once per project)

1. `npm install plancia-ui` (peer: `svelte` ≥ 5; the bundler must compile
   `.svelte` files, so `@sveltejs/vite-plugin-svelte` or equivalent).
2. In the entry point, BEFORE the project CSS and in this order:
   ```ts
   import 'plancia-ui/tokens.css'
   import 'plancia-ui/base.css'
   import './styles/app.css'
   ```
3. Theme: dark is `:root`; light is enabled by putting `data-theme="light"`
   on the root element BEFORE mount (the package never decides it). The
   helpers do it with a storage key the app chooses, imported from
   `plancia-ui/theme` (plain JavaScript, loads in Node and in tests without
   the Svelte compiler; the package index re-exports them too but pulls in
   the components): `applyStoredTheme('myapp.theme')` in the entry point, then
   `rememberTheme(theme, 'myapp.theme')` when the user switches;
   `readRequestedTheme()` reads `?theme=light` from the URL, `applyTheme`
   and `parseTheme` are the pieces. Density: `data-density="comfortable"`
   or `"touch"` on the root or on a container (default is compact). A
   coarse pointer (phone, tablet) gets `touch` by itself when the root sets
   no density: rows 44 px, buttons 40, small buttons 32, toggles 44×26,
   16 px text in inputs. Set a density on the root only to override that.
4. Fonts: the tokens name Inter (ui) and JetBrains Mono (mono) with system
   fallbacks; the package ships no font files, the project loads them if it
   wants them.
5. Labels: the components speak English by default (close button of
   `PanelHead`, `Skeleton` region, `InfoButton`). In another language call
   once, before mount, `setLabels({ close: 'Chiudi', loading: 'Caricamento',
   info: "Cos'è questo dato" })` from
   `plancia-ui/labels` (plain JavaScript, like `plancia-ui/theme`); a prop
   passed to a component still wins.

Never alias the package sources: the contract is `dist`.

## Which component for which case

| Need… | Use | Notes |
|---|---|---|
| an action | `Button` | one primary per panel |
| status, scale level, band, counter | `Chip` | `scaleTone(level)` for NOAA levels 0–5 |
| a switch | `Toggle` | a real checkbox, `bind:checked` |
| label / value row | `KeyValue` | label never wraps, a long value drops to its own line, whole |
| big number with a label | `Stat` | |
| head of a floating panel | `PanelHead` | close button always last |
| a whole panel floating over a stage (globe, map) | `FloatingPanel` | frame + head + scrolling body, Esc, focus return; the app positions it |
| themed tooltips instead of the native `title` ones | `Tooltip` | mount once at the root; keep writing `title` |
| the (i) that opens an explanation | `InfoButton` | a disclosure button; the card is `InfoCard` |
| the frame of an explanation ("what is this datum") | `InfoCard` | native `<details>` with `summary`, or always open with a close button |
| a key in a hint ("Esc closes") | `Kbd` | |
| telling screen readers what happened on the stage | `LiveRegion` + `announce()` | mount once; call from a store |
| the shape of a series next to its value | `Sparkline` | no axes; numbers written by the app |
| a short series of magnitudes (Kp over a day) | `Bars` | zero baseline; a status token per bar when it means a level |
| loading | `Skeleton` | |
| empty / info / warning / error state | `Notice` | the only vocabulary for states |
| gradient legend of a layer | `Legend` | |
| dot legend of what is drawn elsewhere | `LegendDots` | globe, canvas |
| metadata under a card | `MetaRow` | data age, thresholds, notes, small actions |
| exclusive choice among a few options | `Segmented` | `size="sm"` inline |
| head of a card: label + controls | `ControlRow` | |
| list row of a console: icon, name, control | `SettingRow` | layers, settings |
| collapsible section of a console | `Section` | state owned by the app, summary readable while closed |
| inline state of a datum or layer (spinner, dot) | `Status` | the glance inside a row; `Notice` is the block message |
| freshness of a datum ("3m ago") | `Age` | a chip that turns warn/danger with age |

## Component reference

Import: `import { Button, Chip, … , scaleTone } from 'plancia-ui'`.
Types: `Tone`, `ButtonVariant`, `ButtonSize`, `NoticeKind`, `SegmentedItem`,
`LegendDot`, `StatusKind`, `Labels`, `Theme`. `Tone` = `neutral | accent | ok | warn | orange | danger | info`.
"Content" means the children of the component. Snippets are Svelte 5
`{#snippet name()}…{/snippet}` blocks placed inside the component.

**`Button`** — `variant?: 'primary' | 'secondary' | 'quiet' | 'icon'`
(default `secondary`), `size?: 'md' | 'sm'` (`md`), `active?: boolean`
(pressed state for view toggles, sets `aria-pressed`). Content is the label.
Accepts every native `<button>` attribute (`onclick`, `title`, `disabled`,
`type`, `aria-*`). `icon` is square: give it a `title`.

**`Chip`** — `tone?: Tone` (`neutral`), `count?: boolean` (low 18 px counter
variant), `small?: boolean` (same low height but with the tone, for scales in
tables), `color?: string` (a free color, e.g. a satellite group's: background
and border derive from it and override the tone). Content is the text, 22 px
monospace. Accepts native `<span>` attributes (`title`).

**`Toggle`** — `checked?: boolean` (bindable, `false`), `disabled?: boolean`,
`label?: string` (accessible name: pass it, the visible text usually sits in
the row next to it), `title?: string`, `onchange?: (checked: boolean) => void`.
Renders a real `<input type="checkbox">`.

**`KeyValue`** — `label: string`, `sub?: string` (secondary second line),
`subTone?: Tone`, `tone?: Tone` (colors the value), `title?: string` (native
tooltip explaining the datum), `id?: string`. Content is the value, monospace.
The label never wraps; a value that does not fit drops to its own full line,
never split, never truncated, never overlapping the label.

**`Stat`** — `label: string`, `sub?: string`, `tone?: Tone`, `title?: string`,
`id?: string`. Content is the value (monospace, 16 px). Label is small caps.

**`PanelHead`** — `title: string`, `subtitle?: string` (monospace),
`subtitleTitle?: string` (tooltip on the subtitle), snippet `chips` (under
the title), snippet `actions` (right side), `onclose?: () => void` (renders
the close button, always last), `closeLabel?: string` (accessible name and tooltip
of the close button; default from `setLabels()`, `'Close'`).

**`FloatingPanel`** — `title: string`, `subtitle?`, `subtitleTitle?`, snippets
`chips` and `actions`, `onclose?: () => void` (the close button and Esc call
it; the app then removes the panel), `closeLabel?`, `opener?: HTMLElement |
string` (element or id that opened it: focus goes back to it on close if it
was inside), `autofocus?: boolean` (`false`; move focus into the panel on
mount), `label?: string` (accessible name; the title when absent), `class`
and other attributes forwarded (`id`, `data-*`, `style`). Content is the
body, which scrolls inside `--p-floating-max-height` (default
`calc(100vh - 110px)`). Renders `role="dialog"`. The app positions it with
a class of its own (`position`, `top`, `right`, `width`; keep it a class,
not an id, so the package's rule under 700 px — full width with gutters —
can win). The package keeps no open/closed state: render it when open.

**`Tooltip`** — mount `<Tooltip />` once, at the app root. `delay?: number`
(`180` ms between hover and tooltip; focus shows it at once), `maxWidth?:
number` (`300`), `gap?: number` (`8`), `avoid?: string` (selector of the
elements it should not cover, e.g. `'.p-floating'`; the element's own panel
does not count). Delegated: any element with `title` gets the themed tooltip,
the text moves to `data-tip` so the browser shows nothing of its own; while
visible the anchor has `aria-describedby`. Esc, pointerdown, scroll and
blur hide it. Write `title` as before; nothing else changes.

**`InfoButton`** — `active?: boolean` (`aria-expanded`), `onclick?`,
`controls?: string` (id of the `InfoCard` it opens, `aria-controls`),
`label?: string` (accessible name and tooltip; default from `setLabels()`,
`'What is this'`). 20 px, quiet, accent when active.

**`InfoCard`** — with `summary?: string` it is a native `<details>` (`open`
bindable, `false`); without, an always-open `role="region"` named by
`label?: string`, with a close button when `onclose?` is given
(`closeLabel?`). `id?` for `aria-controls`. Content is the body: `<p>`,
`<b>`, a `<dl>` of facts (`dt` dim, `dd` monospace) and `<a>` are styled.
The text is the app's.

**`Kbd`** — content is the key (`<Kbd>Esc</Kbd>`); a combination is several
side by side with the app's "+".

**`LiveRegion`** — mount `<LiveRegion />` once near the root; no props. A
`p-sr-only` `role="status"` `aria-live="polite"` region.
**`announce(text: string)`** (from `plancia-ui/live`, plain JavaScript, also
re-exported by the index) writes into it: only for what follows an action
of the user and cannot be seen on the stage (an object selected, a panel
closed with Esc), never for telemetry. Empties after 5 s; the same text
announced again is read again.

**`Sparkline`** — `values: number[]`, `label: string` (accessible name,
required), `width?` (`120`), `height?` (`32`), `color?` (`'var(--p-viz-1)'`),
`area?: boolean` (15 % fill under the line), `endDot?: boolean` (`true`),
`min?` / `max?` (pin an end of the scale, e.g. `min={0}`), `title?`. An
`<svg role="img">`; text and axes stay outside, in the text tokens.

**`Bars`** — `bars: Bar[]` where `Bar = { value: number; label?: string;
color?: string }` (`label` is the bar's tooltip and accessible text; `color`
per bar, e.g. `var(--p-scale-3)` when the bar means a level), `label: string`
(accessible name, required), `width?` (`120`), `height?` (`32`), `color?`
(`'var(--p-viz-1)'`), `max?` (top of the scale; the bottom is always 0),
`gap?` (`2` px surface gap). Rounded data-ends anchored to the baseline.

**`Skeleton`** — `lines?: number` (`3`), `label?: string` (accessible name; default
from `setLabels()`, `'Loading'`), `compact?: boolean`.

**`Notice`** — `kind?: 'empty' | 'info' | 'warn' | 'error'` (`info`),
`title?: string`, `text?: string`, `compact?: boolean`. Content is the action
on the right (usually a quiet `Button`). `role="alert"` only when `error`.

**`Legend`** — `gradient: string` (a CSS `linear-gradient(...)` already
oriented left to right), `min: string | number`, `max: string | number`,
`unit?: string`, `note?: string` (transparency threshold, method).

**`LegendDots`** — `items: LegendDot[]` where `LegendDot = { color: string;
label: string; opacity?: number; title?: string }`, `label?: string` (group
label). Wraps by itself.

**`MetaRow`** — `align?: 'between' | 'start'` (`between`). Content is the
items, each with its own `title`; a `<b>` inside an item is the highlighted
value (monospace, high contrast). 11 px, dim; wraps by whole item.

**`Segmented`** — `items: SegmentedItem[]` where `SegmentedItem = { id: string;
label: string; title?: string }`, `value?: string` (bindable),
`onchange?: (id: string) => void`, `label?: string` (accessible name of the
group), `size?: 'md' | 'sm'` (`sm` is the inline pill for heads and meta
rows). One button per item, `aria-pressed` on the active one.

**`ControlRow`** — `label: string`, `title?: string`, `help?: boolean` (help
cursor: use it when `title` really explains the datum), `tone?: 'hi' | 'dim'`
(`hi`; `dim` for secondary rows). Content is the controls on the right, in
order. The label never wraps (ellipsis).

**`SettingRow`** — `label: string`, `title?: string`, `help?: boolean`,
snippet `icon` (18 px glyph on the left). Content is the controls on the
right (toggle, chip, counter, buttons). Forwards its own attributes
(`data-*`, `id`, `title`); a `class` of the consumer is added next to its own. Touches the column edges
(horizontal padding is its own) and highlights on hover.

**`Section`** — opens and closes with a height transition on the motion
tokens; closed content stays mounted, `inert` and `aria-hidden`.
`title: string` (rendered as `p-sec-title`), `summary?: string`
(one monospace line next to the title: the gist of the content, readable
while closed), `open?: boolean` (bindable, `true`), `onchange?: (open:
boolean) => void`, snippet `actions` (controls on the right of the head,
outside the toggle button), `id?: string` (of the content region, generated
when absent). Content is the body. The head is a `<button aria-expanded>`;
closed content stays mounted and `hidden`. Sibling sections get a divider.

**`Status`** — `kind?: 'loading' | 'ok' | 'stale' | 'error' | 'idle'` (`idle`),
`text?: string` (short, next to the indicator), `title?: string` (tooltip; the
accessible name when there is no text), `help?: boolean` (help cursor).
Renders `role="status"`, `aria-busy` while loading, a `p-spinner` or a
`p-dot` with the tone (ok, stale → warn, error → danger, idle → neutral).

**`Age`** — `updatedAt: Date | number | string` (required),
`staleAfter?: number` and `deadAfter?: number` (ages in milliseconds past
which the chip turns `warn` and `danger`), `locale?: string` (BCP 47, the
browser's when absent), `title?: string` (tooltip; the absolute time when
absent), `now?: number` (a clock the app controls; otherwise a 30 s timer).
Renders a `Chip` with a `<time datetime>`. `formatAge(ageMs, locale?)` is
exported: the largest whole unit, narrow style ("3m ago", "2h ago").

**`scaleTone(level: number): Tone`** — NOAA R/S/G levels: `0 → ok`,
`1–2 → warn`, `3 → orange`, `4–5 → danger`. Pass the result to `Chip`.

**`setLabels(partial: { close?: string; loading?: string; info?: string })`** — the default
accessible names; a runtime change reaches mounted components. `getLabels()`
returns a snapshot; `labels` is the `svelte/store` behind it. From
`plancia-ui/labels` (also re-exported by the index).

**Theme helpers** (from `plancia-ui/theme`, also re-exported by the index) —
`type Theme = 'dark' | 'light'`; `parseTheme(raw)`
(unknown → `'dark'`); `applyTheme(theme)` (light sets `data-theme`, dark
removes it); `readStoredTheme(key)`, `rememberTheme(theme, key)` (dark is
stored as nothing); `applyStoredTheme(key)` reads and applies in one call;
`readRequestedTheme()` returns the theme in `?theme=` or `null`.

## Base classes (`base.css`)

- surfaces: `p-panel` (floating panel: s3a, border, r3, shadow), `p-card`
  (s2, border, r2), `p-inset` (inset, border, r2), `p-divider` (top border);
- section title: `p-sec-title` (11 px, 600, uppercase spaced: the ONLY
  spaced uppercase in the system);
- text: `p-mono`, `p-hi`, `p-dim`, `p-t11` `p-t12` `p-t13` `p-t14` `p-t16`
  `p-t20` `p-t28`, `p-w500`, `p-w600`, `p-nowrap`, `p-ellipsis`;
- `p-help` (help cursor, goes with a `title`), `p-sr-only` (screen readers
  only: live regions, off-screen labels);
- `p-dot` status dot, with `ok` / `warn` / `danger` / `accent` for the color
  and its glow; `p-spinner`, the 12 px loading spinner;
- inherited: body font and colors, links in accent, visible focus ring on
  every focusable element, `prefers-reduced-motion`, thin scrollbars.

## Tokens (`tokens.css`, all `--p-*`)

- surfaces: `bg`, `s1`, `s2`, `s3`, `inset`, `s1a`, `s3a` (translucent),
  `hover`; borders: `border`, `border-soft`, `border-strong`;
- text: `text-hi`, `text`, `text-dim`;
- semantic colors, each with a `-soft` background variant: `accent` (plus
  `accent-ink` for text on accent), `ok`, `warn`, `yellow`, `orange`,
  `danger`, `info`, `neutral`; glows: `accent-glow`, `ok-glow`, `warn-glow`,
  `danger-glow`; shadows: `sh1`, `sh2`;
- NOAA scale ramp: `scale-0` … `scale-5`;
- dataviz: `viz-1` … `viz-6` (categorical: blue, rose, lime, violet, orange,
  teal, assigned in this order and never cycled; a 7th series folds into
  "Other"), `seq-1` … `seq-7` (sequential, accent hue, near-zero to full;
  discrete marks start at `seq-2`), `div-1` … `div-7` (diverging, blue to red,
  `div-4` the neutral midpoint). Validated per theme for colorblind
  separation and 3:1 contrast on the card surface. A series that means good
  or bad wears the status tokens with an icon or label, never a `viz` slot;
  chart text wears the text tokens, never the series color;
- typography: `font-ui`, `font-mono`, sizes `t11` `t12` `t13` `t14` `t16`
  `t20` `t28` (11 px minimum, no smaller text anywhere);
- spacing (4 px grid): `space-1` (4) `space-2` (8) `space-3` (12) `space-4`
  (16) `space-6` (24) `space-8` (32); radii: `r1` (4) `r2` (8) `r3` (12)
  `r-pill`;
- density: `row` (row padding), `row-h` (row height), `control-h` (button
  height) and `control-h-sm` (small button), `toggle-w` / `toggle-h`,
  `input-size` (input text), switched by `data-density`, three values:
  compact (32 / 26 / 34×20 / 13 px), comfortable (rows 40, controls as
  compact), touch (44 / 40 / 32 / 44×26 / 16 px); z-index: `z-base` `z-overlay` `z-panel` `z-popover`
  `z-tooltip` `z-modal`; motion: `motion-fast`, `motion-base`, `motion-ease`;
  `focus` (the focus ring shadow).

The light theme redefines every color token (surfaces, text, semantic,
glows, shadows, scale) under `[data-theme="light"]`; typography, spacing,
radii and motion do not change. Semantic colors are darker in light (amber,
yellow, green readable on white).

## A typical panel (Svelte 5)

```svelte
<script lang="ts">
  import { Button, Chip, KeyValue, MetaRow, Notice, PanelHead, Segmented, Toggle, scaleTone } from 'plancia-ui'
  let { onclose }: { onclose: () => void } = $props()
  let view = $state('map')
  let follow = $state(true)
</script>

<section class="p-panel">
  <PanelHead title="ISS (ZARYA)" subtitle="NORAD 25544" {onclose} closeLabel="Close panel">
    {#snippet chips()}<Chip tone="accent">STATIONS</Chip><Chip tone={scaleTone(2)}>G2</Chip>{/snippet}
    {#snippet actions()}<Button variant="icon" size="sm" title="Details">i</Button>{/snippet}
  </PanelHead>

  <div class="p-inset" style="padding: 4px 12px">
    <KeyValue label="Altitude">420.6 km</KeyValue>
    <KeyValue label="Air at 420 km" sub="−34 % vs. global median" subTone="warn">0.21 ng/m³</KeyValue>
  </div>

  <MetaRow>
    <span title="Observation time at the source">data from 8 min ago</span>
    <span>≥100 MeV <b>0.4 pfu</b></span>
    <Segmented size="sm" label="View" items={[{ id: 'map', label: 'map' }, { id: 'list', label: 'list' }]} bind:value={view} />
    <Toggle bind:checked={follow} label="Follow the object" />
  </MetaRow>

  <Notice kind="warn" title="Source unreachable: data from 40 min ago">
    <Button variant="quiet" size="sm">retry</Button>
  </Notice>
</section>
```

## Rules the project must follow

- in the project CSS use tokens only: `var(--p-text-dim)`, `var(--p-accent)`,
  `var(--p-s3a)`, `var(--p-border)`, `var(--p-r2)`, `var(--p-sh2)`,
  `var(--p-t12)`; never a hand-written color or size, never text under
  11 px; a transparency is `color-mix(in srgb, var(--p-ok) 35%, transparent)`,
  not an `rgba()` copied from the dark value (it breaks in light);
- a project that already has tokens declares them as aliases of `--p-*` and
  migrates at its own pace;
- spaced uppercase only with `p-sec-title`; one chip per status; one primary
  button per panel; one panel head only;
- empty / error / warning states only with `Notice`; metadata with
  `MetaRow`; exclusive choices with `Segmented`;
- label on the left never wraps, value in monospace on the right on one
  line, optional secondary line (`sub`); a value that does not fit goes on
  its own line, whole: never split, never truncated, never overlapping
  (`KeyValue` does it by itself; custom rows follow the same rule);
- a project component keeps its own scoped `<style>`; global CSS is for
  layout and for DOM the project does not control;
- whatever draws on a `<canvas>` or in a 3D engine does not read custom
  properties: it decides by itself whether to follow the theme (usually it
  stays dark);
- what does NOT belong in the package: product copy, data sources, an
  application's layout. If something is missing (a component, a token), do
  NOT rebuild it in the project: open an issue or a PR on plancia-ui
  following its `AGENTS.md`.

## Verify

`svelte-check` clean; look at the page in both themes (`data-theme="light"`
on the root) and, if the project uses them, in both densities. The package
showcase (`showcase/` in the repository) shows every component in every
state and is the reference for how things should look.
