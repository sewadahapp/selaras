import { readFile } from 'node:fs/promises'

export async function loadCatalog(url = new URL('../dist/agent/catalog.json', import.meta.url)) {
  const catalog = JSON.parse(await readFile(url, 'utf8'))
  if (typeof catalog.version !== 'string' || !Array.isArray(catalog.documents) || !Array.isArray(catalog.examples))
    throw new Error('Invalid Selaras documentation catalog. Reinstall the package or run agent:build in the repository.')
  return catalog
}

export function documentSummary(document) {
  return {
    path: document.path,
    title: document.title,
    description: document.description,
    category: document.category,
    component: document.component,
    examples: document.examples,
    uri: `selaras://docs${document.path}`,
  }
}

export function findDocument(catalog, path) {
  const normalized = `/${path.replace(/^\/+/, '').replace(/\.md$/, '')}`
  return catalog.documents.find(document => document.path === normalized
    || document.component?.toLowerCase() === path.toLowerCase())
}

export function searchDocuments(catalog, query, limit = 10) {
  const words = query.toLowerCase().match(/[\p{L}\p{N}_-]+/gu) ?? []
  if (!words.length)
    return []
  return catalog.documents.map((document) => {
    const title = `${document.title} ${document.component ?? ''}`.toLowerCase()
    const description = document.description.toLowerCase()
    const content = document.content.toLowerCase()
    const score = words.reduce((total, word) => total
      + (title.includes(word) ? 10 : 0)
      + (description.includes(word) ? 4 : 0)
      + (document.path.includes(word) ? 2 : 0)
      + (content.includes(word) ? 1 : 0), 0)
    return { document, score }
  }).filter(result => result.score > 0).sort((a, b) => b.score - a.score || a.document.path.localeCompare(b.document.path)).slice(0, limit).map(({ document }) => documentSummary(document))
}

export function readSection(content, section) {
  if (!section)
    return content
  const headings = []
  let fence
  let offset = 0
  for (const line of content.split('\n')) {
    const marker = line.match(/^ {0,3}(`{3,}|~{3,})/)
    if (fence) {
      if (marker && marker[1][0] === fence[0] && marker[1].length >= fence.length && !line.slice(marker[0].length).trim())
        fence = undefined
    }
    else if (marker) {
      fence = marker[1]
    }
    else {
      const heading = line.match(/^(#{1,6})[ \t]+(\S.*)$/)
      if (heading)
        headings.push({ level: heading[1].length, title: heading[2], offset })
    }
    offset += line.length + 1
  }
  const index = headings.findIndex(heading => heading.title.replace(/`/g, '').toLowerCase() === section.toLowerCase())
  if (index < 0)
    return undefined
  const start = headings[index]
  const end = headings.slice(index + 1).find(heading => heading.level <= start.level)
  return content.slice(start.offset, end?.offset ?? content.length).trim()
}
