# Publishing plancia-ui

The package is on npm as `plancia-ui` (unscoped, `publishConfig.access:
public`); the first published version was 0.3.0 on 2026-09-14. The
procedure is in `AGENTS.md` §7; this document keeps the details and what is
still missing.

## How a version is published

1. Version and changelog in the same commit, `Version X.Y.Z`, tag `vX.Y.Z`.
   A published version is never touched again: a mistake is a new patch.
2. `skills/plancia-ui/SKILL.md` and `CHANGELOG.md` tell the same story,
   and the README still describes what the package can do. The reference
   ships in the tarball: a prop added to the code and missing there is a
   bug.
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

## Tests

Since 2026-09-16 the components have tests of their own (`npm test`: vitest in
jsdom with `@testing-library/svelte`, one file per component in
`tests/components/`, plus `tests/tokens.test.ts` and `tests/scaleTone.test.ts`),
run by CI before the build. They check what the reference promises: roles and
accessible names, props, classes, the snippets, the default labels, that the
committed `tokens.css` is what `tokens.json` generates and that the light
theme mirrors every color key. Layout (a value dropping to its own line, a
label never wrapping) is asserted on the scoped CSS rules, not measured:
jsdom does not lay out, so the showcase stays the place where a change is
looked at. The reference consumer remains the last check before a version
is called good.

## History

- 2026-09-10 — 0.1.0, extracted from the Sidereus cockpit as a `file:`
  dependency inside that repository.
- 2026-09-11 — 0.2.0, fourteen components.
- 2026-09-14 — 0.3.0, first version on npm: `@sveltejs/package`, light
  theme, `LICENSE`, changelog. Published with a "publish and stage" token
  after the stage-only one answered `E_STAGE_REQUIRED`.
- 2026-09-16 — the package moves to its own repository; Sidereus installs
  it from the registry like any other project.
