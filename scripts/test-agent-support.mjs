import assert from 'node:assert/strict'
import { execFileSync, spawnSync } from 'node:child_process'
import { createHash } from 'node:crypto'
import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'
import { Client, InMemoryTransport } from '@modelcontextprotocol/client'
import { StdioClientTransport } from '@modelcontextprotocol/client/stdio'
import { documentComponents, documentOutline, loadCatalog, readSection, resolveCatalogPath } from '../packages/mcp/catalog.mjs'
import manifest from '../packages/mcp/package.json' with { type: 'json' }
import { createServer } from '../packages/mcp/server.mjs'
import { buildAgentCatalog, readPublicComponents } from './build-agent-catalog.mjs'

const root = fileURLToPath(new URL('..', import.meta.url))
const mcpRoot = join(root, 'packages/mcp')
// From the repository root, @sewadah/selaras resolves to this package itself.
const catalog = await loadCatalog(resolveCatalogPath(root))
const digest = value => createHash('sha256').update(JSON.stringify(value)).digest('hex')
assert.equal(digest(await buildAgentCatalog()), digest(catalog), 'Published catalog must match current documentation and examples')
const headingSample = '## Usage\nExample:\n```md\n## Props\n```\nMore usage.\n## `Props`\nReal props.\n## Props\nMore props.'
assert.equal(readSection(headingSample, 'Usage'), '## Usage\nExample:\n```md\n## Props\n```\nMore usage.')
assert.deepEqual(documentOutline(headingSample), [
  { title: 'Usage', level: 2, occurrence: 1 },
  { title: 'Props', level: 2, occurrence: 1 },
  { title: 'Props', level: 2, occurrence: 2 },
])
assert.equal(readSection(headingSample, 'Props'), '## `Props`\nReal props.')
assert.equal(readSection(headingSample, 'Props', 2), '## Props\nMore props.')
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

async function exerciseClient(client, selarasVersion, expectedComponents) {
  assert.deepEqual(client.getServerVersion(), { name: 'selaras', version: manifest.version })
  const { tools } = await client.listTools()
  assert.deepEqual(tools.map(tool => tool.name).sort(), ['get_documentation', 'get_example', 'list_components', 'search_documentation'])
  assert.ok(tools.every(tool => tool.annotations.readOnlyHint && !tool.annotations.openWorldHint))
  assert.ok(tools.every(tool => tool.outputSchema?.type === 'object'))

  async function call(name, args) {
    const result = await client.callTool({ name, arguments: args })
    assert.notEqual(result.isError, true, result.content[0]?.text)
    assert.equal(result.structuredContent?.selarasVersion, selarasVersion)
    return { data: result.structuredContent, text: result.content[0].text }
  }

  const all = await call('list_components', {})
  assert.deepEqual(JSON.parse(all.text), all.data.components)
  assert.deepEqual(all.data.components.map(component => component.component).sort(), expectedComponents, 'Every supported component must be discoverable')
  for (const [component, path] of [
    ['SColumn', '/components/data/table'],
    ['SColumnGroup', '/components/data/table'],
    ['SToolbarButton', '/components/elements/toolbar'],
    ['SSplitterPanel', '/components/layout/splitter'],
    ['SProseH2', '/components/typography/prose'],
    ['SProsePre', '/components/typography/prose'],
  ]) {
    if (expectedComponents.includes(component)) {
      const guide = await call('get_documentation', { path: component })
      assert.equal(guide.data.path, path)
    }
  }
  const list = await call('list_components', { category: 'forms' })
  assert.ok(list.data.components.some(component => component.component === 'SSelect'))
  assert.ok(list.data.components.every(component => component.category.includes('forms')))

  // Chain the structured results without parsing the legacy text fallback.
  const search = await call('search_documentation', { query: 'SSelect', limit: 3 })
  assert.deepEqual(JSON.parse(search.text), search.data.matches)
  assert.ok(search.data.matches.length <= 3)
  const [select] = search.data.matches
  assert.equal(select.component, 'SSelect')
  const outline = await call('get_documentation', { path: select.uri, outline: true })
  assert.equal(outline.data.path, select.path)
  assert.equal(outline.data.markdown, undefined)
  assert.deepEqual(JSON.parse(outline.text), outline.data.headings)
  const heading = outline.data.headings.find(heading => heading.title === 'Usage')
  assert.equal(heading?.level, 2)
  const section = await call('get_documentation', {
    path: outline.data.uri,
    section: heading.title,
    sectionOccurrence: heading.occurrence,
  })
  assert.equal(section.data.section, heading.title)
  assert.equal(section.data.sectionOccurrence, heading.occurrence)
  assert.match(section.data.markdown, /## Usage/)
  assert.doesNotMatch(section.data.markdown, /## Props/)
  const example = await call('get_example', { name: section.data.examples[0] })
  assert.equal(example.data.name, section.data.examples[0])
  assert.equal(example.data.source, example.text)
  assert.match(example.data.source, /<template>/)

  const guide = await call('get_documentation', { path: 'SSelect' })
  assert.match(guide.data.markdown, /valueKey/)
  assert.match(guide.data.markdown, /<SSelect/)
  assert.equal(guide.text, `# ${guide.data.title}\n\nPackage version: ${selarasVersion}\nDocumentation: ${select.path}\n\n${guide.data.markdown}`)
  const missingSection = await client.callTool({ name: 'get_documentation', arguments: { path: select.path, section: 'Unknown heading' } })
  assert.equal(missingSection.isError, true)
  assert.match(missingSection.content[0].text, /outline: true/)
  const conflictingOptions = await client.callTool({ name: 'get_documentation', arguments: { path: select.path, outline: true, section: heading.title } })
  assert.equal(conflictingOptions.isError, true)
  const missing = await client.callTool({ name: 'get_documentation', arguments: { path: '../../package.json' } })
  assert.equal(missing.isError, true)
  const resources = await client.listResources()
  assert.equal(resources.resources.length, new Set(resources.resources.map(resource => resource.uri)).size, 'Shared guides must not duplicate resource URIs')
  assert.ok(resources.resources.some(resource => resource.uri === select.uri))
  const resource = await client.readResource({ uri: select.uri })
  assert.match(resource.contents[0].text, /valueKey/)
  const index = await client.readResource({ uri: 'selaras://catalog' })
  assert.equal(JSON.parse(index.contents[0].text).version, selarasVersion)
  await assert.rejects(client.readResource({ uri: 'selaras://docs/../../package.json' }))
}

const server = createServer(catalog)
const client = new Client({ name: 'selaras-agent-test', version: '1.0.0' })
const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair()
await server.connect(serverTransport)
await client.connect(clientTransport)
try {
  await exerciseClient(client, catalog.version, publicComponents)
}
finally {
  await client.close()
  await server.close()
}
console.log('[agent] Catalog and MCP tool/resource contracts passed')

// Exercise the shipped packages as a consumer would get them: the UI package
// carries only the catalog, and the standalone server finds it through the
// project's own @sewadah/selaras install.
function pack(cwd, destination, specifier = []) {
  const result = JSON.parse(execFileSync('npm', ['pack', '--ignore-scripts', '--json', '--pack-destination', destination, ...specifier], { cwd, encoding: 'utf8' }))
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
  assert.ok(Object.keys(uiManifest.dependencies).every(name => !name.startsWith('@modelcontextprotocol/')), 'The UI package must not depend on the MCP SDK')
  assert.equal(uiManifest.dependencies.zod, undefined, 'The UI package must not depend on zod')
  assert.equal(uiManifest.exports['./agent/catalog.json'], './dist/agent/catalog.json')

  const mcp = pack(mcpRoot, temporary)
  for (const path of ['mcp.mjs', 'server.mjs', 'catalog.mjs'])
    assert.ok(mcp.files.some(file => file.path === path), `Missing packed MCP file: ${path}`)
  // Install the tarball and its runtime dependencies outside the workspace.
  const host = join(temporary, 'mcp-host')
  execFileSync('npm', ['install', '--prefix', host, '--ignore-scripts', '--omit=peer', '--no-package-lock', '--no-audit', '--no-fund', join(temporary, mcp.filename)], { cwd: temporary })
  const server = join(host, 'node_modules/@sewadah/selaras-mcp')
  const mcpManifest = JSON.parse(await readFile(join(server, 'package.json'), 'utf8'))
  assert.equal(mcpManifest.bin['selaras-mcp'], './mcp.mjs')
  assert.ok(mcpManifest.dependencies['@modelcontextprotocol/server'])
  assert.ok(mcpManifest.dependencies.zod)

  // A consumer project with only the packed UI package installed.
  const project = join(temporary, 'project')
  await extract(join(temporary, ui.filename), join(project, 'node_modules/@sewadah/selaras'))
  await writeFile(join(project, 'package.json'), '{ "name": "agent-test-project", "private": true }\n')

  async function connect(args, cwd, mode) {
    const transport = new StdioClientTransport({ command: process.execPath, args: [join(server, mcpManifest.bin['selaras-mcp']), ...args], cwd, stderr: 'pipe' })
    const diagnostics = []
    transport.stderr?.on('data', data => diagnostics.push(data.toString()))
    const packedClient = new Client({ name: 'selaras-packed-agent-test', version: '1.0.0' }, { versionNegotiation: { mode } })
    try {
      await packedClient.connect(transport)
    }
    catch (error) {
      await packedClient.close()
      throw error
    }
    return { packedClient, diagnostics }
  }

  const projects = [{ directory: project, version: catalog.version, components: publicComponents, label: 'checkout' }]
  // Pin representative published packages so this gate does not change when npm's latest tag moves.
  for (const version of ['1.0.0', '1.5.0']) {
    const archive = pack(temporary, temporary, [`@sewadah/selaras@${version}`])
    const directory = join(temporary, `selaras-${version}`)
    await extract(join(temporary, archive.filename), join(directory, 'node_modules/@sewadah/selaras'))
    const published = await loadCatalog(resolveCatalogPath(directory))
    assert.equal(published.version, version)
    projects.push({
      directory,
      version,
      components: published.documents.flatMap(documentComponents).sort(),
      label: `published ${version}`,
    })
  }

  // Cover working-directory discovery and --project with both stdio handshakes.
  for (const { directory, version, components, label } of projects) {
    for (const [args, cwd, mode, era] of [
      [[], directory, 'legacy', 'legacy'],
      [['--project', directory], temporary, { pin: '2026-07-28' }, 'modern'],
    ]) {
      const { packedClient, diagnostics } = await connect(args, cwd, mode)
      try {
        assert.equal(packedClient.getProtocolEra(), era)
        await exerciseClient(packedClient, version, components)
        assert.equal(diagnostics.join(''), '')
        console.log(`[agent] Packed stdio server passed with ${label} on ${era} MCP`)
      }
      finally {
        await packedClient.close()
      }
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
