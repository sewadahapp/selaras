import { execFileSync } from 'node:child_process'
import { createHash } from 'node:crypto'
import { mkdirSync, mkdtempSync, readFileSync, renameSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'
import { afterEach, describe, expect, it } from 'vitest'
import { parse } from 'yaml'
import { applyReleasePlan } from '../scripts/apply-release-plan.mjs'
import { createReleasePlan, dependencySnapshot, inferBump, nextVersion } from '../scripts/plan-release.mjs'

const temporary: string[] = []
afterEach(() => {
  for (const path of temporary.splice(0))
    rmSync(path, { recursive: true, force: true })
})

function fixture() {
  const cwd = mkdtempSync(join(tmpdir(), 'selaras-plan-'))
  temporary.push(cwd)
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
  const git = (...args: string[]) => execFileSync('git', args, { cwd, env, encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] }).trim()
  const write = (path: string, text: string) => {
    mkdirSync(dirname(join(cwd, path)), { recursive: true })
    writeFileSync(join(cwd, path), text)
  }
  const json = (path: string, object: unknown) => write(path, `${JSON.stringify(object)}\n`)
  const read = (path: string) => JSON.parse(readFileSync(join(cwd, path), 'utf8'))
  const commit = (subject: string, body?: string) => {
    git('add', '.')
    git('commit', '-m', subject, ...(body ? ['-m', body] : []))
    return git('rev-parse', 'HEAD')
  }
  git('init', '--initial-branch=master')
  json('package.json', { name: '@sewadah/selaras', version: '1.2.0', dependencies: { shared: '^1.0.0' }, devDependencies: { vitest: '^5.0.0' } })
  json('packages/docs/package.json', { name: '@sewadah/selaras-docs', version: '1.4.0', files: ['app'], dependencies: { '@sewadah/selaras': 'file:../..', 'shared': '^1.0.0' } })
  json('packages/mcp/package.json', { name: '@sewadah/selaras-mcp', version: '0.2.0', files: ['server.mjs'], dependencies: { server: '^1.0.0' } })
  for (const path of ['CHANGELOG.md', 'packages/docs/CHANGELOG.md', 'packages/mcp/CHANGELOG.md'])
    write(path, '# Changelog\n\n## v0.1.0\n\nOld notes.\n')
  json('bun.lock', { packages: { shared: ['shared@1.0.0', '', { dependencies: { nested: '^1' } }], nested: ['nested@1.0.0', '', {}], server: ['server@1.0.0', '', {}], vitest: ['vitest@5.0.0', '', {}] } })
  write('src/module.ts', 'export const value = 1\n')
  write('packages/docs/app/app.vue', '<template>Docs</template>')
  write('packages/mcp/server.mjs', 'export const server = true')
  commit('chore: baseline')
  for (const tag of ['selaras-v1.2.0', 'selaras-docs-v1.4.0', 'selaras-mcp-v0.2.0'])
    git('tag', tag)
  return { cwd, git, write, json, read, commit, plan: (inputs = {}) => createReleasePlan({ cwd, inputs }) }
}

describe('automatic release planning', () => {
  it('does not bump for website, preview, tests, workflows, release scripts, or dev-only dependencies', () => {
    const repo = fixture()
    repo.write('docs/pages/templates.vue', '<template>Templates</template>')
    repo.write('test/new.test.ts', 'test')
    repo.write('.github/workflows/ci.yml', 'ci')
    repo.write('packages/docs/preview/content/index.md', 'Preview')
    repo.write('packages/docs/test/layout.test.ts', 'test')
    repo.write('packages/mcp/test/server.test.ts', 'test')
    repo.write('scripts/plan-release.mjs', 'planner')
    const manifest = repo.read('package.json')
    manifest.devDependencies.vitest = '^5.1.0'
    manifest.scripts = { test: 'vitest run' }
    repo.json('package.json', manifest)
    const lock = repo.read('bun.lock')
    lock.packages.vitest[0] = 'vitest@5.1.0'
    repo.json('bun.lock', lock)
    repo.commit('feat(docs): improve website and tests')
    expect(repo.plan().packages).toEqual([])
    expect(repo.plan().deployDocs).toBe(true)
  })

  it('uses each package tag and infers independent versions from its relevant commits', () => {
    const repo = fixture()
    repo.write('src/module.ts', 'export const value = 2')
    repo.commit('feat(core): add previously released feature')
    repo.git('tag', '-f', 'selaras-v1.2.0')
    repo.write('packages/docs/app/app.vue', '<template>New docs layout</template>')
    const docsCommit = repo.commit('feat(docs): add layout')
    repo.write('src/module.ts', 'export const value = 3')
    const coreCommit = repo.commit('fix(core): correct value')
    repo.write('packages/mcp/server.mjs', 'export const server = false')
    const mcpCommit = repo.commit('fix(mcp): correct server')
    const packages = repo.plan().packages
    expect(packages.map(pkg => [pkg.id, pkg.version])).toEqual([['selaras', '1.2.1'], ['docs', '1.5.0'], ['mcp', '0.2.1']])
    expect(packages.map(pkg => pkg.tag)).toEqual(['v1.2.1', 'selaras-docs-v1.5.0', 'selaras-mcp-v0.2.1'])
    expect(packages.map(pkg => pkg.commits.map(commit => commit.sha))).toEqual([[coreCommit], [docsCommit], [mcpCommit]])
  })

  it('does not cascade a core release into docs or MCP', () => {
    const repo = fixture()
    repo.write('src/module.ts', 'export const value = 2')
    repo.commit('feat!: change core API', 'BREAKING CHANGE: a new API is required')
    expect(repo.plan().packages.map(pkg => [pkg.id, pkg.version])).toEqual([['selaras', '2.0.0']])
  })

  it('ships catalog-only guides and examples as a core patch', () => {
    const repo = fixture()
    repo.write('docs/content/components/button.md', 'Updated guide')
    repo.write('docs/components/content/examples/ButtonExample.vue', '<template>Example</template>')
    repo.commit('feat(docs): improve agent examples')
    expect(repo.plan().packages.map(pkg => [pkg.id, pkg.version])).toEqual([['selaras', '1.2.1']])
  })

  it('detects deletions, renames, and merge-only changes', () => {
    const repo = fixture()
    repo.git('switch', '-c', 'topic')
    repo.write('src/feature.ts', 'feature')
    repo.commit('feat(core): add feature')
    repo.git('switch', 'master')
    repo.write('test/extra.ts', 'test')
    repo.commit('test: add coverage')
    repo.git('merge', '--no-ff', '--no-commit', 'topic')
    repo.write('packages/mcp/server.mjs', 'merge-only change')
    repo.commit('Merge topic')
    renameSync(join(repo.cwd, 'src/module.ts'), join(repo.cwd, 'src/renamed.ts'))
    repo.commit('refactor: rename entry')
    expect(repo.plan().packages[0]?.version).toBe('1.3.0')
    expect(repo.plan().packages[0]?.commits.flatMap(commit => commit.files)).toContain('src/module.ts')
    expect(repo.plan().packages.find(pkg => pkg.id === 'mcp')?.commits.map(commit => commit.subject)).toEqual(['Merge topic'])
  })

  it('ignores fully reverted changes and uncommitted work', () => {
    const repo = fixture()
    repo.write('src/module.ts', 'export const value = 2\n')
    const feature = repo.commit('feat: temporary feature')
    repo.git('revert', '--no-edit', feature)
    repo.write('packages/mcp/server.mjs', 'uncommitted')
    expect(repo.plan().packages).toEqual([])
  })

  it('includes only packages whose runtime dependency graph changed in the lockfile', () => {
    const repo = fixture()
    const lock = repo.read('bun.lock')
    lock.packages.nested[0] = 'nested@1.0.1'
    repo.write('bun.lock', `${JSON.stringify(lock, null, 2).trimEnd().slice(0, -1)},\n}`)
    repo.commit('chore(deps): update shared transitive dependency')
    expect(repo.plan().packages.map(pkg => [pkg.id, pkg.version])).toEqual([['selaras', '1.2.1'], ['docs', '1.4.1']])
  })

  it('includes build tooling that affects the emitted core package', () => {
    const repo = fixture()
    const manifest = repo.read('package.json')
    manifest.devDependencies.typescript = '^6.0.0'
    repo.json('package.json', manifest)
    repo.commit('build: update compiler')
    expect(repo.plan().packages.map(pkg => pkg.id)).toEqual(['selaras'])
  })

  it('filters bookkeeping and preserves package-specific dependency changes', () => {
    const repo = fixture()
    const manifest = repo.read('packages/mcp/package.json')
    manifest.dependencies.server = '^2.0.0'
    repo.json('packages/mcp/package.json', manifest)
    repo.commit('fix(mcp): upgrade server')
    repo.write('packages/docs/CHANGELOG.md', 'Updated release notes')
    repo.commit('chore(release): update records')
    expect(repo.plan().packages.map(pkg => pkg.id)).toEqual(['mcp'])
  })

  it('supports arbitrary auto-detected combinations and manual bump/version overrides', () => {
    const repo = fixture()
    repo.write('packages/docs/app/app.vue', 'new docs')
    repo.write('packages/mcp/server.mjs', 'new server')
    repo.commit('fix: update docs and server')
    expect(repo.plan().packages.map(pkg => pkg.id)).toEqual(['docs', 'mcp'])
    expect(repo.plan({ 'mcp-version': '0.4.0', 'docs-bump': 'minor' }).packages.map(pkg => pkg.version)).toEqual(['1.5.0', '0.4.0'])
    expect(repo.plan({ package: 'selaras' }).packages.map(pkg => pkg.id)).toEqual(['selaras'])
    expect(() => repo.plan({ 'package': 'selaras', 'mcp-bump': 'patch' })).toThrow('unselected package')
  })

  it('fails closed for missing release history and unclassified paths', () => {
    const repo = fixture()
    repo.write('new-build-input.txt', 'review ownership')
    repo.commit('feat: new build input')
    expect(() => repo.plan()).toThrow('Unclassified release paths')
    expect(repo.plan({ package: 'selaras' }).warnings).toContain('new-build-input.txt')
    repo.git('tag', '-d', 'selaras-docs-v1.4.0')
    expect(() => repo.plan()).toThrow('Missing reachable release tag')
  })

  it('rejects a target tag even when it belongs to an unmerged branch', () => {
    const repo = fixture()
    repo.git('switch', '-c', 'other-release')
    repo.write('src/module.ts', 'another release')
    repo.commit('fix: another release')
    repo.git('tag', 'selaras-v1.2.1')
    repo.git('switch', 'master')
    repo.write('src/module.ts', 'new fix')
    repo.commit('fix: current fix')
    expect(() => repo.plan()).toThrow('Target release tag already exists')
  })

  it('writes Actions outputs and a reviewable plan without mutating tracked files', () => {
    const repo = fixture()
    repo.write('packages/docs/app/app.vue', 'new docs')
    repo.write('packages/mcp/server.mjs', 'new server')
    repo.commit('fix: update docs and server')
    const directory = mkdtempSync(join(tmpdir(), 'selaras-plan-output-'))
    temporary.push(directory)
    const output = join(directory, 'outputs')
    const summary = join(directory, 'summary')
    const planPath = join(directory, 'plan.json')
    const script = fileURLToPath(new URL('../scripts/plan-release.mjs', import.meta.url))
    execFileSync(process.execPath, [script, '--output', planPath], {
      cwd: repo.cwd,
      env: { ...process.env, RELEASE_INPUTS: JSON.stringify({ 'mcp-bump': 'minor' }), GITHUB_OUTPUT: output, GITHUB_STEP_SUMMARY: summary },
    })
    expect(readFileSync(output, 'utf8')).toContain('packages=selaras-docs selaras-mcp\n')
    expect(readFileSync(output, 'utf8')).toContain('mcp_version=0.3.0\n')
    expect(readFileSync(output, 'utf8')).toContain('selaras=false\n')
    expect(readFileSync(summary, 'utf8')).toContain('1.4.0 → **1.4.1**')
    expect(JSON.parse(readFileSync(planPath, 'utf8')).packages).toHaveLength(2)
    expect(repo.git('status', '--porcelain')).toBe('')
  })

  it('preserves breaking-change guidance in the generated changelog and release body', () => {
    const repo = fixture()
    repo.write('src/module.ts', 'new API')
    repo.commit('feat(core): change API', 'BREAKING CHANGE: use the new setup API.\nSee https://example.invalid/migration.')
    const planPath = join(repo.cwd, 'plan.json')
    writeFileSync(planPath, JSON.stringify(repo.plan()))
    applyReleasePlan({ planPath, cwd: repo.cwd })
    const notes = readFileSync(`${planPath}.selaras.md`, 'utf8')
    expect(notes).toContain('### Breaking changes')
    expect(notes).toContain('BREAKING CHANGE: use the new setup API.')
    expect(notes).toContain('https://example.invalid/migration')
  })

  it('hashes manifest bytes including the trailing newline so the plan can be applied', () => {
    const repo = fixture()
    repo.write('src/module.ts', 'new core')
    repo.commit('fix(core): update module')
    const manifest = readFileSync(join(repo.cwd, 'package.json'), 'utf8')
    const plan = repo.plan()
    const core = plan.packages.find(pkg => pkg.id === 'selaras')!
    expect(manifest.endsWith('\n')).toBe(true)
    expect(core.manifestHash).toBe(createHash('sha256').update(manifest).digest('hex'))
    const planPath = join(repo.cwd, 'plan.json')
    writeFileSync(planPath, JSON.stringify(plan))
    expect(() => applyReleasePlan({ planPath, cwd: repo.cwd })).not.toThrow()
  })

  it('rejects a changed manifest before mutating any selected package', () => {
    const repo = fixture()
    repo.write('src/module.ts', 'new core')
    repo.write('packages/docs/app/app.vue', 'new docs')
    repo.commit('fix: update packages')
    const planPath = join(repo.cwd, 'plan.json')
    writeFileSync(planPath, JSON.stringify(repo.plan()))
    const docs = repo.read('packages/docs/package.json')
    docs.dependencies.shared = '^2.0.0'
    repo.json('packages/docs/package.json', docs)
    expect(() => applyReleasePlan({ planPath, cwd: repo.cwd })).toThrow('manifest changed')
    expect(repo.read('package.json').version).toBe('1.2.0')
  })

  it('runs the workflow branch guard against a local remote and stops if validation used an older commit', () => {
    const repo = fixture()
    const remote = mkdtempSync(join(tmpdir(), 'selaras-plan-remote-'))
    temporary.push(remote)
    repo.git('init', '--bare', remote)
    repo.git('remote', 'add', 'origin', remote)
    repo.git('push', 'origin', 'master')
    const before = repo.git('rev-parse', 'HEAD')
    const workflow = parse(readFileSync(new URL('../.github/workflows/release.yml', import.meta.url), 'utf8'))
    const guard = workflow.jobs.release.steps.find((step: { name: string }) => step.name === 'Verify release branch has not advanced').run
    const run = () => execFileSync('bash', ['-e', '-c', guard], {
      cwd: repo.cwd,
      env: { ...process.env, RELEASE_REF: 'refs/heads/master' },
      stdio: ['pipe', 'pipe', 'pipe'],
    })
    expect(run).not.toThrow()
    repo.write('test/new.ts', 'new commit')
    repo.commit('test: advance remote')
    repo.git('push', 'origin', 'master')
    repo.git('checkout', '--detach', before)
    expect(run).toThrow()
  })

  it('writes only planned manifests and filtered release notes, and rejects stale plans before mutation', () => {
    const repo = fixture()
    repo.write('packages/docs/app/app.vue', 'new docs')
    repo.commit('feat(docs): add layout')
    repo.write('src/module.ts', 'new core')
    repo.commit('fix(core): correct value')
    const plan = repo.plan()
    const path = join(repo.cwd, 'plan.json')
    writeFileSync(path, JSON.stringify(plan))
    applyReleasePlan({ planPath: path, cwd: repo.cwd })
    expect(repo.read('package.json').version).toBe('1.2.1')
    expect(repo.read('packages/docs/package.json').version).toBe('1.5.0')
    expect(repo.read('packages/mcp/package.json').version).toBe('0.2.0')
    expect(repo.read('packages/docs/package.json').dependencies['@sewadah/selaras']).toBe('file:../..')
    const notes = readFileSync(`${path}.docs.md`, 'utf8')
    expect(notes).toContain('add layout')
    expect(notes).not.toContain('correct value')
    expect(notes).toContain('^1.2.1')
    expect(readFileSync(join(repo.cwd, 'packages/docs/CHANGELOG.md'), 'utf8')).toContain(notes)
    expect(() => applyReleasePlan({ planPath: path, cwd: repo.cwd })).toThrow('manifest changed')
    repo.commit('chore: new head')
    expect(() => applyReleasePlan({ planPath: path, cwd: repo.cwd })).toThrow('HEAD changed')
  })
})

describe('release version policy', () => {
  const change = (subject: string, body = '') => [{ subject, body, runtime: true }]
  it('recognizes features, both breaking-change syntaxes, and the pre-1.0 policy', () => {
    expect(inferBump(change('feat: add field'), '1.0.0')).toBe('minor')
    expect(inferBump(change('fix(field)!: change value'), '1.0.0')).toBe('major')
    expect(inferBump(change('refactor: change API', 'BREAKING-CHANGE: new API'), '1.0.0')).toBe('major')
    expect(inferBump(change('feat: add field'), '0.1.0')).toBe('patch')
    expect(inferBump(change('feat!: change API'), '0.1.0')).toBe('minor')
  })

  it('validates exact overrides and increments versions', () => {
    expect(nextVersion('1.2.3', 'minor')).toBe('1.3.0')
    expect(nextVersion('1.2.3', 'major')).toBe('2.0.0')
    expect(nextVersion('1.2.3', 'patch', '2.0.1')).toBe('2.0.1')
    for (const version of ['1.2.3', '1.2.2', '01.3.0', '2.0.0-beta.1', 'not-a-version'])
      expect(() => nextVersion('1.2.3', 'patch', version)).toThrow()
  })

  it('tracks nested dependency resolutions without including unrelated dev tooling', () => {
    const lock = { packages: { 'tool': ['tool@1', '', {}], 'shared': ['shared@1', '', { dependencies: { nested: '*' } }], 'shared/nested': ['nested@1', '', {}], 'nested': ['nested@2', '', {}] } }
    expect(Object.keys(dependencySnapshot(lock, { dependencies: { shared: '*' } }))).toEqual(['shared', 'shared/nested', 'nested'])
  })
})
