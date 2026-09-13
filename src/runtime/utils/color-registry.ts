/**
 * Framework-independent semantic color contracts.
 *
 * This module deliberately contains no Vue, Nuxt or Tailwind imports. It is
 * the normalization boundary that build-time adapters and runtime CSS
 * bindings can share without putting a token resolver in component bundles.
 */

export const builtinColorNames = ['primary', 'secondary', 'success', 'info', 'warning', 'danger', 'neutral'] as const

export type BuiltinColorName = typeof builtinColorNames[number]

declare global {
  interface SelarasColorRegistry {}
}

export type ColorRole = BuiltinColorName | Extract<keyof SelarasColorRegistry, string>

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

export type RuntimeColorOverrides = Partial<Record<ColorRole, Partial<ColorRecipeInput>>>

export interface RuntimeTokenOverrides {
  light?: RuntimeColorOverrides
  dark?: RuntimeColorOverrides
}

/** Composes managed scope leaves without resolving authored CSS expressions. */
export function mergeRuntimeTokenOverrides(parent: RuntimeTokenOverrides = {}, local: RuntimeTokenOverrides = {}): RuntimeTokenOverrides {
  const result: RuntimeTokenOverrides = {}
  for (const mode of ['light', 'dark'] as const) {
    const roles = new Set([...Object.keys(parent[mode] ?? {}), ...Object.keys(local[mode] ?? {})])
    if (roles.size === 0)
      continue
    const colors: RuntimeColorOverrides = {}
    for (const role of roles) {
      assertColorRoleName(role)
      const key = role as ColorRole
      colors[key] = Object.fromEntries(
        [...Object.entries(parent[mode]?.[key] ?? {}), ...Object.entries(local[mode]?.[key] ?? {})]
          .filter(([, value]) => value !== undefined),
      )
    }
    result[mode] = colors
  }
  return result
}

export interface ColorModePair<T> {
  light: T
  dark: T
}

const roleNamePattern = /^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/
const reservedRoleNames = new Set(['__proto__', 'constructor', 'prototype'])
const requiredRecipeFields = ['fill', 'onFill', 'subtle', 'onSubtle', 'text', 'border'] as const

export function assertColorRoleName(name: string): asserts name is string {
  if (!roleNamePattern.test(name) || reservedRoleNames.has(name))
    throw new Error(`Invalid Selaras color role "${name}". Use lowercase kebab-case, for example "brand-accent".`)
}

export function normalizeColorRecipe(input: ColorRecipeInput): ColorRecipe {
  for (const field of requiredRecipeFields) {
    if (typeof input?.[field] !== 'string' || input[field].length === 0)
      throw new Error(`Invalid Selaras color recipe: "${field}" must be a non-empty string.`)
  }
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
  return {
    '--ui-primary': 'var(--_selaras-color-fill)',
    '--ui-primary-hover': 'var(--_selaras-color-fill-hover)',
    '--ui-primary-active': 'var(--_selaras-color-fill-pressed)',
    '--ui-primary-foreground': 'var(--_selaras-color-on-fill)',
    '--ui-primary-soft': 'var(--_selaras-color-subtle)',
  }
}

/** Maps a custom role onto the static info branch used by status-only recipes. */
export function customStatusColorRoleStyle(role: string): Record<string, string> | undefined {
  if (isBuiltinColorRole(role))
    return undefined
  assertColorRoleName(role)
  return {
    '--ui-info': 'var(--_selaras-color-fill)',
    '--ui-info-foreground': 'var(--_selaras-color-on-fill)',
    '--ui-info-soft': 'var(--_selaras-color-subtle)',
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

function assertCssValue(value: string): void {
  if (/[;{}\r\n]/.test(value))
    throw new Error('Invalid Selaras token value: declaration delimiters are not allowed.')
}

function overrideRule(selector: string, overrides: Partial<ColorRecipeInput>): string | undefined {
  const declarations = Object.entries(overrides).map(([field, value]) => {
    if (value === undefined)
      return undefined
    assertCssValue(value)
    const kebab = field.replace(/[A-Z]/g, character => `-${character.toLowerCase()}`)
    return `  --selaras-color-role-${kebab}: ${value};`
  }).filter(Boolean)
  return declarations.length > 0 ? `${selector} {\n${declarations.join('\n')}\n}` : undefined
}

/** Serializes app-config color leaves into an SSR-safe light/dark CSS layer. */
export function generateRuntimeColorOverrideCss(overrides: RuntimeTokenOverrides, scopeSelector = ''): string {
  const rules: string[] = []
  for (const mode of ['light', 'dark'] as const) {
    const colors = overrides[mode]
    if (!colors)
      continue
    for (const role of Object.keys(colors).sort()) {
      assertColorRoleName(role)
      const colorSelector = `[data-selaras-color="${role}"]`
      const scope = scopeSelector.trim()
      const selectors = scope ? [`${scope}${colorSelector}`, `${scope} ${colorSelector}`] : [colorSelector]
      const selector = selectors.map(value => `${mode === 'dark' ? '.dark ' : ''}${value}`).join(',\n')
      const rule = overrideRule(selector, colors[role as ColorRole] ?? {})
      if (rule)
        rules.push(rule)
    }
  }
  return rules.length > 0 ? `${rules.join('\n\n')}\n` : ''
}

function roleRule(selector: string, recipe: ColorRecipe): string {
  const declarations = generatedRoleFields
    .flatMap((field) => {
      const value = roleFieldValue(recipe, field)
      return [
        `  --selaras-color-role-${field}: ${value};`,
        `  --_selaras-color-${field}: var(--selaras-color-role-${field});`,
      ]
    })
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
