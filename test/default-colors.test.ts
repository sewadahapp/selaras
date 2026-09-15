import { readFile } from 'node:fs/promises'
import { describe, expect, it } from 'vitest'
import { generateDefaultColorCss } from '../scripts/generate-default-colors.mjs'
import { createBuiltinColorRegistry } from '../src/builtin-colors'

const sourceUrl = new URL('../src/tokens/default-colors.tokens.json', import.meta.url)
const cssUrl = new URL('../src/runtime/default-colors.css', import.meta.url)

describe('owned default color source', () => {
  it('generates the checked-in Tailwind foundations from one portable DTCG document', async () => {
    const document = JSON.parse(await readFile(sourceUrl, 'utf8'))
    const css = await readFile(cssUrl, 'utf8')

    expect(document.color.$type).toBe('color')
    expect(generateDefaultColorCss(document)).toBe(css)
    expect([...css.matchAll(/--color-selaras-[a-z-]+-\d+/g)]).toHaveLength(78)
    expect(css).not.toMatch(/--color-(?:primary|secondary|success|info|warning|danger|neutral)-/)
  })

  it('keeps semantic roles separate from their owned foundation palette names', () => {
    const registry = createBuiltinColorRegistry()

    expect(registry.primary.light.fill).toBe('var(--color-selaras-indigo-500)')
    expect(registry.secondary.light.fill).toBe('var(--color-selaras-plum-600)')
    expect(registry.success.light.fill).toBe('var(--color-selaras-emerald-700)')
    expect(registry.warning.light.onFill).toBe('var(--color-selaras-gray-950)')
    expect(JSON.stringify(registry)).not.toMatch(/--color-(?:primary|secondary|success|info|warning|danger|neutral)-/)
  })

  it('rejects malformed source values instead of emitting invalid CSS', () => {
    expect(() => generateDefaultColorCss({ color: { $type: 'color', palette: { bad: { 500: { $value: '{alias}' } } } } })).toThrow('color.palette.bad.500.$value')
    expect(() => generateDefaultColorCss({ color: { $type: 'dimension', palette: {} } })).toThrow('color.$type')
  })
})
