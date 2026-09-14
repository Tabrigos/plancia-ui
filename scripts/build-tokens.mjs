// Genera src/tokens.css da src/tokens.json (sorgente unica dei token).
// Ogni gruppo diventa un prefisso: color.accent → --p-accent, size.t13 →
// --p-t13, space.2 → --p-space-2, glow.ok → --p-ok-glow, shadow.1 → --p-sh1,
// scale[2] → --p-scale-2, z.panel → --p-z-panel, motion.fast →
// --p-motion-fast, font.ui → --p-font-ui.
// Il blocco `light` ridefinisce SOLO ciò che è colore (color, scale, glow,
// shadow) sotto [data-theme="light"], con le stesse chiavi del tema scuro:
// una chiave in più o in meno da un lato ferma la generazione, così un token
// nuovo non può nascere senza la sua controparte chiara.
import { readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))
const src = join(here, '..', 'src')
const t = JSON.parse(readFileSync(join(src, 'tokens.json'), 'utf8'))

const THEMED = ['color', 'scale', 'glow', 'shadow']
for (const group of THEMED) {
  const dark = Object.keys(t[group])
  const light = Object.keys(t.light?.[group] ?? {})
  const missing = dark.filter((k) => !light.includes(k))
  const extra = light.filter((k) => !dark.includes(k))
  if (missing.length || extra.length) {
    throw new Error(`tokens.json: ${group} — nel tema chiaro mancano [${missing}] e avanzano [${extra}]`)
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
   plancia-ui — token (GENERATO da tokens.json con \`npm run tokens\`: non
   modificare a mano). Tema scuro "plancia" su :root; il tema chiaro
   ridefinisce le stesse variabili di colore sotto [data-theme="light"]
   (l'applicazione decide quando mettere l'attributo sull'elemento radice).
   ═══════════════════════════════════════════════════════════════════════════ */
:root {
${lines.join('\n')}
  color-scheme: dark;
}

/* Densità: la riga standard è 32 px con padding 8; "comfortable" respira */
[data-density="comfortable"] {
  --p-row: ${t.density.comfortable.row};
  --p-row-h: ${t.density.comfortable['row-h']};
}

/* Tema chiaro: stesso contratto di variabili, valori di colore diversi */
[data-theme="light"] {
${lightLines.join('\n')}
  color-scheme: light;
}
`
writeFileSync(join(src, 'tokens.css'), css)
console.log(`tokens.css: ${lines.length} variabili, ${lightLines.length} ridefinite dal tema chiaro`)
