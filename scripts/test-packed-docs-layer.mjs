import assert from 'node:assert/strict'
import { spawn, spawnSync } from 'node:child_process'
import { cpSync, existsSync, mkdtempSync, readFileSync, realpathSync, rmSync, writeFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { createServer } from 'node:net'
import { tmpdir } from 'node:os'
import { dirname, join, relative } from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'
import { chromium } from '@playwright/test'

import { prepareDocsLayerForPublish } from './prepare-docs-layer-release.mjs'

const rootDir = fileURLToPath(new URL('..', import.meta.url))
const docsDir = join(rootDir, 'packages/docs')
const docsManifestPath = join(docsDir, 'package.json')
const rootRequire = createRequire(join(rootDir, 'package.json'))
const nuxtRequire = createRequire(rootRequire.resolve('nuxt/package.json'))
const consumerDir = mkdtempSync(join(tmpdir(), 'selaras-docs-layer-'))
const normalOnly = process.env.SELARAS_DOCS_LAYER_NORMAL_ONLY === '1'
const fixtureDir = join(rootDir, `test/fixtures/${normalOnly ? 'docs-layer-minimal' : 'docs-layer'}`)

function run(label, command, args, cwd = consumerDir) {
  console.log(`[docs-layer] ${label}`)
  const result = spawnSync(command, args, { cwd, env: process.env, encoding: 'utf8', maxBuffer: 16 * 1024 * 1024 })
  if (result.error)
    throw result.error
  assert.equal(result.status, 0, `${label}\n${result.stdout}\n${result.stderr}`)
  return result.stdout
}

function readPackedArchive(output) {
  // npm 11 reports `npm pack --json` as an array. npm 12 returns an object
  // keyed by package name. The compatibility gate supports both because
  // release deliberately uses npm for its final pack.
  const result = JSON.parse(output)
  const archives = Array.isArray(result) ? result : Object.values(result)
  assert.equal(archives.length, 1, 'npm pack must report exactly one archive')
  const [archive] = archives
  assert.ok(archive && typeof archive === 'object' && typeof archive.filename === 'string', 'npm pack must report its archive')
  return archive
}

function installedManifest(name, require = nuxtRequire) {
  for (const directory of require.resolve.paths(name) ?? []) {
    const path = join(directory, name, 'package.json')
    if (existsSync(path)) {
      const manifest = JSON.parse(readFileSync(path, 'utf8'))
      if (manifest.name === name)
        return manifest
    }
  }
  throw new Error(`Cannot find installed manifest for ${name}`)
}

async function findFreePort() {
  const reservation = createServer()
  await new Promise((resolve, reject) => {
    reservation.once('error', reject)
    reservation.listen(0, '127.0.0.1', resolve)
  })
  const address = reservation.address()
  assert.ok(address && typeof address !== 'string')
  const { port } = address
  await new Promise(resolve => reservation.close(resolve))
  return port
}

async function inspectConsumer({ prefixed, overridden, example }) {
  console.log(`[docs-layer] inspect ${prefixed ? 'prefixed' : 'normal'} ${overridden ? 'override' : 'default'} consumer`)
  const port = await findFreePort()
  const server = spawn(process.execPath, ['.output/server/index.mjs'], {
    cwd: consumerDir,
    env: { ...process.env, NITRO_HOST: '127.0.0.1', NITRO_PORT: String(port), PORT: String(port) },
    stdio: ['ignore', 'pipe', 'pipe'],
  })
  let output = ''
  try {
    const url = await new Promise((resolve, reject) => {
      const timer = setTimeout(() => reject(new Error(`Docs layer server startup timed out\n${output}`)), 30_000)
      server.once('error', (error) => {
        clearTimeout(timer)
        reject(error)
      })
      server.once('exit', (code) => {
        clearTimeout(timer)
        reject(new Error(`Docs layer server exited: ${code}\n${output}`))
      })
      const collect = (chunk) => {
        output += chunk.toString()
        const match = output.match(/http:\/\/127\.0\.0\.1:\d+/)
        if (match) {
          clearTimeout(timer)
          resolve(match[0])
        }
      }
      server.stdout.on('data', collect)
      server.stderr.on('data', collect)
    })
    const pageUrl = new URL('/guide/getting-started', url)
    const response = await fetch(pageUrl)
    assert.equal(response.status, 200)
    const html = await response.text()
    assert.match(html, /<h1[^>]*>[\s\S]*Getting started/, 'the consumer-owned docs collection must render through the layer route')
    if (prefixed && !overridden) {
      assert.match(html, /Packed documentation/, 'typed app config must set the site identity')
      assert.match(html, /src="\/brand\.svg"[^>]*alt="Packed mark"/, 'site config must render the configured logo and alternative text')
      assert.match(html, /href="https:\/\/github\.com\/sewadahapp\/selaras"/, 'repository config must render a source link')
      assert.match(html, /href="\/guide\/getting-started"[^>]*>[\s\S]*Guide/, 'header link config must render consumer navigation')
    }
    else if (!prefixed) {
      assert.match(html, /Documentation home/, 'the layer must provide a useful default site identity')
    }
    if (example)
      assert.match(html, /id="consumer-example"/, 'the layer Content component must resolve a consumer-owned example')
    if (overridden) {
      assert.match(html, /id="consumer-docs-header"/, 'the consuming app must override a layer component')
      assert.doesNotMatch(html, /Open documentation navigation/, 'the overridden component must replace the layer header')
    }
    else {
      assert.match(html, /Open documentation navigation/, 'the default layer header must render')
      assert.match(html, /Search documentation/, 'the default layer header must expose local navigation search')
      assert.match(html, /id="selaras-docs-main"/, 'the named layer layout must render a main landmark')
      assert.match(html, /href="#selaras-docs-main"[^>]*>Skip to content/, 'the shell must expose a skip link')
      assert.match(html, /aria-label="Documentation navigation"/, 'the shell must expose a labelled desktop navigation landmark')
      assert.match(html, /aria-label="Table of contents"/, 'Markdown headings must render a labelled table of contents')
      if (prefixed)
        assert.match(html, /href="https:\/\/github\.com\/sewadahapp\/selaras\/edit\/main\/content\/guide\/getting-started\.md"/, 'a configured GitHub repository must expose an edit link')
    }
    const stylesheets = [...html.matchAll(/<link [^>]+>/g)]
      .filter(([tag]) => tag.includes('rel="stylesheet"'))
      .map(([tag]) => tag.match(/href="([^"]+)"/)?.[1])
    assert.ok(stylesheets.length > 0)
    const css = (await Promise.all(stylesheets.map(async (href) => {
      assert.ok(href)
      const stylesheet = await fetch(new URL(href, url))
      assert.equal(stylesheet.status, 200)
      return stylesheet.text()
    }))).join('\n')
    const prefix = prefixed ? 'tw\\:' : ''
    assert.ok(css.includes(`.${prefix}inline-flex`), 'Selaras CSS must share the consumer Tailwind compilation')
    if (prefixed)
      assert.ok(css.includes('--tw-breakpoint-tablet:60rem'), 'the advanced consumer owns the emitted breakpoint')
    assert.ok(css.includes('.selaras-docs-content button p'), 'the layer stylesheet must be imported through the consumer entry')
    if (process.env.SELARAS_DOCS_LAYER_BROWSER) {
      const browser = await chromium.launch()
      try {
        const page = await browser.newPage({ viewport: { width: 600, height: 800 } })
        const issues = []
        page.on('pageerror', error => issues.push(error.message))
        page.on('console', (message) => {
          if (/hydration|mismatch|\[Selaras\]/i.test(message.text()))
            issues.push(message.text())
        })
        // Icon providers and other optional browser requests must not turn a
        // hydration assertion into a network-idle test. The following
        // interactive checks wait for the hydrated UI they actually need.
        await page.goto(pageUrl.href, { waitUntil: 'domcontentloaded' })
        await page.getByRole('heading', { level: 1, name: 'Getting started', exact: true }).waitFor()
        if (example)
          await page.locator('#consumer-example').waitFor()
        if (prefixed && !overridden) {
          await page.getByRole('link', { name: 'Packed documentation home', exact: true }).waitFor()
          await page.getByRole('img', { name: 'Packed mark', exact: true }).waitFor()
          await page.getByRole('link', { name: 'Source repository', exact: true }).waitFor()
        }
        if (!overridden) {
          await page.getByRole('link', { name: 'Skip to content', exact: true }).waitFor()
          await page.getByRole('button', { name: 'Open documentation navigation', exact: true }).click()
          const drawer = page.getByRole('dialog', { name: 'Documentation navigation', exact: true })
          await drawer.waitFor()
          await page.keyboard.press('Escape')
          await drawer.waitFor({ state: 'hidden' })
          await page.getByRole('button', { name: 'Search documentation', exact: true }).click()
          const commandPalette = page.getByRole('dialog', { name: 'Command palette', exact: true })
          await commandPalette.waitFor()
          await page.keyboard.press('Escape')
          await commandPalette.waitFor({ state: 'hidden' })
          await page.setViewportSize({ width: 1280, height: 800 })
          await page.getByRole('complementary', { name: 'Table of contents', exact: true }).getByRole('link', { name: 'Installation', exact: true }).waitFor()
        }
        else {
          await page.locator('#consumer-docs-header').waitFor()
        }
        assert.deepEqual(issues, [])
      }
      finally {
        await browser.close()
      }
    }
    console.log(`[docs-layer] ${prefixed ? 'prefixed' : 'normal'} ${overridden ? 'override' : 'default'} consumer passed`)
  }
  finally {
    if (server.exitCode === null) {
      server.kill('SIGTERM')
      await new Promise(resolve => server.once('exit', resolve))
    }
  }
}

let originalDocsManifest
try {
  // `npm pack --ignore-scripts` ships the working-tree dist untouched, so it
  // must be a real build. Stubs (`nuxt-module-build build --stub`, used by
  // `docs:dev`/`docs:prepare`) turn dist/runtime and dist/tokens into symlinks
  // into src, which npm silently omits from the archive.
  run('build a real module dist', 'bun', ['x', 'nuxt-module-build', 'build'], rootDir)
  const npmCache = join(consumerDir, '.npm-cache')
  const packArguments = ['--cache', npmCache, 'pack', '--ignore-scripts', '--json', '--pack-destination', consumerDir]
  const selarasArchive = readPackedArchive(run('create the Selaras tarball', 'npm', packArguments, rootDir))
  // The working-tree manifest pins the layer to the local source (`file:../..`),
  // which npm cannot publish - rewrite it to the released range for the pack,
  // then restore the tree in the `finally` below.
  originalDocsManifest = readFileSync(docsManifestPath, 'utf8')
  prepareDocsLayerForPublish()
  const docsArchive = readPackedArchive(run('create the docs layer tarball', 'npm', packArguments, docsDir))
  for (const archive of [selarasArchive, docsArchive]) {
    assert.ok(!archive.files.some(file => file.path.startsWith('src/') || file.path.startsWith('.notes/')), `${archive.filename} must not ship repository-only files`)
  }
  assert.ok(docsArchive.files.some(file => file.path === 'nuxt.config.mjs'))
  assert.ok(docsArchive.files.some(file => file.path === 'README.md'), 'the docs layer must publish its zero-config bootstrap guidance')
  assert.ok(docsArchive.files.some(file => file.path === 'CHANGELOG.md'), 'the docs layer must publish its own release notes')
  assert.ok(docsArchive.files.some(file => file.path === 'content.config.ts'))
  assert.ok(docsArchive.files.some(file => file.path === 'modules/docs.mjs'))
  assert.ok(docsArchive.files.some(file => file.path === 'app/app.vue'))
  assert.ok(docsArchive.files.some(file => file.path === 'app/components/content/DocsExample.vue'))
  assert.ok(!docsArchive.files.some(file => /ThemeSource|playground|raw/i.test(file.path)), 'the docs layer must not publish internal theme source tooling')
  cpSync(fixtureDir, consumerDir, { recursive: true })
  const dependencies = Object.fromEntries(
    ['nuxt', 'vue', 'typescript', 'vue-tsc']
      .map(name => [name, installedManifest(name).version]),
  )
  dependencies['@sewadah/selaras'] = `file:./${selarasArchive.filename}`
  dependencies['@sewadah/selaras-docs'] = `file:./${docsArchive.filename}`
  // The packed layer declares a semver range on the core package (rewritten
  // from `file:../..` for publishing above). The release candidate under
  // test is not on the registry yet by design - validation runs before
  // publish - so pin the transitive dependency to the just-packed core
  // tarball instead of letting the installer resolve the range remotely.
  // This mirrors the `overrides` pinning in test-packed-consumer.mjs.
  const overrides = { '@sewadah/selaras': `file:./${selarasArchive.filename}` }
  writeFileSync(join(consumerDir, 'package.json'), `${JSON.stringify({ name: 'selaras-packed-docs-layer-consumer', private: true, type: 'module', dependencies, overrides }, null, 2)}\n`)
  run('install both tarballs in an isolated dependency graph', 'bun', ['install', '--ignore-scripts'])
  const consumerRequire = createRequire(join(consumerDir, 'package.json'))
  for (const packageName of ['@sewadah/selaras', '@sewadah/selaras-docs']) {
    const entry = realpathSync(fileURLToPath(run(`resolve ${packageName}`, process.execPath, ['--input-type=module', '--eval', `console.log(import.meta.resolve(${JSON.stringify(packageName)}))`])))
    assert.ok(!relative(consumerDir, entry).startsWith('..'), `${packageName} must resolve from the installed consumer`)
  }
  const nuxtCli = join(dirname(consumerRequire.resolve('nuxt/package.json')), 'bin/nuxt.mjs')
  const vueTsc = join(dirname(consumerRequire.resolve('vue-tsc/package.json')), 'bin/vue-tsc.js')
  if (normalOnly) {
    assert.ok(!existsSync(join(consumerDir, 'app.vue')), 'the minimal consumer must use the layer app root')
    assert.ok(!existsSync(join(consumerDir, 'content.config.ts')), 'the minimal consumer must use the layer Content collection')
    assert.ok(!existsSync(join(consumerDir, 'main.css')), 'the minimal consumer must use the layer stylesheet')
    run('build the minimal unprefixed consumer', process.execPath, [nuxtCli, 'build'])
    run('type-check generated minimal-consumer contracts', process.execPath, [vueTsc, '--noEmit', '--project', 'tsconfig.json'])
    await inspectConsumer({ prefixed: false, overridden: false, example: false })
  }
  else {
    run('build the default prefixed consumer', process.execPath, [nuxtCli, 'build'])
    run('type-check generated layer and Content contracts', process.execPath, [vueTsc, '--noEmit', '--project', 'tsconfig.json'])
    await inspectConsumer({ prefixed: true, overridden: false, example: true })
    cpSync(join(consumerDir, 'components/DocsHeader.override.vue'), join(consumerDir, 'components/DocsHeader.vue'))
    run('rebuild the prefixed consumer override', process.execPath, [nuxtCli, 'build'])
    await inspectConsumer({ prefixed: true, overridden: true, example: true })
  }
}
finally {
  if (originalDocsManifest)
    writeFileSync(docsManifestPath, originalDocsManifest)
  rmSync(consumerDir, { recursive: true, force: true })
}
