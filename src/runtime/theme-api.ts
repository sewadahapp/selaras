import type { ColorModePair, ColorRecipeInput } from './utils/color-registry'
import { normalizeColorRecipe } from './utils/color-registry'
import { dtcgColorToCss } from './utils/dtcg-colors'
import { defineColorFromSeed } from './utils/seed-colors'

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
export type { DtcgColorComponent, DtcgColorConversionOptions, DtcgColorSpace, DtcgResolvedColor } from './utils/dtcg-colors'
export type { FunctionalTokenOverrides, GeometryTokenOverrides, ThemeTokenOverrides } from './utils/functional-tokens'
export type { SeedColorOptions, SeedColorSurfaces } from './utils/seed-colors'
export { dtcgColorToCss }
export { defineColorFromSeed }

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
