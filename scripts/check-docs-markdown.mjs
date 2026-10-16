import assert from 'node:assert/strict'
import process from 'node:process'
import { docsSite } from '../docs/utils/seo.ts'

const origin = new URL(process.argv[2] ?? process.env.NUXT_SITE_URL ?? docsSite.url)
const pages = ['/', '/overview/getting-started/introduction/', '/components/elements/button/']

async function request(path, accept, method = 'GET') {
  const headers = accept === undefined ? {} : { Accept: accept }
  const response = await fetch(new URL(path, origin), { headers, method, signal: AbortSignal.timeout(15_000) })
  assert.equal(response.status, 200, `${method} ${path} (${accept ?? 'default'}): expected HTTP 200`)
  return response
}

function checkType(response, type, path) {
  assert.equal(response.headers.get('content-type')?.split(';')[0]?.trim().toLowerCase(), type, `Content-Type for ${path}`)
}

function checkVary(response, path) {
  const values = (response.headers.get('vary') ?? '').toLowerCase().split(',').map(value => value.trim())
  assert.ok(values.includes('accept'), `Vary must include Accept for ${path}`)
}

async function main() {
  for (const path of pages) {
    const raw = path === '/' ? '/raw/index.md' : `/raw${path.replace(/\/$/, '')}.md`
    const source = await request(raw)
    checkType(source, 'text/markdown', raw)
    const expected = await source.text()
    assert.match(expected, /^#\s/m, `Missing Markdown heading in ${raw}`)
    assert.doesNotMatch(expected, /^\s*<!doctype html|^\s*<html\b/i, `HTML returned from ${raw}`)

    const html = await request(path, 'text/html')
    checkType(html, 'text/html', path)
    checkVary(html, path)
    await html.arrayBuffer()

    for (const target of [path, `${path}?source=agent`]) {
      const markdown = await request(target, 'text/markdown')
      checkType(markdown, 'text/markdown', target)
      checkVary(markdown, target)
      assert.ok(markdown.headers.get('cache-control')?.toLowerCase().split(',').map(value => value.trim()).includes('no-store'), `Markdown must be no-store for ${target}`)
      assert.ok(!['HIT', 'STALE', 'UPDATING', 'REVALIDATED'].includes(markdown.headers.get('cf-cache-status')?.toUpperCase()), `Markdown must bypass Cloudflare cache for ${target}`)
      assert.equal(await markdown.text(), expected, `Negotiated Markdown must match ${raw}`)
    }

    for (const accept of [undefined, 'text/html', 'text/markdown;q=0', 'text/html, text/markdown;q=0.5']) {
      const browser = await request(path, accept)
      checkType(browser, 'text/html', path)
      checkVary(browser, path)
      await browser.arrayBuffer()
    }

    const head = await request(path, 'text/markdown', 'HEAD')
    checkType(head, 'text/markdown', path)
    checkVary(head, path)
    assert.equal(await head.text(), '', 'HEAD must not include a response body')
    console.log(`[docs-markdown] HTML, Markdown, cache separation, queries and HEAD passed: ${path}`)
  }
}

main().catch((error) => {
  console.error(`[docs-markdown] ${error.message}`)
  process.exitCode = 1
})
