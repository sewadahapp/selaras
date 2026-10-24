import { execFileSync } from 'node:child_process'
import { createHash } from 'node:crypto'
import { readFileSync, writeFileSync } from 'node:fs'
import { join, resolve } from 'node:path'
import process from 'node:process'
import { pathToFileURL } from 'node:url'
import { buildChangelogEntry } from './bump-workspace-package.mjs'
import { nextVersion, releasePackages } from './plan-release.mjs'

/** Apply only a previously computed plan; never infer another version mid-release. */
export function applyReleasePlan({ planPath, cwd = process.cwd() }) {
  const plan = JSON.parse(readFileSync(planPath, 'utf8'))
  const head = execFileSync('git', ['rev-parse', 'HEAD'], { cwd, encoding: 'utf8' }).trim()
  if (head !== plan.head)
    throw new Error('Release plan is stale: HEAD changed; generate and review a new plan')
  const candidates = plan.packages.map((pkg) => {
    const config = releasePackages[pkg.id]
    if (!config || pkg.manifest !== config.manifest)
      throw new Error(`Invalid planned package: ${pkg.id}`)
    const content = readFileSync(join(cwd, config.manifest), 'utf8')
    const manifest = JSON.parse(content)
    if (manifest.version !== pkg.currentVersion || manifest.name !== pkg.name
      || createHash('sha256').update(content).digest('hex') !== pkg.manifestHash) {
      throw new Error(`Release plan is stale: ${pkg.name} manifest changed`)
    }
    nextVersion(pkg.currentVersion, pkg.bump, pkg.version)
    const changelog = join(cwd, config.directory, 'CHANGELOG.md')
    const current = readFileSync(changelog, 'utf8')
    return { pkg, manifest, changelog, current }
  })
  const coreVersion = plan.packages.find(pkg => pkg.id === 'selaras')?.version
    ?? JSON.parse(readFileSync(join(cwd, 'package.json'), 'utf8')).version
  for (const { pkg, manifest, changelog, current } of candidates) {
    const body = buildChangelogEntry({
      version: pkg.version,
      previousTag: pkg.baseTag,
      commits: pkg.commits,
      selarasVersion: pkg.id === 'docs' ? coreVersion : undefined,
      tagPrefix: releasePackages[pkg.id].prefix,
      repo: 'sewadahapp/selaras',
    })
    manifest.version = pkg.version
    writeFileSync(join(cwd, pkg.manifest), `${JSON.stringify(manifest, null, 2)}\n`)
    writeFileSync(changelog, `# Changelog\n\n${body}\n${current.replace(/^# Changelog\s*/, '')}`)
    writeFileSync(`${planPath}.${pkg.id}.md`, body)
    console.log(`[release] prepared ${pkg.name}@${pkg.version}`)
  }
  return plan
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href)
  applyReleasePlan({ planPath: resolve(process.argv[2]) })
