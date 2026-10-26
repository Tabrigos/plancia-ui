# plancia-ui — every export

Contents: [Controls](#controls) · [Rows and values](#rows-and-values) ·
[Panels and shapes](#panels-and-shapes) · [Charts and legends](#charts-and-legends) ·
[States and announcements](#states-and-announcements) ·
[Functions](#functions) · [Labels](#labels) · [Theme and screen](#theme-and-screen) ·
[Types](#types)

One section per export of `plancia-ui`, with every prop, its default and
its rules; `tests/skill.test.mjs` and `tests/skill-reference.test.ts` in
the library's repository check that no export and no prop is missing. "Content" means
the children of the component. Snippets are Svelte 5
`{#snippet name()}…{/snippet}` blocks placed inside the component. Every
name here is imported from `plancia-ui`; the helpers also from their
plain-JavaScript entry, `plancia-ui/theme`, `plancia-ui/labels` or
`plancia-ui/live`, as their section says.

## Controls

### `Button`

`variant?: ButtonVariant` (`'primary' | 'secondary' | 'quiet' | 'icon'`,
default `secondary`), `size?: ButtonSize` (`'md' | 'sm'`, `md`), `active?:
boolean` (pressed state for view toggles, sets `aria-pressed`). Content is
the label. Accepts every native `<button>` attribute (`onclick`, `title`,
`disabled`, `type`, `aria-*`); a `class` is added next to the component's
own. `icon` is square: give it a `title`. One primary per panel.

### `Toggle`

`checked?: boolean` (bindable, `false`), `disabled?: boolean`, `label:
string` (required: the accessible name, usually the text of the row;
`ControlRow`, `SettingRow` and `ListItem` are `div`s and do not name the
toggle), `title?: string`, `onchange?: (checked: boolean) => void`.
Renders a real `<input type="checkbox">`.

### `Checkbox`

A native `<input type="checkbox">` with its text beside it: `checked?:
boolean` (bindable, `false`), `label: string` (required: the visible text
and the accessible name), `hint?: string` (a dim second line, read as the
description, not as part of the name), `indeterminate?: boolean`
(bindable: neither on nor off, a "select all" over a partial selection; a
tap clears it), `disabled?: boolean`, `name?`, `value?` (for a native
form), `title?: string`, `onchange?: (checked: boolean) => void`. A tap on
the text toggles it; on touch the row is as tall as `--p-tap-h` (32 px),
in compact it keeps the height of its text. The box is 14 px, 20 on
touch, outlined at 3:1 on every surface. Use it for an option the user
sets (a filter, a form); a setting that acts at once in a row that names
it is a `Toggle`. The checkboxes of one question go in a `Fieldset`; a
"select all" is `checked={all}` and `indeterminate={some && !all}`.

### `RadioGroup`

One choice among a few, each with its text: native radios sharing a name
in a `<fieldset role="radiogroup">`. `legend: string` (required: the
question, read on entering the group), `items: RadioItem[]`, `value?:
string` (bindable, the `id` of the checked item), `hint?: string` (under
the legend, the group's description), `legendHidden?: boolean` (read but
not shown, when a heading or a row beside it already says it), `inline?:
boolean` (a wrapping row instead of a column), `disabled?: boolean`,
`name?: string` (for a native form; generated when absent), `onchange?:
(id: string) => void`. The browser does the keyboard: Tab enters on the
checked option, the arrows move the choice and skip a disabled one. Two
to four short words in a row are a `Segmented`; a long list is a
`Select`.

### `Select`

One choice from a long list: a native `<select>` with the look of the
theme, so a phone opens its own picker and a typed letter jumps to the
item. `items: SelectItem[]`, `value?: string` (bindable, the `id` of the
chosen item), `label: string` (required: the accessible name, usually the
text of the row it sits in, which does not name it, as for `Toggle`),
`placeholder?: string` (shown, and not choosable, while `value` is none of
the items: "Choose a place" when the point came from the globe), `size?:
'md' | 'sm'` (`md`: `--p-control-h`, 32 px, 40 on touch; `sm`:
`--p-control-h-sm`, 26 px, 32 on touch, for a row), `disabled?: boolean`,
`title?: string`, `onchange?: (id: string) => void`, `class` on its frame
(a width: it is as wide as its longest item, and a narrowed one ends the
text in an ellipsis), other attributes (`id`, `name`, `required`) on the
select. The text is `--p-input-size` at both sizes, 16 px on touch, so iOS
does not zoom. In a `SettingRow`: `size="sm"` and the row's text as
`label`. A short list with words is a `RadioGroup`; a list to search is a
combobox, not in the package yet.

### `Slider`

A value scrubbed along a range (a moment of a day or a year, a frame of an
animation, a level): a native `<input type="range">` with the look of the
theme, the same in Chromium, Firefox and Safari, so the arrow keys, Page
Up and Down, Home, End and a screen reader work as everywhere. `label:
string` (required: the accessible name, as for `Toggle`), `min?: number`
(`0`), `max?: number` (`100`), `step?: number | 'any'` (`1`), `value?:
number` (bindable; `min` when absent), `valueText?: string`
(`aria-valuetext`: the value as words, read in place of the number, "14
March, 12:00" rather than "72"; give it whenever the number alone means
nothing), `marks?: SliderMark[]` (a few positions that matter, ticked
under the track; a short label is centered on its tick and moves in at
the ends, so it never sticks out; drawn only and hidden from a screen
reader, so `valueText` names the mark the value sits on), `disabled?:
boolean`, `oninput?: (value: number) => void` (while the thumb moves),
`onchange?: (value: number) => void` (when it is let go), `class` on its
frame (a width), other attributes (`id`, `name`, `title`) on the input.

The track fills in the accent up to the center of the thumb, the rest is
`--p-border-strong`; the thumb is a disc of `--p-s3` ringed in the accent,
and carries the focus ring; the frame keeps 4 px of air at either end, so
the ring of a thumb at an end stays whole inside a container that clips
(`overflow: hidden`). On touch the thumb is as tall as the range, and its
ring takes 4 px above and below. The range is `--p-control-h-sm` tall (26
px, 32 on touch), the thumb 16 px and on touch `--p-tap-h` (32 px), since
iOS moves it only when the finger starts on it; the track is a quarter of
the thumb. A horizontal drag along it is the slider's (`touch-action:
pan-y`): only a vertical one scrolls the page. It takes the width it is
given, `flex: 1` in a row, and draws no number: the value written beside
it, and play/pause or "now" around it, are the app's (`Button`; the
playback recipe in `recipes.md`).

### `Segmented`

`items: SegmentedItem[]`, `value?: string` (bindable), `onchange?: (id:
string) => void`, `label?: string` (accessible name of the group), `size?:
'md' | 'sm'` (`sm` is the inline pill for heads and meta rows). One button
per item, `aria-pressed` on the active one. For two to four short words;
options that need words or a hint are a `RadioGroup`.

### `Tabs`

Tabs that swap the panel under them: a `role="tablist"` of buttons and the
`role="tabpanel"` of the chosen one, with the ids, `aria-controls`,
`aria-labelledby` and tab stops handled by the package. `items:
TabItem[]`, `value?: string` (bindable, the `id` of the chosen tab; the
first enabled one while it is none of them), `label?: string` (the name of
the tab list, when no heading next to it names it), `fill?: boolean` (see
below), snippet `panel` (required: receives the `id` of the chosen tab),
`onchange?: (id: string) => void`, `class` added next to its own, other
attributes on the frame.

Keyboard: one tab stop, Tab reaches the chosen tab and then the panel;
←/→ move and choose at once, skipping a disabled tab and wrapping; Home
and End go to the ends. Only the chosen panel is mounted, afresh on every
change: a panel keeps no state of its own across tabs, so state that must
survive lives in the app. The tabs share the width and their text wraps,
never scrolls (a scrolling row would clip the focus ring): up to four or
five tabs; more is a `Rail` or a `Select`. Tabs are as tall as
`--p-control-h`; the chosen one is high text over a 2 px accent line; the
panel starts 12 px below.

`fill`: the frame is a column and the tabs stay put while the panel takes
the height left and scrolls under them, starting at the top on every
change — for a sidebar as tall as the screen. The app sizes the frame with
a class of its own (`flex: 1` in a column, or a height); the scrolling
panel draws its focus ring inside itself, over the outermost 2 px of its
content, so give the content its own inline padding if it wants air
around the ring. The whole settings recipe is in `recipes.md`.

A fragment, not a file (the two consoles are the app's components):

```svelte nocheck
<Tabs label="Console" bind:value={mode} items={[
  { id: 'track', label: 'Tracking' }, { id: 'wx', label: 'Space weather' },
]}>
  {#snippet panel(id)}
    {#if id === 'track'}<TrackingConsole />{:else}<WeatherConsole />{/if}
  {/snippet}
</Tabs>
```

### `Rail`

Tabs in a narrow column beside their panel, an icon over a short label for
each: for a console with more modes than a row of `Tabs` holds (four or
five), up to six or seven. A `role="tablist"` with
`aria-orientation="vertical"` and the `role="tabpanel"` of the chosen
item, tied by the package as in `Tabs`. `items: TabItem[]` (as in `Tabs`:
`label` is the text under the icon, a word or two, 11 px, wrapping to a
second line rather than cut, so keep it short; `title`, when given, is the
accessible name and the tooltip, longer than the label and holding it,
WCAG 2.5.3: `{ label: 'Geography', title: 'Geography of the sky' }`),
`value?: string` (bindable, the chosen `id`; the first enabled item while
it is none of them), `open?: boolean` (bindable, `true`: the panel shows;
choosing an item sets it, and the chosen item clicked again never closes
it, a tab is not a switch: the app hides the panel with a button of its
own among the `actions`), `label?: string` (the name of the list), snippet
`icon` (required: receives the `id`; the icons are the app's, about 20 px,
drawn in `currentColor`: dim, in the accent when chosen), snippet `panel`
(required: receives the `id` of the chosen item), snippet `header` (above
the items: a brand), snippet `actions` (below the items, outside the list:
a theme switch, the button that hides the panel), `onchange?: (id: string)
=> void`, `class` added next to its own, other attributes on the frame.

Keyboard: one tab stop; ↑/↓ move and choose at once, skipping a disabled
item and wrapping, and open a hidden panel; Home and End go to the ends.
The column is `--p-rail-w` wide (64 px, 56 on touch), its items at least
`--p-control-h` tall, the chosen one with a 2 px accent line on the edge
toward the panel. The frame is a row the app sizes (a height, `flex: 1` in
a column; with the panel hidden, give it the rail's width): the panel
takes the room left and scrolls, starting at the top on every change, and
only the chosen panel is mounted, as in `Tabs`. Items and panel draw their
focus ring inside themselves. On a phone, put rail and panel together in a
`Drawer`.

A fragment, not a file (brand, icons and consoles are the app's
components):

```svelte nocheck
<Rail label="Modes" items={modes} bind:value={mode} bind:open={consoleOpen}>
  {#snippet header()}<Brand />{/snippet}
  {#snippet icon(id)}<ModeIcon {id} />{/snippet}
  {#snippet panel(id)}<Console {id} />{/snippet}
  {#snippet actions()}
    <Button variant="icon" size="sm" title="Hide the console" onclick={() => (consoleOpen = false)}>‹</Button>
  {/snippet}
</Rail>
```

### `Fieldset`

The controls that answer one question: a native `<fieldset>` with its
`<legend>`. `legend: string` (required), `hint?: string` (under the
legend, the group's description), `legendHidden?: boolean`, `inline?:
boolean` (a wrapping row, 16 px apart; the default is a column, 4 px
apart), `disabled?: boolean` (disables every control inside, natively),
content = the controls (required), `class` added next to its own, other
attributes on the fieldset. Legend 12 px, 500, high text; hint 11 px dim.
`RadioGroup` is one already.

## Rows and values

### `KeyValue`

`label: string`, `sub?: string` (secondary second line), `subTone?: Tone`,
`tone?: Tone` (colors the value), `title?: string` (native tooltip
explaining the datum), `id?: string`. Content is the value, monospace. The
label never wraps; a value that does not fit drops to its own full line,
never split, never truncated, never overlapping the label.

### `Stat`

`label: string`, `sub?: string`, `tone?: Tone`, `title?: string`, `id?:
string`. Content is the value (monospace, 16 px). Label is small caps.

### `ControlRow`

`label: string`, `title?: string`, `help?: boolean` (help cursor: use it
when `title` really explains the datum), `tone?: 'hi' | 'dim'` (`hi`;
`dim` for secondary rows). Content is the controls on the right, in order.
The label never wraps (ellipsis).

### `SettingRow`

`label: string`, `title?: string`, `help?: boolean`, snippet `icon` (18 px
glyph on the left). Content is the controls on the right (toggle, chip,
counter, buttons). Forwards its own attributes (`data-*`, `id`, `title`);
a `class` of the consumer is added next to its own. Touches the column
edges (horizontal padding is its own) and highlights on hover.

### `ExpandableRow`

A row that opens its detail below itself: a native `<button aria-expanded
aria-controls>` holding the row, then a full-width detail line (11 px, ui
font, dim, wrapping). `open?: boolean` (bindable, `false`), `onchange?:
(open: boolean) => void` (every tap; one row open at a time is the app's
rule: `open={openId === item.id}` and `onchange={(o) => (openId = o ?
item.id : null)}`), `title?: string` (the tooltip for the mouse, usually
the same fact as the detail), `id?` (of the detail, generated when
absent), snippet `detail` (required), content = the row (required),
`class` added next to its own, other attributes on the button.

Default layout: a flex row, baseline-aligned, 8 px gap; every default
weighs less than a class, so a class of the app lays it out (the vertical
padding that gives the touch height weighs as much as an element, so a
universal reset loaded after the package does not take it away). In a
list with columns make the row a subgrid of the list: `.row { display:
grid; grid-template-columns: subgrid; gap: normal }` (the `gap: normal`
gives back the list's own gap); the detail spans all the columns by
itself. On touch the row is as tall as `--p-tap-h` (32 px); in compact and
comfortable it keeps the height of its text. Style the open row with
`[aria-expanded='true']` (e.g. a truncated text that wraps when open). Put
the rows in a flex column or a grid, not in a `List` (that is for framed
items). The recipe is in `recipes.md`.

### `List`

`label?: string` (accessible name, when no heading next to it names it),
snippet `footer` (a line under the list, 11 px dim: the attribution of the
data). Content is the `ListItem`s. A `<ul role="list">`, items 10 px
apart. With no items, render a `Notice kind="empty"` instead of the list.

### `ListItem`

Only inside a `List`. An inset card: `label?: string` (the head; without
it there is no head and the body is the whole card), `title?: string`,
`help?: boolean`, snippet `controls` (right side of the head, in order: an
`InfoButton`, a `Toggle` with its own `label`). Content is the body under
the head: wrap it in `{#if on}` when it shows only while the item is on.
The head is the `ControlRow` shape (`.p-ctl-label`, never wraps). The body
spaces its blocks by itself: 8 px after the head and between blocks, 6 px
before a `MetaRow` or `LegendDots`; add no margins. Forwards `id` and
`data-*`; a `class` is added next to its own.

### `MetaRow`

`align?: 'between' | 'start'` (`between`). Content is the items, each with
its own `title`; a `<b>` inside an item is the highlighted value
(monospace, high contrast). 11 px, dim; wraps by whole item.

### `Chip`

`tone?: Tone` (`neutral`), `count?: boolean` (low 18 px counter variant),
`small?: boolean` (same low height but with the tone, for scales in
tables), `uppercase?: boolean` (a short label such as LIVE or an alert
type, in the spaced uppercase of `p-sec-title` and its ui font: write the
text in normal case, `Live`, the style uppercases it and a screen reader
reads a word instead of spelling it), `color?: string` (a free color, e.g.
a satellite group's: background and border derive from it and override
the tone; in the light theme the text leans toward the text color, so a
color picked for a dark stage stays readable). Content is the text, 22 px
monospace. Accepts native `<span>` attributes (`title`); a `class` is
added next to the component's own. `scaleTone(level)` gives the tone of a
NOAA level.

### `Age`

`updatedAt: Date | number | string` (required), `staleAfter?: number` and
`deadAfter?: number` (ages in milliseconds past which the chip turns
`warn` and `danger`), `locale?: string` (BCP 47; when absent the `locale`
of `setLabels()`, then the page's `lang`, then the browser's), `title?:
string` (tooltip; the absolute time when absent), `now?: number` (a clock
the app controls; otherwise a 30 s timer). Renders a `Chip` with a `<time
datetime>`. The text is `formatAge()`. Without `title` the absolute time
lives only in the tooltip, which a finger never shows: where it matters,
write it in the text too, a `p-detail` line or an item of the `MetaRow`.

### `Status`

`kind?: StatusKind` (`'loading' | 'ok' | 'stale' | 'error' | 'idle'`,
`idle`), `text?: string` (short, next to the indicator), `title?: string`
(tooltip; the accessible name when there is no text), `help?: boolean`
(help cursor). Renders `role="status"`, `aria-busy` while loading, a
`p-spinner` or a `p-dot` with the tone (ok, stale → warn, error → danger,
idle → neutral). The glance inside a row; `Notice` is the block message.

### `Kbd`

Content is the key (`<Kbd>Esc</Kbd>`); a combination is several side by
side with the app's "+".

## Panels and shapes

### `PanelHead`

`title: string | Snippet` (text, or a snippet for a title that is drawn, a
brand as an SVG: the snippet carries its own text alternative,
`aria-label` on the SVG or a `p-sr-only` text; inside `FloatingPanel` the
title stays a string), `subtitle?: string` (monospace), `subtitleTitle?:
string` (tooltip on the subtitle), snippet `chips` (under the title),
snippet `actions` (right side), `onclose?: () => void` (renders the close
button, always last), `closeLabel?: string` (accessible name and tooltip
of the close button; default from `setLabels()`, `'Close'`). One panel
head per panel.

### `FloatingPanel`

`title: string`, `subtitle?`, `subtitleTitle?`, snippets `chips` and
`actions`, `onclose?: () => void` (the close button and Esc call it; the
app then removes the panel), `closeLabel?`, `opener?: HTMLElement |
string` (element or id that opened it: focus goes back to it on close if
it was inside), `autofocus?: boolean` (`false`; move focus into the panel
on mount), `label?: string` (accessible name; the title when absent),
`class` and other attributes forwarded (`id`, `data-*`, `style`). Content
is the body, which scrolls inside `--p-floating-max-height` (default
`calc(100dvh - 110px)`; `60dvh` on a phone). Renders `role="dialog"`.

The app positions it with a class of its own (`position`, `top`, `right`,
`width`; keep it a class, not an id, so the package's rule under 700 px
can win). Under 700 px it is a **bottom sheet**: anchored to the bottom
edge, full width, top corners rounded, the head fixed and the body
scrolling, padded by `env(safe-area-inset-bottom)` (put
`viewport-fit=cover` in the viewport meta). The app opens one panel at a
time on a phone. The package keeps no open/closed state: render it when
open.

### `Drawer`

`open: boolean` (required: the state is the app's), `onclose: () => void`
(required: the scrim and Esc call it when modal; the app then sets `open`
to false), `label: string` (required, accessible name), `modal?: boolean`
(`false`; over the stage with a scrim that closes it, Esc, focus trapped
inside, `role="dialog"` with `aria-modal`: a phone or a short screen.
Otherwise a column beside the stage the user retracts, `role="region"`),
`side?: 'left' | 'right'` (`left`), `opener?: HTMLElement | string`
(element or id that opens it: focus goes back to it on close if it was
inside), `class` (the width: `class="nav"` with `.nav { width: … }`) and
other attributes forwarded (`id`, `data-*`). Content is the app's (a
`PanelHead`, a scrolling body, a footer), laid out in a full-height flex
column.

Focus moves into the drawer on open; a closed drawer is slid out and
`inert`. It is placed against the app's container (its nearest positioned
ancestor, which should clip it: `overflow: hidden`), full height, padded
by the safe-area insets of the edges it touches, so the content needs none
of its own. Layers: `--p-z-panel` as a column, `--p-z-modal` when modal,
the scrim right under it. On a phone keep one sheet (`FloatingPanel`) open
at a time and close the drawer when a choice made inside it opens a sheet:
that rule is the app's (the phone layout recipe in `recipes.md`).

### `Section`

Opens and closes with a height transition on the motion tokens; closed
content stays mounted, `inert` and `aria-hidden`. `title: string`
(rendered as `p-sec-title`), `summary?: string` (one monospace line next
to the title: the gist of the content, readable while closed),
`summaryTitle?: string` (tooltip of the summary, help cursor: what the
compressed reading means; silent on touch like every `title`, so the
summary must read by itself), `open?: boolean` (bindable, `true`),
`onchange?: (open: boolean) => void`, snippet `actions` (controls on the
right of the head, outside the toggle button), `id?: string` (of the
content region, generated when absent). Content is the body. The head is a
`<button aria-expanded>`; closed content stays mounted and `hidden`.
Sibling sections get a divider.

A `Section` has no side padding of its own: head and body take the width
of their container, which gives the step (`FloatingPanel` keeps 16 px). In
a container without padding, rows put straight in the body (`KeyValue`,
`ControlRow`, `Segmented`, a `p-detail` line) sit flush with its edge,
while a `ListItem` keeps its text 11 px in (its border and padding): give
those rows the step yourself, `padding-inline: var(--p-space-3)` on a
wrapper inside the body, or on the container for the heads too.

### `InfoButton`

`active?: boolean` (`aria-expanded`), `onclick?`, `controls?: string` (id
of the `InfoCard` it opens, `aria-controls`), `label?: string` (accessible
name and tooltip; default from `setLabels()`, `'What is this'`). 20 px,
quiet, accent when active.

### `InfoCard`

With `summary?: string` it is a native `<details>` (`open` bindable,
`false`); without, an always-open `role="region"` named by `label?:
string`, with a close button when `onclose?` is given (`closeLabel?`).
`id?` for `aria-controls`. Content is the body: `<p>`, `<b>`, a `<dl>` of
facts (`dt` dim, `dd` monospace) and `<a>` are styled. The text is the
app's.

### `Tooltip`

Mount `<Tooltip />` once, at the app root. `delay?: number` (`180` ms
between hover and tooltip; focus shows it at once), `maxWidth?: number`
(`300`; the box is as wide as its text up to it, centered on the element,
below or above it, and kept inside the window), `gap?: number` (`8`),
`avoid?: string` (selector of the elements it should not cover, e.g.
`'.p-floating'`; the element's own panel does not count).

Delegated: any element with `title` gets the themed tooltip, the text
moves to `data-tip` so the browser shows nothing of its own; while visible
its id is added after the anchor's own `aria-describedby` (a field's hint
and error are still read) and taken away alone when it hides, so a
description the app changes meanwhile stays. A tip that only repeats the
element's name (its `aria-labelledby`, `aria-label` or text) is not added:
an icon button with `aria-label` and `title` alike is read once. A `title`
the app writes again while the tooltip shows (a button that names its next
action, flipped by the click) replaces the text at once; an empty one
hides it.

The box is a manual popover in the top layer: it shows over an element the
app puts in fullscreen (a viewer, a map) and is never clipped by the
`overflow` or covered by the `z-index` of an ancestor; a browser without
the Popover API gets a fixed box at `--p-z-tooltip`. Esc, pointerdown,
scroll, blur and entering or leaving fullscreen hide it. Silent on touch:
a finger shows no tooltip, nor does the focus that follows a tap, so a
`title` must never be the only place a fact lives (use `InfoButton` or a
`p-detail` line for a phone). Write `title` as before; nothing else
changes.

## Charts and legends

### `Sparkline`

`values: (number | null)[]` (`null` is a missing sample: the pen lifts, a
lone sample between gaps is a dot), `label: string` (accessible name,
required), `width?` (`120`), `height?` (`32`), `color?`
(`'var(--p-viz-1)'`), `area?: boolean` (15 % fill under the line),
`endDot?: boolean` (`true`, on the last real value), `min?` / `max?` (pin
an end of the scale, e.g. `min={0}`; a flat series lies on the pinned end,
in the middle when neither is pinned), `zeroLine?: boolean` (a thin line
at 0 with the scale stretched to hold it: Bz, a delta), `markIndex?:
number` (a dashed vertical marker at that index: "now" before a forecast),
`lines?: ReferenceLine[]`, `readout?: (index, value) => string`, `title?`.

`lines` are thresholds across the chart, dashed in `--p-border-strong`, in
the space of `values`: for a logarithmic scale the app passes the
logarithms in `values` and in `lines` and gives the true value back in
`readout`; a line outside the scale is not drawn and does not widen it, so
pin `min`/`max` to show them all; the label, a letter or two, sits at the
left over the oldest samples, centered on its line, 11 px dim with a halo
in `--p-s2`: give each labelled line about 12 px of height; the labels are
drawn, not read, so name the thresholds in `label` when they matter.

`readout` is the text of the sample under the pointer: a mouse hovers, a
finger drags along the line while the page still scrolls vertically, a
focused sparkline takes the arrow keys, Esc hides; a dot on the line and a
monospace box kept inside the width. An `<svg role="img">`; with a
readout, a focusable `role="slider"` over the samples whose
`aria-valuetext` is the readout of the picked sample (the last one at
rest). No axes: text and axes stay outside, in the text tokens.

### `Bars`

`bars: Bar[]`, `label: string` (accessible name, required), `width?`
(`120`), `height?` (`32`), `color?` (`'var(--p-viz-1)'`), `max?` (top of
the scale; the bottom is always 0, and a row of zeros draws no bar, with
or without `max={0}`), `gap?` (`2` px surface gap), `readout?: (index:
number, bar: Bar) => string` (the text of the bar under a hovering mouse,
a dragging finger or the arrow keys on focus, e.g. `21–24 UTC · Kp 3.7`:
the picked bar stays whole, the others fade, a small monospace box shows
the text inside the width, the finger keeps the reading when lifted, Esc
hides; the chart becomes a focusable `role="slider"` whose value text is
the readout, the last bar at rest, and the per-bar tooltips give way to
it). Rounded data-ends anchored to the baseline. On a phone a bar's value
must not live only in its tooltip: give `Bars` a `readout`, as
`Sparkline`.

### `Legend`

`gradient: string` (a CSS `linear-gradient(...)` already oriented left to
right), `min: string | number`, `max: string | number`, `unit?: string`,
`note?: string` (transparency threshold, method).

### `LegendDots`

`items: LegendDot[]`, `label?: string` (group label). Wraps by itself. For
what is drawn elsewhere: a globe, a canvas.

## States and announcements

### `Skeleton`

`lines?: number` (`3`), `label?: string` (accessible name; default from
`setLabels()`, `'Loading'`), `compact?: boolean`.

### `Notice`

`kind?: NoticeKind` (`'empty' | 'info' | 'warn' | 'error'`, `info`),
`title?: string`, `text?: string`, `compact?: boolean`. Content is the
action on the right (usually a quiet `Button`). `role="alert"` only when
`error`. The only vocabulary for empty, info, warning and error states.

### `LiveRegion`

Mount `<LiveRegion />` once near the root. A `p-sr-only` `role="status"`
`aria-live="polite"` region; attributes are forwarded to it (`<LiveRegion
id="live" />`, so a test can read what a screen reader would hear), while
role, politeness and class stay fixed. It shows `liveMessage`, which
`announce()` writes.

### `announce`

`announce(text: string): void`, from `plancia-ui/live` (plain JavaScript,
also re-exported by the index): writes into the `LiveRegion`. Only for
what follows an action of the user and cannot be seen on the stage (an
object selected, a panel closed with Esc), never for telemetry. Empties
after 5 s; the same text announced again is read again. Call it from a
store or a handler.

### `liveMessage`

`Writable<string>` (a `svelte/store`, from `plancia-ui/live`): the text the
`LiveRegion` shows. Read it in a test to know what a screen reader would
hear; write it only through `announce()`, which empties and rewrites it so
a repeated text is read again.

## Functions

### `scaleTone`

`scaleTone(level: number): Tone` — NOAA R/S/G levels: `0 → ok`, `1–2 →
warn`, `3 → orange`, `4–5 → danger`. Pass the result to `Chip`.

### `formatAge`

`formatAge(ageMs: number, locale?: string): string` — the largest whole
unit, narrow style ("3m ago", "2h ago"), in the same locale order as
`Age` when `locale` is absent. What `Age` writes.

## Labels

From `plancia-ui/labels` (plain JavaScript, also re-exported by the index).
These are all the texts the package speaks: no component writes one of its
own, and a test in the package keeps it so. Everything else on screen comes
from the app's props and content.

| Key | Default | Where it is used |
|---|---|---|
| `close` | `'Close'` | the close button of `PanelHead`, `FloatingPanel` and an always-open `InfoCard`: accessible name and tooltip |
| `loading` | `'Loading'` | the `Skeleton` region: accessible name |
| `info` | `'What is this'` | `InfoButton`: accessible name and tooltip |
| `locale` | none: the page's `lang`, then the browser's | not a text: the language of what `Age` and `formatAge` format |

### `setLabels`

`setLabels(partial: Partial<Labels>): void` — the default accessible names,
and the BCP 47 `locale` of what the package formats with `Intl` (`Age`;
the page's `lang` when absent). Call it once, before mount; a runtime
change reaches mounted components, and a prop passed to a component still
wins.

### `getLabels`

`getLabels(): Labels` — a snapshot of the current defaults.

### `labels`

`Writable<Labels>` — the `svelte/store` behind `setLabels()`, which the
components subscribe to.

### `Labels`

`{ close: string; loading: string; info: string; locale?: string }`: the
keys of the table above.

## Theme and screen

From `plancia-ui/theme` (plain JavaScript: loads in Node and in tests
without the Svelte compiler; also re-exported by the index, which pulls in
the components). The package never decides when the light theme applies:
the app calls these, before mount, with a storage key of its own, so two
apps on the same origin do not share the preference.

### `Theme`

`'dark' | 'light'`.

### `DEFAULT_THEME`

`'dark'`: the value of `:root`, which leaves no attribute on the root.

### `parseTheme`

`parseTheme(raw: string | null | undefined): Theme` — any stored or
requested value to a theme; unknown values give `'dark'`.

### `applyTheme`

`applyTheme(theme: Theme, root?: HTMLElement | null): void` — light sets
`data-theme="light"` on the root element (`document.documentElement` by
default), dark removes it; does nothing without a document.

### `readStoredTheme`

`readStoredTheme(storageKey: string): Theme` — the saved preference; dark
when there is none or storage is unavailable.

### `rememberTheme`

`rememberTheme(theme: Theme, storageKey: string): void` — saves the
preference when the user switches; dark is stored as nothing, so a cleared
choice is the default again.

### `applyStoredTheme`

`applyStoredTheme(storageKey: string): Theme` — reads the saved preference
and applies it: the one call an entry point needs before mount.

### `readRequestedTheme`

`readRequestedTheme(search?: string): Theme | null` — the theme in
`?theme=light` (or `dark`) of the URL, for deep links and screenshots;
`null` when absent or unknown.

### `PHONE_BREAKPOINT`

`700`, CSS pixels: below it the screen is a phone and `FloatingPanel` is a
sheet. The app's own phone CSS writes the same number, `@media (max-width:
700px)`: a custom property cannot enter a media query.

### `PHONE_MEDIA`

`'(max-width: 700px)'`, for `matchMedia(PHONE_MEDIA)`.

### `isPhone`

`isPhone(): boolean` — whether the screen is a phone right now; `false`
without a window (SSR, Node). Components adapt to their content and to the
space they are in (`KeyValue` drops the value to a full line, `MetaRow`
wraps); only `FloatingPanel` looks at the screen.

## Types

Imported as types: `import type { Tone, TabItem } from 'plancia-ui'`.

### `Tone`

`'neutral' | 'accent' | 'ok' | 'warn' | 'orange' | 'danger' | 'info'`: the
semantic tones of `Chip`, `KeyValue`, `Stat`.

### `ButtonVariant`

`'primary' | 'secondary' | 'quiet' | 'icon'` (`Button`).

### `ButtonSize`

`'md' | 'sm'` (`Button`).

### `NoticeKind`

`'empty' | 'info' | 'warn' | 'error'` (`Notice`).

### `StatusKind`

`'loading' | 'ok' | 'stale' | 'error' | 'idle'` (`Status`).

### `SegmentedItem`

`{ id: string; label: string; title?: string }` (`Segmented`).

### `RadioItem`

`{ id: string; label: string; hint?: string; disabled?: boolean }`
(`RadioGroup`).

### `SelectItem`

`{ id: string; label: string; disabled?: boolean }` (`Select`).

### `TabItem`

`{ id: string; label: string; title?: string; disabled?: boolean }`
(`Tabs`, `Rail`).

### `SliderMark`

`{ value: number; label?: string }` (`Slider`).

### `LegendDot`

`{ color: string; label: string; opacity?: number; title?: string }`
(`LegendDots`; `opacity` for contours and faint elements).

### `Bar`

`{ value: number; label?: string; color?: string }` (`Bars`: `label` is
the bar's tooltip and accessible text; `color` per bar, e.g.
`var(--p-scale-3)` when the bar means a level).

### `ReferenceLine`

`{ value: number; label?: string }` (`Sparkline` `lines`).
