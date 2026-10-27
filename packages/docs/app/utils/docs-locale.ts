export interface DocsLocaleCode {
  code: string
}

/**
 * Prefer an explicit locale prefix in the current route over the i18n
 * composer's active locale. On a root locale-detection redirect, SSR may
 * render the prefixed locale before the client composer has synchronized.
 */
export function resolveDocsLocale(
  routePath: string,
  activeLocale: string | undefined,
  locales: readonly DocsLocaleCode[],
  defaultLocale: string,
) {
  const pathname = routePath.split(/[?#]/, 1)[0] || '/'
  const routeLocale = locales.find(({ code }) => code !== defaultLocale
    && (pathname === `/${code}` || pathname.startsWith(`/${code}/`)))?.code

  return routeLocale ?? activeLocale ?? defaultLocale
}
