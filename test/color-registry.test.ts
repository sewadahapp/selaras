import { describe, expect, it } from 'vitest'
import { assertColorRoleName, createColorRegistry, normalizeColorRecipe } from '../src/runtime/utils/color-registry'

describe('color registry', () => {
  it('normalizes omitted interaction states from the nearest authored state', () => {
    expect(normalizeColorRecipe({
      fill: 'var(--brand-fill)',
      onFill: '#fff',
      subtle: 'var(--brand-subtle)',
      onSubtle: '#111',
      text: 'var(--brand-text)',
      border: 'var(--brand-border)',
    })).toEqual({
      fill: 'var(--brand-fill)',
      fillHover: 'var(--brand-fill)',
      fillPressed: 'var(--brand-fill)',
      onFill: '#fff',
      subtle: 'var(--brand-subtle)',
      subtleHover: 'var(--brand-subtle)',
      subtlePressed: 'var(--brand-subtle)',
      onSubtle: '#111',
      text: 'var(--brand-text)',
      textHover: 'var(--brand-text)',
      textPressed: 'var(--brand-text)',
      border: 'var(--brand-border)',
      focus: 'var(--brand-text)',
    })
  })

  it('preserves explicitly authored states', () => {
    const recipe = normalizeColorRecipe({
      fill: 'fill',
      fillHover: 'hover',
      fillPressed: 'pressed',
      onFill: 'on-fill',
      subtle: 'subtle',
      subtleHover: 'subtle-hover',
      subtlePressed: 'subtle-pressed',
      onSubtle: 'on-subtle',
      text: 'text',
      textHover: 'text-hover',
      textPressed: 'text-pressed',
      border: 'border',
      focus: 'focus',
    })
    expect(recipe.fillPressed).toBe('pressed')
    expect(recipe.focus).toBe('focus')
  })

  it.each(['brand-accent', 'premium2', 'x'])('accepts role name %s', (name) => {
    expect(() => assertColorRoleName(name)).not.toThrow()
  })

  it.each(['Brand', 'brand_accent', '-brand', 'brand accent', '__proto__'])('rejects invalid role name %s', (name) => {
    expect(() => assertColorRoleName(name)).toThrow()
  })

  it('normalizes custom light/dark roles without changing their names', () => {
    const registry = createColorRegistry({
      premium: {
        light: {
          fill: 'light-fill',
          onFill: 'light-on',
          subtle: 'light-subtle',
          onSubtle: 'light-on-subtle',
          text: 'light-text',
          border: 'light-border',
        },
        dark: {
          fill: 'dark-fill',
          onFill: 'dark-on',
          subtle: 'dark-subtle',
          onSubtle: 'dark-on-subtle',
          text: 'dark-text',
          border: 'dark-border',
        },
      },
    })
    expect(registry.premium.light.fill).toBe('light-fill')
    expect(registry.premium.dark.focus).toBe('dark-text')
  })
})
