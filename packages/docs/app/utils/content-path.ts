/** Nuxt Content stores page paths without a trailing slash. */
export function docsContentPath(path: string) {
  return path.replace(/\/+$/, '') || '/'
}

/** Remove the locale segment used by public routes (`/id/guide` -> `/guide`). */
export function docsUnlocalizedRoutePath(path: string, locale: string, defaultLocale = 'en') {
  const base = docsContentPath(path)
  if (!locale || locale === defaultLocale)
    return base
  return docsDefaultContentPath(base, locale)
}

/** Add the active locale prefix to an internal public route. */
export function docsLocalizedRoutePath(path: string, locale: string, defaultLocale = 'en') {
  const suffixIndex = [path.indexOf('?'), path.indexOf('#')].filter(index => index >= 0).sort((a, b) => a - b)[0] ?? path.length
  const pathname = path.slice(0, suffixIndex) || '/'
  const suffix = path.slice(suffixIndex)
  if (!pathname.startsWith('/') || pathname.startsWith('//'))
    return path

  const base = locale === defaultLocale ? docsContentPath(pathname) : docsUnlocalizedRoutePath(pathname, locale, defaultLocale)
  if (!locale || locale === defaultLocale)
    return `${base}${suffix}`
  return `${base === '/' ? `/${locale}` : `/${locale}${base}`}${suffix}`
}

/**
 * The content path that stores a page for a locale. English (the default
 * locale) lives at the content root; every other locale keeps its Markdown
 * under `<locale>/` and is served under that locale's public prefix.
 */
export function docsLocalizedContentPath(path: string, locale: string, defaultLocale = 'en') {
  const base = docsContentPath(path)
  if (!locale || locale === defaultLocale)
    return base
  return base === '/' ? `/${locale}` : `/${locale}${base}`
}

/** Strip a locale folder from a content path (`/id/components/button` -> `/components/button`). */
export function docsDefaultContentPath(path: string, locale: string, defaultLocale = 'en') {
  const base = docsContentPath(path)
  if (!locale || locale === defaultLocale)
    return base
  if (base !== `/${locale}` && !base.startsWith(`/${locale}/`))
    return base
  return base.slice(locale.length + 1) || '/'
}

/** Whether a content path belongs to a non-default locale folder. */
export function docsIsLocalizedContentPath(path: string, locale: string) {
  const base = docsContentPath(path)
  return base === `/${locale}` || base.startsWith(`/${locale}/`)
}
