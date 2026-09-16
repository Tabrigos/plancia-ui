// Copies skills/plancia-ui/ to .claude/skills/plancia-ui/ of this repository,
// the folder of the PROJECT skills of Claude Code, so the guide can be tried
// here as an agent in a consumer project would see it. The copy is
// git-ignored: the source of truth stays skills/plancia-ui/SKILL.md, which
// ships in the npm package. Run it again whenever SKILL.md changes
// (npm run skill:install). A consumer installs it with
// `npx skills add Tabrigos/plancia-ui` instead.
import { cpSync, existsSync, mkdirSync, rmSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))
const source = join(here, '..', 'skills', 'plancia-ui')
const target = join(here, '..', '.claude', 'skills', 'plancia-ui')

if (!existsSync(join(source, 'SKILL.md'))) {
  throw new Error(`missing ${join(source, 'SKILL.md')}`)
}
mkdirSync(dirname(target), { recursive: true })
rmSync(target, { recursive: true, force: true })
cpSync(source, target, { recursive: true })
console.log(`plancia-ui skill installed in ${target}`)
