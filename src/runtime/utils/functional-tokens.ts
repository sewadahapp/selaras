/** Functional colors are independent of a component's selected intent role. */
export const functionalTokenGroups = {
  surface: ['default', 'elevated', 'inverted'],
  text: ['default', 'muted', 'inverted'],
  border: ['default', 'muted', 'hover'],
} as const

/** Partial CSS-valued functional inputs for one semantic mode. */
export type FunctionalTokenOverrides = {
  -readonly [K in keyof typeof functionalTokenGroups]?: Partial<Record<typeof functionalTokenGroups[K][number], string>>
} & {
  /** Background behind a modal surface, independently of its content surface. */
  scrim?: string
}

export function mergeFunctionalTokenOverrides(parent: FunctionalTokenOverrides = {}, local: FunctionalTokenOverrides = {}): FunctionalTokenOverrides {
  const result: FunctionalTokenOverrides = {}
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
  return result
}

/** Known public CSS inputs; defaults belong to owner-local resolved bindings. */
export function functionalTokenEntries(overrides: FunctionalTokenOverrides = {}): [string, string][] {
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
  return entries
}
