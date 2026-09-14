import type { ColorModePair, ColorRecipeInput } from './utils/color-registry'
import { normalizeColorRecipe } from './utils/color-registry'

export type { ThemeComponentRegistry, ThemeConfiguration, ThemeDefaults, ThemeUiOverrides } from './theme-config'
export type {
  BuiltinColorName,
  ColorModePair,
  ColorRecipe,
  ColorRecipeInput,
  ColorRole,
  RuntimeColorOverrides,
  RuntimeThemeMode,
  RuntimeTokenOverrides,
} from './utils/color-registry'
export type { FunctionalTokenOverrides } from './utils/functional-tokens'

/**
 * Validates a build-time semantic color while preserving its literal types.
 * It derives no colors; each mode must provide the six required role leaves.
 */
export function defineColor<const T extends ColorModePair<ColorRecipeInput>>(color: T): T {
  if (!color || typeof color !== 'object' || !color.light || !color.dark)
    throw new Error('defineColor requires both light and dark semantic color recipes.')

  normalizeColorRecipe(color.light)
  normalizeColorRecipe(color.dark)
  return color
}
