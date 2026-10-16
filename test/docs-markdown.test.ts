import type { IncomingMessage, ServerResponse } from 'node:http'
import { execFile } from 'node:child_process'
import { createServer } from 'node:http'
import process from 'node:process'
import { fileURLToPath } from 'node:url'
import { promisify } from 'node:util'
import { describe, expect, it } from 'vitest'

const execute = promisify(execFile)
const script = fileURLToPath(new URL('../scripts/check-docs-markdown.mjs', import.meta.url))

async function verify(mode = 'valid') {
  const requests: { path: string, accept?: string, method?: string }[] = []
  let markdownSeen = false
  const server = createServer((request: IncomingMessage, response: ServerResponse) => {
    const path = new URL(request.url!, 'http://localhost').pathname
    const accept = request.headers.accept
    requests.push({ path, accept, method: request.method })
    const raw = path.startsWith('/raw/')
    const negotiated = accept === 'text/markdown'
    let markdown = raw || negotiated
    if (!raw && negotiated && mode === 'html-for-agent')
      markdown = false
    if (!raw && !negotiated && markdownSeen && mode === 'leaked-markdown')
      markdown = true
    if (!raw && !negotiated && mode === 'accept-substring' && accept?.includes('text/markdown'))
      markdown = true
    response.setHeader('Content-Type', markdown ? 'text/markdown; charset=utf-8' : 'text/html; charset=utf-8')
    if (mode !== 'missing-vary')
      response.setHeader('Vary', 'Accept-Encoding, Accept')
    response.setHeader('Cache-Control', 'no-store')
    response.setHeader('CF-Cache-Status', mode === 'cached-markdown' ? 'HIT' : 'DYNAMIC')
    markdownSeen ||= negotiated
    const body = markdown ? '# Documentation\n\n```vue\n<SButton />\n```\n' : '<!DOCTYPE html><html><body>Documentation</body></html>'
    response.end(request.method === 'HEAD' ? undefined : body)
  })
  await new Promise<void>(resolve => server.listen(0, '127.0.0.1', resolve))
  try {
    const address = server.address()
    if (!address || typeof address === 'string')
      throw new Error('Expected a local TCP test server')
    const result = await execute(process.execPath, [script, `http://127.0.0.1:${address.port}`])
    return { ...result, requests }
  }
  finally {
    await new Promise<void>((resolve, reject) => server.close(error => error ? reject(error) : resolve()))
  }
}

describe('deployed documentation Markdown verification', () => {
  it('checks HTML and Markdown at the same URLs, including queries and HEAD', async () => {
    const result = await verify()
    expect(result.stdout).toContain('passed: /components/elements/button/')
    expect(result.requests).toContainEqual({ path: '/components/elements/button/', accept: 'text/markdown', method: 'HEAD' })
    expect(result.requests.some(request => request.accept === 'text/markdown;q=0')).toBe(true)
  })

  it.each([
    ['html-for-agent', 'Content-Type'],
    ['leaked-markdown', 'Content-Type'],
    ['accept-substring', 'Content-Type'],
    ['missing-vary', 'Vary must include Accept'],
    ['cached-markdown', 'Markdown must bypass Cloudflare cache'],
  ])('rejects a broken deployment: %s', async (mode, message) => {
    await expect(verify(mode)).rejects.toMatchObject({ stderr: expect.stringContaining(message) })
  })
})
