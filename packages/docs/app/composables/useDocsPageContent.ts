import { docsContentPath, docsLocalizedContentPath } from '../utils/content-path'

function unique<T>(items: T[]) {
  return Array.from(new Set(items))
}

/**
 * Resolve the content page for the active locale at the current URL. English
 * (the default locale) lives at the content root; every other locale keeps its
 * Markdown under `<locale>/` and is served from the same public URL.
 *
 * Because the docs site is statically generated with a no-prefix i18n strategy,
 * translated content cannot be fetched on demand from a separate route. The
 * composable instead resolves all configured locale variants in one batch at
 * build time, so Nuxt Content includes every translation in the page payload.
 * When the active locale has no translation, the default-locale page is returned
 * with `fallback: true` so the page can show an explicit "not translated" note.
 */
export async function useDocsPageContent() {
  const route = useRoute()
  const { locale, defaultLocale, locales } = useDocsLocale()
  const defaultPath = docsContentPath(route.path)
  const localeFolders = locales.value
    .map(option => option.code)
    .filter(code => code !== defaultLocale.value)
  const contentPaths = unique([
    defaultPath,
    ...localeFolders.map(folder => docsLocalizedContentPath(route.path, folder, defaultLocale.value)),
  ])

  const { data, error, status, refresh } = await useAsyncData(
    () => `selaras-docs:${defaultPath}`,
    async () => {
      const pages = await Promise.all(contentPaths.map(path => queryCollection('docs').path(path).first()))
      const byLocale: Record<string, any> = {}
      byLocale[defaultLocale.value] = pages[0]
      for (let i = 0; i < localeFolders.length; i++)
        byLocale[localeFolders[i]!] = pages[i + 1]
      return { byLocale, defaultPath }
    },
    { watch: [() => route.path] },
  )

  const page = computed(() => data.value?.byLocale[locale.value] ?? data.value?.byLocale[defaultLocale.value])
  const contentPath = computed(() => locale.value === defaultLocale.value
    ? defaultPath
    : docsLocalizedContentPath(route.path, locale.value, defaultLocale.value))

  return {
    page,
    fallback: computed(() => locale.value !== defaultLocale.value && !data.value?.byLocale[locale.value]),
    contentPath,
    contentPaths,
    error,
    status,
    refresh,
  }
}
