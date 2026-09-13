import { spawnSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
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

if (process.env.SELARAS_TAILWIND_VERSION) {
  for (const packageName of ['tailwindcss', '@tailwindcss/vite', '@tailwindcss/oxide']) {
    const manifest = JSON.parse(readFileSync(join(rootDir, 'node_modules', packageName, 'package.json'), 'utf8'))
    if (manifest.version !== process.env.SELARAS_TAILWIND_VERSION) {
      console.error(`[compat] Expected ${packageName}@${process.env.SELARAS_TAILWIND_VERSION}, resolved ${manifest.version}`)
      process.exit(1)
    }
  }

  console.log(`[compat] Tailwind packages ${process.env.SELARAS_TAILWIND_VERSION}`)
}

run(
  'prepare the clean module build context',
  'node_modules/@nuxt/module-builder/dist/cli.mjs',
  ['prepare'],
)

run(
  'build the published module artifact',
  'node_modules/@nuxt/module-builder/dist/cli.mjs',
  ['build'],
)

run(
  'type-check the published public surface',
  'node_modules/vue-tsc/bin/vue-tsc.js',
  ['--project', 'test/tsconfig.packed.json'],
)

run(
  'exercise the published theme helper',
  'test/packed-theme.mjs',
  [],
)

run(
  'exercise source-backed basic and prefixed consumers',
  'node_modules/vitest/vitest.mjs',
  ['run', 'test/basic.test.ts', 'test/prefix.test.ts'],
)

run(
  'exercise an isolated installed-tarball consumer',
  'scripts/test-packed-consumer.mjs',
  [],
)
