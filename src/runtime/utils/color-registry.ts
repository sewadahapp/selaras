import type { FunctionalTokenOverrides } from './functional-tokens'
import { functionalTokenEntries, mergeFunctionalTokenOverrides } from './functional-tokens'

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

export interface RuntimeThemeMode extends FunctionalTokenOverrides {
  colors?: RuntimeColorOverrides
}

export interface RuntimeTokenOverrides {
  light?: RuntimeThemeMode
  dark?: RuntimeThemeMode
}

/** Composes managed scope leaves without resolving authored CSS expressions. */
export function mergeRuntimeTokenOverrides(parent: RuntimeTokenOverrides = {}, local: RuntimeTokenOverrides = {}): RuntimeTokenOverrides {
  const result: RuntimeTokenOverrides = {}
  for (const mode of ['light', 'dark'] as const) {
    const functional = mergeFunctionalTokenOverrides(parent[mode], local[mode])
    const roles = new Set([...Object.keys(parent[mode]?.colors ?? {}), ...Object.keys(local[mode]?.colors ?? {})])
    if (roles.size === 0 && Object.keys(functional).length === 0)
      continue
    const colors: RuntimeColorOverrides = {}
    for (const role of roles) {
      assertColorRoleName(role)
      const key = role as ColorRole
      colors[key] = Object.fromEntries(
        [...Object.entries(parent[mode]?.colors?.[key] ?? {}), ...Object.entries(local[mode]?.colors?.[key] ?? {})]
          .filter(([, value]) => value !== undefined),
      )
    }
    result[mode] = { ...functional, ...(roles.size ? { colors } : {}) }
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

/** Compiles omitted web recipe leaves into dependencies on resolved bindings. */
export function normalizeColorRecipe(input: ColorRecipeInput): ColorRecipe {
  for (const field of requiredRecipeFields) {
    if (typeof input?.[field] !== 'string' || input[field].length === 0)
      throw new Error(`Invalid Selaras color recipe: "${field}" must be a non-empty string.`)
  }
  return {
    fill: input.fill,
    // Keep omitted leaves as dependencies on the resolved state, rather than
    // copying authored values. CSS overrides then propagate through the chain.
    fillHover: input.fillHover ?? 'var(--_selaras-color-fill)',
    fillPressed: input.fillPressed ?? 'var(--_selaras-color-fill-hover)',
    onFill: input.onFill,
    subtle: input.subtle,
    subtleHover: input.subtleHover ?? 'var(--_selaras-color-subtle)',
    subtlePressed: input.subtlePressed ?? 'var(--_selaras-color-subtle-hover)',
    onSubtle: input.onSubtle,
    text: input.text,
    textHover: input.textHover ?? 'var(--_selaras-color-text)',
    textPressed: input.textPressed ?? 'var(--_selaras-color-text-hover)',
    border: input.border,
    focus: input.focus ?? 'var(--_selaras-color-text)',
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
  if (typeof value !== 'string' || value.trim().length === 0)
    throw new Error('Invalid Selaras token value: expected a non-empty CSS string.')
  if (/[;{}\r\n]/.test(value))
    throw new Error('Invalid Selaras token value: declaration delimiters are not allowed.')
}

function overrideRule(selector: string, role: string, overrides: Partial<ColorRecipeInput>): string | undefined {
  const declarations = Object.entries(overrides).map(([field, value]) => {
    if (value === undefined)
      return undefined
    assertCssValue(value)
    const kebab = field.replace(/[A-Z]/g, character => `-${character.toLowerCase()}`)
    return `  --selaras-color-${role}-${kebab}: ${value};`
  }).filter(Boolean)
  return declarations.length > 0 ? `${selector} {\n${declarations.join('\n')}\n}` : undefined
}

/** Exact owners rematerialize effective leaves, including across DOM portals. */
export function generateRuntimeTokenOverrideCss(overrides: RuntimeTokenOverrides, scopeSelector = '[data-selaras-theme="global"]'): string {
  const rules: string[] = []
  const owner = scopeSelector.trim()
  const roles = new Set([...Object.keys(overrides.light?.colors ?? {}), ...Object.keys(overrides.dark?.colors ?? {})])
  const functional = {
    light: Object.fromEntries(functionalTokenEntries(overrides.light)),
    dark: Object.fromEntries(functionalTokenEntries(overrides.dark)),
  }
  const functionalFields = [...new Set([...Object.keys(functional.light), ...Object.keys(functional.dark)])].sort()
  for (const mode of ['light', 'dark'] as const) {
    const selector = mode === 'dark'
      ? `:root.dark ${owner}:where(:not([data-selaras-mode]), [data-selaras-mode="root"]),\n${owner}:where([data-selaras-mode="dark"])`
      : `${owner}:where(:not([data-selaras-mode]), [data-selaras-mode="root"], [data-selaras-mode="light"])`
    const functionalDeclarations = functionalFields.map((field) => {
      const value = functional[mode][field] ?? 'initial'
      assertCssValue(value)
      return `  ${field}: ${value};`
    })
    if (functionalDeclarations.length) {
      // SApp is headless. Its functional contract also serves ordinary page
      // content, while explicit scopes rematerialize values at their owners.
      const functionalSelector = owner === '[data-selaras-theme="global"]'
        ? `${selector},\n${mode === 'dark' ? ':root.dark' : ':root'}`
        : selector
      rules.push(`${functionalSelector} {\n${functionalDeclarations.join('\n')}\n}`)
    }
    const colors = overrides[mode]?.colors
    for (const role of [...roles].sort()) {
      assertColorRoleName(role)
      const key = role as ColorRole
      // An opposite-mode-only managed leaf must not leak through DOM inheritance.
      // `initial` is invalid for a custom property, restoring recipe fallbacks.
      const fields = new Set([
        ...Object.entries(overrides.light?.colors?.[key] ?? {}),
        ...Object.entries(overrides.dark?.colors?.[key] ?? {}),
      ].filter(([, value]) => value !== undefined).map(([field]) => field))
      const effective = Object.fromEntries([...fields].map(field => [field, colors?.[key]?.[field as keyof ColorRecipeInput] ?? 'initial']))
      const rule = overrideRule(selector, role, effective)
      if (rule)
        rules.push(rule)
    }
  }
  return rules.length > 0 ? `@layer theme {\n${rules.join('\n\n')}\n}\n` : ''
}

function roleRule(selector: string, role: string, recipe: ColorRecipe, fields: readonly (typeof generatedRoleFields)[number][] = generatedRoleFields): string {
  const declarations = fields
    .map((field) => {
      const value = roleFieldValue(recipe, field)
      return `  --_selaras-color-${field}: var(--selaras-color-${role}-${field}, ${value});`
    })
    .join('\n')
  return `${selector} {\n${declarations}\n}`
}

/**
 * Serializes normalized role recipes into the private CSS bindings consumed by
 * role-capable components. Role-specific public inputs inherit from the DOM;
 * authored defaults resolve here so local external variables remain usable.
 * The output is deterministic so Nuxt template
 * hashes and HMR invalidation do not change with object insertion order.
 */
export function generateColorRoleCss(registry: Record<string, ColorModePair<ColorRecipe>>): string {
  const roles = Object.keys(registry).sort()
  for (const role of roles)
    assertColorRoleName(role)

  const rules: string[] = []
  for (const role of roles) {
    const modes = registry[role]!
    rules.push(roleRule(`[data-selaras-color="${role}"]`, role, modes.light))
    const changedFields = generatedRoleFields.filter(field => roleFieldValue(modes.light, field) !== roleFieldValue(modes.dark, field))
    if (changedFields.length)
      rules.push(roleRule(`:root.dark [data-selaras-color="${role}"]:where(:not([data-selaras-mode]), [data-selaras-mode="root"]),\n[data-selaras-color="${role}"]:where([data-selaras-mode="dark"])`, role, modes.dark, changedFields))
  }
  return rules.length > 0 ? `@layer theme {\n${rules.join('\n\n')}\n}\n` : ''
}
