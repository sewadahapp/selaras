import { fileURLToPath } from 'node:url'
import { $fetch, setup } from '@nuxt/test-utils/e2e'
import { describe, expect, it } from 'vitest'

describe('ssr', async () => {
  await setup({
    rootDir: fileURLToPath(new URL('./fixtures/basic', import.meta.url)),
  })

  it('renders the index page', async () => {
    // Get response to a server-rendered page with `$fetch`.
    const html = await $fetch('/')
    expect(html).toContain('<div>basic</div>')
  })

  it('keeps native form attributes on the input and defaults action buttons to type=button', async () => {
    const html = await $fetch('/')
    expect(html).toMatch(/<form id="native-form" action="\/submit" method="post">/)
    expect(html).toMatch(/<input(?=[^>]*id="native-email")(?=[^>]*name="email")(?=[^>]*type="email")(?=[^>]*required)(?=[^>]*autocomplete="email")/)
    expect(html).toMatch(/<button(?=[^>]*id="native-action")(?=[^>]*type="button")/)
    expect(html).toMatch(/<button(?=[^>]*id="native-submit")(?=[^>]*type="submit")/)
  })
})
