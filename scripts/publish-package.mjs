import { spawnSync } from 'node:child_process'
import { createHash } from 'node:crypto'
import { mkdirSync, mkdtempSync, readFileSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
import process from 'node:process'
import { pathToFileURL } from 'node:url'
import { gunzipSync } from 'node:zlib'

function packedArchive(output, manifest) {
  const metadata = JSON.parse(output)
  const archives = Array.isArray(metadata) ? metadata : Object.values(metadata)
  const archive = archives[0]
  if (archives.length !== 1 || archive?.name !== manifest.name || archive?.version !== manifest.version
    || typeof archive.filename !== 'string' || typeof archive.integrity !== 'string') {
    throw new Error(`npm pack did not produce the expected candidate for ${manifest.name}@${manifest.version}`)
  }
  return archive
}

/** The caller builds the candidate before invoking this publish step. */
export function publishPackage({ cwd = process.cwd(), run = spawnSync } = {}) {
  const manifest = JSON.parse(readFileSync(join(cwd, 'package.json'), 'utf8'))
  const spec = `${manifest.name}@${manifest.version}`
  const directory = mkdtempSync(join(tmpdir(), 'selaras-publish-'))
  const execute = (args, stdio) => {
    const result = run('npm', args, { cwd, encoding: 'utf8', stdio, maxBuffer: 16 * 1024 * 1024 })
    if (result.error)
      throw result.error
    return result
  }
  try {
    const packed = execute(['pack', '--ignore-scripts', '--json', '--pack-destination', directory])
    if (packed.status !== 0)
      throw new Error(`Cannot pack ${spec}: ${packed.stderr}`)
    const archive = packedArchive(packed.stdout, manifest)
    const archivePath = resolve(directory, archive.filename)

    const published = execute(['view', spec, 'dist.integrity', '--json'])
    if (published.status === 0) {
      const integrity = JSON.parse(published.stdout)
      if (typeof integrity !== 'string')
        throw new Error(`Missing published integrity for ${spec}`)
      let identical = integrity === archive.integrity
      if (!identical) {
        const publishedDirectory = join(directory, 'published')
        mkdirSync(publishedDirectory)
        const downloaded = execute(['pack', spec, '--ignore-scripts', '--json', '--pack-destination', publishedDirectory])
        if (downloaded.status !== 0)
          throw new Error(`Cannot verify published ${spec}: ${downloaded.stderr}`)
        const remote = packedArchive(downloaded.stdout, manifest)
        const bytes = readFileSync(resolve(publishedDirectory, remote.filename))
        if (`sha512-${createHash('sha512').update(bytes).digest('base64')}` !== integrity)
          throw new Error(`Published archive integrity mismatch for ${spec}`)
        // Compression can differ between Node builds; retain an exact tar comparison.
        identical = gunzipSync(readFileSync(archivePath)).equals(gunzipSync(bytes))
      }
      if (!identical)
        throw new Error(`${spec} already exists with different package contents. Recover its release records or choose a new version; it cannot be overwritten.`)
      console.log(`[publish] ${spec} already published with identical contents; continuing release finalization`)
      return { name: manifest.name, version: manifest.version, reused: true }
    }

    let code
    try {
      code = JSON.parse(published.stdout).error?.code
    }
    catch {}
    if (code !== 'E404')
      throw new Error(`Cannot check published ${spec}: ${published.stderr || published.stdout}`)

    const result = execute(['publish', archivePath, '--access', 'public'], 'inherit')
    if (result.status !== 0)
      throw new Error(`Publishing ${spec} failed (exit ${result.status})`)
    return { name: manifest.name, version: manifest.version, reused: false }
  }
  finally {
    rmSync(directory, { recursive: true, force: true })
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href)
  publishPackage({ cwd: resolve(process.argv[2] ?? '.') })
