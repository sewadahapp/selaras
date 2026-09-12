/**
 * Framework-independent semantic color contracts.
 *
 * This module deliberately contains no Vue, Nuxt or Tailwind imports. It is
 * the normalization boundary that build-time adapters and runtime CSS
 * bindings can share without putting a token resolver in component bundles.
 */

export const builtinColorNames = ['primary', 'secondary', 'success', 'info', 'warning', 'danger', 'neutral'] as const

export type BuiltinColorName = typeof builtinColorNames[number]

/** Temporary open role type until Nuxt-generated role augmentation lands. */
export type ColorRole = BuiltinColorName | (string & {})

export interface ColorRecipe {
  fill: string
  fillHover: string
  fillPressed: string
  onFill: string
  subtle: string
  subtleHover: string
  subtlePressed: string
  onSubtle: string
  text: string
  textHover: string
  textPressed: string
  border: string
  focus: string
}

export type ColorRecipeInput = Pick<ColorRecipe, 'fill' | 'onFill' | 'subtle' | 'onSubtle' | 'text' | 'border'> & Partial<Pick<ColorRecipe, 'fillHover' | 'fillPressed' | 'subtleHover' | 'subtlePressed' | 'textHover' | 'textPressed' | 'focus'>>

export interface ColorModePair<T> {
  light: T
  dark: T
}

const roleNamePattern = /^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/
const reservedRoleNames = new Set(['__proto__', 'constructor', 'prototype'])

export function assertColorRoleName(name: string): asserts name is string {
  if (!roleNamePattern.test(name) || reservedRoleNames.has(name))
    throw new Error(`Invalid Selaras color role "${name}". Use lowercase kebab-case, for example "brand-accent".`)
}

export function normalizeColorRecipe(input: ColorRecipeInput): ColorRecipe {
  return {
    fill: input.fill,
    fillHover: input.fillHover ?? input.fill,
    fillPressed: input.fillPressed ?? input.fillHover ?? input.fill,
    onFill: input.onFill,
    subtle: input.subtle,
    subtleHover: input.subtleHover ?? input.subtle,
    subtlePressed: input.subtlePressed ?? input.subtleHover ?? input.subtle,
    onSubtle: input.onSubtle,
    text: input.text,
    textHover: input.textHover ?? input.text,
    textPressed: input.textPressed ?? input.textHover ?? input.text,
    border: input.border,
    focus: input.focus ?? input.text,
  }
}

export function createColorRegistry<T extends Record<string, ColorModePair<ColorRecipeInput>>>(custom: T) {
  for (const name of Object.keys(custom))
    assertColorRoleName(name)

  return Object.fromEntries(Object.entries(custom).map(([name, modes]) => [name, {
    light: normalizeColorRecipe(modes.light),
    dark: normalizeColorRecipe(modes.dark),
  }])) as { [K in keyof T]: ColorModePair<ColorRecipe> }
}

const builtinRoleSet = new Set<string>(builtinColorNames)

export function isBuiltinColorRole(role: string): role is BuiltinColorName {
  return builtinRoleSet.has(role)
}

/**
 * Maps a custom role onto the existing primary recipe's CSS variables. This
 * is the first vertical-slice bridge; generated private role variables will
 * replace it once the Nuxt registry emits CSS for every registered role.
 */
export function customColorRoleStyle(role: string): Record<string, string> | undefined {
  if (isBuiltinColorRole(role))
    return undefined
  assertColorRoleName(role)
  const source = `--selaras-color-${role}`
  return {
    '--ui-primary': `var(${source}-fill)`,
    '--ui-primary-hover': `var(${source}-fill-hover)`,
    '--ui-primary-active': `var(${source}-fill-pressed)`,
    '--ui-primary-foreground': `var(${source}-on-fill)`,
    '--ui-primary-soft': `var(${source}-subtle)`,
  }
}

const generatedRoleFields = [
  'fill',
  'fill-hover',
  'fill-pressed',
  'on-fill',
  'subtle',
  'subtle-hover',
  'subtle-pressed',
  'on-subtle',
  'text',
  'text-hover',
  'text-pressed',
  'border',
  'focus',
] as const

type GeneratedRoleField = typeof generatedRoleFields[number]

function roleFieldValue(recipe: ColorRecipe, field: GeneratedRoleField): string {
  const property = field.replace(/-([a-z])/g, (_, character: string) => character.toUpperCase()) as keyof ColorRecipe
  return recipe[property]
}

function roleRule(selector: string, recipe: ColorRecipe): string {
  const declarations = generatedRoleFields
    .map(field => `  --_selaras-color-${field}: ${roleFieldValue(recipe, field)};`)
    .join('\n')
  return `${selector} {\n${declarations}\n}`
}

/**
 * Serializes normalized role recipes into the private CSS bindings consumed by
 * role-capable components. The output is deterministic so Nuxt template
 * hashes and HMR invalidation do not change with object insertion order.
 */
export function generateColorRoleCss(registry: Record<string, ColorModePair<ColorRecipe>>): string {
  const roles = Object.keys(registry).sort()
  for (const role of roles)
    assertColorRoleName(role)

  const rules: string[] = []
  for (const role of roles) {
    const modes = registry[role]!
    rules.push(roleRule(`[data-selaras-color="${role}"]`, modes.light))
    rules.push(roleRule(`.dark [data-selaras-color="${role}"]`, modes.dark))
  }
  return rules.length > 0 ? `${rules.join('\n\n')}\n` : ''
}
