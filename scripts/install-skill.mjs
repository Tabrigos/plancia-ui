// Copia skill/ in ~/.claude/skills/plancia-ui/, la cartella delle skill
// personali di Claude Code: da lì la skill è disponibile in OGNI progetto
// sulla macchina, non solo in questo repo. Da rifare quando cambia
// skill/SKILL.md (npm run skill:install).
import { cpSync, existsSync, mkdirSync, rmSync } from 'node:fs'
import { homedir } from 'node:os'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))
const source = join(here, '..', 'skill')
const target = join(homedir(), '.claude', 'skills', 'plancia-ui')

if (!existsSync(join(source, 'SKILL.md'))) {
  throw new Error(`manca ${join(source, 'SKILL.md')}`)
}
mkdirSync(dirname(target), { recursive: true })
rmSync(target, { recursive: true, force: true })
cpSync(source, target, { recursive: true })
console.log(`skill plancia-ui installata in ${target}`)
