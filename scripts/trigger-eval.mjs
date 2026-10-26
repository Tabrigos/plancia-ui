// The trigger eval of the skill: does its description make an agent call it
// when the package is needed, and stay silent when it is not? Every request
// of evals/attivazione.json runs `--runs` times, each in a fresh `claude -p`
// session, in a copy of evals/bench (a small Svelte console) that installs
// the packed package and copies the skill into .claude/skills as a consumer
// does, without write tools. A request marked `attiva` passes when the skill
// is called in at least half of its runs, a near miss when in fewer. It costs
// model calls: about 3.5 $ for the whole eval with claude-sonnet-5-5.
//
//   npm run build
//   npm run eval:trigger -- [--model claude-sonnet-5-5] [--runs 3] [--parallel 4] [--only 5,9]
//
// Prints a table, the tool calls of every run that went the wrong way, and
// the folder that keeps the bench and the stream-json of each run.
import { spawn, spawnSync } from 'node:child_process'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const SKILL = 'plancia-ui'
const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')
const option = (name, fallback) => {
  const at = process.argv.indexOf(`--${name}`)
  return at > 0 ? process.argv[at + 1] : fallback
}
const model = option('model', 'claude-sonnet-5-5')
const runs = Number(option('runs', '3'))
const parallel = Number(option('parallel', '4'))
const only = option('only', '').split(',').filter(Boolean).map(Number)

if (!process.env.npm_execpath) throw new Error('run it as `npm run eval:trigger`, which says where npm is')
const npm = (args, cwd) => {
  const result = spawnSync(process.execPath, [process.env.npm_execpath, ...args], { cwd, encoding: 'utf8' })
  if (result.status !== 0) throw new Error(`npm ${args.join(' ')} failed:\n${result.stderr}`)
  return result.stdout
}

// The bench: a fresh project with the package of this checkout, as a consumer has it
const work = fs.mkdtempSync(path.join(os.tmpdir(), 'plancia-eval-'))
const bench = path.join(work, 'bench')
const out = path.join(work, 'runs')
fs.mkdirSync(out)
const tarball = path.join(work, JSON.parse(npm(['pack', '--json', '--pack-destination', work], root))[0].filename)
fs.cpSync(path.join(root, 'evals', 'bench'), bench, { recursive: true })
const manifest = JSON.parse(fs.readFileSync(path.join(bench, 'package.json'), 'utf8'))
manifest.dependencies['plancia-ui'] = `file:${tarball.replace(/\\/g, '/')}`
fs.writeFileSync(path.join(bench, 'package.json'), JSON.stringify(manifest, null, 2) + '\n')
npm(['install', '--no-audit', '--no-fund'], bench)
fs.cpSync(path.join(bench, 'node_modules', 'plancia-ui', 'skills', SKILL), path.join(bench, '.claude', 'skills', SKILL), { recursive: true })
spawnSync('git', ['init', '-q'], { cwd: bench })

const requests = JSON.parse(fs.readFileSync(path.join(root, 'evals', 'attivazione.json'), 'utf8'))
  .map((request, index) => ({ ...request, number: index + 1 }))
  .filter((request) => !only.length || only.includes(request.number))
const jobs = requests.flatMap((request) => Array.from({ length: runs }, (_, run) =>
  ({ request, file: path.join(out, `request-${String(request.number).padStart(2, '0')}-${run + 1}.jsonl`) })))
console.log(`${jobs.length} sessions of ${model} in ${bench}`)

function session({ request, file }) {
  return new Promise((resolve) => {
    const stdout = fs.openSync(file, 'w')
    const stderr = fs.openSync(file.replace(/\.jsonl$/, '.err'), 'w')
    const child = spawn('claude', ['-p', request.richiesta, '--model', model, '--output-format', 'stream-json',
      '--verbose', '--max-turns', '3', '--disallowedTools', 'Edit', 'Write', 'Bash', 'PowerShell', 'NotebookEdit'],
      { cwd: bench, stdio: ['ignore', stdout, stderr] })
    const limit = setTimeout(() => child.kill(), 240_000)
    child.on('close', () => { clearTimeout(limit); fs.closeSync(stdout); fs.closeSync(stderr); resolve() })
  })
}
const queue = [...jobs]
await Promise.all(Array.from({ length: parallel }, async () => { while (queue.length) await session(queue.shift()) }))

// A run called the skill when an assistant message holds a Skill tool_use naming it
const events = (file) => fs.readFileSync(file, 'utf8').split('\n').filter(Boolean)
  .map((line) => { try { return JSON.parse(line) } catch { return null } }).filter(Boolean)
const toolCalls = (file) => events(file).filter((event) => event.type === 'assistant')
  .flatMap((event) => event.message.content || []).filter((block) => block.type === 'tool_use')
const called = (file) => toolCalls(file).some((call) => call.name === 'Skill' && call.input?.skill === SKILL)
const cost = jobs.reduce((sum, { file }) => sum + (events(file).find((event) => event.type === 'result')?.total_cost_usd ?? 0), 0)

const passed = { true: [0, 0], false: [0, 0] }
const wrong = []
for (const request of requests) {
  const files = jobs.filter((job) => job.request === request).map((job) => job.file)
  const hits = files.filter(called).length
  const pass = request.attiva ? hits / files.length >= 0.5 : hits / files.length < 0.5
  passed[request.attiva][0] += pass ? 1 : 0
  passed[request.attiva][1] += 1
  wrong.push(...files.filter((file) => called(file) !== request.attiva))
  console.log(`${String(request.number).padStart(2)}  ${request.attiva ? 'needs it ' : 'near miss'}  ${hits}/${files.length}  ${pass ? 'pass' : 'FAIL'}  ${request.richiesta}`)
}
console.log(`needs it: ${passed.true[0]}/${passed.true[1]} pass; near misses: ${passed.false[0]}/${passed.false[1]} pass; ${cost.toFixed(2)} $`)
for (const file of wrong) {
  const calls = toolCalls(file).map((call) => call.name === 'Skill' ? `Skill(${call.input?.skill})`
    : `${call.name}(${String(call.input?.file_path ?? call.input?.pattern ?? call.input?.path ?? '').split(/[\\/]/).slice(-2).join('/')})`)
  console.log(`  ${path.basename(file)}: ${calls.join(' ')}`)
}
console.log(`bench and runs kept in ${work}`)
