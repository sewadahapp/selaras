import { docsLocalizedRoutePath } from '../utils/content-path'

/** Localize an internal docs URL without coupling the published layer to i18n. */
export function useDocsRoutePath() {
  const { locale, defaultLocale } = useDocsLocale()
  return (path: string) => docsLocalizedRoutePath(path, locale.value, defaultLocale.value)
}
