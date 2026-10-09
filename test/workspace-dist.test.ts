import { execFileSync } from 'node:child_process'
import { copyFileSync, existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, symlinkSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'
import { afterEach, describe, expect, it } from 'vitest'

const fixtures: string[] = []

afterEach(() => {
  for (const fixture of fixtures.splice(0))
    rmSync(fixture, { recursive: true, force: true })
})

function createFixture(linkRoot = false) {
  const root = mkdtempSync(join(tmpdir(), 'selaras-workspace-dist-'))
  fixtures.push(root)
  mkdirSync(join(root, 'scripts'))
  copyFileSync(fileURLToPath(new URL('../scripts/sync-workspace-dist.mjs', import.meta.url)), join(root, 'scripts/sync-workspace-dist.mjs'))
  mkdirSync(join(root, 'dist'))
  writeFileSync(join(root, 'dist/module.mjs'), 'export default "local module"')
  writeFileSync(join(root, 'package.json'), JSON.stringify({ name: '@sewadah/selaras', exports: { '.': { import: './dist/module.mjs' } } }))

  const targets: string[] = []
  for (const consumer of ['docs', 'packages/docs']) {
    const scope = join(root, consumer, 'node_modules/@sewadah')
    mkdirSync(scope, { recursive: true })
    const target = join(scope, 'selaras')
    targets.push(target)
    if (linkRoot) {
      symlinkSync(root, target, 'dir')
    }
    else {
      mkdirSync(target)
      copyFileSync(join(root, 'package.json'), join(target, 'package.json'))
      mkdirSync(join(target, 'dist'))
      writeFileSync(join(target, 'dist/stale.mjs'), 'stale build')
    }
  }
  return { root, targets, run: () => execFileSync(process.execPath, [join(root, 'scripts/sync-workspace-dist.mjs')], { stdio: 'pipe' }) }
}

describe('workspace module preparation', () => {
  it('restores both local consumers without requiring exported package metadata or a working module entry', () => {
    const { targets, run } = createFixture()
    run()
    for (const target of targets) {
      expect(readFileSync(join(target, 'dist/module.mjs'), 'utf8')).toBe('export default "local module"')
      expect(existsSync(join(target, 'dist/stale.mjs'))).toBe(false)
    }
  })

  it('preserves the source distribution when consumers link directly to the workspace root', () => {
    const { root, run } = createFixture(true)
    run()
    expect(readFileSync(join(root, 'dist/module.mjs'), 'utf8')).toBe('export default "local module"')
  })

  it('leaves installed files intact when the source module has not been built', () => {
    const { root, targets, run } = createFixture()
    rmSync(join(root, 'dist/module.mjs'))
    expect(run).toThrow()
    for (const target of targets)
      expect(readFileSync(join(target, 'dist/stale.mjs'), 'utf8')).toBe('stale build')
  })
})
