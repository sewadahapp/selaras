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

async function inspectSsr() {
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
    assert.match(html, /<button(?=[^>]*id="packed-default")(?=[^>]*data-selaras-color="published")(?=[^>]*type="button")(?=[^>]*tw:h-11)/)
    assert.match(html, /<button(?=[^>]*id="packed-scoped")(?=[^>]*data-selaras-color="published")(?=[^>]*tw:h-8)/)
    assert.match(html, /<button(?=[^>]*id="packed-registered-builtin")(?=[^>]*data-selaras-color="secondary")/)
    assert.match(html, /<button(?=[^>]*id="packed-runtime-builtin")(?=[^>]*data-selaras-color="primary")/)
    assert.match(html, /<span(?=[^>]*id="packed-badge")(?=[^>]*data-selaras-color="published")(?=[^>]*tw:bg-\[var\(--_selaras-color-subtle\)\])/)
    assert.match(html, /<span(?=[^>]*id="packed-dot")(?=[^>]*role="img")(?=[^>]*aria-label="Offline")(?=[^>]*data-selaras-color="neutral")/)
    assert.ok(html.includes('--selaras-color-primary-fill: #6789ab;'), 'built-in runtime tokens must appear in SSR head')
    assert.ok(html.includes('--selaras-color-published-fill: #456789;'), 'runtime app-config CSS must appear in SSR head')
    assert.ok(html.includes('--selaras-color-published-fill: #56789a;'), 'scoped token CSS must appear in SSR head')
    assert.ok(html.includes('published-row'), 'published generic Table must render its row')
    assert.match(html, /<button(?=[^>]*id="packed-select")(?=[^>]*aria-label="Published selection")/)
    assert.ok(html.includes('Published select'), 'published generic Select must display its custom-key default')
    assert.match(html, /<input(?=[^>]*name="packed-choices")(?=[^>]*value="1")/, 'bare multiple must preserve the numeric array default')
    assert.match(html, /<input(?=[^>]*id="packed-autocomplete-forced")(?=[^>]*aria-label="Published suggestion")(?=[^>]*value="Published select")/)
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
    assert.ok(css.includes('.tw\\:inline-flex'), 'published JS/Vue recipes must be scanned')
    assert.ok(css.includes('.tw\\:animate-in'), 'published animation candidates must be compiled')
    assert.ok(css.includes('--_selaras-color-fill:var(--selaras-color-published-fill,#123456)'), 'generated CSS must contain the registered default')
    assert.ok(css.includes('--_selaras-color-fill:var(--selaras-color-secondary-fill,#123456)'), 'module options must replace a built-in default recipe')
    assert.ok(css.includes('.dark [data-selaras-color=published]'), 'generated CSS must contain the dark role binding')
    assert.ok(Buffer.byteLength(css) <= 125_000)
    assert.ok(gzipSync(css).byteLength <= 18_000)
    console.log(`[packed] SSR, generated defaults/tokens, Table and CSS passed (${Buffer.byteLength(css)} bytes / ${gzipSync(css).byteLength} gzip)`)
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
  console.log(`[packed] Nuxt ${dependencies.nuxt}, Vue ${dependencies.vue}, Tailwind ${dependencies.tailwindcss}`)
  const nuxtCli = join(dirname(consumerRequire.resolve('nuxt/package.json')), 'bin/nuxt.mjs')
  run('prepare generated module config and types', process.execPath, [nuxtCli, 'prepare'])
  const generatedRoles = readFileSync(join(consumerDir, '.nuxt/selaras-color-roles.d.ts'), 'utf8')
  assert.ok(generatedRoles.includes('published: true'))
  assert.ok(!generatedRoles.includes('premium: true') && !generatedRoles.includes('enterprise: true'), 'generated roles must belong to this consumer')
  const vueTsc = join(dirname(consumerRequire.resolve('vue-tsc/package.json')), 'bin/vue-tsc.js')
  run('type-check generated roles and published component contracts', process.execPath, [vueTsc, '--noEmit', '--project', 'tsconfig.json'])
  run('build Nuxt using only public package and CSS imports', process.execPath, [nuxtCli, 'build'])
  await inspectSsr()
}
finally {
  rmSync(consumerDir, { recursive: true, force: true })
}
