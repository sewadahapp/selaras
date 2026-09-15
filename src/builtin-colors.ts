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

/** Build-time default recipes read foundations, never a component's legacy bridge. */
export function createBuiltinColorRegistry(classPrefix?: string | null) {
  const foundation = (role: typeof builtinColorNames[number], shade: number) => `var(--${classPrefix ? `${classPrefix}-` : ''}color-selaras-${foundationPaletteByRole[role]}-${shade})`
  const recipes = Object.fromEntries(builtinColorNames.map((role) => {
    const mode = (dark: boolean): ColorRecipeInput => {
      const neutral = role === 'neutral'
      const warning = role === 'warning'
      const fillShade = role === 'success' ? 700 : role === 'secondary' || role === 'info' || role === 'danger' ? 600 : 500
      const textShade = warning || role === 'success' ? 800 : role === 'info' || role === 'danger' ? 700 : fillShade
      const fill = foundation(role, neutral ? dark ? 50 : 950 : fillShade)
      // Amber keeps a dark foreground in all filled states; its interactions
      // brighten rather than crossing into shades that require white text.
      const hover = foundation(role, neutral ? dark ? 100 : 900 : warning ? 400 : fillShade + 100)
      const pressed = foundation(role, neutral ? dark ? 200 : 800 : warning ? 300 : fillShade + 200)
      const text = foundation(role, neutral ? dark ? 50 : 950 : dark ? 300 : textShade)
      const subtle = neutral
        ? foundation(role, dark ? 900 : 100)
        : dark ? `color-mix(in oklab, ${fill} 24%, var(--ui-bg))` : foundation(role, 100)
      return {
        fill,
        fillHover: hover,
        fillPressed: pressed,
        onFill: foundation('neutral', role === 'warning' || (neutral && dark) ? 950 : 25),
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
        border: neutral ? foundation(role, dark ? 800 : 200) : fill,
        focus: text,
      }
    }
    return [role, { light: mode(false), dark: mode(true) }]
  })) as Record<typeof builtinColorNames[number], ColorModePair<ColorRecipeInput>>
  return createColorRegistry(recipes)
}
