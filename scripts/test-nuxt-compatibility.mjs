import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { appendFileSync } from 'node:fs'
import process from 'node:process'
import { fileURLToPath } from 'node:url'
import { nuxtCompatibilityChannels, nuxtCompatibilityEnvironment } from './packed-nuxt.mjs'

const rootDir = fileURLToPath(new URL('..', import.meta.url))
const channel = process.argv[2] ?? 'future'
const scope = process.argv[3] ?? 'all'
const target = nuxtCompatibilityChannels[channel]
assert.ok(target && ['all', 'core', 'docs'].includes(scope), 'Usage: bun run test:nuxt-compat [future|nightly] [all|core|docs]')

const metadata = spawnSync('npm', ['view', `${target.package}@${target.tag}`, 'version', 'dependencies.vue', '--json'], {
  cwd: rootDir,
  encoding: 'utf8',
  timeout: 120_000,
})
if (metadata.error)
  throw metadata.error
assert.equal(metadata.status, 0, `Resolve the Nuxt compatibility target\n${metadata.stderr}`)
const environment = {
  ...process.env,
  ...nuxtCompatibilityEnvironment(channel, JSON.parse(metadata.stdout)),
  SELARAS_PACKED_BROWSER: '1',
  SELARAS_DOCS_LAYER_BROWSER: '1',
}
console.log(`[nuxt-compat] ${channel}: ${environment.SELARAS_NUXT_VERSION}, Vue ${environment.SELARAS_NUXT_VUE_VERSION}`)
console.log(`[nuxt-compat] future.compatibilityVersion: ${environment.SELARAS_NUXT_COMPATIBILITY_VERSION || 'framework default'}`)
console.log(`[nuxt-compat] scope: ${scope}; browser checks enabled`)

function run(label, script, args = [], env = {}) {
  console.log(`\n[nuxt-compat] ${label}`)
  const result = spawnSync(process.execPath, [script, ...args], {
    cwd: rootDir,
    env: { ...environment, ...env },
    stdio: 'inherit',
  })
  if (result.error)
    throw result.error
  return result.status === 0
}

if (!run('prepare the module build', 'node_modules/@nuxt/module-builder/dist/cli.mjs', ['prepare'])
  || !run('build the published artifact', 'node_modules/@nuxt/module-builder/dist/cli.mjs', ['build'])) {
  process.exitCode = 1
}
else {
  const results = [
    ...(scope !== 'docs' ? [['Core package', run('exercise installed core consumers', 'scripts/test-packed-consumer.mjs')]] : []),
    ...(scope !== 'core'
      ? [
          ['Prefixed docs layer', run('exercise installed prefixed docs consumers', 'scripts/test-packed-docs-layer.mjs')],
          ['Default docs layer', run('exercise the installed default docs consumer', 'scripts/test-packed-docs-layer.mjs', [], { SELARAS_DOCS_LAYER_NORMAL_ONLY: '1' })],
        ]
      : []),
  ]
  for (const [label, passed] of results)
    console.log(`[nuxt-compat] ${label}: ${passed ? 'passed' : 'failed'}`)
  if (process.env.GITHUB_STEP_SUMMARY) {
    appendFileSync(process.env.GITHUB_STEP_SUMMARY, [
      `### Nuxt compatibility: ${channel}`,
      '',
      `Nuxt: \`${environment.SELARAS_NUXT_VERSION}\`. Future compatibility: \`${environment.SELARAS_NUXT_COMPATIBILITY_VERSION || 'framework default'}\`.`,
      '',
      ...results.map(([label, passed]) => `- ${label}: **${passed ? 'passed' : 'failed'}**`),
      '',
    ].join('\n'))
  }
  if (results.some(([, passed]) => !passed))
    process.exitCode = 1
}
