# Design rules

The rules the components embody, written down in the review of 2026-09-10
(`archivio/audit-visivo.md`, in Italian, tells where they come from). A
project that uses the package follows the same rules in its own CSS.

## Typography and color

- The minimum text size is 11 px (`--p-t11`); the scale has seven sizes and
  every text on screen uses one of them.
- Spaced uppercase only in section titles (`p-sec-title`).
- No hand-written color in the CSS of a component or of the project: tokens
  only, so the two themes stay correct by themselves. A transparency is
  `color-mix(in srgb, var(--p-ok) 35%, transparent)`, not an `rgba()` copied
  from the dark value, which breaks in light.
- If a token is missing, it is added to `tokens.json` in both themes; it is
  never worked around in the project.

## Rows and values

- Label on the left, never wrapping; value in monospace on the right, on one
  line; an optional secondary line (`sub`) for the extra information.
- A value that does not fit next to the label drops to its own line, whole:
  **never split, never truncated, never overlapping the label**. `KeyValue`
  does this by itself; custom rows follow the same rule.
- Metadata under a card (data age, thresholds, notes, small actions) go in
  a `MetaRow`, 11 px, dim, wrapping by whole item.

## Chips, buttons, heads

- One chip only (22 px) for statuses, scales and bands; the counter is the
  low variant (`count`). The NOAA levels get their tone from `scaleTone()`.
- One primary button per panel. Icon buttons carry a `title`.
- One panel head only: title 14/600, optional monospace subtitle, optional
  chips, actions on the right, the close button always last.
- Exclusive choices among a few options use `Segmented`; the inline `sm`
  variant sits in heads and meta rows.

## States

- Empty, info, warning and error states use one vocabulary, `Notice`.
  `role="alert"` only for errors.
- Loading uses `Skeleton`, never a spinner or a "Loading…" text alone.

## Accessibility and motion

- Every interactive element is a native element (`button`, `input`) with an
  accessible name; the visible focus ring comes from `base.css` and is never
  removed. Toggling states use `aria-pressed`.
- No movement under `prefers-reduced-motion`.

## What does not belong in the package

Content: product copy, information sheets, source attributions, the layout
of a cockpit. Anything that knows the domain (a satellite, a data source, a
route) stays in the project. A component enters the package when the same
shape is needed in more than one place and knows nothing about the domain;
a new one starts as an issue.
