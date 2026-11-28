import { McpServer, ResourceTemplate } from '@modelcontextprotocol/server'
import { z } from 'zod'
import { documentComponents, documentOutline, documentSummary, findDocument, readSection, searchDocuments } from './catalog.mjs'
import manifest from './package.json' with { type: 'json' }

const annotations = { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false }
const text = value => ({ content: [{ type: 'text', text: typeof value === 'string' ? value : JSON.stringify(value, null, 2) }] })
const failure = message => ({ ...text(message), isError: true })
const result = (structuredContent, fallback) => ({ ...text(fallback), structuredContent })

const guideSummary = z.object({
  path: z.string(),
  title: z.string(),
  description: z.string(),
  category: z.string(),
  component: z.string().optional(),
  components: z.array(z.string()),
  examples: z.array(z.string()),
  uri: z.string(),
})

export function createServer(catalog) {
  const selarasVersion = catalog.version
  const server = new McpServer({ name: 'selaras', version: manifest.version }, {
    instructions: 'Use the component catalog before implementing UI. Read matching API guides and Vue examples; customize existing Selaras components with props, slots, ui, and shared configuration. This offline catalog matches the installed package version.',
  })
  server.registerTool('list_components', {
    description: 'Discover Selaras components and composites, their documentation paths, and available examples. Filter by category such as forms, overlays, data, or dashboard.',
    inputSchema: { category: z.string().max(100).optional() },
    outputSchema: {
      selarasVersion: z.string(),
      components: z.array(guideSummary.extend({ component: z.string() })),
    },
    annotations,
  }, async ({ category }) => {
    const components = catalog.documents
      .filter(document => !category || document.category.toLowerCase().includes(category.toLowerCase()))
      .flatMap(document => documentComponents(document).map(component => ({ ...documentSummary(document), component })))
    return result({ selarasVersion, components }, components)
  })
  server.registerTool('search_documentation', {
    description: 'Search component APIs, setup, theming, icons, messages, adaptive controls, and composables. Returns matching guide paths to read next.',
    inputSchema: { query: z.string().trim().min(1).max(200), limit: z.number().int().min(1).max(20).default(10) },
    outputSchema: { selarasVersion: z.string(), matches: z.array(guideSummary) },
    annotations,
  }, async ({ query, limit }) => {
    const matches = searchDocuments(catalog, query, limit)
    return result({ selarasVersion, matches }, matches)
  })
  server.registerTool('get_documentation', {
    description: 'Read a guide by catalog path, documentation URI, or component name (for example SSelect). Use outline: true to discover headings, or section to read one heading and its subsections.',
    inputSchema: {
      path: z.string().min(1).max(200),
      section: z.string().max(200).optional(),
      sectionOccurrence: z.number().int().positive().optional().describe('Occurrence of the section title from the outline. Defaults to the first matching heading.'),
      outline: z.boolean().optional(),
    },
    outputSchema: {
      ...guideSummary.shape,
      selarasVersion: z.string(),
      section: z.string().optional(),
      sectionOccurrence: z.number().int().positive().optional(),
      markdown: z.string().optional(),
      headings: z.array(z.object({
        title: z.string(),
        level: z.number().int().min(1).max(6),
        occurrence: z.number().int().positive(),
      })).optional(),
    },
    annotations,
  }, async ({ path, section, sectionOccurrence, outline }) => {
    if (outline && section)
      return failure('Use outline or section in a single call.')
    if (sectionOccurrence !== undefined && !section)
      return failure('Supply a section title when using sectionOccurrence.')
    const document = findDocument(catalog, path)
    if (!document)
      return failure('Unknown documentation path. Use search_documentation or list_components to find a guide.')
    const summary = { ...documentSummary(document), selarasVersion }
    if (outline) {
      const headings = documentOutline(document.content)
      return result({ ...summary, headings }, headings)
    }
    const markdown = readSection(document.content, section, sectionOccurrence)
    if (markdown === undefined)
      return failure(`Unknown section in ${document.path}. Use outline: true to see available headings.`)
    return result(
      { ...summary, ...(section ? { section, sectionOccurrence: sectionOccurrence ?? 1 } : {}), markdown },
      `# ${document.title}\n\nPackage version: ${selarasVersion}\nDocumentation: ${document.path}\n\n${markdown}`,
    )
  })
  server.registerTool('get_example', {
    description: 'Read the exact Vue source of a named example from a component guide or list_components result.',
    inputSchema: { name: z.string().min(1).max(200) },
    outputSchema: { selarasVersion: z.string(), name: z.string(), source: z.string() },
    annotations,
  }, async ({ name }) => {
    const example = catalog.examples.find(example => example.name === name)
    return example
      ? result({ selarasVersion, name: example.name, source: example.source }, example.source)
      : failure('Unknown example name. Read the examples field in list_components or a component guide.')
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
