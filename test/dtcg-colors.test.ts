import type { DtcgResolvedColor } from '../src/runtime/utils/dtcg-colors'
import { describe, expect, it } from 'vitest'
import { dtcgColorToCss } from '../src/runtime/utils/dtcg-colors'

describe('resolved DTCG color converter', () => {
  it('serializes supported sRGB and linear sRGB values without changing their components', () => {
    expect(dtcgColorToCss({ colorSpace: 'srgb', components: [0.1, 0.2, 0.3], alpha: 0.8, hex: '#1a334d' })).toBe('color(srgb 0.1 0.2 0.3 / 0.8)')
    expect(dtcgColorToCss({ colorSpace: 'srgb-linear', components: [0, 0.5, 1] })).toBe('color(srgb-linear 0 0.5 1)')
  })

  it('serializes the owned OKLCH representation with CSS OKLCH syntax', () => {
    const value = { colorSpace: 'oklch', components: [0.7016, 0.3225, 328.363], alpha: 1, hex: '#ff00ff' } satisfies DtcgResolvedColor
    expect(dtcgColorToCss(value)).toBe('oklch(0.7016 0.3225 328.363 / 1)')
    expect(dtcgColorToCss({ colorSpace: 'oklch', components: [0.7, 'none', 'none'] })).toBe('oklch(0.7 none none)')
  })

  it('rejects unresolved forms, malformed payloads and unsupported spaces with source paths', () => {
    expect(() => dtcgColorToCss('{palette.purple}', { path: 'semantic.fill.$value' })).toThrow('semantic.fill.$value')
    expect(() => dtcgColorToCss({ colorSpace: 'display-p3', components: [1, 0, 1] }, { path: 'palette.brand' })).toThrow(/palette\.brand.*unsupported colorSpace/)
    expect(() => dtcgColorToCss({ colorSpace: 'srgb', components: [1, 0, 1], alpha: 'none' }, { path: 'palette.brand' })).toThrow(/palette\.brand\.alpha/)
    expect(() => dtcgColorToCss({ colorSpace: 'srgb', components: [1, 0, 1], hex: '#fff' })).toThrow(/\.hex/)
    expect(() => dtcgColorToCss({ colorSpace: 'oklch', components: [1.1, 0.2, 20] })).toThrow(/components\[0\]/)
    expect(() => dtcgColorToCss({ colorSpace: 'oklch', components: [0.7, 0.2, 360] })).toThrow(/components\[2\]/)
  })
})
