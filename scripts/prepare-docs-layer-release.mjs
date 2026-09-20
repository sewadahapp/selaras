import { execFileSync } from 'node:child_process'
import { readFileSync, writeFileSync } from 'node:fs'
import process from 'node:process'
import { fileURLToPath, pathToFileURL } from 'node:url'

const rootManifestPath = fileURLToPath(new URL('../package.json', import.meta.url))
const layerManifestPath = fileURLToPath(new URL('../packages/docs/package.json', import.meta.url))

export const LAYER_WORKSPACE_DEPENDENCY = 'file:../..'

function readManifest(path) {
  return JSON.parse(readFileSync(path, 'utf8'))
}

function writeManifest(path, manifest) {
  writeFileSync(path, `${JSON.stringify(manifest, null, 2)}\n`)
}

/**
 * Prepares `@sewadah/selaras-docs` for npm publishing.
 *
 * The layer depends on `@sewadah/selaras` through `file:../..` so that local
 * development (and bun, which cannot resolve the workspace root through the
 * `workspace:` protocol) links the root package. npm cannot publish a `file:`
 * dependency, so the released manifest must carry a semver range instead.
 *
 * The layer keeps its own independent version - this function never touches
 * `manifest.version`. Pass the `@sewadah/selaras` version the layer should
 * publish against (defaults to the working-tree root version, which is what
 * a joint release just bumped and published).
 */
export function prepareDocsLayerForPublish(selarasVersion = readManifest(rootManifestPath).version) {
  const manifest = readManifest(layerManifestPath)
  manifest.dependencies['@sewadah/selaras'] = `^${selarasVersion}`
  writeManifest(layerManifestPath, manifest)
  console.log(`[docs-layer] prepared ${manifest.name}@${manifest.version} with \`@sewadah/selaras\` ^${selarasVersion}`)
  return manifest
}

/**
 * Restores the workspace `file:../..` dependency after publishing, keeping
 * the (independently bumped) layer version intact.
 */
export function restoreDocsLayerWorkspaceDependency() {
  const manifest = readManifest(layerManifestPath)
  manifest.dependencies['@sewadah/selaras'] = LAYER_WORKSPACE_DEPENDENCY
  writeManifest(layerManifestPath, manifest)
  console.log(`[docs-layer] restored ${manifest.name}@${manifest.version} to \`${LAYER_WORKSPACE_DEPENDENCY}\``)
  return manifest
}

/**
 * Verifies the `@sewadah/selaras` range the publish manifest will carry
 * actually resolves on the npm registry - publishing the layer against an
 * unpublished core version would ship an uninstallable package.
 */
export function verifyDocsLayerSelarasDependency() {
  const manifest = readManifest(layerManifestPath)
  const spec = manifest.dependencies['@sewadah/selaras']
  const range = spec === LAYER_WORKSPACE_DEPENDENCY
    ? `^${readManifest(rootManifestPath).version}`
    : spec
  const resolved = execFileSync(
    'npm',
    ['view', `@sewadah/selaras@${range}`, 'version', '--json'],
    { encoding: 'utf8' },
  ).trim()
  console.log(`[docs-layer] @sewadah/selaras@${range} resolves on npm: ${resolved}`)
  return resolved
}

/**
 * Asserts the working-tree layer manifest is publishable: its own name and
 * version plus a real semver dependency on `@sewadah/selaras` (never `file:`).
 * Used by CI after `prepareDocsLayerForPublish` to validate the publish-time
 * manifest instead of assuming it.
 */
export function assertDocsLayerPublishable() {
  const manifest = readManifest(layerManifestPath)
  const problems = []
  if (manifest.name !== '@sewadah/selaras-docs')
    problems.push(`expected name @sewadah/selaras-docs, found ${manifest.name}`)
  if (!/^\d+\.\d+\.\d+(?:-[\w.]+)?$/.test(manifest.version ?? ''))
    problems.push(`expected a semver version, found ${manifest.version}`)
  const dependency = manifest.dependencies?.['@sewadah/selaras']
  if (!/^\^\d+\.\d+\.\d+(?:-[\w.]+)?$/.test(dependency ?? ''))
    problems.push(`expected a ^semver dependency on @sewadah/selaras, found ${dependency}`)
  if (problems.length > 0)
    throw new Error(`[docs-layer] unpublishable manifest:\n- ${problems.join('\n- ')}`)
  console.log(`[docs-layer] ${manifest.name}@${manifest.version} is publishable (depends on @sewadah/selaras ${dependency})`)
  return manifest
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  const args = process.argv.slice(2)
  const selarasFlag = args.indexOf('--selaras')
  const selarasVersion = selarasFlag === -1 ? undefined : args[selarasFlag + 1]
  if (args.includes('--restore'))
    restoreDocsLayerWorkspaceDependency()
  else if (args.includes('--verify'))
    verifyDocsLayerSelarasDependency()
  else if (args.includes('--assert-publishable'))
    assertDocsLayerPublishable()
  else
    prepareDocsLayerForPublish(selarasVersion)
}
