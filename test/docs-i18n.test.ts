import type { DocsNavigationNode } from '../packages/docs/app/utils/docs-navigation'
import { describe, expect, it } from 'vitest'
import { docsContentPath, docsDefaultContentPath, docsIsLocalizedContentPath, docsLocalizedContentPath } from '../packages/docs/app/utils/content-path'
import { docsMessages, formatDocsMessage, resolveDocsMessages } from '../packages/docs/app/utils/docs-messages'
import { applyDocsTranslatedTitles, withoutDocsLocaleFolders } from '../packages/docs/app/utils/docs-navigation'

describe('documentation locale content paths', () => {
  it('keeps the default locale at the content root', () => {
    expect(docsLocalizedContentPath('/components/elements/button', 'en')).toBe('/components/elements/button')
    expect(docsLocalizedContentPath('/', 'en')).toBe('/')
  })

  it('maps a public path to the locale folder without changing the URL', () => {
    expect(docsLocalizedContentPath('/components/elements/button', 'id')).toBe('/id/components/elements/button')
    expect(docsLocalizedContentPath('/components/elements/button/', 'id')).toBe('/id/components/elements/button')
    expect(docsLocalizedContentPath('/', 'id')).toBe('/id')
    expect(docsLocalizedContentPath('/components/elements/button', 'id', 'id')).toBe('/components/elements/button')
  })

  it('strips a locale folder back to the canonical content path', () => {
    expect(docsDefaultContentPath('/id/components/elements/button', 'id')).toBe('/components/elements/button')
    expect(docsDefaultContentPath('/id', 'id')).toBe('/')
    expect(docsDefaultContentPath('/components/elements/button', 'id')).toBe('/components/elements/button')
    // A route that only shares a prefix with the locale code is not localized.
    expect(docsDefaultContentPath('/identity', 'id')).toBe('/identity')
    expect(docsContentPath('/overview/')).toBe('/overview')
  })

  it('detects localized content paths by folder segment', () => {
    expect(docsIsLocalizedContentPath('/id', 'id')).toBe(true)
    expect(docsIsLocalizedContentPath('/id/overview', 'id')).toBe(true)
    expect(docsIsLocalizedContentPath('/identity', 'id')).toBe(false)
    expect(docsIsLocalizedContentPath('/overview', 'id')).toBe(false)
  })
})

describe('documentation UI messages', () => {
  const locales = Object.keys(docsMessages)

  it('ships English and Indonesian copy', () => {
    expect(locales).toContain('en')
    expect(locales).toContain('id')
  })

  it('keeps the same keys in every locale', () => {
    const expected = Object.keys(docsMessages.en!).sort()
    for (const locale of locales)
      expect(Object.keys(docsMessages[locale]!).sort(), locale).toEqual(expected)
  })

  it('has non-empty copy, including placeholders, in every locale', () => {
    for (const locale of locales) {
      for (const [key, value] of Object.entries(docsMessages[locale]!)) {
        expect(typeof value, `${locale}.${key}`).toBe('string')
        expect((value as string).trim(), `${locale}.${key}`).not.toBe('')
        const expectedPlaceholders = [...String((docsMessages.en as Record<string, string>)[key]).matchAll(/\{(\w+)\}/g)].map(match => match[1]).sort()
        const actualPlaceholders = [...(value as string).matchAll(/\{(\w+)\}/g)].map(match => match[1]).sort()
        expect(actualPlaceholders, `${locale}.${key}`).toEqual(expectedPlaceholders)
      }
    }
  })

  it('falls back to English and applies per-locale overrides', () => {
    expect(resolveDocsMessages('fr').skipToContent).toBe('Skip to content')
    expect(resolveDocsMessages('id').skipToContent).toBe('Lewati ke konten')
    expect(resolveDocsMessages('id', 'en', { skipToContent: 'Langsung ke isi' }).skipToContent).toBe('Langsung ke isi')
  })

  it('formats named placeholders', () => {
    expect(formatDocsMessage('Switch to {language}', { language: 'Bahasa Indonesia' })).toBe('Switch to Bahasa Indonesia')
    expect(formatDocsMessage('Keep {unknown}', {})).toBe('Keep {unknown}')
  })
})

describe('documentation locale navigation', () => {
  const tree: DocsNavigationNode[] = [
    {
      title: 'Components',
      path: '/components',
      children: [
        { title: 'Button', path: '/components/button' },
        { title: 'Calendar', path: '/components/calendar' },
      ],
    },
    { title: 'Id', path: '/id', children: [{ title: 'Tombol', path: '/id/components/button' }] },
  ]

  it('removes locale folders from the default navigation tree', () => {
    const result = withoutDocsLocaleFolders(tree, ['id'])
    expect(result.map(node => node.path)).toEqual(['/components'])
    expect(result[0]!.children?.map(node => node.path)).toEqual(['/components/button', '/components/calendar'])
  })

  it('applies translated titles while keeping the default structure', () => {
    const result = applyDocsTranslatedTitles(tree, new Map([['/components/button', 'Tombol']]))
    expect(result[0]!.children).toEqual([
      { title: 'Tombol', path: '/components/button' },
      { title: 'Calendar', path: '/components/calendar' },
    ])
  })
})
