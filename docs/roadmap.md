# Roadmap

What plancia-ui is likely to grow next, in order. It is a plan, not a
promise: a line moves when a consumer needs it or when the design is clear.
The rule for a new component still applies (`AGENTS.md` §3): the same shape
needed in more than one place, knowing nothing about the domain. Requests
from consumers arrive as GitHub issues; this file is updated with every
release, next to the changelog.

## 0.6.0 — medium, with a design choice to make first

0. **`plancia-ui/theme` and `plancia-ui/labels` subpath exports** — the
   helpers and `setLabels()` without the components behind them. The
   package index pulls in `.svelte` files, which a pure Node module (an
   entry point tested in Node, a vitest config without the Svelte plugin)
   cannot load: found on 2026-09-18 updating Sidereus to 0.5.0, whose
   `lib/theme.ts` had to keep its own copy. A new `exports` entry, so a
   minor by the table; first in line.
1. **`FloatingPanel`** — `PanelHead` plus the behavior three panels repeat:
   Esc closes, focus returns to the opener, full width with inner scroll
   under 700 px.
2. **`Tooltip`** — delegated on `title`, the package measures the space
   above and below and picks the side; `prefers-reduced-motion` respected.
3. **`InfoButton` + `InfoCard`** — the (i) button and the inline card it
    opens: frame (head, close, bold) in the package, content in the app.
4. **Dataviz tokens, then `Sparkline` and `Bars`** — categorical,
    sequential and diverging palettes in both themes in `tokens.json`
    first; the SVG mini-charts on those tokens and on the type scale after.
5. **Small utilities** — `Kbd` for shortcuts, `announce()` for live
    regions (with `p-sr-only`), open/close transitions on the motion tokens
    for `Section` and `FloatingPanel`.
6. **`List` / `Row` vocabulary** — the dense list with label, value,
    controls and attribution row. To design first: it overlaps `SettingRow`
    and `KeyValue`.

## Later — waiting for a second use, or for a decision

- Icon set (close, info, sun/moon, locate, play/pause, expand).
- Form controls: `Select`, `NumberField`, `Checkbox`, `Radio`, `Tabs`.
- `Combobox`, `Transport` (playback pill), `Scrubber`, `DataTable`: one use
  each in Sidereus today.
- `LayerRow`: probably `SettingRow` + `Status` (0.5.0), to be checked against
  the Sidereus layer rows.
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
