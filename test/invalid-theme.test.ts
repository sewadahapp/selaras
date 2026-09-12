import { execFile } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import { promisify } from 'node:util'
import { describe, expect, it } from 'vitest'

const execFileAsync = promisify(execFile)
const fixture = fileURLToPath(new URL('./fixtures/invalid-theme', import.meta.url))

describe('invalid Nuxt theme configuration', () => {
  it('fails nuxt prepare with the invalid role diagnostic', async () => {
    await expect(execFileAsync('sh', ['-c', 'bun x nuxt prepare 2>&1'], {
      cwd: fixture,
      env: { ...process.env, CI: '1' },
      maxBuffer: 1024 * 1024 * 4,
    })).rejects.toThrow(/Command failed: sh -c bun x nuxt prepare/)
  }, 30_000)
})
