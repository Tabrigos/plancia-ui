// What `npm pack` would publish: only what a consumer uses, and a size that
// grows by the changelog and the components, never by accident. A file that
// is not on the list (a contributors' guide, a source map, an image) or a
// tarball over the ceiling fails CI. The ceiling has room for normal growth
// (99.7 kB at 0.12.2); raise it on purpose, with a line in the changelog.
// Run through `npm run check:pack`, after the build.
import { spawnSync } from 'node:child_process'

const CEILING_KB = 150
const ALLOWED = [/^dist\//, /^skills\//, /^README\.md$/, /^CHANGELOG\.md$/, /^LICENSE$/, /^package\.json$/]

if (!process.env.npm_execpath) throw new Error('run it as `npm run check:pack`, which says where npm is')
const result = spawnSync(process.execPath, [process.env.npm_execpath, 'pack', '--dry-run', '--json', '--ignore-scripts'], { encoding: 'utf8' })
if (result.status !== 0) throw new Error(`npm pack failed:\n${result.stderr}`)
const [pack] = JSON.parse(result.stdout.slice(result.stdout.indexOf('[')))

const strays = pack.files.map((file) => file.path).filter((file) => !ALLOWED.some((allowed) => allowed.test(file)))
if (strays.length) throw new Error(`files a consumer does not need: ${strays.join(', ')} (see "files" in package.json)`)
const kb = pack.size / 1000
if (kb > CEILING_KB) throw new Error(`the tarball is ${kb.toFixed(1)} kB, over the ${CEILING_KB} kB ceiling: what grew?`)
console.log(`npm pack: ${pack.entryCount} files, ${kb.toFixed(1)} kB of ${CEILING_KB}, nothing off the list`)
