import type { DtcgColorRoleGroup } from '../src/runtime/utils/dtcg-colors'
import { describe, expect, it } from 'vitest'
import { createColorRegistryFromDtcg } from '../src/runtime/utils/dtcg-colors'

function role(fill: string): DtcgColorRoleGroup {
  return {
    'fill': { $type: 'color' as const, $value: fill },
    'on-fill': { $value: '#fff' },
    'subtle': { $value: '#eee' },
    'on-subtle': { $value: '#111' },
    'text': { $value: '#123' },
    'border': { $value: '#456' },
  }
}

describe('dtcg color adapter', () => {
  it('imports explicit light/dark semantic groups and normalizes states', () => {
    const registry = createColorRegistryFromDtcg({ light: { premium: role('#5134a8') }, dark: { premium: role('#a78bfa') } })
    expect(registry.premium!.light.fill).toBe('#5134a8')
    expect(registry.premium!.dark.fillHover).toBe('#a78bfa')
  })

  it('serializes supported structured sRGB values to CSS color()', () => {
    const structured = role('#5134a8')
    structured.fill!.$value = { colorSpace: 'srgb', components: [0.1, 0.2, 0.3], alpha: 0.8 }
    const registry = createColorRegistryFromDtcg({ light: { premium: structured }, dark: { premium: role('#a78bfa') } })
    expect(registry.premium!.light.fill).toBe('color(srgb 0.1 0.2 0.3 / 0.8)')
  })

  it('rejects aliases and missing dark roles instead of pretending to resolve them', () => {
    expect(() => createColorRegistryFromDtcg({ light: { premium: role('{palette.purple}') }, dark: { premium: role('#a78bfa') } })).toThrow(/alias/)
    expect(() => createColorRegistryFromDtcg({ light: { premium: role('#5134a8') }, dark: {} })).toThrow(/both light and dark/)
  })
})
