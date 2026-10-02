import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import { createHash } from 'node:crypto'
import { mkdtemp, readFile, rm, symlink } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'
import { Client } from '@modelcontextprotocol/sdk/client/index.js'
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js'
import { InMemoryTransport } from '@modelcontextprotocol/sdk/inMemory.js'
import { loadCatalog, readSection } from '../agent/catalog.mjs'
import { createServer } from '../agent/server.mjs'
import { buildAgentCatalog } from './build-agent-catalog.mjs'

const root = fileURLToPath(new URL('..', import.meta.url))
const catalog = await loadCatalog()
const digest = value => createHash('sha256').update(JSON.stringify(value)).digest('hex')
assert.equal(digest(await buildAgentCatalog()), digest(catalog), 'Published catalog must match current documentation and examples')
assert.equal(readSection('## Usage\nExample:\n```md\n## Props\n```\nMore usage.\n## Props\nReal props.', 'Usage'), '## Usage\nExample:\n```md\n## Props\n```\nMore usage.')
assert.ok(catalog.documents.length > 90)
assert.ok(catalog.examples.length > 300)
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
  assert.ok(resources.resources.some(resource => resource.uri === select.uri))
  const resource = await client.readResource({ uri: select.uri })
  assert.match(resource.contents[0].text, /valueKey/)
  const index = await client.readResource({ uri: 'selaras://catalog' })
  assert.equal(JSON.parse(index.contents[0].text).version, catalog.version)
  await assert.rejects(client.readResource({ uri: 'selaras://docs/../../package.json' }))
}

const server = createServer(await loadCatalog())
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

// Exercise the shipped files, including the executable entry and versioned catalog.
const temporary = await mkdtemp(join(tmpdir(), 'selaras-agent-'))
try {
  const result = JSON.parse(execFileSync('npm', ['pack', '--ignore-scripts', '--json', '--pack-destination', temporary], { cwd: root, encoding: 'utf8' }))
  const archives = Array.isArray(result) ? result : Object.values(result)
  assert.equal(archives.length, 1)
  const [pack] = archives
  for (const path of ['agent/mcp.mjs', 'dist/agent/catalog.json', 'skills/selaras/SKILL.md'])
    assert.ok(pack.files.some(file => file.path === path), `Missing packed file: ${path}`)
  execFileSync('tar', ['-xzf', join(temporary, pack.filename), '-C', temporary])
  const extracted = join(temporary, 'package')
  await symlink(join(root, 'node_modules'), join(extracted, 'node_modules'), 'dir')
  const manifest = JSON.parse(await readFile(join(extracted, 'package.json'), 'utf8'))
  assert.equal(manifest.bin['selaras-mcp'], 'agent/mcp.mjs')
  assert.ok(manifest.dependencies['@modelcontextprotocol/sdk'])
  assert.ok(manifest.dependencies.zod)
  const transport = new StdioClientTransport({ command: process.execPath, args: [join(extracted, manifest.bin['selaras-mcp'])], stderr: 'pipe' })
  const diagnostics = []
  transport.stderr?.on('data', data => diagnostics.push(data.toString()))
  const packedClient = new Client({ name: 'selaras-packed-agent-test', version: '1.0.0' })
  try {
    await packedClient.connect(transport)
    await exerciseClient(packedClient)
    assert.equal(diagnostics.join(''), '')
  }
  finally {
    await packedClient.close()
  }
  console.log('[agent] Packed stdio server and distributable skill passed')
}
finally {
  await rm(temporary, { recursive: true, force: true })
}
