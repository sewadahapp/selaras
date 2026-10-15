import { describe, expect, it } from 'vitest'
import { docsCanonicalUrl, docsPageTitle, docsPathWithoutBase } from '../docs/utils/seo'

describe('documentation canonical URLs', () => {
  it('keeps the deployment prefix and removes tracking queries and fragments', () => {
    expect(docsCanonicalUrl('/components/forms/select?source=search#usage', 'https://sewadahapp.github.io', '/selaras/'))
      .toBe('https://sewadahapp.github.io/selaras/components/forms/select/')
  })

  it('supports a root deployment on a custom domain', () => {
    expect(docsCanonicalUrl('/design-kit/', 'https://docs.example.com', '/'))
      .toBe('https://docs.example.com/design-kit/')
  })

  it('preserves the homepage trailing slash', () => {
    expect(docsCanonicalUrl('/', 'https://sewadahapp.github.io', '/selaras/'))
      .toBe('https://sewadahapp.github.io/selaras/')
  })

  it('points legacy pages to their current documentation URL', () => {
    expect(docsCanonicalUrl('/overview/introduction', 'https://sewadahapp.github.io', '/selaras/'))
      .toBe('https://sewadahapp.github.io/selaras/overview/getting-started/introduction/')
  })

  it('removes a deployment prefix exactly once from sitemap discovery', () => {
    expect(docsPathWithoutBase('/selaras', '/selaras/')).toBe('/')
    expect(docsPathWithoutBase('/selaras/design-kit', '/selaras/')).toBe('/design-kit')
    expect(docsPathWithoutBase('/design-kit', '/selaras/')).toBe('/design-kit')
    expect(docsPathWithoutBase('/selaras-other', '/selaras/')).toBe('/selaras-other')
    expect(docsPathWithoutBase('https://example.com/selaras/design-kit', '/selaras/')).toBe('https://example.com/selaras/design-kit')
    expect(docsPathWithoutBase('/design-kit', '/')).toBe('/design-kit')
  })

  it('brands page titles once and leaves the homepage title intact', () => {
    expect(docsPageTitle('Design kit')).toBe('Design kit — Selaras')
    expect(docsPageTitle('Selaras')).toBe('Selaras')
  })
})
