// Mirrors CommandPaletteGroup/CommandPaletteItem (src/runtime/components/
// CommandPalette.vue) structurally - not imported from the package itself,
// since this playground registers the module by relative path
// (nuxt.config.ts), not the `selaras` package name, so there's no
// node_modules/selaras symlink for that specifier to resolve against (see
// playground/assets/css/global.css's own note on the same constraint).
interface DocsSearchGroup {
  label?: string
  items: { label: string, icon?: string, onSelect?: () => void }[]
}

export function useDocsSearchGroups() {
  const icons = useIcons()
  const { data: navigation } = useDocsNavigation()

  return computed<DocsSearchGroup[]>(() => {
    return (navigation.value ?? [])
      .map(section => ({
        label: section.title,
        items: flattenNavigationLinks(section.children ?? []).map(link => ({
          label: link.title,
          icon: icons.value.file,
          onSelect: () => navigateTo(link.path),
        })),
      }))
      .filter(group => group.items.length > 0)
  })
}
