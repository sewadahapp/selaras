import assert from 'node:assert/strict'
import { existsSync, readdirSync, readFileSync } from 'node:fs'
import process from 'node:process'
import { fileURLToPath } from 'node:url'
import { agentAttributionRequest } from '../docs/utils/agent-attribution.ts'
import { docsCanonicalUrl, docsSite, legacyDocsPaths } from '../docs/utils/seo.ts'

const output = new URL('../docs/.output/public/', import.meta.url)
const siteUrl = process.env.NUXT_SITE_URL ?? docsSite.url
const baseURL = process.env.NUXT_APP_BASE_URL ?? '/'
const home = new URL(docsCanonicalUrl('/', siteUrl, baseURL))

function decode(value) {
  return value.replace(/&quot;/g, '"').replace(/&#39;|&apos;/g, '\'').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&')
}

function readPage(path) {
  const relative = path.replace(/^\//, '').replace(/\/$/, '')
  const candidates = relative ? [`${relative}/index.html`, `${relative}.html`] : ['index.html']
  const file = candidates.map(path => new URL(path, output)).find(existsSync)
  assert.ok(file, `Missing generated HTML for ${path}`)
  return readFileSync(file, 'utf8')
}

function headTags(html) {
  const head = html.split('</head>')[0]
  return [...head.matchAll(/<(meta|link)\s[^>]*>/g)].map(([tag]) => Object.fromEntries(
    [...tag.matchAll(/([\w:-]+)="([^"]*)"/g)].map(([, name, value]) => [name, decode(value)]),
  ))
}

const robots = readFileSync(new URL('robots.txt', output), 'utf8')
assert.match(robots, /^User-agent:\s*\*\s*$/im, 'Robots must include a group for all crawlers')
assert.match(robots, /^Allow:\s*\/\s*$/im, 'Public documentation must allow crawling')
assert.doesNotMatch(robots, /^Disallow:\s*\/\s*$/im, 'Do not block public documentation or agent access')
const robotSitemaps = [...robots.matchAll(/^Sitemap:\s*(\S+)\s*$/gim)].map(([, url]) => url)
assert.ok(robotSitemaps.includes(new URL('sitemap_index.xml', home).href), 'Robots must advertise the production sitemap index')

const aiUserAgents = [
  'Amazonbot',
  'Applebot-Extended',
  'Bytespider',
  'CCBot',
  'ChatGPT-User',
  'Claude-Web',
  'Claude-SearchBot',
  'Claude-User',
  'ClaudeBot',
  'Google-Extended',
  'GPTBot',
  'OAI-SearchBot',
  'PerplexityBot',
  'Perplexity-User',
]
const robotGroups = robots.split(/\r?\n[\t ]*\r?\n/)
for (const userAgent of aiUserAgents) {
  const group = robotGroups.find(group => new RegExp(`^User-agent:[\\t ]*${userAgent}[\\t ]*$`, 'im').test(group))
  assert.ok(group, `Missing explicit AI crawler policy: ${userAgent}`)
  assert.match(group, /^Allow:[\t ]*\/[\t ]*$/im, `AI crawlers must be allowed to read public documentation: ${userAgent}`)
  assert.doesNotMatch(group, /^Disallow:[\t ]*\/.*$/im, `Do not block AI crawler access: ${userAgent}`)
}

for (const group of robotGroups.filter(group => /^User-agent:/im.test(group))) {
  const userAgent = group.match(/^User-agent:[\t ]*(\S.*)$/im)?.[1]
  const signals = [...group.matchAll(/^Content-Signal:[\t ]*(\S.*)$/gim)]
    .flatMap(([, value]) => value.split(','))
    .map(signal => signal.trim().toLowerCase())
  for (const category of ['ai-train', 'search', 'ai-input']) {
    assert.ok(signals.includes(`${category}=yes`), `Missing content preference ${category}=yes for ${userAgent}`)
    assert.ok(!signals.includes(`${category}=no`), `Conflicting content preference ${category}=no for ${userAgent}`)
  }
}

const sitemapFile = existsSync(new URL('sitemap_index.xml', output)) ? 'sitemap_index.xml' : 'sitemap.xml'
const sitemap = readFileSync(new URL(sitemapFile, output), 'utf8')
const sitemapUrls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(([, url]) => decode(url))
const sitemaps = /<sitemapindex\b/.test(sitemap)
  ? sitemapUrls.map((url) => {
      const pathname = new URL(url).pathname.slice(home.pathname.length).replace(/^\//, '')
      return readFileSync(new URL(pathname, output), 'utf8')
    })
  : [sitemap]
const locations = sitemaps.flatMap(xml => [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(([, url]) => decode(url)))
assert.ok(locations.length > 100, 'The sitemap must discover the documentation collection')
assert.equal(new Set(locations).size, locations.length, 'Sitemap URLs must be unique')

const content = new URL('../docs/content/', import.meta.url)
const documentation = readdirSync(content, { recursive: true })
  .filter(path => path.endsWith('.md') && !path.startsWith('id/'))
  .map(path => path === 'index.md' ? '/' : `/${path.replace(/\.md$/, '')}`)

for (const path of documentation) {
  assert.ok(path === '/' || /^\/(?:overview|components|composites|blocks|utilities)\/[^.]+$/.test(path), `Page is outside the Cloudflare Markdown rewrite scope: ${path}`)
  const raw = path === '/' ? 'raw/index.md' : `raw${path}.md`
  const markdown = readFileSync(new URL(raw, output), 'utf8')
  assert.match(markdown, /^#\s/m, `Missing generated Markdown heading: ${raw}`)
  assert.doesNotMatch(markdown, /^\s*<!doctype html|^\s*<html\b/i, `HTML returned in Markdown export: ${raw}`)
  assert.ok(markdown.includes(agentAttributionRequest), `Missing optional attribution request in Markdown export: ${raw}`)
}

for (const path of ['/', '/design-kit', '/templates', '/changelog', '/changelog/docs', '/changelog/mcp', ...documentation]) {
  if (legacyDocsPaths[path])
    continue
  const tags = headTags(readPage(path))
  const indexable = !/noindex|none/i.test(tags.find(tag => tag.name === 'robots')?.content ?? '')
  if (!indexable) {
    assert.ok(!locations.includes(docsCanonicalUrl(path, siteUrl, baseURL)), `Non-indexable page in sitemap: ${path}`)
    continue
  }
  assert.ok(locations.includes(docsCanonicalUrl(path, siteUrl, baseURL)), `Sitemap must include ${path}`)
}

const untranslatedIdPath = '/id/overview/introduction'
const untranslatedTags = headTags(readPage(untranslatedIdPath))
assert.match(untranslatedTags.find(tag => tag.name === 'robots')?.content ?? '', /noindex/, 'Untranslated Indonesian fallback must be noindex')
assert.equal(
  untranslatedTags.find(tag => tag.rel === 'canonical')?.href,
  docsCanonicalUrl('/overview/introduction', siteUrl, baseURL),
  'Untranslated Indonesian fallback must canonicalize to its English page',
)
assert.ok(!locations.includes(docsCanonicalUrl(untranslatedIdPath, siteUrl, baseURL)), 'Untranslated Indonesian fallback must stay out of the sitemap')

const images = new Set()
for (const location of locations) {
  const url = new URL(location)
  assert.equal(url.origin, home.origin, 'Sitemap URLs must use the production origin')
  assert.ok(url.pathname.startsWith(home.pathname), 'Sitemap URLs must include the deployment base path')
  assert.equal(url.search + url.hash, '', 'Sitemap URLs must omit queries and fragments')
  const path = `/${url.pathname.slice(home.pathname.length)}`.replace(/\/$/, '') || '/'
  assert.ok(!/^\/(?:examples|raw|_og)\//.test(path), `Non-documentation route in sitemap: ${path}`)
  assert.ok(!path.endsWith('.html'), `Exploration page in sitemap: ${path}`)
  assert.ok(!legacyDocsPaths[path], `Legacy alias in sitemap: ${path}`)

  const html = readPage(path)
  const tags = headTags(html)
  const meta = name => tags.find(tag => tag.name === name || tag.property === name)?.content
  assert.ok(!/noindex|none/i.test(meta('robots') ?? ''), `Non-indexable page in sitemap: ${path}`)
  assert.equal(tags.filter(tag => tag.rel === 'canonical').length, 1, `One canonical URL required: ${path}`)
  assert.equal(tags.find(tag => tag.rel === 'canonical').href, location, `Canonical URL mismatch: ${path}`)
  const title = decode(html.match(/<title>(.*?)<\/title>/s)?.[1] ?? '')
  assert.ok(title === 'Selaras' || title.endsWith(' — Selaras'), `Missing branded title: ${path}`)
  assert.equal(meta('og:title'), title, `Open Graph title mismatch: ${path}`)
  assert.equal(meta('twitter:title'), title, `Twitter title mismatch: ${path}`)
  assert.ok(meta('description'), `Missing description: ${path}`)
  assert.equal(meta('og:description'), meta('description'), `Open Graph description mismatch: ${path}`)
  assert.equal(meta('twitter:description'), meta('description'), `Twitter description mismatch: ${path}`)
  assert.equal(meta('og:url'), location, `Open Graph URL mismatch: ${path}`)
  assert.equal(meta('twitter:card'), 'summary_large_image', `Missing sharing card: ${path}`)
  const image = new URL(meta('og:image'))
  assert.equal(image.origin, home.origin, `Sharing image origin mismatch: ${path}`)
  assert.ok(image.pathname.startsWith(home.pathname), `Sharing image missing base path: ${path}`)
  assert.equal(meta('twitter:image'), image.href, `Twitter image mismatch: ${path}`)
  assert.ok(meta('og:image:alt'), `Missing sharing image description: ${path}`)
  images.add(image.pathname)
}

assert.ok(images.size > 100, 'Sharing images must be specific to each documentation page')
for (const path of images) {
  const file = new URL(decodeURIComponent(path.slice(home.pathname.length)), output)
  assert.ok(existsSync(file), `Sharing image was not prerendered: ${path}`)
  const png = readFileSync(file)
  assert.equal(png.subarray(0, 8).toString('hex'), '89504e470d0a1a0a', `Invalid PNG: ${path}`)
  assert.equal(png.readUInt32BE(16), 1200, `Sharing image width: ${path}`)
  assert.equal(png.readUInt32BE(20), 630, `Sharing image height: ${path}`)
}

for (const [path, canonical] of Object.entries(legacyDocsPaths)) {
  const tags = headTags(readPage(path))
  assert.equal(tags.find(tag => tag.rel === 'canonical')?.href, docsCanonicalUrl(canonical, siteUrl, baseURL), `Legacy canonical URL: ${path}`)
}

const preview = headTags(readPage('/examples/adaptive-interfaces'))
assert.match(preview.find(tag => tag.name === 'robots')?.content ?? '', /noindex/, 'The embedded preview must remain non-indexable')
assert.ok(existsSync(new URL('llms.txt', output)), 'Keep the agent documentation index')
assert.ok(existsSync(new URL('llms-full.txt', output)), 'Keep the complete agent documentation')
for (const file of ['llms.txt', 'llms-full.txt'])
  assert.ok(readFileSync(new URL(file, output), 'utf8').includes(agentAttributionRequest), `Missing optional attribution request in ${file}`)
console.log(`[docs-seo] Verified ${locations.length} pages, ${images.size} static sharing images, and robots.txt in ${fileURLToPath(output)}`)
