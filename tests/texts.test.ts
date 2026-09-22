import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { parse } from 'svelte/compiler'
import { srcDir } from '../scripts/build-tokens.mjs'

// An app in another language sets the texts of the package once, with
// setLabels(): that holds only while no component writes a text of its own.
// Checked on the markup of every component (#33): a visible text, or a
// spoken attribute, that contains a letter must come from `$labels` or from
// a prop. Symbols and digits are not language; neither is what is hidden
// from assistive technology with aria-hidden.
const SPOKEN = new Set(['aria-label', 'aria-description', 'aria-roledescription', 'aria-valuetext', 'aria-placeholder', 'title', 'alt', 'placeholder'])
const LETTER = /\p{L}/u

type Node = { type: string; [key: string]: any }

/** The string literals an expression can render: its own, a branch of a condition, a fallback. */
function literals(expression: Node | null | undefined): string[] {
  if (!expression) return []
  switch (expression.type) {
    case 'Literal': return typeof expression.value === 'string' ? [expression.value] : []
    case 'TemplateLiteral': return expression.quasis.map((quasi: Node) => quasi.value.cooked)
    case 'ConditionalExpression': return [...literals(expression.consequent), ...literals(expression.alternate)]
    case 'LogicalExpression': return [...literals(expression.left), ...literals(expression.right)]
    case 'BinaryExpression': return expression.operator === '+' ? [...literals(expression.left), ...literals(expression.right)] : []
    default: return []
  }
}

function isAriaHidden(element: Node): boolean {
  return element.attributes.some((attribute: Node) =>
    attribute.type === 'Attribute' && attribute.name === 'aria-hidden' &&
    (attribute.value === true || (Array.isArray(attribute.value) && attribute.value.some((part: Node) => part.data === 'true'))))
}

function literalTexts(node: unknown, hidden = false, found: string[] = []): string[] {
  if (Array.isArray(node)) {
    for (const child of node) literalTexts(child, hidden, found)
    return found
  }
  if (!node || typeof node !== 'object') return found
  const current = node as Node
  switch (current.type) {
    case 'Text':
      if (!hidden) found.push(current.data)
      return found
    case 'ExpressionTag':
      if (!hidden) found.push(...literals(current.expression))
      return found
    case 'Attribute': {
      if (!SPOKEN.has(current.name) || current.value === true) return found
      for (const part of Array.isArray(current.value) ? current.value : [current.value]) {
        found.push(...(part.type === 'Text' ? [part.data] : literals(part.expression)))
      }
      return found
    }
    case 'RegularElement':
    case 'SvelteElement':
      literalTexts(current.attributes, hidden, found)
      return literalTexts(current.fragment, hidden || isAriaHidden(current), found)
  }
  for (const [key, value] of Object.entries(current)) {
    if (key !== 'metadata') literalTexts(value, hidden, found)
  }
  return found
}

const componentsDir = join(srcDir, 'components')
const components = readdirSync(componentsDir).filter((name) => name.endsWith('.svelte'))
const sources = Object.fromEntries(components.map((name) => [name, readFileSync(join(componentsDir, name), 'utf8')]))

describe('texts the package speaks', () => {
  it('finds the markup of every component, so the check means something', () => {
    expect(components.length).toBeGreaterThan(20)
    const sample = '<b title="Next">More {x ? "Hide" : y}<i aria-hidden="true">i</i> ×</b>' +
      '{#if a}<Chip title={t ?? "Fallback"}>On</Chip>{:else}{#each list as item}{`Row ${item}`}{/each}{/if}{#snippet s()}Off{/snippet}'
    expect(literalTexts(parse(sample, { modern: true }).fragment))
      .toEqual(['Next', 'More ', 'Hide', ' ×', 'Fallback', 'On', 'Row ', '', 'Off'])
  })

  it.each(components)('%s writes no text of its own', (name) => {
    const texts = literalTexts(parse(sources[name], { modern: true }).fragment).filter((text) => LETTER.test(text))
    expect(texts).toEqual([])
  })

  it('every label a component reads is in the inventory of the skill, with that component', () => {
    const skill = readFileSync(join(srcDir, '..', 'skills', 'plancia-ui', 'SKILL.md'), 'utf8')
    for (const [name, source] of Object.entries(sources)) {
      for (const [, key] of source.matchAll(/\$labels\.(\w+)/g)) {
        const row = skill.split('\n').find((line) => line.startsWith(`| \`${key}\` |`))
        expect(row, `no row for \`${key}\` in the labels table of SKILL.md`).toBeDefined()
        expect(row, `the row of \`${key}\` does not name ${name}`).toContain(`\`${name.replace('.svelte', '')}\``)
      }
    }
  })
})
