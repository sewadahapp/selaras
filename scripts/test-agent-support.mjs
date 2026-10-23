import assert from 'node:assert/strict'
import { execFileSync, spawnSync } from 'node:child_process'
import { createHash } from 'node:crypto'
import { mkdir, mkdtemp, readFile, rm, symlink, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'
import { Client } from '@modelcontextprotocol/sdk/client/index.js'
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js'
import { InMemoryTransport } from '@modelcontextprotocol/sdk/inMemory.js'
import { loadCatalog, readSection, resolveCatalogPath } from '../packages/mcp/catalog.mjs'
import { createServer } from '../packages/mcp/server.mjs'
import { buildAgentCatalog, readPublicComponents } from './build-agent-catalog.mjs'

const root = fileURLToPath(new URL('..', import.meta.url))
const mcpRoot = join(root, 'packages/mcp')
// From the repository root, @sewadah/selaras resolves to this package itself.
const catalog = await loadCatalog(resolveCatalogPath(root))
const digest = value => createHash('sha256').update(JSON.stringify(value)).digest('hex')
assert.equal(digest(await buildAgentCatalog()), digest(catalog), 'Published catalog must match current documentation and examples')
assert.equal(readSection('## Usage\nExample:\n```md\n## Props\n```\nMore usage.\n## Props\nReal props.', 'Usage'), '## Usage\nExample:\n```md\n## Props\n```\nMore usage.')
assert.ok(catalog.documents.length > 90)
assert.ok(catalog.examples.length > 300)
const publicComponents = await readPublicComponents(root)
assert.equal(catalog.documents.find(document => document.path === '/components/forms/validation').component, undefined)
assert.equal(catalog.documents.find(document => document.path === '/components/typography/prose').component, undefined)
assert.ok(!catalog.documents.some(document => /^\/overview\/[^/]+$/.test(document.path)))
assert.ok(!catalog.documents.some(document => document.content.includes('component-example{')))
for (const document of catalog.documents) {
  for (const name of document.examples)
    assert.ok(catalog.examples.some(example => example.name === name), `${document.path}: ${name}`)
}

async function exerciseClient(client) {
  const { tools } = await client.listTools()
  assert.deepEqual(tools.map(tool => tool.name).sort(), ['get_documentation', 'get_example', 'list_components', 'search_documentation'])
  assert.ok(tools.every(tool => tool.annotations.readOnlyHint && !tool.annotations.openWorldHint))
  const all = await client.callTool({ name: 'list_components', arguments: {} })
  assert.deepEqual(JSON.parse(all.content[0].text).map(component => component.component).sort(), publicComponents, 'Every public component must be discoverable, including shared-guide companions')
  for (const [component, path] of [
    ['SColumn', '/components/data/table'],
    ['SColumnGroup', '/components/data/table'],
    ['SToolbarButton', '/components/elements/toolbar'],
    ['SSplitterPanel', '/components/layout/splitter'],
    ['SProseH2', '/components/typography/prose'],
    ['SProsePre', '/components/typography/prose'],
  ]) {
    const guide = await client.callTool({ name: 'get_documentation', arguments: { path: component } })
    assert.notEqual(guide.isError, true, `${component} must resolve its shared guide`)
    assert.ok(guide.content[0].text.includes(`Documentation: ${path}`))
  }
  const list = await client.callTool({ name: 'list_components', arguments: { category: 'forms' } })
  const components = JSON.parse(list.content[0].text)
  const select = components.find(component => component.component === 'SSelect')
  assert.ok(select)
  assert.ok(components.every(component => component.category.includes('forms')))
  const search = await client.callTool({ name: 'search_documentation', arguments: { query: 'SSelect', limit: 3 } })
  assert.equal(JSON.parse(search.content[0].text)[0].component, 'SSelect')
  const guide = await client.callTool({ name: 'get_documentation', arguments: { path: 'SSelect' } })
  assert.match(guide.content[0].text, /valueKey/)
  assert.match(guide.content[0].text, /<SSelect/)
  assert.match(guide.content[0].text, new RegExp(`Package version: ${catalog.version.replaceAll('.', '\\.')}`))
  const section = await client.callTool({ name: 'get_documentation', arguments: { path: select.path, section: 'Usage' } })
  assert.match(section.content[0].text, /## Usage/)
  assert.doesNotMatch(section.content[0].text, /## Props/)
  const example = await client.callTool({ name: 'get_example', arguments: { name: select.examples[0] } })
  assert.match(example.content[0].text, /<template>/)
  const missing = await client.callTool({ name: 'get_documentation', arguments: { path: '../../package.json' } })
  assert.equal(missing.isError, true)
  const resources = await client.listResources()
  assert.equal(resources.resources.length, new Set(resources.resources.map(resource => resource.uri)).size, 'Shared guides must not duplicate resource URIs')
  assert.ok(resources.resources.some(resource => resource.uri === select.uri))
  const resource = await client.readResource({ uri: select.uri })
  assert.match(resource.contents[0].text, /valueKey/)
  const index = await client.readResource({ uri: 'selaras://catalog' })
  assert.equal(JSON.parse(index.contents[0].text).version, catalog.version)
  await assert.rejects(client.readResource({ uri: 'selaras://docs/../../package.json' }))
}

const server = createServer(catalog)
const client = new Client({ name: 'selaras-agent-test', version: '1.0.0' })
const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair()
await server.connect(serverTransport)
await client.connect(clientTransport)
try {
  await exerciseClient(client)
}
finally {
  await client.close()
  await server.close()
}
console.log('[agent] Catalog and MCP tool/resource contracts passed')

// Exercise the shipped packages as a consumer would get them: the UI package
// carries only the catalog, and the standalone server finds it through the
// project's own @sewadah/selaras install.
function pack(cwd, destination) {
  const result = JSON.parse(execFileSync('npm', ['pack', '--ignore-scripts', '--json', '--pack-destination', destination], { cwd, encoding: 'utf8' }))
  const archives = Array.isArray(result) ? result : Object.values(result)
  assert.equal(archives.length, 1)
  return archives[0]
}

async function extract(archive, destination) {
  await mkdir(destination, { recursive: true })
  execFileSync('tar', ['-xzf', archive, '-C', destination, '--strip-components=1'])
  return destination
}

const temporary = await mkdtemp(join(tmpdir(), 'selaras-agent-'))
try {
  const ui = pack(root, temporary)
  for (const path of ['dist/agent/catalog.json', 'skills/selaras/SKILL.md'])
    assert.ok(ui.files.some(file => file.path === path), `Missing packed file: ${path}`)
  assert.ok(!ui.files.some(file => file.path.startsWith('agent/')), 'The UI package must not ship the MCP server')
  const uiManifest = JSON.parse(await readFile(join(root, 'package.json'), 'utf8'))
  assert.equal(uiManifest.bin, undefined, 'The UI package must not expose an MCP executable')
  assert.equal(uiManifest.dependencies['@modelcontextprotocol/sdk'], undefined, 'The UI package must not depend on the MCP SDK')
  assert.equal(uiManifest.dependencies.zod, undefined, 'The UI package must not depend on zod')
  assert.equal(uiManifest.exports['./agent/catalog.json'], './dist/agent/catalog.json')

  const mcp = pack(mcpRoot, temporary)
  for (const path of ['mcp.mjs', 'server.mjs', 'catalog.mjs'])
    assert.ok(mcp.files.some(file => file.path === path), `Missing packed MCP file: ${path}`)
  const server = await extract(join(temporary, mcp.filename), join(temporary, 'mcp'))
  // Its own workspace install: only the dependencies it declares, as a consumer gets.
  await symlink(join(mcpRoot, 'node_modules'), join(server, 'node_modules'), 'dir')
  const mcpManifest = JSON.parse(await readFile(join(server, 'package.json'), 'utf8'))
  assert.equal(mcpManifest.bin['selaras-mcp'], './mcp.mjs')
  assert.ok(mcpManifest.dependencies['@modelcontextprotocol/sdk'])
  assert.ok(mcpManifest.dependencies.zod)

  // A consumer project with only the packed UI package installed.
  const project = join(temporary, 'project')
  await extract(join(temporary, ui.filename), join(project, 'node_modules/@sewadah/selaras'))
  await writeFile(join(project, 'package.json'), '{ "name": "agent-test-project", "private": true }\n')

  async function connect(args, cwd) {
    const transport = new StdioClientTransport({ command: process.execPath, args: [join(server, mcpManifest.bin['selaras-mcp']), ...args], cwd, stderr: 'pipe' })
    const diagnostics = []
    transport.stderr?.on('data', data => diagnostics.push(data.toString()))
    const packedClient = new Client({ name: 'selaras-packed-agent-test', version: '1.0.0' })
    await packedClient.connect(transport)
    return { packedClient, diagnostics }
  }

  // Launched from the project directory, and from elsewhere with --project.
  for (const [args, cwd] of [[[], project], [['--project', project], temporary]]) {
    const { packedClient, diagnostics } = await connect(args, cwd)
    try {
      await exerciseClient(packedClient)
      assert.equal(diagnostics.join(''), '')
    }
    finally {
      await packedClient.close()
    }
  }

  // Outside any project, it fails with directions rather than serving nothing.
  const orphan = spawnSync(process.execPath, [join(server, 'mcp.mjs')], { cwd: temporary, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] })
  assert.equal(orphan.status, 1)
  assert.match(orphan.stderr, /Could not find @sewadah\/selaras from .*--project/)
}
finally {
  await rm(temporary, { recursive: true, force: true })
}
console.log('[agent] Packed UI catalog, standalone stdio server, and distributable skill passed')
