import { execFile } from 'node:child_process'
import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'
import { promisify } from 'node:util'
import { describe, expect, it } from 'vitest'

const execute = promisify(execFile)
const script = fileURLToPath(new URL('../scripts/tag-and-push-release.sh', import.meta.url))
const packages = [
  { name: 'selaras', directory: '.', tags: ['v0.2.0', 'selaras-v0.2.0'] },
  { name: 'selaras-docs', directory: 'packages/docs', tags: ['selaras-docs-v0.2.0'] },
  { name: 'selaras-mcp', directory: 'packages/mcp', tags: ['selaras-mcp-v0.2.0'] },
]

describe('release staging', () => {
  it.each([
    { releases: ['selaras'], newMcpChangelog: false, unchangedChangelogs: false },
    { releases: ['selaras-docs'], newMcpChangelog: false, unchangedChangelogs: false },
    { releases: ['selaras-mcp'], newMcpChangelog: false, unchangedChangelogs: false },
    { releases: ['selaras', 'selaras-docs'], newMcpChangelog: false, unchangedChangelogs: false },
    { releases: ['selaras', 'selaras-docs', 'selaras-mcp'], newMcpChangelog: true, unchangedChangelogs: false },
    { releases: ['selaras'], newMcpChangelog: true, unchangedChangelogs: false },
    { releases: ['selaras-mcp'], newMcpChangelog: true, unchangedChangelogs: false },
    { releases: ['selaras-docs'], newMcpChangelog: false, unchangedChangelogs: true },
  ])('commits only selected release files: $releases (new MCP changelog: $newMcpChangelog, unchanged: $unchangedChangelogs)', async ({ releases, newMcpChangelog, unchangedChangelogs }) => {
    const temporary = await mkdtemp(join(tmpdir(), 'selaras-release-'))
    const work = join(temporary, 'work')
    const remote = join(temporary, 'remote.git')
    const env = {
      ...process.env,
      GIT_AUTHOR_NAME: 'Release test',
      GIT_AUTHOR_EMAIL: 'release@example.invalid',
      GIT_COMMITTER_NAME: 'Release test',
      GIT_COMMITTER_EMAIL: 'release@example.invalid',
      GIT_CONFIG_COUNT: '2',
      GIT_CONFIG_KEY_0: 'core.hooksPath',
      GIT_CONFIG_VALUE_0: '/dev/null',
      GIT_CONFIG_KEY_1: 'commit.gpgsign',
      GIT_CONFIG_VALUE_1: 'false',
    }
    const git = async (...args: string[]) => (await execute('git', args, { cwd: work, env })).stdout.trim()
    try {
      await mkdir(work)
      await git('init', '--bare', remote)
      await git('init', '--initial-branch=master')
      for (const pkg of packages) {
        await mkdir(join(work, pkg.directory), { recursive: true })
        await writeFile(join(work, pkg.directory, 'package.json'), '{"version":"0.1.0"}\n')
        if (!newMcpChangelog || pkg.name !== 'selaras-mcp')
          await writeFile(join(work, pkg.directory, 'CHANGELOG.md'), '# Changelog\n')
      }
      await git('add', '.')
      await git('commit', '-m', 'Initial test fixture')
      await git('remote', 'add', 'origin', remote)
      await git('push', '--set-upstream', 'origin', 'master')
      const before = await git('rev-parse', 'HEAD')

      for (const pkg of packages) {
        await writeFile(join(work, pkg.directory, 'package.json'), '{"version":"0.2.0"}\n')
        if (!unchangedChangelogs)
          await writeFile(join(work, pkg.directory, 'CHANGELOG.md'), '# Changelog\n\nNew release notes\n')
      }

      await execute('bash', [script, ...releases], { cwd: work, env })
      const selected = packages.filter(pkg => releases.includes(pkg.name))
      const expected = selected.flatMap(pkg => [
        join(pkg.directory, 'package.json'),
        ...unchangedChangelogs ? [] : [join(pkg.directory, 'CHANGELOG.md')],
      ]).sort()
      expect((await git('diff', '--name-only', before, 'HEAD')).split('\n').sort()).toEqual(expected)
      expect((await git('tag', '--list')).split('\n').sort()).toEqual(selected.flatMap(pkg => pkg.tags).sort())
      for (const pkg of packages.filter(pkg => !releases.includes(pkg.name))) {
        expect(await git('status', '--porcelain', '--', join(pkg.directory, 'package.json'))).not.toBe('')
        if (!unchangedChangelogs)
          expect(await git('status', '--porcelain', '--', join(pkg.directory, 'CHANGELOG.md'))).not.toBe('')
      }
      const head = await git('rev-parse', 'HEAD')
      expect(await git('ls-remote', 'origin', 'refs/heads/master')).toBe(`${head}\trefs/heads/master`)
    }
    finally {
      await rm(temporary, { recursive: true, force: true })
    }
  })
})
