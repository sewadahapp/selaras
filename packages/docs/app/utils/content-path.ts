/** Nuxt Content stores page paths without a trailing slash. */
export function docsContentPath(path: string) {
  return path.replace(/\/+$/, '') || '/'
}

/**
 * The content path that stores a page for a locale. English (the default
 * locale) lives at the content root; every other locale keeps its Markdown
 * under `<locale>/` and is served from the same public URL.
 */
export function docsLocalizedContentPath(path: string, locale: string, defaultLocale = 'en') {
  const base = docsContentPath(path)
  if (!locale || locale === defaultLocale)
    return base
  return base === '/' ? `/${locale}` : `/${locale}${base}`
}

/** Strip a locale folder from a content path (`/id/components/button` -> `/components/button`). */
export function docsDefaultContentPath(path: string, locale: string) {
  const base = docsContentPath(path)
  if (!locale)
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
