import { McpServer, ResourceTemplate } from '@modelcontextprotocol/sdk/server/mcp.js'
import { z } from 'zod'
import { documentSummary, findDocument, readSection, searchDocuments } from './catalog.mjs'

const annotations = { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false }
const text = value => ({ content: [{ type: 'text', text: typeof value === 'string' ? value : JSON.stringify(value, null, 2) }] })
const failure = message => ({ ...text(message), isError: true })

export function createServer(catalog) {
  const server = new McpServer({ name: 'selaras', version: catalog.version }, {
    instructions: 'Use the component catalog before implementing UI. Read matching API guides and Vue examples; customize existing Selaras components with props, slots, ui, and shared configuration. This offline catalog matches the installed package version.',
  })
  server.registerTool('list_components', {
    description: 'Discover Selaras components and composites, their documentation paths, and available examples. Filter by category such as forms, overlays, data, or dashboard.',
    inputSchema: { category: z.string().max(100).optional() },
    annotations,
  }, async ({ category }) => text(catalog.documents.filter(document => document.component
    && (!category || document.category.toLowerCase().includes(category.toLowerCase()))).map(documentSummary)))
  server.registerTool('search_documentation', {
    description: 'Search component APIs, setup, theming, icons, messages, adaptive controls, and composables. Returns matching guide paths to read next.',
    inputSchema: { query: z.string().trim().min(1).max(200), limit: z.number().int().min(1).max(20).default(10) },
    annotations,
  }, async ({ query, limit }) => text(searchDocuments(catalog, query, limit)))
  server.registerTool('get_documentation', {
    description: 'Read a guide by its catalog path or component name (for example SSelect). Contains API tables and complete Vue source for embedded examples. Optionally read one heading section.',
    inputSchema: { path: z.string().min(1).max(200), section: z.string().max(200).optional() },
    annotations,
  }, async ({ path, section }) => {
    const document = findDocument(catalog, path)
    if (!document)
      return failure('Unknown documentation path. Use search_documentation or list_components to find a guide.')
    const content = readSection(document.content, section)
    return content === undefined
      ? failure(`Unknown section in ${document.path}. Read the full guide to see available headings.`)
      : text(`# ${document.title}\n\nPackage version: ${catalog.version}\nDocumentation: ${document.path}\n\n${content}`)
  })
  server.registerTool('get_example', {
    description: 'Read the exact Vue source of a named example from a component guide or list_components result.',
    inputSchema: { name: z.string().min(1).max(200) },
    annotations,
  }, async ({ name }) => {
    const example = catalog.examples.find(example => example.name === name)
    return example ? text(example.source) : failure('Unknown example name. Read the examples field in list_components or a component guide.')
  })
  server.registerResource('catalog', 'selaras://catalog', {
    description: 'Guide and component index for this Selaras package version.',
    mimeType: 'application/json',
  }, async uri => ({ contents: [{ uri: uri.href, mimeType: 'application/json', text: JSON.stringify({ version: catalog.version, documents: catalog.documents.map(documentSummary) }) }] }))
  server.registerResource('documentation', new ResourceTemplate('selaras://docs/{+path}', {
    list: async () => ({ resources: catalog.documents.map(document => ({ uri: documentSummary(document).uri, name: document.title, description: document.description, mimeType: 'text/markdown' })) }),
  }), { mimeType: 'text/markdown', description: 'Versioned Selaras documentation with Vue examples.' }, async (uri, { path }) => {
    const document = typeof path === 'string' ? findDocument(catalog, path) : undefined
    if (!document)
      throw new Error('Unknown Selaras documentation resource')
    return { contents: [{ uri: uri.href, mimeType: 'text/markdown', text: document.content }] }
  })
  return server
}
