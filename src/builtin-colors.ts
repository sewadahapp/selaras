import type { ColorModePair, ColorRecipeInput } from './runtime/utils/color-registry'
import { builtinColorNames, createColorRegistry } from './runtime/utils/color-registry'

const foundationPaletteByRole = {
  primary: 'indigo',
  secondary: 'plum',
  success: 'green',
  info: 'blue',
  warning: 'yellow',
  danger: 'red',
  neutral: 'gray',
} as const satisfies Record<typeof builtinColorNames[number], string>

const fillShadesByRole = {
  primary: { light: [500, 600, 700], dark: [400, 300, 200] },
  secondary: { light: [600, 700, 800], dark: [400, 300, 200] },
  success: { light: [500, 600, 700], dark: [500, 400, 300] },
  info: { light: [600, 700, 800], dark: [500, 400, 300] },
  warning: { light: [500, 600, 700], dark: [500, 400, 300] },
  danger: { light: [500, 600, 700], dark: [500, 400, 300] },
  neutral: { light: [950, 900, 800], dark: [200, 100, 50] },
} as const satisfies Record<typeof builtinColorNames[number], Record<'light' | 'dark', readonly [number, number, number]>>

/** Build-time default recipes read foundations, never a component's legacy bridge. */
export function createBuiltinColorRegistry(classPrefix?: string | null) {
  const foundation = (role: typeof builtinColorNames[number], shade: number) => `var(--${classPrefix ? `${classPrefix}-` : ''}color-selaras-${foundationPaletteByRole[role]}-${shade})`
  const recipes = Object.fromEntries(builtinColorNames.map((role) => {
    const mode = (dark: boolean): ColorRecipeInput => {
      const neutral = role === 'neutral'
      const brightIntent = role === 'success' || role === 'warning' || role === 'danger'
      const modeName = dark ? 'dark' : 'light'
      const [fillShade, hoverShade, pressedShade] = fillShadesByRole[role][modeName]
      const textShade = brightIntent ? 800 : role === 'info' ? 700 : fillShade
      const fill = foundation(role, fillShade)
      const hover = brightIntent
        ? `color-mix(in oklab, ${fill} ${!dark && role === 'danger' ? 98 : 94}%, ${dark ? 'white' : 'black'})`
        : foundation(role, hoverShade)
      const pressed = brightIntent
        ? `color-mix(in oklab, ${fill} ${!dark && role === 'danger' ? 96 : 88}%, ${dark ? 'white' : 'black'})`
        : foundation(role, pressedShade)
      const text = foundation(role, neutral ? dark ? 50 : 950 : dark ? 300 : textShade)
      const subtle = neutral
        ? foundation(role, dark ? 900 : 100)
        : dark
          ? `color-mix(in oklab, ${fill} ${brightIntent ? 16 : 24}%, var(--selaras-resolved-surface-default))`
          : foundation(role, brightIntent ? 50 : 100)
      const indicatorShade = dark
        ? 400
        : role === 'success' || role === 'warning'
          ? 700
          : role === 'danger'
            ? 500
            : fillShade
      const indicator = neutral ? foundation(role, 500) : foundation(role, indicatorShade)
      return {
        fill,
        fillHover: hover,
        fillPressed: pressed,
        // The vivid light-mode intent fills intentionally use white text.
        // Dark mode restores the shared dark foreground on its lighter fills.
        // Consumers can override onFill in their own recipe.
        onFill: brightIntent && !dark ? '#ffffff' : foundation('neutral', dark ? 950 : 25),
        indicator,
        subtle,
        subtleHover: brightIntent
          ? `color-mix(in oklab, ${subtle} 96%, ${text})`
          : dark
            ? `color-mix(in oklab, ${foundation(role, 500)} 32%, var(--selaras-resolved-surface-default))`
            : `color-mix(in oklab, ${subtle} 94%, ${text})`,
        subtlePressed: brightIntent
          ? `color-mix(in oklab, ${subtle} 92%, ${text})`
          : dark
            ? `color-mix(in oklab, ${foundation(role, 500)} 40%, var(--selaras-resolved-surface-default))`
            : `color-mix(in oklab, ${subtle} 90%, ${text})`,
        onSubtle: text,
        text,
        textHover: foundation(role, neutral ? dark ? 100 : 900 : dark ? 200 : Math.min(textShade + 100, 950)),
        textPressed: foundation(role, neutral ? dark ? 200 : 800 : dark ? 100 : Math.min(textShade + 200, 950)),
        border: indicator,
        focus: brightIntent ? indicator : text,
      }
    }
    return [role, { light: mode(false), dark: mode(true) }]
  })) as Record<typeof builtinColorNames[number], ColorModePair<ColorRecipeInput>>
  return createColorRegistry(recipes)
}
