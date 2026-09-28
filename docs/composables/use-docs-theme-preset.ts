export type DocsThemePreset = 'pelog' | 'slendro'

/** The docs-only visual preset, persisted so page navigation keeps the choice. */
export function useDocsThemePreset() {
  const stored = useCookie<string>('selaras-docs-theme-preset', {
    default: () => 'pelog',
    sameSite: 'lax',
  })

  return computed<DocsThemePreset>({
    get: () => stored.value === 'slendro' ? 'slendro' : 'pelog',
    set: value => stored.value = value,
  })
}
