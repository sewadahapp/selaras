import { describe, expect, it } from 'vitest'
import { defineColorFromSeed } from '../src/runtime/theme-api'

type Rgb = readonly [number, number, number]

function parseHex(value: string): Rgb {
  return [
    Number.parseInt(value.slice(1, 3), 16) / 255,
    Number.parseInt(value.slice(3, 5), 16) / 255,
    Number.parseInt(value.slice(5, 7), 16) / 255,
  ]
}

function luminance(value: Rgb): number {
  const linear = value.map(component => component <= 0.04045 ? component / 12.92 : ((component + 0.055) / 1.055) ** 2.4)
  return 0.2126 * linear[0]! + 0.7152 * linear[1]! + 0.0722 * linear[2]!
}

function contrast(left: string, right: string): number {
  const leftLuminance = luminance(parseHex(left))
  const rightLuminance = luminance(parseHex(right))
  return (Math.max(leftLuminance, rightLuminance) + 0.05) / (Math.min(leftLuminance, rightLuminance) + 0.05)
}

function expectAccessibleRecipe(recipe: ReturnType<typeof defineColorFromSeed>, surfaces: { light: string, dark: string }) {
  for (const mode of ['light', 'dark'] as const) {
    const color = recipe[mode]
    for (const state of ['fill', 'fillHover', 'fillPressed'] as const) {
      expect(contrast(color[state], color.onFill)).toBeGreaterThanOrEqual(4.5)
      expect(contrast(color[state], surfaces[mode])).toBeGreaterThanOrEqual(3)
    }
    for (const state of ['subtle', 'subtleHover', 'subtlePressed'] as const)
      expect(contrast(color[state], color.onSubtle)).toBeGreaterThanOrEqual(4.5)
    for (const state of ['text', 'textHover', 'textPressed'] as const)
      expect(contrast(color[state], surfaces[mode])).toBeGreaterThanOrEqual(4.5)
    expect(contrast(color.border, surfaces[mode])).toBeGreaterThanOrEqual(3)
    expect(contrast(color.focus, surfaces[mode])).toBeGreaterThanOrEqual(3)
  }
}

describe('seed color helper', () => {
  it('normalizes the roadmap seed into a complete two-mode recipe with guarded contrast', () => {
    const recipe = defineColorFromSeed('#FD5E53')

    expect(recipe.light).toMatchObject({
      fill: '#f6584d',
      fillHover: '#ea4c43',
      fillPressed: '#de4039',
      onFill: '#000000',
      subtle: '#ffeeec',
      onSubtle: '#c52423',
    })
    expect(recipe.dark).toMatchObject({
      fill: '#fd5e53',
      fillHover: '#ff7b6e',
      fillPressed: '#ff9589',
      onFill: '#000000',
      subtle: '#1d1314',
      onSubtle: '#fd5e53',
    })
    expect(Object.keys(recipe.light)).toHaveLength(13)
    expect(Object.values(recipe.light).every(value => /^#[0-9a-f]{6}$/i.test(value))).toBe(true)
    expectAccessibleRecipe(recipe, { light: '#fdfdfe', dark: '#090a0d' })
  })

  it('derives against explicit known surfaces without changing the explicit recipe path', () => {
    const surfaces = { light: '#f4f0e8', dark: '#20242a' }
    const recipe = defineColorFromSeed('#6750A4', { surfaces })

    expectAccessibleRecipe(recipe, surfaces)
    expect(recipe.light.subtle).not.toBe(defineColorFromSeed('#6750A4').light.subtle)
  })

  it('rejects unresolved, translucent and underconstrained inputs with an explicit-recipe escape hatch', () => {
    for (const seed of ['red', '#fff', '#11223380', 'var(--brand)'])
      expect(() => defineColorFromSeed(seed)).toThrow('opaque six-digit sRGB')
    expect(() => defineColorFromSeed('#88744F', { surfaces: { light: '#777777', dark: '#888888' } })).toThrow(/cannot derive the (light|dark) (fill|text\/subtle|border) family.*explicit defineColor/)
  })
})
