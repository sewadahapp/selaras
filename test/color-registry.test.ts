import { describe, expect, it } from 'vitest'
import { assertColorRoleName, createColorRegistry, customStatusColorRoleStyle, generateColorRoleCss, generateRuntimeColorOverrideCss, mergeRuntimeTokenOverrides, normalizeColorRecipe } from '../src/runtime/utils/color-registry'

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

  it.each(['fill', 'onFill', 'subtle', 'onSubtle', 'text', 'border'] as const)('reports a missing required recipe field: %s', (field) => {
    const recipe = {
      fill: 'fill',
      onFill: 'on-fill',
      subtle: 'subtle',
      onSubtle: 'on-subtle',
      text: 'text',
      border: 'border',
    }
    delete recipe[field]
    expect(() => normalizeColorRecipe(recipe as never)).toThrow(`"${field}" must be a non-empty string`)
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

  it('generates deterministic light/dark private bindings for registered roles', () => {
    const registry = createColorRegistry({
      premium: {
        light: { fill: 'light-fill', onFill: 'light-on', subtle: 'light-subtle', onSubtle: 'light-on-subtle', text: 'light-text', border: 'light-border' },
        dark: { fill: 'dark-fill', onFill: 'dark-on', subtle: 'dark-subtle', onSubtle: 'dark-on-subtle', text: 'dark-text', border: 'dark-border' },
      },
    })
    const css = generateColorRoleCss(registry)
    expect(css).toContain('[data-selaras-color="premium"]')
    expect(css).toContain('--selaras-color-role-fill: light-fill;')
    expect(css).toContain('--_selaras-color-fill: var(--selaras-color-role-fill);')
    expect(css).toContain('.dark [data-selaras-color="premium"]')
    expect(css).toContain('--selaras-color-role-fill: dark-fill;')
    expect(css.endsWith('\n')).toBe(true)
  })

  it('sorts role output and rejects unsafe generated selectors', () => {
    const make = (fill: string) => ({ light: { fill, onFill: 'on', subtle: 'subtle', onSubtle: 'on-subtle', text: 'text', border: 'border' }, dark: { fill, onFill: 'on', subtle: 'subtle', onSubtle: 'on-subtle', text: 'text', border: 'border' } })
    const css = generateColorRoleCss(createColorRegistry({ zebra: make('z'), alpha: make('a') }))
    expect(css.indexOf('alpha')).toBeLessThan(css.indexOf('zebra'))
    const invalid = make('x')
    const normalizedInvalid = { light: normalizeColorRecipe(invalid.light), dark: normalizeColorRecipe(invalid.dark) }
    expect(() => generateColorRoleCss({ 'bad role': normalizedInvalid })).toThrow()
  })

  it('serializes runtime light/dark overrides without allowing declaration injection', () => {
    const css = generateRuntimeColorOverrideCss({
      light: { premium: { fill: '#5134a8', fillHover: 'var(--brand-hover)' } },
      dark: { premium: { fill: '#a78bfa' } },
    })
    expect(css).toContain('[data-selaras-color="premium"]')
    expect(css).toContain('--selaras-color-role-fill-hover: var(--brand-hover);')
    expect(css).toContain('.dark [data-selaras-color="premium"]')
    expect(() => generateRuntimeColorOverrideCss({ light: { premium: { fill: 'red; color: blue' } } })).toThrow()
  })

  it('inherits untouched modes, roles and leaves without mutating or resolving authored values', () => {
    const parent = {
      light: { premium: { fill: '#123456', subtle: 'var(--local-subtle)' }, primary: { text: '#654321' } },
      dark: { premium: { subtle: '#112233' } },
    }
    const local = { light: { premium: { fill: '#abcdef', subtle: undefined } } }
    const merged = mergeRuntimeTokenOverrides(parent, local)
    expect(merged).toEqual({
      light: { premium: { fill: '#abcdef', subtle: 'var(--local-subtle)' }, primary: { text: '#654321' } },
      dark: { premium: { subtle: '#112233' } },
    })
    expect(parent.light.premium.fill).toBe('#123456')
    expect(merged.light?.premium).not.toBe(parent.light.premium)
  })

  it('supports a scoped color marker on the scope root itself or a descendant', () => {
    const css = generateRuntimeColorOverrideCss({ light: { premium: { fill: '#5134a8' } } }, '[data-selaras-theme="scope"] ')
    expect(css).toContain('[data-selaras-theme="scope"][data-selaras-color="premium"],')
    expect(css).toContain('[data-selaras-theme="scope"] [data-selaras-color="premium"]')
  })

  it('maps custom roles onto status-only info recipe variables', () => {
    expect(customStatusColorRoleStyle('premium')).toEqual({
      '--ui-info': 'var(--_selaras-color-fill)',
      '--ui-info-foreground': 'var(--_selaras-color-on-fill)',
      '--ui-info-soft': 'var(--_selaras-color-subtle)',
    })
    expect(customStatusColorRoleStyle('info')).toBeUndefined()
  })
})
