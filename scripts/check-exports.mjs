// Imports the plain-JavaScript subpath exports from Node, without the Svelte
// compiler, the way an entry point tested in Node or a vitest run without
// the Svelte plugin would: the promise of `plancia-ui/theme` and
// `plancia-ui/labels`. Runs in CI after the build, through package
// self-reference (`exports` in package.json), so it checks the real entries.
const theme = await import('plancia-ui/theme')
const labels = await import('plancia-ui/labels')
const live = await import('plancia-ui/live')

if (typeof theme.applyStoredTheme !== 'function' || typeof theme.parseTheme !== 'function' || theme.PHONE_BREAKPOINT !== 700 || theme.isPhone() !== false) {
  throw new Error('plancia-ui/theme: helpers missing')
}
labels.setLabels({ close: 'x' })
if (labels.getLabels().close !== 'x' || labels.getLabels().loading !== 'Loading') {
  throw new Error('plancia-ui/labels: setLabels/getLabels do not round-trip')
}
if (typeof live.announce !== 'function') throw new Error('plancia-ui/live: announce missing')
console.log(`subpath exports load in Node ${process.version}: theme (${Object.keys(theme).length} exports), labels, live`)
