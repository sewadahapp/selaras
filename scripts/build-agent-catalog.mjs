import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'
import { parse } from 'yaml'
import { expandLlmsExamples } from '../docs/utils/llms-examples.ts'

const repositoryRoot = fileURLToPath(new URL('..', import.meta.url))

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
  const componentNames = new Set((await readdir(resolve(root, 'src/runtime/components')))
    .filter(file => file.endsWith('.vue'))
    .map(file => `S${file.slice(0, -4)}`))
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
    const exampleNames = [...content.matchAll(/component-example\{name=["']([^"']+)["']/g)].map(match => match[1])
    const component = `S${file.split('/').at(-1).replace(/\.md$/, '').split('-').map(part => part[0].toUpperCase() + part.slice(1)).join('')}`
    documents.push({
      path,
      title: metadata.title,
      description: metadata.description ?? '',
      category: file.split('/').slice(0, -1).join('/'),
      component: (file.startsWith('components/') || file.startsWith('composites/')) && componentNames.has(component)
        ? component
        : undefined,
      examples: [...new Set(exampleNames)],
      content: expandLlmsExamples(content, sources),
    })
  }
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
