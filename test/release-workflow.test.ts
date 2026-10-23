import { execFile } from 'node:child_process'
import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import process from 'node:process'
import { promisify } from 'node:util'
import { runInNewContext } from 'node:vm'
import { describe, expect, it } from 'vitest'
import { parse } from 'yaml'

interface WorkflowStep {
  name?: string
  if?: string
  run?: string
  uses?: string
  env?: Record<string, string>
}

interface Workflow {
  on: { workflow_dispatch: { inputs: Record<string, { default?: string, required?: boolean, options?: string[] }> } }
  concurrency?: { 'group': string, 'cancel-in-progress': boolean }
  jobs: Record<string, { if?: string, permissions?: Record<string, string>, steps: WorkflowStep[] }>
}

const execute = promisify(execFile)
const release = parse(await readFile(new URL('../.github/workflows/release.yml', import.meta.url), 'utf8')) as Workflow
const rehearsal = parse(await readFile(new URL('../.github/workflows/release-rehearsal.yml', import.meta.url), 'utf8')) as Workflow
const combinations = [[], ['selaras'], ['docs'], ['mcp'], ['selaras', 'docs'], ['selaras', 'mcp'], ['docs', 'mcp'], ['selaras', 'docs', 'mcp']]
const packageSteps = [
  { package: 'selaras', names: ['Publish to npm', 'Create GitHub release'] },
  { package: 'docs', names: ['Prepare docs layer publish manifest', 'Publish docs layer to npm', 'Restore docs layer workspace dependency', 'Create docs layer GitHub release'] },
  { package: 'mcp', names: ['Verify MCP server package', 'Publish MCP server to npm', 'Create MCP server GitHub release'] },
]

function step(workflow: Workflow, name: string) {
  const found = Object.values(workflow.jobs).flatMap(job => job.steps).find(step => step.name === name)
  if (!found)
    throw new Error(`Missing workflow step: ${name}`)
  return found
}

function applies(workflow: Workflow, name: string, packages: string[]) {
  const condition = step(workflow, name).if
  if (!condition)
    return true
  const outputs = Object.fromEntries(['selaras', 'docs', 'mcp'].map(id => [id, String(packages.includes(id))]))
  outputs.has_packages = String(packages.length > 0)
  return runInNewContext(condition, { steps: { plan: { outputs } }, always: () => true })
}

describe('planned release workflow', () => {
  it('defaults both workflows to automatic detection with optional overrides', () => {
    for (const workflow of [release, rehearsal]) {
      const inputs = workflow.on.workflow_dispatch.inputs
      expect(inputs.package?.default).toBe('auto')
      expect(inputs.package?.options).toEqual(['auto', 'selaras-and-docs', 'all', 'selaras', 'selaras-docs', 'selaras-mcp'])
      for (const id of ['selaras', 'docs', 'mcp']) {
        expect(inputs[`${id}-bump`]?.default).toBe('auto')
        expect(inputs[`${id}-version`]?.required).toBe(false)
        expect(inputs[`${id}-version`]?.default).toBeUndefined()
      }
      expect(step(workflow, 'Plan release').run).toBe('node scripts/plan-release.mjs --output "$PLAN_FILE"')
      expect(step(workflow, 'Plan release').env?.RELEASE_INPUTS).toContain('toJSON(inputs)')
      expect(step(workflow, 'Create release candidate').run).toBe('node scripts/apply-release-plan.mjs "$PLAN_FILE"')
      expect(step(workflow, 'Install dependencies').run).toContain('--frozen-lockfile')
    }
  })

  it.each(combinations.map(packages => ({ packages, label: packages.join('+') || 'website only' })))('runs only the planned package stages: $label', ({ packages }) => {
    for (const stages of packageSteps) {
      for (const name of stages.names)
        expect(applies(release, name, packages), name).toBe(packages.includes(stages.package))
    }
    for (const workflow of [release, rehearsal]) {
      for (const name of ['Create release candidate', 'Install Chromium for release validation', 'Verify release candidate', 'Build'])
        expect(applies(workflow, name, packages), name).toBe(packages.length > 0)
    }
    expect(applies(rehearsal, 'Validate docs layer publish manifest', packages)).toBe(packages.includes('docs'))
    expect(applies(rehearsal, 'Verify MCP server package', packages)).toBe(packages.includes('mcp'))
    expect(applies(release, 'Verify published Selaras dependency', packages)).toBe(packages.includes('docs') && !packages.includes('selaras'))
    expect(applies(release, 'Commit and tag the release', packages)).toBe(packages.length > 0)
  })

  it.each(combinations.filter(packages => packages.length).map(packages => ({ packages, label: packages.join('+') })))('tags exactly the planned packages: $label', async ({ packages }) => {
    const temporary = await mkdtemp(join(tmpdir(), 'selaras-workflow-'))
    const log = join(temporary, 'calls')
    try {
      await mkdir(join(temporary, 'scripts'))
      await writeFile(join(temporary, 'scripts/tag-and-push-release.sh'), 'printf "tag %s\\n" "$*" >> "$RELEASE_TEST_LOG"\n')
      const selected = packages.map(id => id === 'selaras' ? id : `selaras-${id}`).join(' ')
      await execute('bash', ['-e', '-c', step(release, 'Commit and tag the release').run!], {
        cwd: temporary,
        env: { ...process.env, RELEASE_PACKAGES: selected, RELEASE_TEST_LOG: log },
      })
      expect((await readFile(log, 'utf8')).trim()).toBe(`tag ${selected}`)
    }
    finally {
      await rm(temporary, { recursive: true, force: true })
    }
  })

  it('keeps publication before tagging and retains exact-artifact retry verification', () => {
    const steps = release.jobs.release!.steps
    const tagIndex = steps.indexOf(step(release, 'Commit and tag the release'))
    for (const name of ['Publish to npm', 'Publish docs layer to npm', 'Publish MCP server to npm']) {
      expect(steps.indexOf(step(release, name))).toBeLessThan(tagIndex)
      expect(step(release, name).if).not.toContain('always()')
    }
    expect(step(release, 'Commit and tag the release').if).not.toContain('always()')
    expect(step(release, 'Publish to npm').run).toBe('node scripts/publish-package.mjs')
    expect(step(release, 'Publish docs layer to npm').run).toBe('node scripts/publish-package.mjs packages/docs')
    expect(step(release, 'Publish MCP server to npm').run).toBe('node scripts/publish-package.mjs packages/mcp')
    for (const name of ['Create GitHub release', 'Create docs layer GitHub release', 'Create MCP server GitHub release']) {
      expect(steps.indexOf(step(release, name))).toBeGreaterThan(tagIndex)
      expect(step(release, name).run).toContain('--notes-file "$PLAN_FILE.')
      expect(step(release, name).run).toContain('--verify-tag')
    }
  })

  it('serializes release runs, restricts publication to the default branch, and rejects a stale branch', () => {
    expect(release.concurrency).toEqual({ 'group': 'package-release', 'cancel-in-progress': false })
    expect(release.jobs.release?.if).toBe('github.ref == format(\'refs/heads/{0}\', github.event.repository.default_branch)')
    expect(step(release, 'Verify release branch has not advanced').run).toContain('git rev-parse FETCH_HEAD')
    const steps = release.jobs.release!.steps
    expect(steps.indexOf(step(release, 'Verify release branch has not advanced'))).toBeLessThan(steps.indexOf(step(release, 'Publish to npm')))
  })

  it('keeps rehearsal read-only while recording and validating the same plan', () => {
    expect(rehearsal.jobs.rehearsal?.permissions).toEqual({ contents: 'read' })
    for (const candidate of rehearsal.jobs.rehearsal!.steps) {
      expect(candidate.run ?? '').not.toMatch(/npm publish|publish-package|tag-and-push|gh release|git push/)
      expect(candidate.uses ?? '').not.toContain('deploy-pages')
    }
    expect(step(rehearsal, 'Save release plan').uses).toBe('actions/upload-artifact@v4')
    expect(step(rehearsal, 'Validate docs layer publish manifest').run).not.toContain('inputs.selaras-version')
    expect(step(rehearsal, 'Generate static docs site').run).toContain('bun run test:docs-seo')
  })
})
