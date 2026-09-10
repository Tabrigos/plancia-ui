// Genera src/tokens.css da src/tokens.json (sorgente unica dei token).
// Ogni gruppo diventa un prefisso: color.accent → --p-accent, size.t13 →
// --p-t13, space.2 → --p-space-2, glow.ok → --p-ok-glow, shadow.1 → --p-sh1,
// z.panel → --p-z-panel, motion.fast → --p-motion-fast, font.ui → --p-font-ui.
import { readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))
const src = join(here, '..', 'src')
const t = JSON.parse(readFileSync(join(src, 'tokens.json'), 'utf8'))

const lines = []
const put = (name, value) => lines.push(`  --p-${name}: ${value};`)
for (const [k, v] of Object.entries(t.color)) put(k, v)
for (const [k, v] of Object.entries(t.glow)) put(`${k}-glow`, v)
for (const [k, v] of Object.entries(t.font)) put(`font-${k}`, v)
for (const [k, v] of Object.entries(t.size)) put(k, v)
for (const [k, v] of Object.entries(t.space)) put(`space-${k}`, v)
for (const [k, v] of Object.entries(t.radius)) put(`r${k === 'pill' ? '-pill' : k}`, v)
for (const [k, v] of Object.entries(t.shadow)) put(`sh${k}`, v)
for (const [k, v] of Object.entries(t.z)) put(`z-${k}`, v)
for (const [k, v] of Object.entries(t.motion)) put(`motion-${k}`, v)
put('row', t.density.compact.row)
put('row-h', t.density.compact['row-h'])
put('focus', t.focus)

const css = `/* ═══════════════════════════════════════════════════════════════════════════
   plancia-ui — token (GENERATO da tokens.json con \`npm run tokens\`: non
   modificare a mano). Tema scuro "plancia"; il tema chiaro ridefinisce le
   stesse variabili sotto [data-theme="light"] (per ora vuoto, per scelta).
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

/* Tema chiaro: stesso contratto di variabili, da riempire quando servirà */
[data-theme="light"] {
  color-scheme: light;
}
`
writeFileSync(join(src, 'tokens.css'), css)
console.log(`tokens.css: ${lines.length} variabili`)
