import type { ColorModePair, ColorRecipe, ColorRecipeInput } from './color-registry'
import { assertColorRoleName, createColorRegistry } from './color-registry'

/** Supported DTCG color value subset for the first build-time adapter. */
export interface DtcgColorValue {
  colorSpace: 'srgb' | 'srgb-linear'
  components: [number | 'none', number | 'none', number | 'none']
  alpha?: number | 'none'
}

export interface DtcgColorToken {
  $type?: 'color'
  $value: string | DtcgColorValue
}

export interface DtcgColorRoleGroup {
  $type?: 'color'
  [key: string]: DtcgColorToken | 'color' | undefined
}
export type DtcgColorModes = ColorModePair<Record<string, DtcgColorRoleGroup>>

const fieldMap = {
  'fill': 'fill',
  'fill-hover': 'fillHover',
  'fill-pressed': 'fillPressed',
  'on-fill': 'onFill',
  'subtle': 'subtle',
  'subtle-hover': 'subtleHover',
  'subtle-pressed': 'subtlePressed',
  'on-subtle': 'onSubtle',
  'text': 'text',
  'text-hover': 'textHover',
  'text-pressed': 'textPressed',
  'border': 'border',
  'focus': 'focus',
} as const

const requiredFields = ['fill', 'on-fill', 'subtle', 'on-subtle', 'text', 'border'] as const

function cssColor(value: string | DtcgColorValue, path: string): string {
  if (typeof value === 'string') {
    if (/\{[^}]+\}/.test(value))
      throw new Error(`Unsupported DTCG color alias at ${path}; resolve references before the web CSS adapter.`)
    return value
  }
  const alpha = value.alpha === undefined || value.alpha === 'none' ? '' : ` / ${value.alpha}`
  return `color(${value.colorSpace} ${value.components.join(' ')}${alpha})`
}

function readRole(role: string, group: DtcgColorRoleGroup, mode: keyof DtcgColorModes): ColorRecipeInput {
  assertColorRoleName(role)
  if (group.$type && group.$type !== 'color')
    throw new Error(`Unsupported DTCG group type at "${mode}.colors.${role}"; expected color.`)
  for (const field of requiredFields) {
    const token = group[field]
    if (!token)
      throw new Error(`Missing DTCG color token "${mode}.colors.${role}.${field}".`)
    if (typeof token !== 'object' || (token.$type && token.$type !== 'color') || !token.$value)
      throw new Error(`Unsupported DTCG token type at "${mode}.colors.${role}.${field}"; expected color.`)
  }
  const values = Object.fromEntries(Object.entries(fieldMap).flatMap(([field, property]) => {
    const token = group[field] as DtcgColorToken | undefined
    return token ? [[property, cssColor(token.$value, `${mode}.colors.${role}.${field}`)]] : []
  }))
  return values as ColorRecipeInput
}

/**
 * Imports the supported DTCG semantic-color subset into Selaras recipes.
 * This is a build-time adapter, not a general DTCG resolver.
 */
export function createColorRegistryFromDtcg(source: DtcgColorModes): Record<string, ColorModePair<ColorRecipe>> {
  const roles = new Set([...Object.keys(source.light), ...Object.keys(source.dark)])
  const input: Record<string, ColorModePair<ColorRecipeInput>> = {}
  for (const role of [...roles].sort()) {
    const light = source.light[role]
    const dark = source.dark[role]
    if (!light || !dark)
      throw new Error(`DTCG color role "${role}" must define both light and dark modes.`)
    input[role] = { light: readRole(role, light, 'light'), dark: readRole(role, dark, 'dark') }
  }
  return createColorRegistry(input)
}
