import type { ContentNavigationLink } from '@sewadah/selaras/components/ContentNavigation.vue'

function flattenNavigation(links: ContentNavigationLink[]): ContentNavigationLink[] {
  return links.flatMap(link => link.children?.length ? flattenNavigation(link.children) : [link])
}

/** The adjacent leaf pages in the collection's reading order. */
export function useDocsSurround() {
  const route = useRoute()
  const { data: navigation } = useDocsNavigation()

  return computed(() => {
    const links = flattenNavigation(navigation.value ?? [])
    const index = links.findIndex(link => link.path === route.path)

    return index === -1
      ? { prev: undefined, next: undefined }
      : { prev: links[index - 1], next: links[index + 1] }
  })
}
