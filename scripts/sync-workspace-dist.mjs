import { cpSync, existsSync, rmSync } from 'node:fs'
import { createRequire } from 'node:module'
import { dirname, join } from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))
const rootDir = join(here, '..')
const docsDir = join(rootDir, 'docs')
const rootDist = join(rootDir, 'dist')

if (!existsSync(rootDist)) {
  console.error(`[sync-workspace-dist] root dist missing at ${rootDist}; run nuxt-module-build build --stub first`)
  process.exit(1)
}

const require = createRequire(import.meta.url)
const targetPackageJson = require.resolve('@sewadah/selaras/package.json', { paths: [docsDir] })
const targetDir = dirname(targetPackageJson)
const targetDist = join(targetDir, 'dist')

rmSync(targetDist, { recursive: true, force: true })
cpSync(rootDist, targetDist, { recursive: true })

console.log(`[sync-workspace-dist] synced ${rootDist} -> ${targetDist}`)
