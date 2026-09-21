// Generates src/tokens.css from src/tokens.json (single source of the tokens).
// Every group becomes a prefix: color.accent → --p-accent, size.t13 →
// --p-t13, space.2 → --p-space-2, glow.ok → --p-ok-glow, shadow.1 → --p-sh1,
// scale[2] → --p-scale-2, z.panel → --p-z-panel, motion.fast →
// --p-motion-fast, font.ui → --p-font-ui.
// scale[2] → --p-scale-2, viz[0] → --p-viz-1, seq[0] → --p-seq-1, div[3] →
// --p-div-4 (the midpoint of a seven-step diverging ramp).
// The `light` block redefines ONLY what is color (color, scale, glow,
// shadow, viz, seq, div) under [data-theme="light"], with the same keys as the dark theme:
// a key more or less on one side stops the generation, so a new token
// cannot be born without its light counterpart.
// `density` works the same way across its three entries: `compact` is the
// value of :root, every entry is redefined under [data-density="…"], and
// `touch` also applies by itself on a coarse pointer when the root sets no
// density at all (the app can still choose one and win).
// `generateTokensCss` is exported so the tests can check that the committed
// tokens.css is what the JSON produces; run as a script it writes the file.
import { readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const THEMED = ['color', 'scale', 'glow', 'shadow', 'viz', 'seq', 'div']

export function generateTokensCss(t) {
  for (const group of THEMED) {
    const dark = Object.keys(t[group])
    const light = Object.keys(t.light?.[group] ?? {})
    const missing = dark.filter((k) => !light.includes(k))
    const extra = light.filter((k) => !dark.includes(k))
    if (missing.length || extra.length) {
      throw new Error(`tokens.json: ${group} — the light theme is missing [${missing}] and has extra [${extra}]`)
    }
  }

  const densities = Object.keys(t.density)
  for (const name of densities) {
    const base = Object.keys(t.density.compact)
    const keys = Object.keys(t.density[name])
    const missing = base.filter((k) => !keys.includes(k))
    const extra = keys.filter((k) => !base.includes(k))
    if (missing.length || extra.length) {
      throw new Error(`tokens.json: density ${name} — missing [${missing}] and has extra [${extra}]`)
    }
  }

  function themed(theme) {
    const lines = []
    const put = (name, value) => lines.push(`  --p-${name}: ${value};`)
    for (const [k, v] of Object.entries(theme.color)) put(k, v)
    theme.scale.forEach((v, i) => put(`scale-${i}`, v))
    theme.viz.forEach((v, i) => put(`viz-${i + 1}`, v))
    theme.seq.forEach((v, i) => put(`seq-${i + 1}`, v))
    theme.div.forEach((v, i) => put(`div-${i + 1}`, v))
    for (const [k, v] of Object.entries(theme.glow)) put(`${k}-glow`, v)
    for (const [k, v] of Object.entries(theme.shadow)) put(`sh${k}`, v)
    return lines
  }

  const lines = themed(t)
  const put = (name, value) => lines.push(`  --p-${name}: ${value};`)
  for (const [k, v] of Object.entries(t.font)) put(`font-${k}`, v)
  for (const [k, v] of Object.entries(t.size)) put(k, v)
  for (const [k, v] of Object.entries(t.space)) put(`space-${k}`, v)
  for (const [k, v] of Object.entries(t.radius)) put(`r${k === 'pill' ? '-pill' : k}`, v)
  for (const [k, v] of Object.entries(t.z)) put(`z-${k}`, v)
  for (const [k, v] of Object.entries(t.motion)) put(`motion-${k}`, v)
  for (const [k, v] of Object.entries(t.density.compact)) put(k, v)
  put('focus', t.focus)

  const lightLines = themed(t.light)
  const newline = String.fromCharCode(10)
  const densityLines = (name) => Object.entries(t.density[name]).map(([k, v]) => `  --p-${k}: ${v};`).join(newline)
  const densityBlocks = densities.map((name) => `[data-density="${name}"] {${newline}${densityLines(name)}${newline}}`).join(newline)

  const css = `/* ═══════════════════════════════════════════════════════════════════════════
   plancia-ui — tokens (GENERATED from tokens.json with \`npm run tokens\`: do
   not edit by hand). Dark "plancia" theme on :root; the light theme
   redefines the same color variables under [data-theme="light"]
   (the application decides when to put the attribute on the root element).
   ═══════════════════════════════════════════════════════════════════════════ */
:root {
${lines.join('\n')}
  color-scheme: dark;
}

/* Density: the standard row is 32 px with 8 px padding; "comfortable"
   breathes; "touch" makes rows, controls and toggles big enough for a finger
   and input text large enough that iOS does not zoom on focus. Compact has
   a block of its own so a container can ask for it inside a touch root */
${densityBlocks}

/* A coarse pointer (a phone, a tablet) gets the touch density by itself,
   unless the app sets a density on the root element */
@media (pointer: coarse) {
  :root:not([data-density]) {
${densityLines('touch')}
  }
}

/* Light theme: same variable contract, different color values */
[data-theme="light"] {
${lightLines.join('\n')}
  color-scheme: light;
}
`
  return { css, variables: lines.length, lightVariables: lightLines.length }
}

const here = dirname(fileURLToPath(import.meta.url))
export const srcDir = join(here, '..', 'src')

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const t = JSON.parse(readFileSync(join(srcDir, 'tokens.json'), 'utf8'))
  const { css, variables, lightVariables } = generateTokensCss(t)
  writeFileSync(join(srcDir, 'tokens.css'), css)
  console.log(`tokens.css: ${variables} variables, ${lightVariables} redefined by the light theme`)
}
