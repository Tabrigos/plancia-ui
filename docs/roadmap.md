# Roadmap

What plancia-ui is likely to grow next, in order. It is a plan, not a
promise: a line moves when a consumer needs it or when the design is clear.
The rule for a new component still applies (`AGENTS.md` §3): the same shape
needed in more than one place, knowing nothing about the domain. Requests
from consumers arrive as GitHub issues; this file is updated with every
release, next to the changelog.

## 0.5.0 — small, compatible, closes real friction

1. **Default labels per context** — a `setLabels({ close, loading })`
   (context or module) so an app in another language sets them once instead
   of passing `closeLabel` to every `PanelHead`; the first step toward i18n.
2. **Theme helpers exported** — `parseTheme`, `applyTheme`, the reading of
   a stored preference with the storage key chosen by the consumer. Sidereus
   and the showcase implement the same functions today.
3. **Fixes** — `KeyValue` and `Stat` accept every `Tone` but map only some
   (`orange`, `neutral` do nothing); `SettingRow` drops a `class` passed by
   the consumer instead of merging it.
4. **`Section`** — a collapsible console section: `p-sec-title` title,
   summary line, optional (i) button, open/closed state owned by the
   consumer (no storage in the package). The primitive of every console;
   eleven uses in Sidereus.
5. **`Status`** — the state row with a spinner: loading, error, stale data
   with a tone, help text. Generic shape, today in the app's CSS.
6. **`Age`** — a freshness chip ("updated 3 min ago") built on `Chip`, with
   `updatedAt` and a threshold after which the tone changes.
7. **Issue templates** — component proposal and bug, since requests come
   as issues.

## 0.6.0 — medium, with a design choice to make first

8. **`FloatingPanel`** — `PanelHead` plus the behavior three panels repeat:
   Esc closes, focus returns to the opener, full width with inner scroll
   under 700 px.
9. **`Tooltip`** — delegated on `title`, the package measures the space
   above and below and picks the side; `prefers-reduced-motion` respected.
10. **`InfoButton` + `InfoCard`** — the (i) button and the inline card it
    opens: frame (head, close, bold) in the package, content in the app.
11. **Dataviz tokens, then `Sparkline` and `Bars`** — categorical,
    sequential and diverging palettes in both themes in `tokens.json`
    first; the SVG mini-charts on those tokens and on the type scale after.
12. **Small utilities** — `Kbd` for shortcuts, `announce()` for live
    regions (with `p-sr-only`), open/close transitions on the motion tokens
    for `Section` and `FloatingPanel`.
13. **`List` / `Row` vocabulary** — the dense list with label, value,
    controls and attribution row. To design first: it overlaps `SettingRow`
    and `KeyValue`.

## Later — waiting for a second use, or for a decision

- Icon set (close, info, sun/moon, locate, play/pause, expand).
- Form controls: `Select`, `NumberField`, `Checkbox`, `Radio`, `Tabs`.
- `Combobox`, `Transport` (playback pill), `Scrubber`, `DataTable`: one use
  each in Sidereus today.
- `LayerRow`: probably `SettingRow` + `Status`, to be checked once `Status`
  exists.
- A high-contrast third theme (`forced-colors`) as a block in `tokens.json`.
- A documented CSS-only path for non-Svelte consumers; a web-components
  build if someone asks.
- Showcase playground for props and a "recipes" page (a full panel, a list,
  a table).
- Token export in Style Dictionary / Figma Tokens format.

## Infrastructure, whenever it fits

- Visual regression of the showcase in both themes (Playwright screenshots)
  and an axe audit in CI.
- Publishing from CI with npm trusted publishing plus staged approval, so
  no token lives on a machine.

## Open questions

- **`Badge`** (LIVE, alert types) would be the second use of spaced
  uppercase, which the design rules reserve to `p-sec-title`. Either a
  `Chip` variant with the rule amended, or nothing.
- **`Drawer` and `ConsoleShell`** are application layout, which `AGENTS.md`
  keeps out of the package. Taking them means changing that rule on purpose.
- **`Toggle.label`** is optional but a toggle without it has no accessible
  name: required in 1.0, or documented more loudly before.
