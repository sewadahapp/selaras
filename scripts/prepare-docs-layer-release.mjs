import { readFileSync, writeFileSync } from 'node:fs'
import process from 'node:process'
import { fileURLToPath, pathToFileURL } from 'node:url'

const rootManifestPath = fileURLToPath(new URL('../package.json', import.meta.url))
const layerManifestPath = fileURLToPath(new URL('../packages/docs/package.json', import.meta.url))

/**
 * Prepares `@sewadah/selaras-docs` for npm publishing.
 *
 * The layer depends on `@sewadah/selaras` through `file:../..` so that local
 * development (and bun, which cannot resolve the workspace root through the
 * `workspace:` protocol) links the root package. npm cannot publish a `file:`
 * dependency, so the released manifest must carry a semver range instead -
 * and the layer version must line up with the root package (both are released
 * in lockstep off the same changelogen bump). Call this right before
 * `npm publish`, then restore the working tree with `git checkout`.
 */
export function prepareDocsLayerForPublish(rootVersion = JSON.parse(readFileSync(rootManifestPath, 'utf8')).version) {
  const manifest = JSON.parse(readFileSync(layerManifestPath, 'utf8'))
  manifest.version = rootVersion
  manifest.dependencies['@sewadah/selaras'] = `^${rootVersion}`
  writeFileSync(layerManifestPath, `${JSON.stringify(manifest, null, 2)}\n`)
  console.log(`[docs-layer] prepared ${manifest.name}@${manifest.version} with \`@sewadah/selaras\` ^${rootVersion}`)
  return manifest
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  prepareDocsLayerForPublish()
}
