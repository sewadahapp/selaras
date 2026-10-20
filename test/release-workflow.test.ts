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
}

interface Workflow {
  on: { workflow_dispatch: { inputs: { package: { default: string, options: string[] } } } }
  jobs: Record<string, { steps: WorkflowStep[] }>
}

const execute = promisify(execFile)
const release = parse(await readFile(new URL('../.github/workflows/release.yml', import.meta.url), 'utf8')) as Workflow
const rehearsal = parse(await readFile(new URL('../.github/workflows/release-rehearsal.yml', import.meta.url), 'utf8')) as Workflow
const selections = [
  { selection: 'selaras', packages: ['selaras'] },
  { selection: 'selaras-docs', packages: ['selaras-docs'] },
  { selection: 'selaras-mcp', packages: ['selaras-mcp'] },
  { selection: 'selaras-and-docs', packages: ['selaras', 'selaras-docs'] },
  { selection: 'all', packages: ['selaras', 'selaras-docs', 'selaras-mcp'] },
]
const packageSteps = [
  { package: 'selaras', names: ['Bump Selaras version', 'Add 1.0 migration summary', 'Publish to npm', 'Create GitHub release'] },
  { package: 'selaras-docs', names: ['Bump docs layer version', 'Prepare docs layer publish manifest', 'Publish docs layer to npm', 'Restore docs layer workspace dependency', 'Create docs layer GitHub release'] },
  { package: 'selaras-mcp', names: ['Bump MCP server version', 'Verify MCP server package', 'Publish MCP server to npm', 'Create MCP server GitHub release'] },
]

function step(workflow: Workflow, name: string) {
  const found = Object.values(workflow.jobs).flatMap(job => job.steps).find(step => step.name === name)
  if (!found)
    throw new Error(`Missing workflow step: ${name}`)
  return found
}

function applies(workflow: Workflow, name: string, selection: string) {
  const condition = step(workflow, name).if
  if (!condition)
    return true
  // Evaluate the workflow's actual selection conditions with Actions inputs.
  const expression = condition.replace(/inputs\.([\w-]+)/g, (_, key) => `inputs[${JSON.stringify(key)}]`)
  return runInNewContext(expression, { inputs: { 'package': selection, 'selaras-version': '1.0.0' }, always: () => true })
}

describe('release workflow package selection', () => {
  it('uses explicit package choices and keeps the default scoped to core and docs', () => {
    for (const workflow of [release, rehearsal]) {
      const input = workflow.on.workflow_dispatch.inputs.package
      expect(input.default).toBe('selaras-and-docs')
      expect(input.options.toSorted()).toEqual(selections.map(item => item.selection).toSorted())
    }
  })

  it.each(selections)('runs every release stage only for the selected packages: $selection', ({ selection, packages }) => {
    for (const stages of packageSteps) {
      for (const name of stages.names)
        expect(applies(release, name, selection), name).toBe(packages.includes(stages.package))
    }
    expect(applies(rehearsal, 'Add 1.0 migration summary', selection)).toBe(packages.includes('selaras'))
    expect(applies(rehearsal, 'Validate docs layer publish manifest', selection)).toBe(packages.includes('selaras-docs'))
    expect(applies(rehearsal, 'Validate MCP server package', selection)).toBe(packages.includes('selaras-mcp'))
    expect(applies(release, 'Verify published Selaras dependency', selection)).toBe(selection === 'selaras-docs')
  })

  it.each(selections)('rehearses independent versions and tags exactly the selected packages: $selection', async ({ selection, packages }) => {
    const temporary = await mkdtemp(join(tmpdir(), 'selaras-workflow-'))
    const bin = join(temporary, 'bin')
    const log = join(temporary, 'calls')
    try {
      await mkdir(bin)
      await mkdir(join(temporary, 'scripts'))
      for (const command of ['node', 'npx'])
        await writeFile(join(bin, command), `#!/bin/sh\nprintf '${command} %s\\n' "$*" >> "$RELEASE_TEST_LOG"\n`, { mode: 0o755 })
      await writeFile(join(temporary, 'scripts/tag-and-push-release.sh'), 'printf "tag %s\\n" "$*" >> "$RELEASE_TEST_LOG"\n')
      const inputs: Record<string, string> = { 'package': selection, 'selaras-version': '1.2.3', 'docs-version': '2.3.4', 'mcp-version': '3.4.5' }
      const options = { cwd: temporary, env: { ...process.env, PATH: `${bin}:${process.env.PATH}`, RELEASE_TEST_LOG: log } }
      for (const [workflow, name] of [[rehearsal, 'Create ephemeral release candidate'], [release, 'Commit and tag the release']] as const) {
        const script = step(workflow, name).run!.replace(/\$\{\{\s*inputs\.([\w-]+)\s*\}\}/g, (_, key) => inputs[key]!)
        await execute('bash', ['-e', '-c', script], options)
      }
      const expected = [
        ...(packages.includes('selaras') ? ['npx changelogen --bump -r 1.2.3'] : []),
        ...(packages.includes('selaras-docs') ? ['node scripts/bump-workspace-package.mjs --package docs --version 2.3.4'] : []),
        ...(packages.includes('selaras-mcp') ? ['node scripts/bump-workspace-package.mjs --package mcp --version 3.4.5'] : []),
        `tag ${packages.join(' ')}`,
      ]
      expect((await readFile(log, 'utf8')).trim().split('\n')).toEqual(expected)
    }
    finally {
      await rm(temporary, { recursive: true, force: true })
    }
  })

  it('tags releases only after every package publish step', () => {
    const steps = release.jobs.release!.steps
    const tagIndex = steps.indexOf(step(release, 'Commit and tag the release'))
    for (const name of ['Publish to npm', 'Publish docs layer to npm', 'Publish MCP server to npm'])
      expect(steps.indexOf(step(release, name))).toBeLessThan(tagIndex)
    expect(step(release, 'Commit and tag the release').if).toBeUndefined()
  })

  it('uses the verified retry path for every package publish', () => {
    expect(step(release, 'Publish to npm').run).toBe('node scripts/publish-package.mjs')
    expect(step(release, 'Publish docs layer to npm').run).toBe('node scripts/publish-package.mjs packages/docs')
    expect(step(release, 'Publish MCP server to npm').run).toBe('node scripts/publish-package.mjs packages/mcp')
  })
})
