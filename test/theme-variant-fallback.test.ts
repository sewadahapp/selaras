import { tv } from 'tailwind-variants'
import { describe, expect, it } from 'vitest'
import { buttonTheme } from '../src/runtime/theme/button'
import { withVariantFallback } from '../src/runtime/utils/ui'

describe('theme runtime variant fallback', () => {
  it('keeps valid values and falls back to the theme default for unknown variants and sizes', () => {
    const theme = withVariantFallback(buttonTheme, 'button')
    const defaults = buttonTheme({ variant: 'solid', size: 'md' })

    expect(theme({ variant: 'ghost', size: 'md' }).base()).toBe(buttonTheme({ variant: 'ghost', size: 'md' }).base())
    expect(theme({ variant: 'unknown', size: 'md' } as any).base()).toBe(defaults.base())
    expect(theme({ variant: 'solid', size: 'nope' } as any).base()).toBe(defaults.base())
  })

  it('accepts values added by a component theme override', () => {
    const extended = tv({
      extend: buttonTheme,
      variants: { variant: { futuristic: { base: 'futuristic-class' } } },
    })
    const theme = withVariantFallback(extended, 'button')

    expect(theme({ variant: 'futuristic', size: 'md' }).base()).toContain('futuristic-class')
  })

  it('accepts a custom value declared by a compound variant', () => {
    const extended = tv({
      extend: buttonTheme,
      compoundVariants: [{ variant: 'custom', class: { base: 'custom-class' } }] as any,
    })
    const theme = withVariantFallback(extended, 'button')

    expect(theme({ variant: 'custom', size: 'md' } as any).base()).toContain('custom-class')
  })
})
