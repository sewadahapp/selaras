import { describe, expect, it } from 'vitest'
import { createBuiltinColorRegistry } from '../src/builtin-colors'
import { builtinColorNames } from '../src/runtime/utils/color-registry'

describe('built-in semantic defaults', () => {
  it('covers every role in both modes without reading remapped legacy color variables', () => {
    const registry = createBuiltinColorRegistry()
    expect(Object.keys(registry)).toEqual([...builtinColorNames])
    expect(registry.primary.light.fill).toBe('var(--color-selaras-indigo-500)')
    expect(registry.warning.light.onFill).toBe('var(--color-selaras-gray-950)')
    expect(registry.neutral.light.fill).toBe('var(--color-selaras-gray-950)')
    expect(registry.neutral.dark.fill).toBe('var(--color-selaras-gray-50)')
    expect(JSON.stringify(registry)).not.toMatch(/--ui-(?:primary|secondary|success|info|warning|danger|neutral)/)
  })

  it('uses the consumer foundation prefix in all modes and preserves opaque dark subtle surfaces', () => {
    const registry = createBuiltinColorRegistry('tw')
    expect(registry.primary.light.fill).toBe('var(--tw-color-selaras-indigo-500)')
    expect(registry.primary.dark.subtle).toBe('color-mix(in oklab, var(--tw-color-selaras-indigo-500) 24%, var(--ui-bg))')
    expect(registry.neutral.dark.border).toBe('var(--tw-color-selaras-gray-800)')
  })
})
