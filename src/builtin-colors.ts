import type { ColorModePair, ColorRecipeInput } from './runtime/utils/color-registry'
import { builtinColorNames, createColorRegistry } from './runtime/utils/color-registry'

const foundationPaletteByRole = {
  primary: 'indigo',
  secondary: 'plum',
  success: 'emerald',
  info: 'blue',
  warning: 'amber',
  danger: 'red',
  neutral: 'gray',
} as const satisfies Record<typeof builtinColorNames[number], string>

const fillShadesByRole = {
  primary: { light: [500, 600, 700], dark: [400, 300, 200] },
  secondary: { light: [600, 700, 800], dark: [400, 300, 200] },
  success: { light: [700, 800, 900], dark: [500, 400, 300] },
  info: { light: [600, 700, 800], dark: [500, 400, 300] },
  warning: { light: [700, 800, 900], dark: [500, 400, 300] },
  danger: { light: [600, 700, 800], dark: [500, 400, 300] },
  neutral: { light: [950, 900, 800], dark: [200, 100, 50] },
} as const satisfies Record<typeof builtinColorNames[number], Record<'light' | 'dark', readonly [number, number, number]>>

/** Build-time default recipes read foundations, never a component's legacy bridge. */
export function createBuiltinColorRegistry(classPrefix?: string | null) {
  const foundation = (role: typeof builtinColorNames[number], shade: number) => `var(--${classPrefix ? `${classPrefix}-` : ''}color-selaras-${foundationPaletteByRole[role]}-${shade})`
  const recipes = Object.fromEntries(builtinColorNames.map((role) => {
    const mode = (dark: boolean): ColorRecipeInput => {
      const neutral = role === 'neutral'
      const warning = role === 'warning'
      const modeName = dark ? 'dark' : 'light'
      const [fillShade, hoverShade, pressedShade] = fillShadesByRole[role][modeName]
      const textShade = warning || role === 'success' ? 800 : role === 'info' || role === 'danger' ? 700 : fillShade
      const fill = foundation(role, fillShade)
      const hover = foundation(role, hoverShade)
      const pressed = foundation(role, pressedShade)
      const text = foundation(role, neutral ? dark ? 50 : 950 : dark ? 300 : textShade)
      const subtle = neutral
        ? foundation(role, dark ? 900 : 100)
        : dark ? `color-mix(in oklab, ${fill} 24%, var(--ui-bg))` : foundation(role, 100)
      return {
        fill,
        fillHover: hover,
        fillPressed: pressed,
        onFill: foundation('neutral', dark ? 950 : 25),
        subtle,
        subtleHover: dark
          ? `color-mix(in oklab, ${foundation(role, 500)} 32%, var(--ui-bg))`
          : `color-mix(in oklab, ${subtle} 94%, ${text})`,
        subtlePressed: dark
          ? `color-mix(in oklab, ${foundation(role, 500)} 40%, var(--ui-bg))`
          : `color-mix(in oklab, ${subtle} 90%, ${text})`,
        onSubtle: text,
        text,
        textHover: foundation(role, neutral ? dark ? 100 : 900 : dark ? 200 : Math.min(textShade + 100, 950)),
        textPressed: foundation(role, neutral ? dark ? 200 : 800 : dark ? 100 : Math.min(textShade + 200, 950)),
        border: neutral ? foundation(role, 500) : fill,
        focus: text,
      }
    }
    return [role, { light: mode(false), dark: mode(true) }]
  })) as Record<typeof builtinColorNames[number], ColorModePair<ColorRecipeInput>>
  return createColorRegistry(recipes)
}
