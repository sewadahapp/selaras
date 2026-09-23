import { execFileSync } from 'node:child_process'
import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import process from 'node:process'
import { fileURLToPath, pathToFileURL } from 'node:url'

const rootDir = fileURLToPath(new URL('..', import.meta.url))
const rootManifestPath = fileURLToPath(new URL('../package.json', import.meta.url))
const layerManifestPath = fileURLToPath(new URL('../packages/docs/package.json', import.meta.url))
const layerChangelogPath = fileURLToPath(new URL('../packages/docs/CHANGELOG.md', import.meta.url))

const DOCS_TAG_PREFIX = 'selaras-docs-v'

function parseVersion(version) {
  const match = /^(\d+)\.(\d+)\.(\d+)$/.exec(version ?? '')
  if (!match)
    throw new Error(`[docs-layer] expected a plain x.y.z version, found ${version}`)
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

function previousDocsTag() {
  try {
    return execFileSync('git', ['describe', '--tags', '--abbrev=0', '--match', `${DOCS_TAG_PREFIX}*`, 'HEAD'], { cwd: rootDir, encoding: 'utf8' }).trim() || null
  }
  catch {
    return null
  }
}

function readDocsCommitsSince(from) {
  const range = from ? `${from}..HEAD` : 'HEAD'
  const output = execFileSync('git', ['log', range, '--format=%H %s'], { cwd: rootDir, encoding: 'utf8' })
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
 * Renders a `packages/docs/CHANGELOG.md` entry in the same shape as the
 * changelogen-written root changelog: version heading, compare link, grouped
 * change bullets with commit links, and the core range this layer release
 * publishes against (the one piece of information only this file records).
 */
export function buildDocsChangelogEntry({ version, previousTag, commits, selarasVersion, repo = repositoryPath() }) {
  const lines = [`## v${version}`, '']
  if (previousTag)
    lines.push(`[compare changes](https://github.com/${repo}/compare/${previousTag}...${DOCS_TAG_PREFIX}${version})`, '')
  const sections = [
    ['feat', '### 🚀 Enhancements'],
    ['fix', '### 🩹 Fixes'],
    ['docs', '### 📖 Documentation'],
  ]
  const grouped = new Map(sections.map(([type]) => [type, []]))
  const other = []
  for (const { sha, subject } of commits) {
    const conventional = splitConventional(subject)
    const bullet = conventional
      ? `- **${conventional.prefix}** ${conventional.rest} ([${sha.slice(0, 7)}](https://github.com/${repo}/commit/${sha}))`
      : `- ${subject} ([${sha.slice(0, 7)}](https://github.com/${repo}/commit/${sha}))`
    const bucket = grouped.get(conventional?.type)
    if (bucket)
      bucket.push(bullet)
    else
      other.push(bullet)
  }
  for (const [type, heading] of sections) {
    const bullets = grouped.get(type)
    if (bullets.length > 0)
      lines.push(heading, '', ...bullets, '')
  }
  if (other.length > 0)
    lines.push('### 🤖 Other changes', '', ...other, '')
  lines.push(`Published against \`@sewadah/selaras\` ^${selarasVersion}.`, '')
  return `${lines.join('\n').trimEnd()}\n`
}

export function prependDocsChangelogEntry(entry) {
  const header = '# Changelog\n'
  const current = existsSync(layerChangelogPath) ? readFileSync(layerChangelogPath, 'utf8') : ''
  const rest = current.startsWith(header) ? current.slice(header.length).replace(/^\n/, '') : current.replace(/^\n/, '')
  writeFileSync(layerChangelogPath, `${header}\n${entry}\n${rest}`)
  console.log(`[docs-layer] prepended packages/docs/CHANGELOG.md entry`)
}

/**
 * Bumps `@sewadah/selaras-docs` independently of the root `@sewadah/selaras`
 * version - the two packages are separate release streams that happen to
 * share a repository and CI.
 *
 * Usage: node scripts/bump-docs-layer.mjs [--patch|--minor|--major|--version x.y.z]
 *
 * The release workflow drives this through RELEASE_BUMP (auto|patch|minor|
 * major) and RELEASE_VERSION (exact override), mirroring the changelogen
 * inputs used for the core package. `auto` resolves to a patch bump:
 * changelogen's conventional-commit inference tracks the root stream, so
 * anything beyond a patch needs an explicit bump.
 *
 * Bumping also prepends a `packages/docs/CHANGELOG.md` entry built from the
 * commits since the previous `selaras-docs-v*` tag (plus the core range this
 * release publishes against), so the shipped layer always carries its own
 * release notes and the tag script can commit them alongside the version.
 */
export function bumpDocsLayerVersion({ bump = 'patch', version } = {}) {
  const manifest = JSON.parse(readFileSync(layerManifestPath, 'utf8'))
  if (version) {
    parseVersion(version)
    manifest.version = version
  }
  else {
    if (!['patch', 'minor', 'major'].includes(bump))
      throw new Error(`[docs-layer] unknown bump ${bump}, expected patch, minor, or major`)
    const [major, minor, patch] = parseVersion(manifest.version)
    manifest.version = bump === 'major'
      ? `${major + 1}.0.0`
      : bump === 'minor'
        ? `${major}.${minor + 1}.0`
        : `${major}.${minor}.${patch + 1}`
  }
  const previousTag = previousDocsTag()
  if (!previousTag)
    console.warn('[docs-layer] no previous selaras-docs-v* tag found - changelog entry covers the full history')
  const selarasVersion = JSON.parse(readFileSync(rootManifestPath, 'utf8')).version
  const entry = buildDocsChangelogEntry({
    version: manifest.version,
    previousTag,
    commits: readDocsCommitsSince(previousTag),
    selarasVersion,
  })
  writeFileSync(layerManifestPath, `${JSON.stringify(manifest, null, 2)}\n`)
  prependDocsChangelogEntry(entry)
  console.log(`[docs-layer] bumped ${manifest.name} to ${manifest.version}`)
  return manifest
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  const args = process.argv.slice(2)
  const versionFlag = args.indexOf('--version')
  const bump = process.env.RELEASE_BUMP && process.env.RELEASE_BUMP !== 'auto'
    ? process.env.RELEASE_BUMP
    : args.find(arg => ['--patch', '--minor', '--major'].includes(arg))?.slice(2) ?? 'patch'
  const version = versionFlag === -1
    ? (process.env.RELEASE_VERSION || undefined)
    : args[versionFlag + 1]
  bumpDocsLayerVersion({ bump, version })
}
