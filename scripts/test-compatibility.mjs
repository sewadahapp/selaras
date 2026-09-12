import { spawnSync } from 'node:child_process'
import process from 'node:process'
import { fileURLToPath } from 'node:url'

const rootDir = fileURLToPath(new URL('..', import.meta.url))

function run(label, script, args) {
  console.log(`\n[compat] ${label}`)

  const result = spawnSync(process.execPath, [script, ...args], {
    cwd: rootDir,
    env: process.env,
    stdio: 'inherit',
  })

  if (result.error)
    throw result.error

  if (result.status !== 0) {
    console.error(`[compat] ${label} failed with exit code ${result.status ?? 'unknown'}`)
    process.exit(result.status ?? 1)
  }
}

console.log(`[compat] Node ${process.version}`)

run(
  'build the published module artifact',
  'node_modules/@nuxt/module-builder/dist/cli.mjs',
  ['build'],
)

run(
  'exercise basic and prefixed packed consumers',
  'node_modules/vitest/vitest.mjs',
  ['run', 'test/basic.test.ts', 'test/prefix.test.ts'],
)
