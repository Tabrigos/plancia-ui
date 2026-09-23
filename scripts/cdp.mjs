// A minimal Chrome DevTools Protocol client for the checks in CI: a headless
// Chrome, one page, commands and events over the WebSocket of Node 22. No
// dependency: a browser automation library would be one more thing to keep
// up to date for four commands.
import { spawn } from 'node:child_process'
import { existsSync, mkdtempSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

const CANDIDATES = [
  process.env.CHROME_PATH,
  '/usr/bin/google-chrome',
  '/usr/bin/chromium',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
]

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

export async function launchChrome({ port = 9333 } = {}) {
  const binary = CANDIDATES.find((path) => path && existsSync(path))
  if (!binary) throw new Error('Chrome not found: set CHROME_PATH')
  const profile = mkdtempSync(join(tmpdir(), 'plancia-chrome-'))
  const chrome = spawn(binary, ['--headless=new', `--remote-debugging-port=${port}`, `--user-data-dir=${profile}`, '--no-first-run', '--no-default-browser-check', '--hide-scrollbars', 'about:blank'], { stdio: 'ignore' })

  let targets
  for (let attempt = 0; attempt < 100 && !targets; attempt++) {
    try { targets = await (await fetch(`http://127.0.0.1:${port}/json`)).json() } catch { await sleep(100) }
  }
  if (!targets) throw new Error('Chrome did not open its debugging port')
  const socket = new WebSocket(targets.find((target) => target.type === 'page').webSocketDebuggerUrl)
  await new Promise((resolve, reject) => { socket.onopen = resolve; socket.onerror = reject })

  let lastId = 0
  const pending = new Map()
  const listeners = new Set()
  socket.onmessage = (event) => {
    const message = JSON.parse(event.data)
    if (message.id && pending.has(message.id)) {
      const { resolve, reject } = pending.get(message.id)
      pending.delete(message.id)
      if (message.error) reject(new Error(message.error.message))
      else resolve(message.result)
    } else if (message.method) {
      for (const listener of listeners) listener(message)
    }
  }
  const send = (method, params = {}) => new Promise((resolve, reject) => {
    const id = ++lastId
    pending.set(id, { resolve, reject })
    socket.send(JSON.stringify({ id, method, params }))
  })
  const once = (method) => new Promise((resolve) => {
    const listener = (message) => {
      if (message.method !== method) return
      listeners.delete(listener)
      resolve(message.params)
    }
    listeners.add(listener)
  })
  await send('Page.enable')
  await send('Runtime.enable')

  return {
    send,
    sleep,
    /** Runs an expression in the page and returns its value (promises are awaited). */
    async evaluate(expression) {
      const result = await send('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true })
      if (result.exceptionDetails) throw new Error(result.exceptionDetails.exception?.description ?? result.exceptionDetails.text)
      return result.result.value
    },
    async open(url) {
      const loaded = once('Page.loadEventFired')
      await send('Page.navigate', { url })
      await loaded
      await sleep(300)
    },
    /** `mobile` makes the page see a phone: `pointer: coarse`, touch events, a viewport that may widen to fit. */
    async viewport(width, height, { mobile = false } = {}) {
      await send('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 1, mobile })
      await send('Emulation.setTouchEmulationEnabled', mobile ? { enabled: true, maxTouchPoints: 5 } : { enabled: false })
    },
    /** The whole page as a PNG buffer. */
    async screenshot() {
      const { cssContentSize } = await send('Page.getLayoutMetrics')
      const clip = { x: 0, y: 0, width: Math.ceil(cssContentSize.width), height: Math.ceil(cssContentSize.height), scale: 1 }
      const { data } = await send('Page.captureScreenshot', { format: 'png', clip, captureBeyondViewport: true })
      return Buffer.from(data, 'base64')
    },
    async close() {
      socket.close()
      const exited = new Promise((resolve) => chrome.once('exit', resolve))
      chrome.kill()
      await Promise.race([exited, sleep(3000)])
      // Windows may hold a profile file a moment longer: a temporary folder left behind is harmless
      try { rmSync(profile, { recursive: true, force: true, maxRetries: 5, retryDelay: 200 }) } catch {}
    },
  }
}
