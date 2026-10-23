export interface DocsNavigationNode {
  title: string
  path: string
  icon?: string | false
  order?: number
  collapse?: boolean
  navBadges?: Array<string | { text: string }>
  navigation?: boolean | {
    title?: string
    icon?: string | false
    order?: number
    navBadges?: Array<string | { text: string }>
  }
  children?: DocsNavigationNode[]
}

/** Drop nodes that live in a non-default locale folder from a content tree. */
export function withoutDocsLocaleFolders(items: DocsNavigationNode[], localeFolders: Iterable<string>): DocsNavigationNode[] {
  const folders = new Set(localeFolders)
  const isLocalized = (path: string) => [...folders].some(code => path === `/${code}` || path.startsWith(`/${code}/`))
  return items
    .filter(item => !isLocalized(item.path))
    .map(item => item.children ? { ...item, children: withoutDocsLocaleFolders(item.children, folders) } : item)
}

/**
 * Replace default-locale navigation titles with translated ones. The tree keeps
 * the default locale's structure and paths, so untranslated pages still appear.
 */
export function applyDocsTranslatedTitles(items: DocsNavigationNode[], titles: Map<string, string>): DocsNavigationNode[] {
  return items.map(item => ({
    ...item,
    title: titles.get(item.path) ?? item.title,
    ...(item.children ? { children: applyDocsTranslatedTitles(item.children, titles) } : {}),
  }))
}
