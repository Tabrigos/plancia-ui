// The showcase at phone width, in CI: the rules of the touch density checked
// in the DOM of a real Chrome, not as pixels, which differ between Windows
// and Linux. For each page (the components, the recipes, also under a
// universal reset, the phone layout recipe full screen) and each theme, at 390 px:
// - with a phone emulated (`pointer: coarse`), the density tokens of the
//   root are the touch ones of tokens.json;
// - every tap target is at least `--p-control-h-sm` (32 px on touch) both
//   ways, measured by hit-testing, so an area a pseudo element enlarges
//   counts; a link inside running text is exempt, as in WCAG 2.5.8;
// - an axe audit (WCAG 2.2, A and AA) finds nothing;
// - with the viewport held at 390 (phone emulation would widen it to fit
//   the content) and the touch density, nothing sticks out.
// A full-page screenshot per page and theme is saved to look at, never compared.
//
//   node scripts/check-phone.mjs [showcase/dist] [phone-check]
import { createServer } from 'node:http'
import { existsSync, mkdirSync, readFileSync, statSync, writeFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { extname, join, resolve } from 'node:path'
import { launchChrome } from './cdp.mjs'

const [root = 'showcase/dist', out = 'phone-check'] = process.argv.slice(2).map((path) => resolve(path))
const [WIDTH, HEIGHT] = [390, 844]
const PAGES = [
  { name: 'showcase', path: '' },
  // The recipes are checked again under the reset many apps load after the
  // package: a default of the package that loses to it is a target gone small
  { name: 'recipes', path: 'recipes.html', states: [
    ['under a universal reset', `document.head.append(Object.assign(document.createElement('style'), { textContent: '* { margin: 0; padding: 0 }' }))`],
  ] },
  // The phone layout is checked again with its drawer open, then with a sheet up
  { name: 'phone-layout', path: 'recipes.html?only=phone', states: [
    ['drawer open', `document.getElementById('open-nav').click()`],
    ['a sheet up', `document.getElementById('pick-station').click()`],
  ] },
]
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.woff2': 'font/woff2' }
const touch = JSON.parse(readFileSync(new URL('../src/tokens.json', import.meta.url), 'utf8')).density.touch
const axe = readFileSync(createRequire(import.meta.url).resolve('axe-core/axe.min.js'), 'utf8')

// Names an element in a report: its tag, its own classes, its accessible name or text
const DESCRIBE = `const describe = (element) => {
  const classes = [...element.classList].filter((name) => !name.startsWith('svelte-')).map((name) => '.' + name).join('')
  const name = (element.getAttribute('aria-label') ?? element.textContent ?? '').trim().replace(/\\s+/g, ' ').slice(0, 32)
  return element.tagName.toLowerCase() + classes + (name ? ' "' + name + '"' : '')
}`

// A density value may name another token (`var(--p-control-h-sm)`): the page resolves both sides
const DENSITY = `(() => {
  const style = getComputedStyle(document.documentElement)
  const read = (value) => (value.startsWith('var(') ? style.getPropertyValue(value.slice(4, -1)).trim() : value)
  const expected = ${JSON.stringify(touch)}
  return Object.fromEntries(Object.entries(expected).map(([key, value]) => [key, { got: style.getPropertyValue('--p-' + key).trim(), want: read(value) }]))
})()`

const TARGETS = `(() => { ${DESCRIBE}
  const minimum = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--p-control-h-sm'))
  const selector = 'button, a[href], input:not([type=hidden]), select, textarea, summary, [role=slider], [role=button], [tabindex]:not([tabindex="-1"])'
  // Behind an open modal nothing is meant to be reached: only its own targets count
  const modal = document.querySelector('[aria-modal="true"]')
  const seen = new Set()
  const small = []
  for (const element of document.querySelectorAll(selector)) {
    // A checkbox is tapped through its label, which is what a Toggle draws
    const target = element.matches('input[type=checkbox], input[type=radio]') ? (element.closest('label') ?? element) : element
    if (seen.has(target) || element.disabled || target.closest('[inert], [hidden], [aria-hidden="true"]') || (modal && !modal.contains(target))) continue
    seen.add(target)
    if (element.matches('a') && getComputedStyle(element).display === 'inline') continue
    // Not drawn: hidden, or in a closed <details>, whose content keeps a box
    if (!target.getBoundingClientRect().width || !target.checkVisibility({ visibilityProperty: true })) continue
    target.scrollIntoView({ block: 'center', inline: 'center' })
    const box = target.getBoundingClientRect()
    const [x, y] = [box.left + box.width / 2, box.top + box.height / 2]
    const owns = (px, py) => { const hit = document.elementFromPoint(px, py); return hit !== null && target.contains(hit) }
    const hit = document.elementFromPoint(x, y)
    if (!hit || !target.contains(hit)) { small.push(describe(target) + (hit ? ' covered by ' + describe(hit) : ' out of reach at ' + Math.round(x) + ',' + Math.round(y))); continue }
    const reach = (dx, dy) => { let distance = 0; while (distance < 64 && owns(x + dx * (distance + 1), y + dy * (distance + 1))) distance++; return distance }
    const [width, height] = [reach(-1, 0) + reach(1, 0) + 1, reach(0, -1) + reach(0, 1) + 1]
    if (width < minimum || height < minimum) small.push(describe(target) + ' ' + width + '×' + height)
  }
  return { minimum, measured: seen.size, small }
})()`

const OVERFLOW = `(() => { ${DESCRIBE}
  const width = document.documentElement.clientWidth
  // A box that scrolls or clips its content keeps it inside: only what reaches the page counts
  const clipped = (element) => { for (let parent = element.parentElement; parent && parent !== document.body; parent = parent.parentElement) if (getComputedStyle(parent).overflowX !== 'visible') return true; return false }
  // A box that sticks out, or text that spills out of its box (a nowrap title)
  const spills = (element) => getComputedStyle(element).overflowX === 'visible' && element.getBoundingClientRect().left + element.scrollWidth > width + 0.5
  const outside = [...document.querySelectorAll('body *')].filter((element) => (element.getBoundingClientRect().right > width + 0.5 || spills(element)) && !clipped(element))
  const outermost = outside.filter((element) => !outside.some((other) => other !== element && other.contains(element)))
  return { width, scrollWidth: document.documentElement.scrollWidth, outermost: outermost.slice(0, 10).map(describe) }
})()`

const AUDIT = `axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'] } })
  .then((result) => result.violations.map((violation) => violation.id + ' (' + violation.impact + '): ' + violation.help + ' — ' + violation.nodes.slice(0, 4).map((node) => node.target.join(' ')).join(', ') + (violation.nodes.length > 4 ? ' …' : '')))`

const server = createServer((request, response) => {
  let file = join(root, decodeURIComponent(new URL(request.url, 'http://localhost').pathname))
  if (!file.startsWith(root) || !existsSync(file) || statSync(file).isDirectory()) file = join(root, 'index.html')
  response.writeHead(200, { 'content-type': TYPES[extname(file)] ?? 'application/octet-stream' })
  response.end(readFileSync(file))
})
await new Promise((ready) => server.listen(0, '127.0.0.1', ready))
const origin = `http://127.0.0.1:${server.address().port}/`

mkdirSync(out, { recursive: true })
const failures = []
const chrome = await launchChrome()
try {
  for (const { name, path, states = [] } of PAGES) for (const theme of ['dark', 'light']) {
    const where = `${name}, ${theme}`
    const url = (query) => `${origin}${path}${path.includes('?') ? '&' : '?'}${query}`
    await chrome.viewport(WIDTH, HEIGHT, { mobile: true })
    await chrome.open(url(`theme=${theme}`))
    writeFileSync(join(out, `${name}-${theme}-${WIDTH}.png`), await chrome.screenshot())

    const density = await chrome.evaluate(DENSITY)
    const wrong = Object.entries(density).filter(([, { got, want }]) => got !== want).map(([key, { got, want }]) => `--p-${key} is ${got || 'unset'}, not ${want}`)
    if (wrong.length) failures.push(`${where}: the touch density is not in effect on a phone: ${wrong.join('; ')}`)

    await chrome.evaluate(axe)
    let measured = 0
    for (const [state, action] of [['on load', ''], ...states]) {
      if (action) {
        await chrome.evaluate(action)
        await chrome.sleep(400)
        writeFileSync(join(out, `${name}-${theme}-${WIDTH}-${state.replaceAll(' ', '-')}.png`), await chrome.screenshot())
      }
      const targets = await chrome.evaluate(TARGETS)
      measured += targets.measured
      for (const target of targets.small) failures.push(`${where}, ${state}: tap target under ${targets.minimum} px: ${target}`)
      for (const violation of await chrome.evaluate(AUDIT)) failures.push(`${where}, ${state}: axe ${violation}`)
    }

    await chrome.viewport(WIDTH, HEIGHT)
    await chrome.open(url(`theme=${theme}&density=touch`))
    const overflow = await chrome.evaluate(OVERFLOW)
    if (overflow.scrollWidth > overflow.width || overflow.outermost.length) {
      failures.push(`${where}: the page is ${overflow.scrollWidth} px wide at ${overflow.width}: ${overflow.outermost.join(', ') || 'nothing found by box'}`)
    }
    console.log(`${where}: touch density on the root, ${measured} tap targets measured in ${1 + states.length} state(s), axe audit, overflow at ${WIDTH} px`)
  }
} finally {
  await chrome.close()
  server.close()
}

if (failures.length) {
  console.error(`\n${failures.length} problem(s) at phone width:\n- ${failures.join('\n- ')}`)
  process.exit(1)
}
console.log(`the showcase and the recipes hold at ${WIDTH} px in both themes; screenshots in ${out}`)
