import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { Client } from '@modelcontextprotocol/sdk/client/index.js'
import { InMemoryTransport } from '@modelcontextprotocol/sdk/inMemory.js'
import { afterEach, describe, expect, it } from 'vitest'
import { documentComponents, findDocument, searchDocuments } from '../packages/mcp/catalog.mjs'
import { createServer } from '../packages/mcp/server.mjs'
import { buildAgentCatalog, readPublicComponents } from '../scripts/build-agent-catalog.mjs'

const temporary: string[] = []
const root = fileURLToPath(new URL('..', import.meta.url))
afterEach(async () => {
  await Promise.all(temporary.splice(0).map(path => rm(path, { recursive: true, force: true })))
})

async function fixture() {
  const root = await mkdtemp(join(tmpdir(), 'selaras-documentation-'))
  temporary.push(root)
  const write = async (path: string, source: string) => {
    await mkdir(dirname(join(root, path)), { recursive: true })
    await writeFile(join(root, path), source)
  }
  await write('package.json', JSON.stringify({ version: '1.0.0', exports: { './components/*': './dist/components/*', './components/Renderer*': {} } }))
  await write('src/runtime/components/Button.vue', '<template><button /></template>')
  await write('src/runtime/components/Column.ts', 'export default {}')
  await write('src/runtime/components/Renderer.vue', '<template>Private</template>')
  await write('docs/components/content/examples/ButtonBasic.vue', '<template><SButton>Save</SButton></template>')
  await write('docs/content/components/button.md', '---\ntitle: Button\ncomponents: [SColumn]\n---\n\n## Usage\n\n::component-example{name="button-basic"}\n::\n')
  // Translations are served from the same URL and must never duplicate catalog entries.
  await write('docs/content/id/components/button.md', '---\ntitle: Tombol\n---\n\n## Penggunaan\n')
  return { root, write, build: () => buildAgentCatalog(root) }
}

describe('public documentation inventory', () => {
  it('covers every published component, including TypeScript and shared-guide companions', async () => {
    const repo = await fixture()
    const catalog = await repo.build()
    expect(await readPublicComponents(repo.root)).toEqual(['SButton', 'SColumn'])
    expect(catalog.documents).toHaveLength(1)
    expect(catalog.documents.map(document => document.path)).toEqual(['/components/button'])
    expect(catalog.documents[0]?.components).toEqual(['SButton', 'SColumn'])
    expect(catalog.documents[0]?.content).toContain('<SButton>Save</SButton>')
    expect(catalog.examples.map(example => example.name)).toEqual(['button-basic'])
  })

  it('fails a build when a public component has no guide', async () => {
    const repo = await fixture()
    await repo.write('src/runtime/components/Unlisted.vue', '<template>New component</template>')
    await expect(repo.build()).rejects.toThrow('Public components missing documentation: SUnlisted')
  })

  it.each(['[SRenderer]', '[SUnknown]', 'SColumn'])('rejects private, unknown, or malformed companion metadata: %s', async (components) => {
    const repo = await fixture()
    await repo.write('docs/content/components/button.md', `---\ntitle: Button\ncomponents: ${components}\n---\n\n## Usage\n`)
    await expect(repo.build()).rejects.toThrow(/unknown or private component|components metadata/)
  })

  it('rejects ambiguous ownership instead of assigning a component to an arbitrary guide', async () => {
    const repo = await fixture()
    await repo.write('docs/content/components/another.md', '---\ntitle: Another guide\ncomponents: [SColumn]\n---\n\n## Usage\n')
    await expect(repo.build()).rejects.toThrow('SColumn has multiple guides')
  })

  it('maps all current public exports to a guide without exposing implementation helpers', async () => {
    const catalog = await buildAgentCatalog(root)
    const actual = catalog.documents.flatMap(documentComponents).sort()
    expect(actual).toEqual(await readPublicComponents(root))
    expect(catalog.documents.map(document => document.path).length).toBe(new Set(catalog.documents.map(document => document.path)).size)
    for (const [component, path] of [
      ['SColumn', '/components/data/table'],
      ['SColumnGroup', '/components/data/table'],
      ['SToolbarButton', '/components/elements/toolbar'],
      ['SToolbarSeparator', '/components/elements/toolbar'],
      ['SToolbarToggleGroup', '/components/elements/toolbar'],
      ['SSplitterPanel', '/components/layout/splitter'],
      ['SSplitterResizeHandle', '/components/layout/splitter'],
      ['SProseH1', '/components/typography/prose'],
      ['SProseH2', '/components/typography/prose'],
      ['SProseH3', '/components/typography/prose'],
      ['SProseH4', '/components/typography/prose'],
      ['SProseH5', '/components/typography/prose'],
      ['SProseH6', '/components/typography/prose'],
      ['SProsePre', '/components/typography/prose'],
    ]) {
      expect(findDocument(catalog, component)?.path).toBe(path)
      expect(searchDocuments(catalog, component, 1)[0]?.path).toBe(path)
    }
    expect(actual).not.toContain('SModalRenderer')
    expect(actual).not.toContain('SNavigationMenuFlyoutList')
    expect(catalog.documents.find(document => document.path === '/components/typography/prose')?.component).toBeUndefined()
    for (const document of catalog.documents) {
      for (const name of document.examples)
        expect(catalog.examples.some(example => example.name === name), `${document.path}: ${name}`).toBe(true)
    }
    const badge = catalog.documents.find(document => document.path === '/components/elements/badge')
    expect(badge?.content).toContain('Rounded count badges')
    expect(badge?.content).toContain('<SBadge label="100"')
    expect(badge?.examples).toContain('badge-rounded-count')
  })

  it('keeps reading primary-component catalogs published before companion metadata', () => {
    const legacy = { documents: [{ path: '/components/button', title: 'Button', description: 'Action', content: 'Use SButton', component: 'SButton', category: 'elements', examples: [] }] }
    expect(findDocument(legacy, 'sbutton')?.path).toBe('/components/button')
    expect(searchDocuments(legacy, 'SButton', 1)[0]?.components).toEqual(['SButton'])
  })

  it('serves older primary-component catalogs through the MCP tools', async () => {
    const catalog = { version: '1.0.0', examples: [], documents: [{ path: '/components/button', title: 'Button', description: 'Action', content: 'Use SButton', component: 'SButton', category: 'elements', examples: [] }] }
    const server = createServer(catalog)
    const client = new Client({ name: 'legacy-catalog-test', version: '1.0.0' })
    const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair()
    await server.connect(serverTransport)
    await client.connect(clientTransport)
    try {
      const list = await client.callTool({ name: 'list_components', arguments: {} })
      const content = list.content as { type: string, text: string }[]
      expect(JSON.parse(content[0]!.text).map((entry: { component: string }) => entry.component)).toEqual(['SButton'])
      const guide = await client.callTool({ name: 'get_documentation', arguments: { path: 'SButton' } })
      expect(guide.isError).not.toBe(true)
      expect((guide.content as { text: string }[])[0]!.text).toContain('Use SButton')
    }
    finally {
      await client.close()
      await server.close()
    }
  })

  it('keeps grouped documentation and expanded examples in the saved catalog', async () => {
    const repo = await fixture()
    await repo.build()
    const saved = JSON.parse(await readFile(join(repo.root, 'dist/agent/catalog.json'), 'utf8'))
    expect(findDocument(saved, 'SColumn')?.content).toContain('<SButton>Save</SButton>')
    expect(saved.documents).toHaveLength(1)
    expect(saved.documents[0].components).toEqual(['SButton', 'SColumn'])
  })
})
