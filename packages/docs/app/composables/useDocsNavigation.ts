interface DocsNavigationNode {
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

export function useDocsNavigation() {
  const appConfig = useAppConfig()

  return useAsyncData('selaras-docs-navigation', async () => {
    const tree = await queryCollectionNavigation('docs', ['order', 'icon', 'collapse', 'navBadges'])
      .order('order', 'ASC')

    const excluded = new Set(appConfig.selarasDocs?.sidebar?.exclude ?? [])
    const visit = (items: DocsNavigationNode[], applyExclusions = false): DocsNavigationNode[] => items
      .filter(item => !applyExclusions || !excluded.has(item.path))
      .map((item) => {
        const metadata = typeof item.navigation === 'object' && item.navigation ? item.navigation : {}
        const children = item.children ? visit(item.children, applyExclusions) : undefined
        return {
          ...item,
          ...metadata,
          title: metadata.title ?? item.title,
          icon: metadata.icon ?? item.icon,
          order: metadata.order ?? item.order,
          navBadges: metadata.navBadges ?? item.navBadges,
          ...(children && { children }),
        }
      })
      .filter(item => !applyExclusions || !item.children || item.children.length > 0)
      .sort((a, b) => {
        if (a.order == null && b.order == null)
          return 0
        if (a.order == null)
          return 1
        if (b.order == null)
          return -1
        return a.order - b.order
      })

    return visit(tree as DocsNavigationNode[], excluded.size > 0)
  })
}
