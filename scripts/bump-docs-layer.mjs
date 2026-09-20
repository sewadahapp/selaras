import { readFileSync, writeFileSync } from 'node:fs'
import process from 'node:process'
import { fileURLToPath, pathToFileURL } from 'node:url'

const layerManifestPath = fileURLToPath(new URL('../packages/docs/package.json', import.meta.url))

function parseVersion(version) {
  const match = /^(\d+)\.(\d+)\.(\d+)$/.exec(version ?? '')
  if (!match)
    throw new Error(`[docs-layer] expected a plain x.y.z version, found ${version}`)
  return match.slice(1).map(Number)
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
  writeFileSync(layerManifestPath, `${JSON.stringify(manifest, null, 2)}\n`)
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
