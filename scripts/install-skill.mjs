// Copies skills/plancia-ui/ to ~/.claude/skills/plancia-ui/, the folder of
// the personal Claude Code skills: from there the skill is available in
// EVERY project on the machine, not only in this repository. Run it again
// whenever SKILL.md changes (npm run skill:install). A consumer that
// installs the package from npm can use `npx skills add Tabrigos/plancia-ui`
// instead.
import { cpSync, existsSync, mkdirSync, rmSync } from 'node:fs'
import { homedir } from 'node:os'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))
const source = join(here, '..', 'skills', 'plancia-ui')
const target = join(homedir(), '.claude', 'skills', 'plancia-ui')

if (!existsSync(join(source, 'SKILL.md'))) {
  throw new Error(`missing ${join(source, 'SKILL.md')}`)
}
mkdirSync(dirname(target), { recursive: true })
rmSync(target, { recursive: true, force: true })
cpSync(source, target, { recursive: true })
console.log(`plancia-ui skill installed in ${target}`)
