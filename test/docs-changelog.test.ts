import { execFileSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
import process from 'node:process'
import { describe, expect, it } from 'vitest'
import { changelogHashTarget, parseChangelog, releaseDatesFromMetadata, scopeReleaseHeadings } from '../docs/utils/changelog'
import { localizeChangelogBody } from '../docs/utils/changelog-locale'

describe('documentation changelog', () => {
  it('resolves older release and section permalinks without confusing prerelease tags', () => {
    const releases = parseChangelog('## v2.0.0\n\nLatest.\n\n## v1.0.0\n\nStable.\n\n## v1.0.0-rc.1\n\nPreview.', 'v')
    expect(changelogHashTarget(releases, '#v1.0.0')).toEqual({ id: 'v1.0.0', index: 1 })
    expect(changelogHashTarget(releases, '#v1.0.0-rc.1-fixes')).toEqual({ id: 'v1.0.0-rc.1-fixes', index: 2 })
    expect(changelogHashTarget(releases, '#v1.0.0%2Dfixes')).toEqual({ id: 'v1.0.0-fixes', index: 1 })
    expect(changelogHashTarget(releases, '#missing')).toBeUndefined()
    expect(changelogHashTarget(releases, '#%FF')).toBeUndefined()
  })

  it('preserves release notes and skips version headings inside fenced examples', () => {
    const source = '# Changelog\r\n\r\n## v2.0.0\r\n\r\n### Fixes\r\n\r\n- A [fix](https://example.com).\r\n\r\n````md\r\n## v99.0.0\r\n```\r\n````\r\n\r\n## v1.0.0\r\n\r\n### Breaking Changes\r\n\r\nRead the migration guide.\r\n'
    const releases = parseChangelog(source, 'v')
    expect(releases.map(release => release.version)).toEqual(['2.0.0', '1.0.0'])
    expect(releases[0]!.body).toContain('## v99.0.0\n```\n````')
    expect(releases[0]!.body).toContain('- A [fix](https://example.com).')
    expect(releases[1]!.body).toContain('### Breaking Changes')
  })

  it('supports linked headings, prereleases, verified dates, and an undated offline build', () => {
    const source = '## [v1.2.0-beta.1](https://example.com) (2026-10-21)\n\nPreview.\n\n## v1.1.0 (2026-10-19)\n\nStable.\n\n## v1.0.0\n\nInitial.\n'
    const releases = parseChangelog(source, 'selaras-docs-v', { 'selaras-docs-v1.1.0': '2026-10-20' })
    expect(releases.map(({ tag, date }) => ({ tag, date }))).toEqual([
      { tag: 'selaras-docs-v1.2.0-beta.1', date: '2026-10-21' },
      { tag: 'selaras-docs-v1.1.0', date: '2026-10-20' },
      { tag: 'selaras-docs-v1.0.0', date: undefined },
    ])
    expect(parseChangelog('## v1.0.0 (2026-99-99)\n\nInitial.', 'v')[0]!.date).toBeUndefined()
  })

  it('reads each real package history independently, including v1 upgrade notes', () => {
    const core = parseChangelog(readFileSync(new URL('../CHANGELOG.md', import.meta.url), 'utf8'), 'v')
    const docs = parseChangelog(readFileSync(new URL('../packages/docs/CHANGELOG.md', import.meta.url), 'utf8'), 'selaras-docs-v')
    const mcp = parseChangelog(readFileSync(new URL('../packages/mcp/CHANGELOG.md', import.meta.url), 'utf8'), 'selaras-mcp-v')
    expect(core.find(release => release.version === '1.1.0')!.body).toContain('Add reusable empty states')
    expect(core.find(release => release.version === '1.0.0')!.body).toContain('Migrating to 1.0 guide')
    expect(docs.find(release => release.version === '1.3.3')!.tag).toBe('selaras-docs-v1.3.3')
    expect(mcp.find(release => release.version === '0.1.1')!.tag).toBe('selaras-mcp-v0.1.1')
    expect(docs.every(release => release.tag.startsWith('selaras-docs-v'))).toBe(true)
    expect(new Set(core.map(release => release.tag)).size).toBe(core.length)
  })

  it('localizes editorial release summaries while preserving generated notes and API identifiers', () => {
    const core = parseChangelog(readFileSync(new URL('../CHANGELOG.md', import.meta.url), 'utf8'), 'v')
    const docs = parseChangelog(readFileSync(new URL('../packages/docs/CHANGELOG.md', import.meta.url), 'utf8'), 'selaras-docs-v')
    const coreSummary = core.find(release => release.tag === 'v1.0.0')!.body
    const docsSummary = docs.find(release => release.tag === 'selaras-docs-v1.0.0')!.body
    const localizedCore = localizeChangelogBody(coreSummary, 'v1.0.0', 'id')
    const localizedDocs = localizeChangelogBody(docsSummary, 'selaras-docs-v1.0.0', 'id')

    expect(localizedCore).toContain('Sorotan upgrade')
    expect(localizedCore).toContain('`--selaras-resolved-*`')
    expect(localizedCore).toContain('`v-model:open`/`defaultOpen`')
    expect(localizedCore).toContain('Redesign the homepage around four theming edits')
    expect(localizedDocs).toContain('kompatibel dengan `@sewadah/selaras` versi ^0.3.0.')
    expect(localizedDocs).toContain('Riwayat terperinci sebelum rilis ini tersedia')
    expect(localizeChangelogBody(coreSummary, 'v1.0.0', 'en')).toBe(coreSummary)
  })

  it('ignores drafts, unrelated tags, and unverifiable publication dates', () => {
    expect(releaseDatesFromMetadata([
      { tag_name: 'v1.1.0', published_at: '2026-10-20T04:16:22Z', draft: false },
      { tag_name: 'selaras-docs-v1.3.3', published_at: '2026-10-20T04:16:24Z' },
      { tag_name: 'selaras-mcp-v0.1.1', published_at: '2026-10-20T04:34:34Z' },
      { tag_name: 'v2.0.0', published_at: '2026-10-21T00:00:00Z', draft: true },
      { tag_name: 'other-v1.0.0', published_at: '2026-10-21T00:00:00Z' },
      { tag_name: 'v1.0.0', published_at: null },
      null,
    ])).toEqual({ 'v1.1.0': '2026-10-20', 'selaras-docs-v1.3.3': '2026-10-20', 'selaras-mcp-v0.1.1': '2026-10-20' })
  })

  it('gives repeated section headings and local links unique ids without mutating cached bodies', () => {
    const body = { type: 'root', children: [
      { type: 'element', tag: 'h3', props: { id: 'fixes' }, children: [{ type: 'text', value: '🩹 Fixes' }] },
      { type: 'element', tag: 'a', props: { href: '#fixes' }, children: [{ type: 'text', value: 'See fixes' }] },
    ] }
    const result = scopeReleaseHeadings(body, 'v1.1.0')
    expect(result.children[0].props.id).toBe('v1.1.0-fixes')
    expect(result.children[0].children[0].value).toBe('Fixes')
    expect(result.children[1].props.href).toBe('#v1.1.0-fixes')
    expect(body.children[0]!.props.id).toBe('fixes')
  })

  it('keeps documentation generation usable when GitHub cannot be reached', () => {
    const script = new URL('../scripts/sync-release-dates.mjs', import.meta.url).href
    const output = execFileSync(process.execPath, ['--input-type=module', '--eval', `
      globalThis.fetch = async () => { throw new Error('Offline fixture') }
      console.warn = console.log
      await import(${JSON.stringify(script)})
    `], { encoding: 'utf8' })
    expect(output).toContain('keeping cached dates if available')
  })
})
