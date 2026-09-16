import { describe, expect, it } from 'vitest'
import { assertColorRoleName, createColorRegistry, generateColorRoleCss, generateRuntimeTokenOverrideCss, mergeRuntimeTokenOverrides, normalizeColorRecipe } from '../src/runtime/utils/color-registry'

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
      fillHover: 'var(--_selaras-color-fill)',
      fillPressed: 'var(--_selaras-color-fill-hover)',
      onFill: '#fff',
      subtle: 'var(--brand-subtle)',
      subtleHover: 'var(--_selaras-color-subtle)',
      subtlePressed: 'var(--_selaras-color-subtle-hover)',
      onSubtle: '#111',
      text: 'var(--brand-text)',
      textHover: 'var(--_selaras-color-text)',
      textPressed: 'var(--_selaras-color-text-hover)',
      border: 'var(--brand-border)',
      focus: 'var(--_selaras-color-text)',
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
    expect(registry.premium.dark.focus).toBe('var(--_selaras-color-text)')
  })

  it('generates deterministic public reads and private selected bindings for registered roles', () => {
    const registry = createColorRegistry({
      premium: {
        light: { fill: 'light-fill', onFill: 'light-on', subtle: 'light-subtle', onSubtle: 'light-on-subtle', text: 'light-text', border: 'light-border' },
        dark: { fill: 'dark-fill', onFill: 'dark-on', subtle: 'dark-subtle', onSubtle: 'dark-on-subtle', text: 'dark-text', border: 'dark-border' },
      },
    })
    const css = generateColorRoleCss(registry)
    expect(css).toContain('[data-selaras-color="premium"]')
    expect(css).toContain(':root,\n[data-selaras-theme]')
    expect(css).toContain('--selaras-resolved-color-premium-fill: var(--selaras-color-premium-fill, light-fill);')
    expect(css).toContain('--_selaras-color-fill: var(--selaras-color-premium-fill, var(--selaras-resolved-color-premium-fill));')
    expect(css).not.toContain('--selaras-color-role-')
    expect(css).toContain(':root.dark [data-selaras-theme]')
    expect(css).toContain('--selaras-resolved-color-premium-fill: var(--selaras-color-premium-fill, dark-fill);')
    expect(css.endsWith('\n')).toBe(true)
  })

  it('keeps omitted-state dependencies within their role and emits only changed dark reads', () => {
    const light = { fill: 'shared-fill', onFill: 'shared-on', subtle: 'light-subtle', onSubtle: 'shared-text', text: 'shared-text', border: 'shared-border' }
    const css = generateColorRoleCss(createColorRegistry({ premium: { light, dark: { ...light, subtle: 'dark-subtle' } } }))
    const [base, dark, selected] = css.split('\n\n')
    expect(base).toContain('--selaras-resolved-color-premium-fill: var(--selaras-color-premium-fill, shared-fill);')
    expect(base).toContain('--selaras-resolved-color-premium-subtle-hover: var(--selaras-color-premium-subtle-hover, var(--selaras-resolved-color-premium-subtle));')
    expect(dark).toContain('--selaras-resolved-color-premium-subtle: var(--selaras-color-premium-subtle, dark-subtle);')
    expect(dark).not.toContain('--selaras-resolved-color-premium-fill:')
    expect(dark).not.toContain('--selaras-resolved-color-premium-subtle-hover:')
    expect(selected).toContain('--_selaras-color-subtle-hover: var(--selaras-color-premium-subtle-hover, var(--selaras-resolved-color-premium-subtle-hover));')
    expect(generateColorRoleCss(createColorRegistry({ premium: { light, dark: light } }))).not.toContain('.dark')
  })

  it('keeps external recipe expressions in owner-local public reads', () => {
    const recipe = { fill: 'var(--company-brand-10)', onFill: '#fff', subtle: '#eee', onSubtle: '#111', text: '#333', border: '#555' }
    const css = generateColorRoleCss(createColorRegistry({ brand: { light: recipe, dark: { ...recipe, fill: 'var(--company-brand-dark-10)' } } }))
    expect(css).toContain('--selaras-resolved-color-brand-fill: var(--selaras-color-brand-fill, var(--company-brand-10));')
    expect(css).toContain('--selaras-resolved-color-brand-fill: var(--selaras-color-brand-fill, var(--company-brand-dark-10));')
    expect(css).toContain('--_selaras-color-fill: var(--selaras-color-brand-fill, var(--selaras-resolved-color-brand-fill));')
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
    const css = generateRuntimeTokenOverrideCss({
      light: { colors: { premium: { fill: '#5134a8', fillHover: 'var(--brand-hover)' } } },
      dark: { colors: { premium: { fill: '#a78bfa' } } },
    })
    expect(css).toContain('[data-selaras-theme="global"]')
    expect(css).toContain('--selaras-color-premium-fill-hover: var(--brand-hover);')
    expect(css).toContain('[data-selaras-mode="light"]')
    expect(css).toContain(':root.dark [data-selaras-theme="global"]')
    expect(css).toContain(':root {\n  --selaras-color-premium-fill: #5134a8;')
    expect(css).toContain(':root.dark {\n  --selaras-color-premium-fill: #a78bfa;')
    expect(() => generateRuntimeTokenOverrideCss({ light: { colors: { premium: { fill: 'red; color: blue' } } } })).toThrow()
  })

  it('inherits untouched modes, roles and leaves without mutating or resolving authored values', () => {
    const parent = {
      light: { colors: { premium: { fill: '#123456', subtle: 'var(--local-subtle)' }, primary: { text: '#654321' } } },
      dark: { colors: { premium: { subtle: '#112233' } } },
    }
    const local = { light: { colors: { premium: { fill: '#abcdef', subtle: undefined } } } }
    const merged = mergeRuntimeTokenOverrides(parent, local)
    expect(merged).toEqual({
      light: { colors: { premium: { fill: '#abcdef', subtle: 'var(--local-subtle)' }, primary: { text: '#654321' } } },
      dark: { colors: { premium: { subtle: '#112233' } } },
    })
    expect(parent.light.colors.premium.fill).toBe('#123456')
    expect(merged.light?.colors?.premium).not.toBe(parent.light.colors.premium)
  })

  it('targets exact managed owners instead of broad descendants', () => {
    const css = generateRuntimeTokenOverrideCss({ light: { colors: { premium: { fill: '#5134a8' } } } }, '[data-selaras-theme="scope"] ')
    expect(css).toContain('[data-selaras-theme="scope"]:where(')
    expect(css).not.toContain('[data-selaras-theme="scope"] ')
    expect(css).toContain('--selaras-color-premium-fill: initial;')
  })

  it('inherits functional leaves independently of roles and preserves opposite-mode values', () => {
    const parent = {
      light: { surface: { default: 'var(--company-surface)', elevated: '#eeeeee' }, text: { muted: '#555555' } },
      dark: { surface: { default: '#111111' }, border: { default: '#777777' }, scrim: 'rgb(1 2 3 / .6)' },
    }
    const merged = mergeRuntimeTokenOverrides(parent, {
      light: { surface: { default: undefined, elevated: '#dddddd' }, colors: { primary: { fill: '#123456' } } },
    })
    expect(merged).toEqual({
      light: { surface: { default: 'var(--company-surface)', elevated: '#dddddd' }, text: { muted: '#555555' }, colors: { primary: { fill: '#123456' } } },
      dark: parent.dark,
    })
    expect(parent.light.surface.elevated).toBe('#eeeeee')
    expect(merged.dark?.surface).not.toBe(parent.dark.surface)
  })

  it('rematerializes functional inputs and invalidates opposite-mode-only inherited leaves', () => {
    const css = generateRuntimeTokenOverrideCss({
      light: { surface: { default: 'var(--company-surface)' }, border: { hover: '#123456' } },
      dark: { text: { muted: '#eeeeee' }, scrim: 'rgb(1 2 3 / .6)' },
    }, '[data-selaras-theme="scope"]')
    const [light, dark] = css.split('\n\n')
    expect(light).toContain('--selaras-surface-default: var(--company-surface);')
    expect(light).toContain('--selaras-text-muted: initial;')
    expect(dark).toContain('--selaras-surface-default: initial;')
    expect(dark).toContain('--selaras-scrim: rgb(1 2 3 / .6);')
    expect(() => generateRuntimeTokenOverrideCss({ dark: { surface: { default: 'red; color: blue' } } })).toThrow()
    expect(() => generateRuntimeTokenOverrideCss({ light: { scrim: '' } })).toThrow(/non-empty/)
  })

  it('serializes scoped geometry inputs with the same mode isolation as functional colors', () => {
    const css = generateRuntimeTokenOverrideCss({
      light: { radius: { base: '6px' }, shadow: { md: '0 2px 4px rgb(0 0 0 / .2)' }, zIndex: { dropdown: '91' } },
      dark: { radius: { full: '1rem' } },
    }, '[data-selaras-theme="scope"]')
    const [light, dark] = css.split('\n\n')
    expect(light).toContain('--selaras-radius-base: 6px;')
    expect(light).toContain('--selaras-radius-full: initial;')
    expect(light).toContain('--selaras-shadow-md: 0 2px 4px rgb(0 0 0 / .2);')
    expect(light).toContain('--selaras-z-dropdown: 91;')
    expect(dark).toContain('--selaras-radius-base: initial;')
    expect(dark).toContain('--selaras-radius-full: 1rem;')
    expect(() => generateRuntimeTokenOverrideCss({ light: { zIndex: { dropdown: '1; color: red' } } })).toThrow()
  })
})
