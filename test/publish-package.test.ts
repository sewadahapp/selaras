import type { Buffer } from 'node:buffer'
import { createHash } from 'node:crypto'
import { existsSync, writeFileSync } from 'node:fs'
import { mkdtemp, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { gzipSync } from 'node:zlib'
import { describe, expect, it, vi } from 'vitest'
import { publishPackage } from '../scripts/publish-package.mjs'

const candidate = { name: '@sewadah/test-package', version: '1.1.0', filename: 'test-package-1.1.0.tgz', integrity: 'sha512-identical' }

async function fixture() {
  const directory = await mkdtemp(join(tmpdir(), 'selaras-publish-test-'))
  await writeFile(join(directory, 'package.json'), JSON.stringify({ name: candidate.name, version: candidate.version }))
  return directory
}

function result(status: number, stdout = '', stderr = '') {
  return { status, stdout, stderr, error: undefined }
}

function compressedArtifacts(sameContents: boolean, validIntegrity = true) {
  const local = gzipSync('candidate tar bytes', { level: 0 })
  const published = gzipSync(sameContents ? 'candidate tar bytes' : 'different tar bytes', { level: 9 })
  const integrity = (bytes: Buffer) => `sha512-${createHash('sha512').update(bytes).digest('base64')}`
  let packs = 0
  return vi.fn().mockImplementation((_command: string, args: string[]) => {
    if (args[0] === 'view')
      return result(0, JSON.stringify(validIntegrity ? integrity(published) : 'sha512-invalid'))
    if (args[0] !== 'pack')
      throw new Error('Publishing is forbidden in this test')
    const bytes = ++packs === 1 ? local : published
    writeFileSync(join(args.at(-1)!, candidate.filename), bytes)
    return result(0, JSON.stringify([{ ...candidate, integrity: integrity(bytes) }]))
  })
}

describe('release publishing retries', () => {
  it.each([false, true])('accepts an identical published artifact without publishing again (npm object output: %s)', async (objectOutput) => {
    const directory = await fixture()
    const run = vi.fn()
      .mockReturnValueOnce(result(0, JSON.stringify(objectOutput ? { [candidate.name]: candidate } : [candidate])))
      .mockReturnValueOnce(result(0, JSON.stringify(candidate.integrity)))
    try {
      expect(publishPackage({ cwd: directory, run })).toEqual({ name: candidate.name, version: candidate.version, reused: true })
      expect(run.mock.calls.map(call => call[1][0])).toEqual(['pack', 'view'])
      const packedDirectory = run.mock.calls[0]![1].at(-1)
      expect(existsSync(packedDirectory)).toBe(false)
    }
    finally {
      await rm(directory, { recursive: true, force: true })
    }
  })

  it('rejects different contents under an existing version instead of treating it as a successful retry', async () => {
    const directory = await fixture()
    const run = compressedArtifacts(false)
    try {
      expect(() => publishPackage({ cwd: directory, run })).toThrow('different package contents')
      expect(run.mock.calls.map(call => call[1][0])).toEqual(['pack', 'view', 'pack'])
    }
    finally {
      await rm(directory, { recursive: true, force: true })
    }
  })

  it('accepts different gzip output only when the verified uncompressed archives are identical', async () => {
    const directory = await fixture()
    const run = compressedArtifacts(true)
    try {
      expect(publishPackage({ cwd: directory, run }).reused).toBe(true)
      expect(run.mock.calls.map(call => call[1][0])).toEqual(['pack', 'view', 'pack'])
    }
    finally {
      await rm(directory, { recursive: true, force: true })
    }
  })

  it('rejects a downloaded archive whose contents do not match the registry integrity', async () => {
    const directory = await fixture()
    const run = compressedArtifacts(true, false)
    try {
      expect(() => publishPackage({ cwd: directory, run })).toThrow('Published archive integrity mismatch')
    }
    finally {
      await rm(directory, { recursive: true, force: true })
    }
  })

  it('publishes the exact packed candidate when the version is absent', async () => {
    const directory = await fixture()
    const run = vi.fn()
      .mockReturnValueOnce(result(0, JSON.stringify([candidate])))
      .mockReturnValueOnce(result(1, JSON.stringify({ error: { code: 'E404' } })))
      .mockReturnValueOnce(result(0))
    try {
      expect(publishPackage({ cwd: directory, run }).reused).toBe(false)
      const packedDirectory = run.mock.calls[0]![1].at(-1)
      expect(run.mock.calls[2]![1]).toEqual(['publish', join(packedDirectory, candidate.filename), '--access', 'public'])
      expect(existsSync(packedDirectory)).toBe(false)
    }
    finally {
      await rm(directory, { recursive: true, force: true })
    }
  })

  it.each(['E401', 'E403', 'EAI_AGAIN'])('does not treat a registry %s error as an unpublished version', async (code) => {
    const directory = await fixture()
    const run = vi.fn()
      .mockReturnValueOnce(result(0, JSON.stringify([candidate])))
      .mockReturnValueOnce(result(1, JSON.stringify({ error: { code } })))
    try {
      expect(() => publishPackage({ cwd: directory, run })).toThrow('Cannot check published')
      expect(run).toHaveBeenCalledTimes(2)
    }
    finally {
      await rm(directory, { recursive: true, force: true })
    }
  })

  it('keeps an npm authorization failure fatal so release finalization cannot run', async () => {
    const directory = await fixture()
    const run = vi.fn()
      .mockReturnValueOnce(result(0, JSON.stringify([candidate])))
      .mockReturnValueOnce(result(1, JSON.stringify({ error: { code: 'E404' } })))
      .mockReturnValueOnce(result(1))
    try {
      expect(() => publishPackage({ cwd: directory, run })).toThrow('Publishing @sewadah/test-package@1.1.0 failed')
    }
    finally {
      await rm(directory, { recursive: true, force: true })
    }
  })
})
