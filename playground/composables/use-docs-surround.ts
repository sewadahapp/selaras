// Scoped to the current top-level section (Overview, Components, Blocks,
// Utilities) - the same scoping layouts/default.vue's own sidebar nav
// already applies (see its `section` computed), so prev/next only ever
// lands on a page the sidebar itself would show next to the current one,
// never a jump across unrelated sections.
export function useDocsSurround() {
  const route = useRoute()
  const { data: navigation } = useDocsNavigation()

  return computed(() => {
    const section = `/${route.path.split('/')[1]}`
    const sectionNode = navigation.value?.find(node => node.path === section)
    const links = flattenNavigationLinks(sectionNode?.children ?? [])
    const index = links.findIndex(link => link.path === route.path)

    if (index === -1)
      return { prev: undefined, next: undefined }

    return { prev: links[index - 1], next: links[index + 1] }
  })
}
