import { cpSync, existsSync, realpathSync, rmSync } from 'node:fs'
import { createRequire } from 'node:module'
import { dirname, join } from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))
const rootDir = join(here, '..')
const rootDist = join(rootDir, 'dist')

if (!existsSync(join(rootDist, 'module.mjs'))) {
  console.error(`[sync-workspace-dist] root module entry missing at ${rootDist}; run nuxt-module-build build --stub first`)
  process.exit(1)
}

const targetDirs = new Set()
for (const consumerDir of [join(rootDir, 'docs'), join(rootDir, 'packages/docs/preview')]) {
  const require = createRequire(join(consumerDir, 'package.json'))
  const modulePaths = require.resolve.paths('@sewadah/selaras') ?? []
  const targetDir = modulePaths
    .map(path => join(path, '@sewadah/selaras'))
    .find(path => existsSync(join(path, 'package.json')))

  if (!targetDir) {
    console.error(`[sync-workspace-dist] local package missing for ${consumerDir}; run bun install first`)
    process.exit(1)
  }

  targetDirs.add(realpathSync(targetDir))
}

for (const targetDir of targetDirs) {
  if (targetDir === realpathSync(rootDir))
    continue

  const targetDist = join(targetDir, 'dist')
  rmSync(targetDist, { recursive: true, force: true })
  cpSync(rootDist, targetDist, { recursive: true })
  console.log(`[sync-workspace-dist] synced ${rootDist} -> ${targetDist}`)
}
