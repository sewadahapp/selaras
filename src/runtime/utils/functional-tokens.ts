/** Functional colors are independent of a component's selected intent role. */
export const functionalTokenGroups = {
  surface: ['canvas', 'default', 'elevated', 'inverted'],
  text: ['default', 'muted', 'inverted'],
  border: ['default', 'muted', 'hover'],
} as const

/** Geometry is scoped with functional colors because overlays cross portals. */
export const geometryTokenGroups = {
  radius: ['base', 'sm', 'md', 'lg', 'full'],
  shadow: ['sm', 'md', 'lg'],
  zIndex: ['modal-overlay', 'modal', 'dropdown', 'tooltip', 'toast'],
} as const

/** Partial CSS-valued functional inputs for one semantic mode. */
export type FunctionalTokenOverrides = {
  -readonly [K in keyof typeof functionalTokenGroups]?: Partial<Record<typeof functionalTokenGroups[K][number], string>>
} & {
  /** Background behind a modal surface, independently of its content surface. */
  scrim?: string
}

export type GeometryTokenOverrides = {
  -readonly [K in keyof typeof geometryTokenGroups]?: Partial<Record<typeof geometryTokenGroups[K][number], string>>
}

export type ThemeTokenOverrides = FunctionalTokenOverrides & GeometryTokenOverrides

export function mergeFunctionalTokenOverrides(parent: ThemeTokenOverrides = {}, local: ThemeTokenOverrides = {}): ThemeTokenOverrides {
  const result: ThemeTokenOverrides = {}
  for (const group of Object.keys(functionalTokenGroups) as (keyof typeof functionalTokenGroups)[]) {
    const values = Object.fromEntries(
      [...Object.entries(parent[group] ?? {}), ...Object.entries(local[group] ?? {})]
        .filter(([, value]) => value !== undefined),
    )
    if (Object.keys(values).length)
      result[group] = values
  }
  const scrim = local.scrim ?? parent.scrim
  if (scrim !== undefined)
    result.scrim = scrim
  for (const group of Object.keys(geometryTokenGroups) as (keyof typeof geometryTokenGroups)[]) {
    const values = Object.fromEntries(
      [...Object.entries(parent[group] ?? {}), ...Object.entries(local[group] ?? {})]
        .filter(([, value]) => value !== undefined),
    )
    if (Object.keys(values).length)
      result[group] = values
  }
  return result
}

/** Known public CSS inputs; defaults belong to owner-local resolved bindings. */
export function functionalTokenEntries(overrides: ThemeTokenOverrides = {}): [string, string][] {
  const entries: [string, string][] = []
  for (const group of Object.keys(functionalTokenGroups) as (keyof typeof functionalTokenGroups)[]) {
    const values = overrides[group] as Partial<Record<string, string>> | undefined
    for (const leaf of functionalTokenGroups[group]) {
      const value = values?.[leaf]
      if (value !== undefined)
        entries.push([`--selaras-${group}-${leaf}`, value])
    }
  }
  if (overrides.scrim !== undefined)
    entries.push(['--selaras-scrim', overrides.scrim])
  for (const group of Object.keys(geometryTokenGroups) as (keyof typeof geometryTokenGroups)[]) {
    const values = overrides[group] as Partial<Record<string, string>> | undefined
    const prefix = group === 'zIndex' ? 'z' : group
    for (const leaf of geometryTokenGroups[group]) {
      const value = values?.[leaf]
      if (value !== undefined)
        entries.push([`--selaras-${prefix}-${leaf}`, value])
    }
  }
  return entries
}
