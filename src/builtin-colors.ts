import type { ColorModePair, ColorRecipeInput } from './runtime/utils/color-registry'
import { builtinColorNames, createColorRegistry } from './runtime/utils/color-registry'

/** Build-time default recipes read foundations, never a component's legacy bridge. */
export function createBuiltinColorRegistry(classPrefix?: string | null) {
  const foundation = (role: string, shade: number) => `var(--${classPrefix ? `${classPrefix}-` : ''}color-${role}-${shade})`
  const recipes = Object.fromEntries(builtinColorNames.map((role) => {
    const mode = (dark: boolean): ColorRecipeInput => {
      const neutral = role === 'neutral'
      const fill = foundation(role, neutral ? dark ? 50 : 950 : 500)
      const hover = foundation(role, neutral ? dark ? 100 : 900 : 600)
      const pressed = foundation(role, neutral ? dark ? 200 : 800 : 700)
      const subtle = neutral
        ? foundation(role, dark ? 900 : 100)
        : dark ? `color-mix(in oklab, ${fill} 24%, var(--ui-bg))` : foundation(role, 100)
      return {
        fill,
        fillHover: hover,
        fillPressed: pressed,
        onFill: foundation('neutral', role === 'warning' || (neutral && dark) ? 950 : 25),
        subtle,
        onSubtle: fill,
        text: fill,
        textHover: hover,
        textPressed: pressed,
        border: neutral ? foundation(role, dark ? 800 : 200) : fill,
        focus: fill,
      }
    }
    return [role, { light: mode(false), dark: mode(true) }]
  })) as Record<typeof builtinColorNames[number], ColorModePair<ColorRecipeInput>>
  return createColorRegistry(recipes)
}
