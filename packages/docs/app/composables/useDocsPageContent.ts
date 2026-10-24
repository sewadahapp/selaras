import { docsContentPath, docsIsLocalizedContentPath, docsLocalizedContentPath, docsUnlocalizedRoutePath } from '../utils/content-path'

function unique<T>(items: T[]) {
  return Array.from(new Set(items))
}

/**
 * Resolve the content page for the active locale at the current URL. English
 * (the default locale) lives at the content root; every other locale keeps its
 * Markdown under `<locale>/` and is served under the locale-specific route.
 *
 * The public route's locale prefix is stripped before looking up its default
 * content path. All configured locale variants are resolved in one batch so
 * Nuxt Content includes every translation in the static payload. When the
 * active locale has no translation, the default page is returned with
 * `fallback: true` so the page can show an explicit translation notice.
 */
export async function useDocsPageContent() {
  const route = useRoute()
  const { locale, defaultLocale, locales } = useDocsLocale()
  const localeFolders = locales.value
    .map(option => option.code)
    .filter(code => code !== defaultLocale.value)
  const routeLocale = computed(() => locales.value.find(option => route.path === `/${option.code}` || route.path.startsWith(`/${option.code}/`))?.code ?? locale.value)
  const defaultPath = computed(() => docsContentPath(docsUnlocalizedRoutePath(route.path, routeLocale.value, defaultLocale.value)))
  const contentPaths = computed(() => unique([
    defaultPath.value,
    ...localeFolders.map(folder => docsLocalizedContentPath(defaultPath.value, folder, defaultLocale.value)),
  ]))

  const { data, error, status, refresh } = await useAsyncData(
    () => `selaras-docs:${defaultPath.value}`,
    async () => {
      const pages = await Promise.all(contentPaths.value.map(path => queryCollection('docs').path(path).first()))
      const byLocale: Record<string, any> = {}
      byLocale[defaultLocale.value] = pages[0]
      for (let i = 0; i < localeFolders.length; i++)
        byLocale[localeFolders[i]!] = pages[i + 1]
      return { byLocale, defaultPath: defaultPath.value }
    },
    { watch: [() => route.path, routeLocale] },
  )

  const page = computed(() => data.value?.byLocale[routeLocale.value] ?? data.value?.byLocale[defaultLocale.value])
  const contentPath = computed(() => routeLocale.value === defaultLocale.value
    ? defaultPath.value
    : data.value?.byLocale[routeLocale.value]
      ? docsLocalizedContentPath(defaultPath.value, routeLocale.value, defaultLocale.value)
      : defaultPath.value)
  const hasTranslation = computed(() => routeLocale.value === defaultLocale.value
    ? localeFolders.some(folder => docsIsLocalizedContentPath(data.value?.byLocale[folder]?.path ?? '', folder))
    : docsIsLocalizedContentPath(data.value?.byLocale[routeLocale.value]?.path ?? '', routeLocale.value))
  const isLocalizedPage = computed(() => routeLocale.value !== defaultLocale.value
    && docsIsLocalizedContentPath(page.value?.path ?? '', routeLocale.value))

  return {
    page,
    fallback: computed(() => routeLocale.value !== defaultLocale.value && !isLocalizedPage.value),
    hasTranslation,
    contentPath,
    contentPaths: contentPaths.value,
    error,
    status,
    refresh,
  }
}
