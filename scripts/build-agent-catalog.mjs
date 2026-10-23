import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'
import { parse } from 'yaml'
import { expandLlmsExamples } from '../docs/utils/llms-examples.ts'

const repositoryRoot = fileURLToPath(new URL('..', import.meta.url))

/** The published export boundary excludes renderers and recursive implementation helpers. */
export async function readPublicComponents(root = repositoryRoot) {
  const manifest = JSON.parse(await readFile(resolve(root, 'package.json'), 'utf8'))
  return (await readdir(resolve(root, 'src/runtime/components')))
    .filter(file => /\.(?:vue|ts|js)$/.test(file))
    .map(file => file.replace(/\.(?:vue|ts|js)$/, ''))
    .filter((name) => {
      const entry = manifest.exports?.[`./components/${name}*`]
      return !(entry && typeof entry === 'object' && Object.keys(entry).length === 0)
    })
    .map(name => `S${name}`)
    .sort()
}

/** Build an offline catalog from the same documentation and examples as the site. */
export async function buildAgentCatalog(root = repositoryRoot) {
  const manifest = JSON.parse(await readFile(resolve(root, 'package.json'), 'utf8'))
  const contentRoot = resolve(root, 'docs/content')
  const examplesRoot = resolve(root, 'docs/components/content/examples')
  const examples = []
  const sources = {}
  for (const file of (await readdir(examplesRoot, { recursive: true })).sort()) {
    if (!file.endsWith('.vue'))
      continue
    const name = file.split('/').at(-1).replace(/\.vue$/, '').replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()
    if (sources[name] !== undefined)
      throw new Error(`Duplicate example name: ${name}`)
    const source = await readFile(resolve(examplesRoot, file), 'utf8')
    sources[name] = source
    examples.push({ name, source, file: `docs/components/content/examples/${file}` })
  }
  const componentNames = new Set(await readPublicComponents(root))
  const documentedComponents = new Map()
  const documents = []
  for (const file of (await readdir(contentRoot, { recursive: true })).sort()) {
    if (!file.endsWith('.md') || file === 'index.md')
      continue
    const source = await readFile(resolve(contentRoot, file), 'utf8')
    const frontmatter = source.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n/)
    if (!frontmatter)
      throw new Error(`Missing documentation metadata: ${file}`)
    const metadata = parse(frontmatter[1])
    if (metadata.navigation === false)
      continue
    const path = `/${file.replace(/\.md$/, '')}`
    const content = source.slice(frontmatter[0].length).trim()
    const exampleNames = [...content.matchAll(/(?:component-example|block-preview)\{name=["']([^"']+)["']/g)].map(match => match[1])
    const component = `S${file.split('/').at(-1).replace(/\.md$/, '').split('-').map(part => part[0].toUpperCase() + part.slice(1)).join('')}`
    const primaryComponent = (file.startsWith('components/') || file.startsWith('composites/')) && componentNames.has(component) ? component : undefined
    if (metadata.components !== undefined && (!Array.isArray(metadata.components) || metadata.components.some(name => typeof name !== 'string')))
      throw new Error(`${file}: components metadata must be an array of public component names`)
    const components = [...new Set([...(primaryComponent ? [primaryComponent] : []), ...metadata.components ?? []])]
    for (const name of components) {
      if (!componentNames.has(name))
        throw new Error(`${file}: unknown or private component ${name}`)
      if (documentedComponents.has(name))
        throw new Error(`${name} has multiple guides: ${documentedComponents.get(name)} and ${file}`)
      documentedComponents.set(name, file)
    }
    documents.push({
      path,
      title: metadata.title,
      description: metadata.description ?? '',
      category: file.split('/').slice(0, -1).join('/'),
      component: primaryComponent,
      components: components.length ? components : undefined,
      examples: [...new Set(exampleNames)],
      content: expandLlmsExamples(content, sources),
    })
  }
  const missing = [...componentNames].filter(name => !documentedComponents.has(name))
  if (missing.length)
    throw new Error(`Public components missing documentation: ${missing.join(', ')}. Add a guide or declare companion components in its components frontmatter.`)
  const catalog = { version: manifest.version, documents, examples }
  const directory = resolve(root, 'dist/agent')
  await mkdir(directory, { recursive: true })
  await writeFile(resolve(directory, 'catalog.json'), `${JSON.stringify(catalog)}\n`)
  return catalog
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const catalog = await buildAgentCatalog()
  console.log(`[agent] Built ${catalog.documents.length} guides and ${catalog.examples.length} examples for ${catalog.version}`)
}
