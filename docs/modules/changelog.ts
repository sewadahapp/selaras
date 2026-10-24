import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { addTemplate, defineNuxtModule } from '@nuxt/kit'
import { parseChangelog } from '../utils/changelog'

export default defineNuxtModule({
  meta: { name: 'selaras-docs-changelog' },
  setup(_options, nuxt) {
    const root = resolve(nuxt.options.rootDir, '..')
    addTemplate({
      filename: 'selaras-changelog.json',
      write: true,
      getContents() {
        let dates: Record<string, string> = {}
        try {
          dates = JSON.parse(readFileSync(resolve(nuxt.options.rootDir, '.cache/release-dates.json'), 'utf8'))
        }
        catch {
          // Changelog notes remain available in offline builds without cached dates.
        }
        const packages = [
          { id: 'core', name: '@sewadah/selaras', label: 'Selaras', description: 'Components, theming, and the Nuxt module.', path: '/changelog', source: 'CHANGELOG.md', prefix: 'v' },
          { id: 'docs', name: '@sewadah/selaras-docs', label: 'Docs layer', description: 'The reusable documentation layer.', path: '/changelog/docs', source: 'packages/docs/CHANGELOG.md', prefix: 'selaras-docs-v' },
          { id: 'mcp', name: '@sewadah/selaras-mcp', label: 'MCP server', description: 'Component discovery and documentation for agents.', path: '/changelog/mcp', source: 'packages/mcp/CHANGELOG.md', prefix: 'selaras-mcp-v' },
        ].map(({ prefix, ...pkg }) => ({
          ...pkg,
          releases: parseChangelog(readFileSync(resolve(root, pkg.source), 'utf8'), prefix, dates),
        }))
        return JSON.stringify(packages)
      },
    })
  },
})
