import { readdirSync, readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'

const runtime = fileURLToPath(new URL('../src/runtime/', import.meta.url))
const registry = readFileSync(`${runtime}theme-config.ts`, 'utf8')
const declaration = registry.split('export interface ThemeComponentRegistry {')[1]!.split('\ntype ThemeConditions')[0]!
const registered = new Set([...declaration.matchAll(/^ {2}(\w+): \{/gm)].map(match => match[1]))
const sources = ['components', 'internal'].flatMap(directory =>
  readdirSync(`${runtime}${directory}`).filter(file => file.endsWith('.vue')).map(file => readFileSync(`${runtime}${directory}/${file}`, 'utf8')),
)
const consumed = new Set(sources.flatMap(source => [...source.matchAll(/useComponentTheme\('([^']+)'/g)].map(match => match[1])))

describe('finite theme registry inventory', () => {
  it('covers every runtime recipe except explicitly deferred dashboard contracts', () => {
    expect([...consumed].filter(key => !registered.has(key)).sort()).toEqual([
      'dashboardGroup',
      'dashboardNavbar',
      'dashboardPanel',
      'dashboardResizeHandle',
      'dashboardSidebar',
    ])
    expect([...registered].filter(key => !consumed.has(key))).toEqual([])
  })

  it('only declares defaults for components that actually consume them', () => {
    const defaults = [...declaration.matchAll(/^ {2}(\w+): \{[^}]*?\bdefaults:/gm)].map(match => match[1]).sort()
    const readers = [...new Set(sources.flatMap(source => [...source.matchAll(/useThemeProps\('([^']+)'/g)].map(match => match[1])))].sort()
    expect(defaults).toEqual(readers)
  })
})
