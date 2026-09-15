import assert from 'node:assert/strict'
import { Buffer } from 'node:buffer'
import { spawn, spawnSync } from 'node:child_process'
import { cpSync, existsSync, mkdtempSync, readFileSync, realpathSync, rmSync, writeFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { tmpdir } from 'node:os'
import { dirname, join, relative } from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'
import { gzipSync } from 'node:zlib'
import { chromium } from '@playwright/test'

const rootDir = fileURLToPath(new URL('..', import.meta.url))
const rootRequire = createRequire(join(rootDir, 'package.json'))
const nuxtRequire = createRequire(rootRequire.resolve('nuxt/package.json'))
const consumerDir = mkdtempSync(join(tmpdir(), 'selaras-packed-'))

function run(label, command, args, cwd = consumerDir) {
  console.log(`[packed] ${label}`)
  const result = spawnSync(command, args, { cwd, env: process.env, encoding: 'utf8', maxBuffer: 16 * 1024 * 1024 })
  if (result.error)
    throw result.error
  assert.equal(result.status, 0, `${label}\n${result.stdout}\n${result.stderr}`)
  return result.stdout
}

function installedManifest(name) {
  for (const directory of nuxtRequire.resolve.paths(name) ?? []) {
    const path = join(directory, name, 'package.json')
    if (existsSync(path)) {
      const manifest = JSON.parse(readFileSync(path, 'utf8'))
      if (manifest.name === name)
        return manifest
    }
  }
  throw new Error(`Cannot find installed manifest for ${name}`)
}

async function inspectSsr(prefixed = true) {
  const server = spawn(process.execPath, ['.output/server/index.mjs'], {
    cwd: consumerDir,
    env: { ...process.env, NITRO_HOST: '127.0.0.1', NITRO_PORT: '0' },
    stdio: ['ignore', 'pipe', 'pipe'],
  })
  let output = ''
  try {
    const url = await new Promise((resolve, reject) => {
      const timer = setTimeout(() => reject(new Error(`Packed server startup timed out\n${output}`)), 30_000)
      server.once('error', (error) => {
        clearTimeout(timer)
        reject(error)
      })
      server.once('exit', (code) => {
        clearTimeout(timer)
        reject(new Error(`Packed server exited: ${code}\n${output}`))
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
    const response = await fetch(url)
    assert.equal(response.status, 200)
    const html = await response.text()
    const pattern = value => new RegExp(value.source.replaceAll('tw:', prefixed ? 'tw:' : ''), value.flags)
    assert.match(html, pattern(/<button(?=[^>]*id="packed-default")(?=[^>]*data-selaras-color="published")(?=[^>]*type="button")(?=[^>]*tw:h-11)/))
    assert.match(html, /<button(?=[^>]*id="packed-seed")(?=[^>]*data-selaras-color="seeded")/)
    assert.match(html, pattern(/<button(?=[^>]*id="packed-default")(?=[^>]*tw:font-bold)/), 'registered roles must match typed application compound variants')
    assert.match(html, pattern(/<button(?=[^>]*id="packed-scoped")(?=[^>]*data-selaras-color="published")(?=[^>]*tw:h-8)/))
    assert.match(html, /<button(?=[^>]*id="packed-registered-builtin")(?=[^>]*data-selaras-color="secondary")/)
    assert.match(html, /<button(?=[^>]*id="packed-runtime-builtin")(?=[^>]*data-selaras-color="primary")/)
    assert.match(html, pattern(/<span(?=[^>]*id="packed-badge")(?=[^>]*data-selaras-color="published")(?=[^>]*tw:bg-\[var\(--_selaras-color-subtle\)\])/))
    assert.match(html, /<span(?=[^>]*id="packed-dot")(?=[^>]*role="img")(?=[^>]*aria-label="Offline")(?=[^>]*data-selaras-color="neutral")/)
    assert.match(html, pattern(/<div(?=[^>]*data-selaras-color="published")(?=[^>]*tw:tracking-normal)/), 'registered roles must reach Alert recipe conditions')
    assert.match(html, pattern(/<span(?=[^>]*data-selaras-color="published")(?=[^>]*tw:tracking-tight)/), 'registered roles must reach Avatar recipe conditions')
    assert.match(html, pattern(/<button(?=[^>]*aria-label="Color picker")(?=[^>]*data-selaras-color="published")(?=[^>]*tw:tracking-wide)/), 'registered roles must reach ColorPicker recipe conditions')
    assert.match(html, pattern(/tw:tracking-widest/), 'registered roles must reach FileUpload recipe conditions')
    assert.match(html, pattern(/<span(?=[^>]*id="packed-icon")(?=[^>]*data-selaras-color="published")(?=[^>]*tw:align-top)/), 'registered roles must reach Icon recipe conditions')
    assert.match(html, pattern(/<a(?=[^>]*href="\/")(?=[^>]*tw:underline-offset-8)/), 'registered roles must reach NavigationMenu recipe conditions')
    assert.match(html, pattern(/<nav(?=[^>]*id="packed-breadcrumb")(?=[^>]*data-selaras-color="published")(?=[^>]*tw:outline-offset-2)/), 'registered roles must reach Breadcrumb recipe conditions')
    assert.match(html, pattern(/id="packed-accordion"(?=[^>]*tw:outline-dashed)/), 'registered roles must reach Accordion recipe conditions')
    assert.match(html, pattern(/id="packed-collapsible"(?=[^>]*tw:outline-dotted)/), 'registered roles must reach Collapsible recipe conditions')
    assert.match(html, /id="packed-separator"/, 'the published Separator must render during SSR')
    assert.match(html, pattern(/tw:opacity-75/), 'registered roles must reach Separator recipe conditions')
    assert.match(html, pattern(/id="packed-stepper"(?=[^>]*tw:outline-double)/), 'registered roles must reach Stepper recipe conditions')
    assert.match(html, pattern(/<nav(?=[^>]*id="packed-pagination")(?=[^>]*tw:outline-offset-4)/), 'Pagination layout conditions must reach its own recipe')
    assert.match(html, pattern(/id="packed-tabs"(?=[^>]*tw:outline-solid)/), 'registered roles must reach Tabs recipe conditions')
    assert.ok(html.includes('--selaras-color-primary-fill: #6789ab;'), 'built-in runtime tokens must appear in SSR head')
    assert.ok(html.includes('--selaras-color-published-fill: #456789;'), 'runtime app-config CSS must appear in SSR head')
    assert.ok(html.includes('--selaras-color-published-fill: #56789a;'), 'scoped token CSS must appear in SSR head')
    assert.ok(html.includes('published-row'), 'published generic Table must render its row')
    const packedSelectTag = [...html.matchAll(/<button[^>]*>/g)].find(([tag]) => tag.includes('id="packed-select"'))?.[0]
    assert.ok(packedSelectTag, 'published Select trigger must render during SSR')
    assert.match(packedSelectTag, /aria-label="Published selection"/)
    assert.match(packedSelectTag, pattern(/tw:font-semibold/), 'ui.select must configure Select')
    assert.match(packedSelectTag, pattern(/tw:tracking-wide/), 'ui.select must receive Select\'s registered role')
    assert.ok(html.includes('Published select'), 'published generic Select must display its custom-key default')
    assert.match(html, /<input(?=[^>]*name="packed-choices")(?=[^>]*value="1")/, 'bare multiple must preserve the numeric array default')
    assert.match(html, /<div[^>]*class="[^"]*font-semibold[^"]*tracking-wide[^"]*"[^>]*><input(?=[^>]*id="packed-autocomplete-forced")(?=[^>]*aria-label="Published suggestion")(?=[^>]*value="Published select")/, 'ui.select must configure Autocomplete through the shared recipe')
    assert.match(html, /<input(?=[^>]*name="packed-forced-choice")(?=[^>]*value="1")/)
    assert.match(html, /<input(?=[^>]*id="packed-autocomplete-created")(?=[^>]*aria-label="Published free text")(?=[^>]*value="Created text")/)
    const stylesheets = [...html.matchAll(/<link [^>]+>/g)]
      .filter(([tag]) => tag.includes('rel="stylesheet"'))
      .map(([tag]) => tag.match(/href="([^"]+)"/)?.[1])
    assert.ok(stylesheets.length > 0)
    const css = (await Promise.all(stylesheets.map(async (href) => {
      assert.ok(href)
      const result = await fetch(new URL(href, url))
      assert.equal(result.status, 200)
      return result.text()
    }))).join('\n')
    const cssPrefix = prefixed ? 'tw\\:' : ''
    const breakpoint = prefixed ? 'tablet' : 'laptop'
    assert.ok(css.includes(`.${cssPrefix}inline-flex`), 'published JS/Vue recipes must be scanned')
    assert.ok(css.includes(`.${cssPrefix}animate-in`), 'published animation candidates must be compiled')
    assert.ok(css.includes(`--${prefixed ? 'tw-' : ''}breakpoint-${breakpoint}:60rem`), 'host breakpoint must be emitted')
    assert.ok(css.includes(`--selaras-adaptive-breakpoint:var(--${prefixed ? 'tw-' : ''}breakpoint-${breakpoint})`), 'generated inputs must use current consumer options')
    assert.ok(css.includes('--_selaras-color-fill:var(--selaras-color-published-fill,#123456)'), 'generated CSS must contain the registered default')
    assert.ok(css.includes('--_selaras-color-fill:var(--selaras-color-seeded-fill,#f6584d)'), 'generated CSS must contain the seed-derived default')
    assert.ok(css.includes('--_selaras-color-fill:var(--selaras-color-secondary-fill,#123456)'), 'module options must replace a built-in default recipe')
    assert.ok(css.includes('.dark [data-selaras-color=published]'), 'generated CSS must contain the dark role binding')
    assert.ok(Buffer.byteLength(css) <= 125_000)
    assert.ok(gzipSync(css).byteLength <= 18_000)
    console.log(`[packed] SSR, generated defaults/tokens, Table and CSS passed (${Buffer.byteLength(css)} bytes / ${gzipSync(css).byteLength} gzip)`)
    if (process.env.SELARAS_PACKED_BROWSER) {
      const browser = await chromium.launch()
      try {
        const page = await browser.newPage({ viewport: { width: 959, height: 800 } })
        const issues = []
        page.on('pageerror', error => issues.push(error.message))
        page.on('console', (message) => {
          if (/hydration|mismatch|\[Selaras\]/i.test(message.text()))
            issues.push(message.text())
        })
        await page.goto(url)
        await page.waitForFunction(() => document.querySelector('#packed-narrow')?.textContent === 'true')
        const functionalInput = page.locator('#packed-functional-input')
        assert.equal(await functionalInput.evaluate(element => getComputedStyle(element).backgroundColor), 'rgb(240, 241, 242)')
        assert.equal(await functionalInput.evaluate(element => getComputedStyle(element).color), 'rgb(21, 22, 23)')
        const seededButton = page.locator('#packed-seed')
        assert.equal(await seededButton.evaluate(element => getComputedStyle(element).backgroundColor), 'rgb(246, 88, 77)')
        assert.equal(await seededButton.evaluate(element => getComputedStyle(element).color), 'rgb(0, 0, 0)')
        await page.locator('html').evaluate(element => element.classList.add('dark'))
        await page.waitForFunction(() => getComputedStyle(document.querySelector('#packed-functional-input')).backgroundColor === 'rgb(31, 32, 33)')
        assert.equal(await functionalInput.evaluate(element => getComputedStyle(element).color), 'rgb(220, 221, 222)')
        await page.waitForFunction(() => getComputedStyle(document.querySelector('#packed-seed')).backgroundColor === 'rgb(253, 94, 83)')
        assert.equal(await seededButton.evaluate(element => getComputedStyle(element).color), 'rgb(0, 0, 0)')
        await page.locator('html').evaluate(element => element.classList.remove('dark'))
        await page.addStyleTag({ content: 'html { font-size: 32px; }' })
        assert.equal(await page.locator('#packed-responsive').isVisible(), false)
        await page.setViewportSize({ width: 960, height: 800 })
        await page.waitForFunction(() => document.querySelector('#packed-narrow')?.textContent === 'false')
        assert.equal(await page.locator('#packed-responsive').isVisible(), true)
        await page.locator('#packed-toast').evaluate(element => element.click())
        await page.waitForFunction((expectedClass) => {
          const toast = [...document.querySelectorAll('[data-selaras-color="published"]')].find(element => element.textContent.includes('Published global toast'))
          return toast && toast.classList.contains(expectedClass) && getComputedStyle(toast).borderInlineStartColor === 'rgb(69, 103, 137)'
        }, prefixed ? 'tw:tracking-widest' : 'tracking-widest')
        assert.deepEqual(issues, [])
        console.log(`[packed] ${prefixed ? 'prefixed' : 'normal'} hydration and adaptive/CSS agreement passed`)
      }
      finally {
        await browser.close()
      }
    }
  }
  finally {
    if (server.exitCode === null) {
      server.kill('SIGTERM')
      await new Promise(resolve => server.once('exit', resolve))
    }
  }
}

try {
  // The compatibility runner builds first; packing must not rebuild or stub dist.
  const [archive] = JSON.parse(run('create the publishable tarball', 'npm', ['pack', '--ignore-scripts', '--json', '--pack-destination', consumerDir], rootDir))
  assert.ok(archive.files.some(file => file.path === 'dist/module.mjs'))
  assert.ok(!archive.files.some(file => file.path.startsWith('src/') || file.path.startsWith('.notes/')))
  cpSync(join(rootDir, 'test/fixtures/packed'), consumerDir, { recursive: true })
  // Compile the same inference matrix through direct package imports and the
  // component declarations generated by this consumer's Nuxt module.
  const selectContract = readFileSync(join(rootDir, 'test/packed-select.vue'), 'utf8')
  const generatedSelectContract = selectContract.replace('import SSelect from \'@sewadah/selaras/components/Select.vue\'\n', '')
  assert.notEqual(generatedSelectContract, selectContract, 'generated component checks must remove the direct Select import')
  writeFileSync(join(consumerDir, 'select-direct.vue'), selectContract)
  writeFileSync(join(consumerDir, 'select-generated.vue'), generatedSelectContract)
  cpSync(join(rootDir, 'test/packed-types.ts'), join(consumerDir, 'public-contracts.ts'))
  const autocompleteContract = readFileSync(join(rootDir, 'test/packed-autocomplete.vue'), 'utf8')
  const generatedAutocompleteContract = autocompleteContract.replace('import SAutocomplete from \'@sewadah/selaras/components/Autocomplete.vue\'\n', '')
  assert.notEqual(generatedAutocompleteContract, autocompleteContract, 'generated component checks must remove the direct Autocomplete import')
  writeFileSync(join(consumerDir, 'autocomplete-direct.vue'), autocompleteContract)
  writeFileSync(join(consumerDir, 'autocomplete-generated.vue'), generatedAutocompleteContract)
  const sourceManifest = JSON.parse(readFileSync(join(rootDir, 'package.json'), 'utf8'))
  const dependencies = Object.fromEntries(
    ['nuxt', 'vue', 'tailwindcss', 'typescript', 'vue-tsc']
      .map(name => [name, installedManifest(name).version]),
  )
  const overrides = Object.fromEntries(Object.keys(sourceManifest.dependencies).map(name => [name, installedManifest(name).version]))
  dependencies[sourceManifest.name] = `file:./${archive.filename}`
  writeFileSync(join(consumerDir, 'package.json'), `${JSON.stringify({ name: 'selaras-packed-consumer', private: true, type: 'module', dependencies, overrides }, null, 2)}\n`)
  run('install the tarball in an isolated dependency graph', 'bun', ['install', '--ignore-scripts'])
  const consumerRequire = createRequire(join(consumerDir, 'package.json'))
  const packageEntry = realpathSync(fileURLToPath(run('resolve the public ESM module entry', process.execPath, [
    '--input-type=module',
    '-e',
    `console.log(import.meta.resolve(${JSON.stringify(sourceManifest.name)}))`,
  ]).trim()))
  assert.ok(!relative(consumerDir, packageEntry).startsWith('..'), 'package resolution must stay outside the repository')
  assert.ok(!existsSync(join(consumerDir, 'node_modules', sourceManifest.name, 'src')))
  const defaultTokens = JSON.parse(run('load the published default DTCG token source', process.execPath, [
    '--input-type=module',
    '-e',
    `import tokens from ${JSON.stringify(`${sourceManifest.name}/tokens/default-colors.tokens.json`)} with { type: 'json' }; console.log(JSON.stringify(tokens))`,
  ]))
  assert.equal(defaultTokens.color.$type, 'color')
  assert.equal(defaultTokens.color.palette.indigo['500'].$value.colorSpace, 'oklch')
  console.log(`[packed] Nuxt ${dependencies.nuxt}, Vue ${dependencies.vue}, Tailwind ${dependencies.tailwindcss}`)
  const nuxtCli = join(dirname(consumerRequire.resolve('nuxt/package.json')), 'bin/nuxt.mjs')
  run('build a fresh consumer without a separate prepare step', process.execPath, [nuxtCli, 'build'])
  const generatedImports = readFileSync(join(consumerDir, '.nuxt/imports.d.ts'), 'utf8')
  for (const internalName of ['useComboboxSelect', 'flattenItems', 'isOptionGroup'])
    assert.doesNotMatch(generatedImports, new RegExp(`\\b${internalName}\\b`), `${internalName} must remain internal`)
  const generatedRoles = readFileSync(join(consumerDir, '.nuxt/selaras-color-roles.d.ts'), 'utf8')
  assert.ok(generatedRoles.includes('"published": true'))
  assert.ok(generatedRoles.includes('"seeded": true'))
  assert.ok(generatedRoles.includes('"published-accent": true'), 'legal kebab-case roles must generate valid TypeScript members')
  assert.doesNotMatch(generatedRoles, /"(?:premium|enterprise)": true/, 'generated roles must belong to this consumer')
  const vueTsc = join(dirname(consumerRequire.resolve('vue-tsc/package.json')), 'bin/vue-tsc.js')
  run('type-check generated roles and published component contracts', process.execPath, [vueTsc, '--noEmit', '--project', 'tsconfig.json'])
  await inspectSsr()
  const configPath = join(consumerDir, 'nuxt.config.ts')
  writeFileSync(configPath, readFileSync(configPath, 'utf8').replace('classPrefix: \'tw\'', 'classPrefix: undefined').replace('breakpoint: \'tablet\'', 'breakpoint: \'laptop\''))
  const cssPath = join(consumerDir, 'main.css')
  writeFileSync(cssPath, readFileSync(cssPath, 'utf8').replace(' prefix(tw)', '').replace('--breakpoint-tablet', '--breakpoint-laptop'))
  const appPath = join(consumerDir, 'app.vue')
  writeFileSync(appPath, readFileSync(appPath, 'utf8').replace('tw:hidden tw:tablet:block', 'hidden laptop:block'))
  run('rebuild changed prefix and breakpoint options without prepare', process.execPath, [nuxtCli, 'build'])
  await inspectSsr(false)
}
finally {
  rmSync(consumerDir, { recursive: true, force: true })
}
