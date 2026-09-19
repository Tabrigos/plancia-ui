# Roadmap

What plancia-ui is likely to grow next, in order. It is a plan, not a
promise: a line moves when a consumer needs it or when the design is clear.
The rule for a new component still applies (`AGENTS.md` §3): the same shape
needed in more than one place, knowing nothing about the domain. Requests
from consumers arrive as GitHub issues; this file is updated with every
release, next to the changelog.

## 0.7.0 — the list vocabulary, designed first

1. **`List` / `Row` vocabulary** — the dense list with label, value,
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
