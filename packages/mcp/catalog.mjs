import { readFile } from 'node:fs/promises'
import { createRequire } from 'node:module'
import { join, resolve } from 'node:path'
import process from 'node:process'

const catalogSpecifier = '@sewadah/selaras/agent/catalog.json'

/**
 * Find the catalog shipped inside the project's own `@sewadah/selaras`
 * install, so answers always describe the version that project uses. It is
 * resolved from the project directory rather than from this package, which
 * may live somewhere else entirely (an npx cache, a global install).
 */
export function resolveCatalogPath(projectDir = process.cwd()) {
  const directory = resolve(projectDir)
  try {
    return createRequire(join(directory, 'package.json')).resolve(catalogSpecifier)
  }
  catch (error) {
    if (error?.code === 'ERR_PACKAGE_PATH_NOT_EXPORTED')
      throw new Error(`The @sewadah/selaras installed in ${directory} does not export the documentation catalog. Upgrade @sewadah/selaras to 1.0.0 or later.`)
    throw new Error(`Could not find @sewadah/selaras from ${directory}. Start the server from your project directory, or pass --project <path-to-your-project>.`)
  }
}

export async function loadCatalog(path) {
  const catalog = JSON.parse(await readFile(path, 'utf8'))
  if (typeof catalog.version !== 'string' || !Array.isArray(catalog.documents) || !Array.isArray(catalog.examples))
    throw new Error('Invalid Selaras documentation catalog. Reinstall @sewadah/selaras, or run agent:build in the Selaras repository.')
  return catalog
}

export function documentComponents(document) {
  return document.components ?? (document.component ? [document.component] : [])
}

export function documentSummary(document) {
  return {
    path: document.path,
    title: document.title,
    description: document.description,
    category: document.category,
    ...(document.component === undefined ? {} : { component: document.component }),
    components: documentComponents(document),
    examples: document.examples,
    uri: `selaras://docs${document.path}`,
  }
}

export function findDocument(catalog, path) {
  const normalized = path.startsWith('selaras://docs/')
    ? path.slice('selaras://docs'.length)
    : `/${path.replace(/^\/+/, '').replace(/\.md$/, '')}`
  return catalog.documents.find(document => document.path === normalized
    || documentComponents(document).some(component => component.toLowerCase() === path.toLowerCase()))
}

export function searchDocuments(catalog, query, limit = 10) {
  const words = query.toLowerCase().match(/[\p{L}\p{N}_-]+/gu) ?? []
  if (!words.length)
    return []
  return catalog.documents.map((document) => {
    const title = `${document.title} ${documentComponents(document).join(' ')}`.toLowerCase()
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

function documentHeadings(content) {
  const headings = []
  const occurrences = new Map()
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
      if (heading) {
        const title = heading[2].replace(/`/g, '')
        const key = title.toLowerCase()
        const occurrence = (occurrences.get(key) ?? 0) + 1
        occurrences.set(key, occurrence)
        headings.push({ level: heading[1].length, title, occurrence, offset })
      }
    }
    offset += line.length + 1
  }
  return headings
}

export function documentOutline(content) {
  return documentHeadings(content).map(({ title, level, occurrence }) => ({ title, level, occurrence }))
}

export function readSection(content, section, occurrence = 1) {
  if (!section)
    return content
  const headings = documentHeadings(content)
  const title = section.toLowerCase()
  const index = headings.findIndex(heading => heading.title.toLowerCase() === title && heading.occurrence === occurrence)
  if (index < 0)
    return undefined
  const start = headings[index]
  const end = headings.slice(index + 1).find(heading => heading.level <= start.level)
  return content.slice(start.offset, end?.offset ?? content.length).trim()
}
