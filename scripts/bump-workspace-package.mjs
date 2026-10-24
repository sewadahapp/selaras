import { execFileSync } from 'node:child_process'
import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import process from 'node:process'
import { fileURLToPath, pathToFileURL } from 'node:url'

const rootDir = fileURLToPath(new URL('..', import.meta.url))
const rootManifestPath = fileURLToPath(new URL('../package.json', import.meta.url))

/**
 * The workspace packages released independently of `@sewadah/selaras`.
 * `paths` limits release notes to commits touching the package (the docs
 * layer depends on the whole library, so it lists every commit), and
 * `publishedAgainst` records the core version a release pairs with.
 */
export const workspacePackages = {
  docs: {
    label: 'docs-layer',
    directory: 'packages/docs',
    tagPrefix: 'selaras-docs-v',
    paths: [],
    publishedAgainst: true,
  },
  mcp: {
    label: 'mcp',
    directory: 'packages/mcp',
    tagPrefix: 'selaras-mcp-v',
    paths: ['packages/mcp'],
    publishedAgainst: false,
  },
}

function resolvePackage(name) {
  const config = workspacePackages[name]
  if (!config)
    throw new Error(`[release] unknown package ${name}, expected ${Object.keys(workspacePackages).join(' or ')}`)
  return {
    ...config,
    manifestPath: fileURLToPath(new URL(`../${config.directory}/package.json`, import.meta.url)),
    changelogPath: fileURLToPath(new URL(`../${config.directory}/CHANGELOG.md`, import.meta.url)),
  }
}

function parseVersion(version, label = 'release') {
  const match = /^(\d+)\.(\d+)\.(\d+)$/.exec(version ?? '')
  if (!match)
    throw new Error(`[${label}] expected a plain x.y.z version, found ${version}`)
  return match.slice(1).map(Number)
}

function splitConventional(subject) {
  // Matched in two linear steps on purpose: a single `type:\s rest` pattern
  // lets `\s+` and `.*` overlap, which the lint rules flag as potential
  // polynomial backtracking.
  const match = /^([a-z]+)(\([^)]*\))?(!)?:\s/.exec(subject)
  if (!match)
    return null
  return { type: match[1], prefix: `${match[1]}${match[2] ?? ''}${match[3] ?? ''}:`, rest: subject.slice(match[0].length) }
}

function repositoryPath() {
  const repository = JSON.parse(readFileSync(rootManifestPath, 'utf8')).repository ?? ''
  const url = typeof repository === 'string' ? repository : repository.url ?? ''
  return url.replace(/^(?:github:)?(?:https?:\/\/github\.com\/)?/, '').replace(/\.git$/, '')
}

function previousTag(tagPrefix) {
  try {
    return execFileSync('git', ['describe', '--tags', '--abbrev=0', '--match', `${tagPrefix}*`, 'HEAD'], { cwd: rootDir, encoding: 'utf8' }).trim() || null
  }
  catch {
    return null
  }
}

function readCommitsSince(from, paths = []) {
  const range = from ? `${from}..HEAD` : 'HEAD'
  const output = execFileSync('git', ['log', range, '--format=%H %s', ...(paths.length ? ['--', ...paths] : [])], { cwd: rootDir, encoding: 'utf8' })
  return output.split('\n')
    .filter(Boolean)
    .map((line) => {
      const separator = line.indexOf(' ')
      return { sha: line.slice(0, separator), subject: line.slice(separator + 1) }
    })
    // Merge and release commits carry no release-note value on their own -
    // the release commit is implied by the entry itself, and merges duplicate
    // the commits they land. This mirrors the root changelog, which lists
    // neither either.
    .filter(({ subject }) => !subject.startsWith('Merge ') && !subject.startsWith('chore(release)'))
}

/**
 * Renders a package `CHANGELOG.md` entry in the same shape as the
 * changelogen-written root changelog: version heading, compare link, and
 * grouped change bullets with commit links. When `selarasVersion` is given it
 * also records the core range the release publishes against (for the docs
 * layer, the one piece of information only its changelog records).
 */
export function buildChangelogEntry({ version, previousTag, commits, selarasVersion, tagPrefix, repo = repositoryPath() }) {
  const lines = [`## v${version}`, '']
  if (previousTag)
    lines.push(`[compare changes](https://github.com/${repo}/compare/${previousTag}...${tagPrefix}${version})`, '')
  const sections = [
    ['feat', '### 🚀 Enhancements'],
    ['fix', '### 🩹 Fixes'],
    ['docs', '### 📖 Documentation'],
  ]
  const grouped = new Map(sections.map(([type]) => [type, []]))
  const other = []
  const breaking = []
  for (const { sha, subject, body } of commits) {
    const conventional = splitConventional(subject)
    const bullet = conventional
      ? `- **${conventional.prefix}** ${conventional.rest} ([${sha.slice(0, 7)}](https://github.com/${repo}/commit/${sha}))`
      : `- ${subject} ([${sha.slice(0, 7)}](https://github.com/${repo}/commit/${sha}))`
    const bucket = grouped.get(conventional?.type)
    if (bucket)
      bucket.push(bullet)
    else
      other.push(bullet)
    if (/^[a-z]+(?:\([^)]*\))?!:/.test(subject) || /^BREAKING[ -]CHANGE:/m.test(body ?? '')) {
      breaking.push(bullet)
      if (body?.trim())
        breaking.push('', ...body.trim().split('\n').map(line => `  ${line}`))
    }
  }
  if (breaking.length)
    lines.push('### Breaking changes', '', ...breaking, '')
  for (const [type, heading] of sections) {
    const bullets = grouped.get(type)
    if (bullets.length > 0)
      lines.push(heading, '', ...bullets, '')
  }
  if (other.length > 0)
    lines.push('### 🤖 Other changes', '', ...other, '')
  if (selarasVersion)
    lines.push(`Published against \`@sewadah/selaras\` ^${selarasVersion}.`, '')
  return `${lines.join('\n').trimEnd()}\n`
}

function prependChangelogEntry(target, entry) {
  const header = '# Changelog\n'
  const current = existsSync(target.changelogPath) ? readFileSync(target.changelogPath, 'utf8') : ''
  const rest = current.startsWith(header) ? current.slice(header.length).replace(/^\n/, '') : current.replace(/^\n/, '')
  writeFileSync(target.changelogPath, `${header}\n${entry}\n${rest}`)
  console.log(`[${target.label}] prepended ${target.directory}/CHANGELOG.md entry`)
}

/**
 * Bumps one workspace package (`@sewadah/selaras-docs` or
 * `@sewadah/selaras-mcp`) independently of the root `@sewadah/selaras`
 * version - each is a separate release stream that happens to share a
 * repository and CI.
 *
 * Usage: node scripts/bump-workspace-package.mjs --package <docs|mcp> [--patch|--minor|--major|--version x.y.z]
 *
 * `--package` defaults to `docs`. The release workflow drives this through
 * RELEASE_BUMP (auto|patch|minor|major) and RELEASE_VERSION (exact
 * override), mirroring the changelogen inputs used for the core package.
 * `auto` resolves to a patch bump: changelogen's conventional-commit
 * inference tracks the root stream, so anything beyond a patch needs an
 * explicit bump.
 *
 * Bumping also prepends a `CHANGELOG.md` entry to the package, built from
 * the commits since its previous tag, so the shipped package always carries
 * its own release notes and the tag script can commit them alongside the
 * version.
 */
export function bumpWorkspacePackage({ name = 'docs', bump = 'patch', version } = {}) {
  const target = resolvePackage(name)
  const manifest = JSON.parse(readFileSync(target.manifestPath, 'utf8'))
  if (version) {
    parseVersion(version, target.label)
    manifest.version = version
  }
  else {
    if (!['patch', 'minor', 'major'].includes(bump))
      throw new Error(`[${target.label}] unknown bump ${bump}, expected patch, minor, or major`)
    const [major, minor, patch] = parseVersion(manifest.version, target.label)
    manifest.version = bump === 'major'
      ? `${major + 1}.0.0`
      : bump === 'minor'
        ? `${major}.${minor + 1}.0`
        : `${major}.${minor}.${patch + 1}`
  }
  const tag = previousTag(target.tagPrefix)
  if (!tag)
    console.warn(`[${target.label}] no previous ${target.tagPrefix}* tag found - changelog entry covers the full history`)
  const entry = buildChangelogEntry({
    version: manifest.version,
    previousTag: tag,
    commits: readCommitsSince(tag, target.paths),
    selarasVersion: target.publishedAgainst ? JSON.parse(readFileSync(rootManifestPath, 'utf8')).version : undefined,
    tagPrefix: target.tagPrefix,
  })
  writeFileSync(target.manifestPath, `${JSON.stringify(manifest, null, 2)}\n`)
  prependChangelogEntry(target, entry)
  console.log(`[${target.label}] bumped ${manifest.name} to ${manifest.version}`)
  return manifest
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  const args = process.argv.slice(2)
  const valueOf = flag => args.includes(flag) ? args[args.indexOf(flag) + 1] : undefined
  const bump = process.env.RELEASE_BUMP && process.env.RELEASE_BUMP !== 'auto'
    ? process.env.RELEASE_BUMP
    : args.find(arg => ['--patch', '--minor', '--major'].includes(arg))?.slice(2) ?? 'patch'
  const version = valueOf('--version') ?? (process.env.RELEASE_VERSION || undefined)
  bumpWorkspacePackage({ name: valueOf('--package') ?? 'docs', bump, version })
}
