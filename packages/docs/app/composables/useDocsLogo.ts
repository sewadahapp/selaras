/**
 * Prefixes a root-relative path (`/logo.svg`) with the app's base URL, so a
 * file in `public/` still resolves when the site is served from a subpath.
 * Absolute URLs and relative paths pass through unchanged.
 */
export function useDocsAssetUrl() {
  const baseURL = useRuntimeConfig().app.baseURL.replace(/\/$/, '')
  return (path: string | undefined) => path?.startsWith('/') && !path.startsWith('//') ? `${baseURL}${path}` : path
}

/** The configured `site.logo`, resolved into light/dark image sources. */
export function useDocsLogo() {
  const appConfig = useAppConfig()
  const assetUrl = useDocsAssetUrl()

  return computed(() => {
    const config = appConfig.selarasDocs ?? {}
    const logo = config.site?.logo
    const name = config.header?.title ?? config.site?.name ?? 'Documentation'
    const light = assetUrl(typeof logo === 'string' ? logo : (logo?.light ?? logo?.dark))
    const dark = assetUrl(typeof logo === 'string' ? logo : (logo?.dark ?? logo?.light))
    return {
      light,
      dark,
      alt: typeof logo === 'object' ? (logo.alt ?? name) : name,
      distinct: Boolean(light && dark && light !== dark),
      tint: typeof logo === 'object' && logo.tint === true,
    }
  })
}
