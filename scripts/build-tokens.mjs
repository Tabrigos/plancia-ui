// Generates src/tokens.css from src/tokens.json (single source of the tokens).
// Every group becomes a prefix: color.accent → --p-accent, size.t13 →
// --p-t13, space.2 → --p-space-2, glow.ok → --p-ok-glow, shadow.1 → --p-sh1,
// scale[2] → --p-scale-2, z.panel → --p-z-panel, motion.fast →
// --p-motion-fast, font.ui → --p-font-ui.
// The `light` block redefines ONLY what is color (color, scale, glow,
// shadow) under [data-theme="light"], with the same keys as the dark theme:
// a key more or less on one side stops the generation, so a new token
// cannot be born without its light counterpart.
// `generateTokensCss` is exported so the tests can check that the committed
// tokens.css is what the JSON produces; run as a script it writes the file.
import { readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const THEMED = ['color', 'scale', 'glow', 'shadow']

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

  function themed(theme) {
    const lines = []
    const put = (name, value) => lines.push(`  --p-${name}: ${value};`)
    for (const [k, v] of Object.entries(theme.color)) put(k, v)
    theme.scale.forEach((v, i) => put(`scale-${i}`, v))
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
  put('row', t.density.compact.row)
  put('row-h', t.density.compact['row-h'])
  put('focus', t.focus)

  const lightLines = themed(t.light)

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

/* Density: the standard row is 32 px with 8 px padding; "comfortable" breathes */
[data-density="comfortable"] {
  --p-row: ${t.density.comfortable.row};
  --p-row-h: ${t.density.comfortable['row-h']};
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
