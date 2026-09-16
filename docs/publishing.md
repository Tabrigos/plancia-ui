# Publishing plancia-ui

The package is on npm as `plancia-ui` (unscoped, `publishConfig.access:
public`); the first published version was 0.3.0 on 2026-09-14. The
procedure is in `AGENTS.md` §7; this document keeps the details and what is
still missing.

## How a version is published

1. Version and changelog in the same commit, `Version X.Y.Z`, tag `vX.Y.Z`.
   A published version is never touched again: a mistake is a new patch.
2. `README.md`, `skills/plancia-ui/SKILL.md` and `CHANGELOG.md` tell the
   same story. The agent guide ships in the tarball: a prop added to the
   code and missing there is a bug.
3. `npm run build` and `npm pack --dry-run`. The tarball contains `dist/`
   (the `.svelte` files as they are, the compiled `.js`, the `.d.ts`,
   `tokens.css`, `base.css`, `tokens.json`), `skills/`, `README.md`,
   `AGENTS.md`, `CHANGELOG.md`, `LICENSE`. Nothing from a consumer, no
   sources, no showcase.
4. **Staged publishing.** Since August 2026 npm publishes versions through a
   staging area: `npm stage publish` with a granular token of type "Read and
   write (stage only)", then the version is approved on npmjs.com with the
   second factor. Tokens that publish directly are being retired in January
   2027, so this is the only flow worth learning. Two things learned on the
   first publication:
   - a stage-only token cannot create a package that does not exist yet
     (`E_STAGE_REQUIRED`): 0.3.0 went out with a "publish and stage" token.
     The package now exists, so stage-only is enough;
   - on npm a name is reserved only by publishing; an empty placeholder is
     squatting under their policy.
   The token lives in the publisher's `~/.npmrc`, never in the repository.
5. Push commit and tag; GitHub release with the changelog section as text.
6. In the reference consumer (Sidereus) raise the version and verify: its
   token test reads `tokens.json` and `tokens.css` from the installed
   package, and its smoke test uses every component. A version that passes
   this repository's CI has only proven that it compiles.

## What is still missing

### Component tests

The fourteen components have no tests of their own; the guarantee is
indirect (the Sidereus smoke test uses them all). The plan, inside the
package:

- `vitest` + `@testing-library/svelte` + `jsdom` (or `@vitest/browser` to
  test the visible focus for real);
- one test per component on what the README promises: `Toggle` emits
  `onchange` with the new value and is a real checkbox (role, `aria-label`,
  `disabled`); `Button` applies variant, size and `active` (`aria-pressed`);
  `Chip` maps the tones and the counter variant; `KeyValue` never wraps the
  label, shows `sub` and drops a long value to a full line instead of
  overlapping the label (a real regression of 2026-09-11); `Notice` picks
  `role="alert"` only for `error`; `Segmented` changes the value and marks
  `aria-pressed`; `MetaRow` distributes the items; `Legend` orients the
  gradient; `PanelHead` renders the close button and the snippets;
  `Skeleton` counts the lines; `ControlRow` never wraps the label and puts
  the controls on the right; `SettingRow` keeps its own class when the
  consumer passes one (a real regression of 2026-09-11) and forwards
  `data-*` attributes; `LegendDots` renders one dot per item with the
  requested opacity; `scaleTone` covers the five NOAA levels;
- a regression test of the tokens: `tokens.css` regenerated from
  `tokens.json` is identical to the committed one (today CI does this with
  `git diff`).

### CI

A test job next to the build one, run on every push and pull request, and
required by the branch protection of `main` like the build.

## History

- 2026-09-10 — 0.1.0, extracted from the Sidereus cockpit as a `file:`
  dependency inside that repository.
- 2026-09-11 — 0.2.0, fourteen components.
- 2026-09-14 — 0.3.0, first version on npm: `@sveltejs/package`, light
  theme, `LICENSE`, changelog. Published with a "publish and stage" token
  after the stage-only one answered `E_STAGE_REQUIRED`.
- 2026-09-16 — the package moves to its own repository; Sidereus installs
  it from the registry like any other project.
