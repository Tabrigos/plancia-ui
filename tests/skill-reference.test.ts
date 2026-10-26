import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { parse } from 'svelte/compiler'
import { srcDir } from '../scripts/build-tokens.mjs'

// The skill is read instead of the code, so what it says about the
// components has to be the code. tests/skill.test.mjs (the template shared
// with other libraries) checks the exports, the js examples and the
// tarball; this file checks what it cannot see in a Svelte package: every
// prop of every component in that component's section of the reference,
// and every Svelte example being the exact text of a recipe the showcase
// compiles, so an example cannot rot while svelte-check stays green.
const skillDir = join(srcDir, '..', 'skills', 'plancia-ui')
const recipesDir = join(srcDir, '..', 'showcase', 'src', 'recipes')
const componentsDir = join(srcDir, 'components')
const FENCE = /^```(\w*)([^\n]*)\n([\s\S]*?)^```[ \t]*$/gm

type Node = { type: string; [key: string]: any }

const read = (file: string) => readFileSync(file, 'utf8').replace(/\r\n/g, '\n')
const skillFiles = ['SKILL.md', ...readdirSync(join(skillDir, 'references')).map((name) => `references/${name}`)]
const reference = read(join(skillDir, 'references', 'api.md'))
const recipes = Object.fromEntries(readdirSync(recipesDir).filter((name) => name.endsWith('.svelte'))
  .map((name) => [name, read(join(recipesDir, name))]))

/**
 * The names in the type of `$props()`: the members of its type literals,
 * through intersections and through a type or interface the component
 * declares itself (`let { a }: Props = $props()`, Props in either script).
 * A type from elsewhere (`HTMLAttributes`) adds nothing: those are native
 * attributes, not props the reference must name.
 */
function propsOf(source: string): string[] {
  const ast = parse(source, { modern: true }) as Node
  const statements: Node[] = [ast.instance, ast.module].flatMap((script) => script?.content.body ?? [])
    .map((statement: Node) => statement.type === 'ExportNamedDeclaration' && statement.declaration ? statement.declaration : statement)
  const declarator = statements.flatMap((statement) => statement.type === 'VariableDeclaration' ? statement.declarations : [])
    .find((d: Node) => d.init?.type === 'CallExpression' && d.init.callee.name === '$props')
  if (!declarator) return []
  const declared = (name: string) => statements.find((statement) =>
    ['TSTypeAliasDeclaration', 'TSInterfaceDeclaration'].includes(statement.type) && statement.id.name === name)
  const members = (type: Node | undefined): Node[] => !type ? []
    : type.type === 'TSTypeLiteral' ? type.members
    : type.type === 'TSIntersectionType' ? type.types.flatMap(members)
    : type.type === 'TSTypeReference' ? members(declared(type.typeName.name))
    : type.type === 'TSTypeAliasDeclaration' ? members(type.typeAnnotation)
    : type.type === 'TSInterfaceDeclaration' ? type.body.body
    : []
  return members(declarator.id.typeAnnotation?.typeAnnotation)
    .filter((member) => member.type === 'TSPropertySignature')
    .map((member) => member.key.name ?? member.key.value)
}

// Components with no prop of their own, each with the reason: without this
// list a component whose props the reader cannot see would pass empty
const NO_OWN_PROPS: Record<string, string> = {
  Kbd: 'only its content, the key',
  LiveRegion: 'only the native attributes of its region, forwarded; role, politeness and class are fixed',
}

/** The text under `### \`Name\`` in the reference, up to the next heading. */
function sectionOf(name: string): string | undefined {
  const heading = `### \`${name}\`\n`
  const start = reference.indexOf(heading)
  if (start < 0) return undefined
  const rest = reference.slice(start + heading.length)
  const end = rest.search(/^#{2,3} /m)
  return end < 0 ? rest : rest.slice(0, end)
}

const components = readdirSync(componentsDir).filter((name) => name.endsWith('.svelte'))
  .map((name) => name.replace('.svelte', ''))
  .filter((name) => new RegExp(`^export \\{ default as ${name}\\b`, 'm').test(read(join(srcDir, 'index.ts'))))

describe('the reference names every prop', () => {
  it('reads the props of the exported components, so the check means something', () => {
    expect(components.length).toBeGreaterThan(30)
    expect(propsOf(read(join(componentsDir, 'Button.svelte')))).toEqual(['variant', 'size', 'active', 'children', 'class'])
    const named = (declaration: string, script = 'script') =>
      `<${script} lang="ts">${declaration}</script><script lang="ts">let { a, b }: Props = $props()</script>`
    expect(propsOf(named('type Props = { a: string; b?: number }', 'script module'))).toEqual(['a', 'b'])
    expect(propsOf(named('interface Props { a: string; b?: number }', 'script module'))).toEqual(['a', 'b'])
    expect(propsOf('<script lang="ts">type Props = { a: string } & { b?: number }\nlet { a, b }: Props = $props()</script>')).toEqual(['a', 'b'])
  })

  it.each(components)('%s: every prop is in its section', (name) => {
    const section = sectionOf(name)
    expect(section, `no \`### \\\`${name}\\\`\` in references/api.md`).toBeDefined()
    // children is the content, which every section describes in words
    const props = propsOf(read(join(componentsDir, `${name}.svelte`))).filter((prop) => prop !== 'children')
    expect(props.length > 0 || name in NO_OWN_PROPS, `no prop read from ${name}: a type the test cannot see, or a reason in NO_OWN_PROPS`).toBe(true)
    const missing = props.filter((prop) => !new RegExp('`' + prop.replace('$', '\\$') + '(`|\\?|:| )').test(section!))
    expect(missing, `props of ${name} not named in references/api.md`).toEqual([])
  })

  it('every component in NO_OWN_PROPS is exported and has, indeed, no prop', () => {
    for (const name of Object.keys(NO_OWN_PROPS)) {
      expect(components, `${name} in NO_OWN_PROPS is not an exported component`).toContain(name)
      expect(propsOf(read(join(componentsDir, `${name}.svelte`))).filter((prop) => prop !== 'children'), `${name} has props now: remove it from NO_OWN_PROPS`).toEqual([])
    }
  })
})

describe('the tokens the skill names exist', () => {
  // Not a token: a property the app may set on a FloatingPanel, read with a fallback
  const APP_PROPERTIES = new Set(['--p-floating-max-height'])
  const defined = new Set([...read(join(srcDir, 'tokens.css')).matchAll(/(--p-[\w-]+)\s*:/g)].map((m) => m[1]))
  const cited = new Set(skillFiles.flatMap((file) => [...read(join(skillDir, file)).matchAll(/--p-[a-z0-9]+(?:-[a-z0-9]+)*/g)].map((m) => m[0])))

  it('finds tokens on both sides, so the check means something', () => {
    expect(defined.size).toBeGreaterThan(80)
    expect(cited.size).toBeGreaterThan(50)
  })

  it('every --p-* in the skill is defined in tokens.css', () => {
    const unknown = [...cited].filter((name) => !defined.has(name) && !APP_PROPERTIES.has(name))
    expect(unknown, 'tokens named by the skill that tokens.css does not define').toEqual([])
  })
})

describe('the Svelte examples of the skill are recipes', () => {
  const blocks = skillFiles.flatMap((file) => [...read(join(skillDir, file)).matchAll(FENCE)]
    .filter(([, kind]) => kind === 'svelte')
    .map(([, , info, code]) => ({ file, code, checked: !info.trim().split(/\s+/).includes('nocheck') })))

  it('finds the examples, and SKILL.md shows at least one whole recipe', () => {
    expect(blocks.filter((block) => block.checked && block.file === 'SKILL.md').length).toBeGreaterThan(0)
    expect(Object.keys(recipes).length).toBeGreaterThan(5)
  })

  it('every Svelte block not fenced nocheck is the exact text of a recipe file', () => {
    const strays = blocks.filter((block) => block.checked && !Object.values(recipes).includes(block.code))
      .map((block) => `${block.file}: ${block.code.split('\n').find((line) => line.trim())}`)
    expect(strays, 'copy the recipe again, or fence a fragment `svelte nocheck` with the reason before it').toEqual([])
  })

  it('every recipe is in the skill', () => {
    const shown = new Set(blocks.filter((block) => block.checked).map((block) => block.code))
    const absent = Object.entries(recipes).filter(([, code]) => !shown.has(code)).map(([name]) => name)
    expect(absent, 'add the recipe to references/recipes.md').toEqual([])
  })
})
