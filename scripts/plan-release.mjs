import { execFileSync } from 'node:child_process'
import { createHash } from 'node:crypto'
import { appendFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import process from 'node:process'
import { pathToFileURL } from 'node:url'
import { parse } from 'yaml'

export const releasePackages = {
  selaras: { manifest: 'package.json', prefix: 'selaras-v', directory: '.' },
  docs: { manifest: 'packages/docs/package.json', prefix: 'selaras-docs-v', directory: 'packages/docs' },
  mcp: { manifest: 'packages/mcp/package.json', prefix: 'selaras-mcp-v', directory: 'packages/mcp' },
}
const selections = {
  'auto': null,
  'selaras': ['selaras'],
  'selaras-docs': ['docs'],
  'selaras-mcp': ['mcp'],
  'selaras-and-docs': ['selaras', 'docs'],
  'all': ['selaras', 'docs', 'mcp'],
}
const buildDependencies = ['@nuxt/module-builder', '@nuxt/schema', 'typescript', 'vue-tsc', 'yaml']
const buildFiles = ['build.config.ts', 'tsconfig.json', 'scripts/build-agent-catalog.mjs', 'scripts/generate-default-colors.mjs']
const ignoredFiles = ['CONTRIBUTING.md', 'SECURITY.md', 'CODE_OF_CONDUCT.md', 'commitlint.config.mjs', 'eslint.config.js', 'vitest.config.ts', 'playwright.config.ts', '.npmrc']

function stable(value) {
  if (Array.isArray(value))
    return value.map(stable)
  if (value && typeof value === 'object')
    return Object.fromEntries(Object.keys(value).sort().map(key => [key, stable(value[key])]))
  return value
}

function equal(a, b) {
  return JSON.stringify(stable(a)) === JSON.stringify(stable(b))
}

/** Exclude local scripts, tooling, and release bookkeeping from published metadata. */
function publishedManifest(manifest = {}) {
  const { version, scripts, devDependencies, workspaces, packageManager, ...published } = manifest
  return published
}

function packageFile(file, config, manifests) {
  const relative = file.slice(config.directory.length + 1)
  if (['README.md', 'LICENSE', 'LICENSE.md'].includes(relative))
    return true
  return manifests.flatMap(manifest => manifest?.files ?? [])
    .some((entry) => {
      const path = entry.replace(/^\.\//, '').replace(/\/$/, '')
      return relative === path || relative.startsWith(`${path}/`)
    })
}

/** Bun's text lockfile uses JSON with trailing commas, accepted by the YAML parser. */
export function dependencySnapshot(lock, manifest, core = false) {
  const entries = lock?.packages ?? {}
  const pending = Object.keys({ ...manifest?.dependencies, ...manifest?.optionalDependencies })
  if (core)
    pending.push(...buildDependencies)
  const seen = new Set()
  const result = {}
  while (pending.length) {
    const name = pending.pop()
    if (seen.has(name) || name === '@sewadah/selaras')
      continue
    seen.add(name)
    // Include nested resolutions as well as the hoisted one. This is conservative
    // when multiple dependency branches use different versions of the same name.
    for (const [key, entry] of Object.entries(entries)) {
      if (key !== name && !key.endsWith(`/${name}`))
        continue
      result[key] = entry
      const metadata = entry.find(value => value && typeof value === 'object' && !Array.isArray(value))
      pending.push(...Object.keys({ ...metadata?.dependencies, ...metadata?.optionalDependencies }))
    }
  }
  return result
}

export function inferBump(commits, version) {
  let bump = 'patch'
  for (const commit of commits) {
    if (!commit.runtime)
      continue
    if (/^[a-z]+(?:\([^)]*\))?!:/.test(commit.subject) || /^BREAKING[ -]CHANGE:/m.test(commit.body)) {
      bump = 'major'
      break
    }
    if (commit.subject.startsWith('feat:') || commit.subject.startsWith('feat('))
      bump = 'minor'
  }
  // Before 1.0, retain the workspace's existing policy: breaking changes
  // increment minor, and features increment patch. Stable releases use SemVer.
  if (version.startsWith('0.'))
    return bump === 'major' ? 'minor' : 'patch'
  return bump
}

export function nextVersion(current, bump, exact) {
  const pattern = /^(?:0|[1-9]\d*)\.(?:0|[1-9]\d*)\.(?:0|[1-9]\d*)$/
  if (!pattern.test(current) || (exact && !pattern.test(exact)))
    throw new Error(`Expected stable x.y.z versions, found ${current} / ${exact ?? ''}`)
  const parts = current.split('.').map(Number)
  let target
  if (exact) {
    target = exact
  }
  else {
    const index = ['major', 'minor', 'patch'].indexOf(bump)
    if (index < 0)
      throw new Error(`Unknown version bump: ${bump}`)
    parts[index]++
    for (let i = index + 1; i < parts.length; i++)
      parts[i] = 0
    target = parts.join('.')
  }
  const old = current.split('.').map(Number)
  const proposed = target.split('.').map(Number)
  const firstDifference = proposed.findIndex((part, index) => part !== old[index])
  if (firstDifference < 0 || proposed[firstDifference] < old[firstDifference])
    throw new Error(`Release version ${target} must be greater than ${current}`)
  return target
}

export function createReleasePlan({ cwd = process.cwd(), inputs = {} } = {}) {
  const git = (...args) => execFileSync('git', args, { cwd, encoding: 'utf8', maxBuffer: 32 * 1024 * 1024 }).trimEnd()
  const head = git('rev-parse', 'HEAD')
  const read = (ref, path) => {
    if (!git('ls-tree', '--name-only', ref, '--', path))
      return undefined
    return execFileSync('git', ['show', `${ref}:${path}`], { cwd, encoding: 'utf8', maxBuffer: 32 * 1024 * 1024 })
  }
  const json = (ref, path) => {
    const content = read(ref, path)
    return content ? JSON.parse(content) : undefined
  }
  const selection = inputs.package || 'auto'
  if (!Object.hasOwn(selections, selection))
    throw new Error(`Unknown package selection: ${selection}`)
  const requested = selections[selection]
  const unknown = new Set()
  const packages = []
  const tags = new Set(git('tag', '--merged', head).split('\n'))
  const allTags = new Set(git('tag', '--list').split('\n'))
  const manifests = Object.fromEntries(Object.entries(releasePackages).map(([id, config]) => [id, json(head, config.manifest)]))
  const cache = new Map()
  const changes = (sha) => {
    if (cache.has(sha))
      return cache.get(sha)
    const [subject, body, parents] = git('show', '-s', '--format=%s%x00%b%x00%P', sha).split('\0')
    const parent = parents?.split(' ')[0]
    const files = git('diff-tree', '--root', '--no-commit-id', '--name-only', '--no-renames', '-r', '--diff-merges=first-parent', '-z', sha).split('\0').filter(Boolean)
    const result = { sha, subject, body: body ?? '', parent, files }
    cache.set(sha, result)
    return result
  }
  for (const [id, config] of Object.entries(releasePackages)) {
    const manifest = manifests[id]
    const baseTag = [`${config.prefix}${manifest.version}`, ...(id === 'selaras' ? [`v${manifest.version}`] : [])].find(tag => tags.has(tag))
    if (!baseTag)
      throw new Error(`Missing reachable release tag for ${manifest.name}@${manifest.version}; fetch full history and tags or recover the release records first`)
    const previousManifest = json(baseTag, config.manifest)
    const netFiles = new Set(git('diff', '--name-only', '--no-renames', '-z', baseTag, head).split('\0').filter(Boolean))
    const commits = []
    for (const sha of git('rev-list', `${baseTag}..${head}`).split('\n').filter(Boolean)) {
      const commit = changes(sha)
      if (/^chore\(release\)[!:]/.test(commit.subject))
        continue
      const reasons = []
      let runtime = false
      for (const file of commit.files.filter(file => netFiles.has(file))) {
        let owner
        let affectsRuntime = true
        if (file === config.manifest) {
          const before = commit.parent ? json(commit.parent, file) : undefined
          const after = json(sha, file)
          if (!equal(publishedManifest(before), publishedManifest(after))) {
            owner = id
          }
          else if (id === 'selaras' && !equal(
            Object.fromEntries(buildDependencies.map(name => [name, before?.devDependencies?.[name]])),
            Object.fromEntries(buildDependencies.map(name => [name, after?.devDependencies?.[name]])),
          )) {
            owner = id
          }
          else {
            continue
          }
        }
        else if (Object.values(releasePackages).some(pkg => pkg.manifest === file)) {
          continue
        }
        else if (file === 'bun.lock') {
          const oldLock = commit.parent ? read(commit.parent, file) : undefined
          const newLock = read(sha, file)
          const before = dependencySnapshot(oldLock ? parse(oldLock) : undefined, commit.parent ? json(commit.parent, config.manifest) : {}, id === 'selaras')
          const after = dependencySnapshot(newLock ? parse(newLock) : undefined, json(sha, config.manifest), id === 'selaras')
          if (!equal(before, after))
            owner = id
          else
            continue
        }
        else if (file.endsWith('CHANGELOG.md')) {
          continue
        }
        else if (file.startsWith('src/') || file.startsWith('skills/') || buildFiles.includes(file)) {
          owner = 'selaras'
        }
        else if ((file.startsWith('docs/content/') && file.endsWith('.md') && file !== 'docs/content/index.md')
          || (file.startsWith('docs/components/content/examples/') && file.endsWith('.vue')) || file === 'docs/utils/llms-examples.ts') {
          owner = 'selaras'
          affectsRuntime = false
        }
        else if (file === 'README.md' || file === 'LICENSE' || file === 'LICENSE.md') {
          owner = file === 'README.md' ? 'selaras' : id
          affectsRuntime = false
        }
        else if (file.startsWith('packages/docs/preview/')) {
          continue
        }
        else if (file.startsWith('packages/docs/')) {
          if (id !== 'docs' || !packageFile(file, config, [manifest, previousManifest]))
            continue
          owner = id
          affectsRuntime = !file.endsWith('.md')
        }
        else if (file.startsWith('packages/mcp/')) {
          if (id !== 'mcp' || !packageFile(file, config, [manifest, previousManifest]))
            continue
          owner = id
          affectsRuntime = !file.endsWith('.md')
        }
        else if (file.startsWith('docs/') || file.startsWith('test/') || file.startsWith('.github/')
          || file.startsWith('.husky/') || file.startsWith('scripts/') || file.startsWith('.') || ignoredFiles.includes(file)) {
          continue
        }
        else {
          unknown.add(file)
          continue
        }
        if (owner === id) {
          reasons.push(file)
          runtime ||= affectsRuntime
        }
      }
      if (reasons.length)
        commits.push({ sha, subject: commit.subject, body: commit.body, files: reasons, runtime })
    }
    const bumpInput = inputs[`${id}-bump`] || 'auto'
    const exact = inputs[`${id}-version`]?.trim() || undefined
    if (!['auto', 'patch', 'minor', 'major'].includes(bumpInput))
      throw new Error(`Unknown ${id} bump: ${bumpInput}`)
    if (requested && !requested.includes(id) && (exact || bumpInput !== 'auto'))
      throw new Error(`Override supplied for unselected package ${id}`)
    const selected = requested ? requested.includes(id) : commits.length > 0 || !!exact || bumpInput !== 'auto'
    if (!selected)
      continue
    const bump = bumpInput === 'auto' ? inferBump(commits, manifest.version) : bumpInput
    const version = nextVersion(manifest.version, bump, exact)
    if (allTags.has(`${config.prefix}${version}`) || (id === 'selaras' && allTags.has(`v${version}`)))
      throw new Error(`Target release tag already exists: ${config.prefix}${version}`)
    const tag = id === 'selaras' ? `v${version}` : `${config.prefix}${version}`
    const manifestHash = createHash('sha256').update(read(head, config.manifest)).digest('hex')
    packages.push({ id, name: manifest.name, manifest: config.manifest, manifestHash, directory: config.directory, baseTag, currentVersion: manifest.version, version, bump, tag, commits, forced: requested !== null || !!exact || bumpInput !== 'auto' })
  }
  if (unknown.size && selection === 'auto')
    throw new Error(`Unclassified release paths: ${[...unknown].join(', ')}. Add ownership rules or use an explicit package selection after review.`)
  return { head, selection, packages, warnings: [...unknown], deployDocs: true }
}

export function formatReleasePlan(plan) {
  const lines = ['## Release plan', '', `Commit: \`${plan.head}\``, '', '| Package | Previous tag | Version | Reason |', '| --- | --- | --- | --- |']
  for (const pkg of plan.packages) {
    lines.push(`| ${pkg.name} | ${pkg.baseTag} | ${pkg.currentVersion} → **${pkg.version}** | ${pkg.commits.length} relevant commit(s)${pkg.forced ? '; manual selection/override' : ''} |`)
  }
  if (!plan.packages.length)
    lines.push('', 'No npm packages require a release.')
  lines.push('', 'The documentation website will be rebuilt and deployed. Package versions remain independent.')
  for (const pkg of plan.packages) {
    lines.push('', `### ${pkg.name}`, '')
    for (const commit of pkg.commits)
      lines.push(`- \`${commit.sha.slice(0, 7)}\` ${commit.subject.replaceAll('|', '\\|')}: ${commit.files.map(file => `\`${file}\``).join(', ')}`)
  }
  if (plan.warnings.length)
    lines.push('', `Manual ownership review required: ${plan.warnings.join(', ')}`)
  return `${lines.join('\n')}\n`
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const plan = createReleasePlan({ inputs: JSON.parse(process.env.RELEASE_INPUTS || '{}') })
  const output = process.argv.indexOf('--output')
  if (output !== -1)
    writeFileSync(resolve(process.argv[output + 1]), `${JSON.stringify(plan, null, 2)}\n`)
  const summary = formatReleasePlan(plan)
  process.stdout.write(summary)
  if (process.env.GITHUB_STEP_SUMMARY)
    appendFileSync(process.env.GITHUB_STEP_SUMMARY, summary)
  if (process.env.GITHUB_OUTPUT) {
    const outputs = {
      packages: plan.packages.map(pkg => pkg.id === 'selaras' ? 'selaras' : `selaras-${pkg.id}`).join(' '),
      has_packages: plan.packages.length > 0,
    }
    for (const id of Object.keys(releasePackages)) {
      const pkg = plan.packages.find(pkg => pkg.id === id)
      outputs[id] = !!pkg
      outputs[`${id}_version`] = pkg?.version ?? ''
      outputs[`${id}_tag`] = pkg?.tag ?? ''
    }
    appendFileSync(process.env.GITHUB_OUTPUT, Object.entries(outputs).map(([key, value]) => `${key}=${value}\n`).join(''))
  }
}
