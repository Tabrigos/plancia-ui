# AGENTS.md — working on plancia-ui

A guide for whoever works on plancia-ui, human or agent. `README.md` says
what the package is and how to use it in a project; this file says how to
change it, version it and publish it. If the two disagree, the code wins and
the document gets fixed.

## 1. What you are touching

plancia-ui is a design system for dense consoles, dark by birth and light by
choice: CSS **tokens** (`--p-*`), **base styles** (`p-*` classes) and
**seventeen Svelte 5 components**. It has one peer dependency (`svelte` ≥ 5)
and **no runtime dependency**: that is a rule, not an accident.

```
src/index.ts              exports the components, the types and scaleTone()
src/tokens.json           SINGLE SOURCE of the tokens: dark theme + `light` block
src/tokens.css            GENERATED from tokens.json (npm run tokens); committed
src/base.css              reset, typography, surfaces, p-* utilities, focus, reduced motion
src/components/*.svelte   one component per file, scoped CSS, tokens only
tests/                    vitest in jsdom: one file per component, tokens, scaleTone
scripts/build-tokens.mjs  the generator; it stops if a token is missing in one theme
showcase/                 Vite showcase (every component in every state); reads ../src, not dist
skills/plancia-ui/        the usage guide for AI agents (SKILL.md), shipped in the npm package
docs/                     tokens, design rules, publishing, roadmap + archivio/ (history, never updated)
dist/                     output of `npm run build`, git-ignored: it is what goes to npm
```

### Language

Everything public is in English: identifiers, props, CSS classes, comments,
documents, commit messages, pull requests, issues and releases. The project
started in Italian and is moving over file by file: **when you touch a file
that is still in Italian, translate the whole file**, never a paragraph. Two
exceptions: `docs/archivio/` is history and stays as it is, and a component's
public prop names never change for language reasons (`sub` stays `sub`).
American spelling.

## 2. Getting started

```bash
npm ci                      # root: svelte-package, svelte, typescript
npm run tokens              # tokens.json → src/tokens.css
npm run build               # tokens + svelte-package → dist/
npm test                    # vitest: one file per component in tests/, plus tokens and scaleTone
cd showcase && npm install  # once
cd showcase && npm run dev  # http://localhost:5174, HMR on the package sources
cd showcase && npm run check && npm run build   # svelte-check (covers ../src too) and build
npm pack --dry-run          # what would go to npm (about 40 files, under 100 kB)
```

The showcase is the test bench: **every change is looked at there, in both
themes and both densities, before it counts as done.** The tests in `tests/`
cover what the README promises for each component (roles, accessible names,
props, classes) and that the committed `tokens.css` is what `tokens.json`
generates; they run in jsdom, so layout is checked by eye in the showcase,
not by a test.

## 3. How the code is written

The package must stay readable by a developer who opens it for the first
time, without tools. In practice:

- **one component, one file, under ~120 lines** including styles. If it
  grows, it is two components;
- **full names**: `subtitle`, not `sub` (where `sub` exists today it means
  "secondary line" and the README explains it: do not add more); no new
  abbreviations, no acronyms;
- **props typed inline** in `$props()`, with one line of JSDoc on every prop
  that does not explain itself (see `SettingRow.svelte`);
- **a comment says why**, never what: the what is read from the code. A
  comment at the top of the component says what it is for and which design
  rule it embodies;
- **CSS**: tokens only (`var(--p-*)`), one declaration per state, grouped by
  selector; no `!important`, no hand-written colors or sizes, no text under
  11 px. A transparency is `color-mix(in srgb, var(--p-x) N%, transparent)`;
- **no JavaScript where CSS is enough** and no dependencies: if a library
  seems necessary, open an issue first;
- **what runs without a component gets its own entry**: a helper meant for
  an entry point, a store or a pure module (the theme helpers, `setLabels`)
  is exported from a JavaScript-only subpath (`plancia-ui/theme`,
  `plancia-ui/labels`), not only from the package index. The index
  re-exports the `.svelte` components, and whoever imports it from plain
  Node — a vitest run without the Svelte plugin, a script — fails on the
  first `.svelte` file. Found with the reference consumer on 2026-09-18: its
  pure theme module could not use the helpers of 0.5.0;
- **accessibility by default**: every interactive element is a native element
  (`button`, `input`), has the visible focus ring inherited from `base.css`
  and an accessible name; `aria-pressed` for toggling states; `role="alert"`
  only for errors;
- **the package knows nothing about the domain**: no product copy, no data
  sources, no application layout. A component comes in when the same shape is
  needed in more than one place.

### Checklist for a new or changed component

1. the file in `src/components/`, exported from `src/index.ts` (with its types);
2. a section in the showcase that shows it in every state;
3. its test file in `tests/components/`, on what the README promises;
4. the row in the `README.md` table (main props, what it is for);
5. the row in `skills/plancia-ui/SKILL.md`, the guide an AI agent reads
   instead of the code: same props, same rules, kept as complete as the code;
6. the line in `CHANGELOG.md` under `[Unreleased]`;
7. if it adds a token: in `tokens.json` in BOTH themes, then `npm run tokens`
   and commit the regenerated CSS;
8. `cd showcase && npm run check` clean, showcase looked at in dark and light.

## 4. Versioning (SemVer, with the rules of a design system)

The **public contract** of the package is: the exported components and their
props; the NAMES of the `--p-*` tokens; the `p-*` classes of `base.css`; the
`exports` entries (`.`, `./tokens.css`, `./base.css`, `./tokens.json`); the
`data-theme` and `data-density` attributes; the peer dependency. Everything
else is implementation.

| Version | When | Examples |
|---|---|---|
| **patch** `0.3.x` | a fix that does not change the contract | a bug, a wrong value, an accessibility regression, a token that clashed in the light theme, documents, build |
| **minor** `0.x.0` | a compatible addition | new component, new optional prop, new token (in both themes), new utility class, deprecation (still works, warns) |
| **major** `x.0.0` | a break | component, prop, token or class removed or renamed; a default that consumers rely on changed; peer dependency raised; the order or the name of the CSS files to import |

Extra rules:

- **changing the VALUE of a token** (a color, a size) is *patch* if it is a
  fix and *minor* if it is a deliberate redesign: in both cases the changelog
  says so, because the consumer sees it on screen;
- **while we are in 0.x** SemVer allows breaks in minor versions; we make
  them only with a **Breaking** entry in the changelog and a "how to migrate"
  line. From 1.0.0 on the table applies without exceptions;
- **a published version is never touched**: a mistake is a new patch;
- the version is raised in `package.json` and in `CHANGELOG.md` **in the same
  commit**, titled `Version X.Y.Z`, with the tag `vX.Y.Z` on that commit.

## 5. Changelog

`CHANGELOG.md` follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).
Rules:

- there is always `## [Unreleased]` at the top; **every commit that changes
  `src/` adds its line there**, in the same commit. A commit without a
  changelog line is either documentation or a mistake;
- sections, in this order and only the ones needed: **Breaking** (with the
  "how to migrate" line), **Added**, **Changed**, **Deprecated**, **Removed**,
  **Fixed**, **Security**;
- a line describes **what the user of the package sees**, not the
  implementation: it starts with the name of the component, token or class
  in backticks, says what changes and, if not obvious, why.
  Good: "`KeyValue`: a value that does not fit next to the label drops to a
  full line instead of overlapping it". Bad: "KeyValue refactor";
- on release `[Unreleased]` becomes `## [X.Y.Z] — YYYY-MM-DD` and a new empty
  `[Unreleased]` opens; the GitHub release text is that section, copied as is.

## 6. Git and GitHub

- `main` is always publishable. Anything under `src/` (what consumers see
  and what ends up in a version) goes on a branch and lands with a pull
  request, even when you are alone: CI runs before the merge and the PR is
  where the diff gets re-read. Documentation, showcase, CI configuration and
  metadata may go straight to `main` from a maintainer; if CI turns red
  after the push, it gets fixed at once. External contributors always open
  a PR;
- small commits, with a message in English that says what changes for the
  user of the package and why; the title is a sentence, not a code;
- no **personal data** in the message (names, surnames, e-mail addresses), no
  reference to **AI assistants** — `Co-Authored-By` trailers included — and no
  chronicle of the reasoning: the repository is public and git history is the
  part that never gets cleaned up;
- CI (`.github/workflows/ci.yml`) on every push and PR: `npm ci`, tokens
  regenerated identical to the committed ones, `npm test`, `npm run build`, svelte-check
  and build of the showcase, `npm pack --dry-run`. A red PR is not merged;
- no personal files in the repo: `CLAUDE.md` is in `.gitignore` on purpose
  (whoever works with Claude Code keeps their own, importing this file). The
  shared instructions live HERE.

## 7. Publishing to npm

1. `[Unreleased]` → `[X.Y.Z] — date` in the changelog, version in
   `package.json`, commit `Version X.Y.Z`, tag `vX.Y.Z`;
2. check that `README.md`, `skills/plancia-ui/SKILL.md` and the changelog tell
   the same story: the agent guide ships in the package and must not lag
   behind the code;
3. `npm run build` and `npm pack --dry-run`: the tarball contains only
   `dist/`, `skills/`, `README.md`, `AGENTS.md`, `CHANGELOG.md`, `LICENSE`
   (`files` in `package.json`); nothing from a consumer, no sources;
4. **staged** publishing (npm since August 2026): `npm stage publish` with a
   "stage only" token, then approval of the version on the website with the
   second factor. A stage-only token cannot create a new package
   (`E_STAGE_REQUIRED`), but the package already exists. The token lives in
   the publisher's `~/.npmrc`, never in the repo;
5. push commit and tag, GitHub release with the changelog text;
   `docs/roadmap.md` updated: what shipped goes out, what moved goes up;
6. in the reference consumer (Sidereus) raise the version and verify.

Details and history in `docs/publishing.md`.

## 8. What not to do

- do not import the package sources through an alias from an external
  consumer: the contract is `dist`, the showcase is the only exception;
- do not add a runtime dependency;
- do not write a color, a size or a z-index by hand;
- do not rename a token or a prop "for cleanliness": it is a major, and it
  gets discussed;
- do not update the documents in `docs/archivio/`: they are history.
