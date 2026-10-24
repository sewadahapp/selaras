import type { DocsNavigationNode } from '../utils/docs-navigation'
import { docsDefaultContentPath, docsLocalizedRoutePath } from '../utils/content-path'
import { applyDocsTranslatedTitles, withoutDocsLocaleFolders } from '../utils/docs-navigation'

export function useDocsNavigation() {
  const appConfig = useAppConfig()
  const { locale, defaultLocale, locales } = useDocsLocale()
  const translatedFolder = computed(() => locales.value.find(option => option.code !== defaultLocale.value)?.code ?? '')
  const localeFolders = computed(() => locales.value
    .map(option => option.code)
    .filter(code => code !== defaultLocale.value))

  return useAsyncData('selaras-docs-navigation', async () => {
    const tree = await queryCollectionNavigation('docs', ['order', 'icon', 'collapse', 'navBadges'])
      .order('order', 'ASC')

    // The navigation tree always mirrors the default locale's structure, so a
    // partially translated site never hides whole sections. Translated pages
    // contribute their own titles; untranslated pages keep the source title.
    let defaultTree = withoutDocsLocaleFolders(tree as DocsNavigationNode[], localeFolders.value)

    if (locale.value !== defaultLocale.value && translatedFolder.value) {
      const translated = await queryCollection('docs')
        .where('path', 'LIKE', `/${translatedFolder.value}/%`)
        .select('path', 'title')
        .all()
      const titles = new Map(translated.map(page => [docsDefaultContentPath(page.path, translatedFolder.value), page.title]))
      defaultTree = applyDocsTranslatedTitles(defaultTree, titles)
    }

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

    const localize = (items: DocsNavigationNode[]): DocsNavigationNode[] => items.map(item => ({
      ...item,
      path: docsLocalizedRoutePath(item.path, locale.value, defaultLocale.value),
      ...(item.children ? { children: localize(item.children) } : {}),
    }))

    return localize(visit(defaultTree, excluded.size > 0))
  }, { watch: [locale, defaultLocale] })
}
