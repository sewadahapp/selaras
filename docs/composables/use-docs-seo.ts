import type { MaybeRefOrGetter } from 'vue'
import { docsDefaultContentPath, docsLocalizedRoutePath } from '../../packages/docs/app/utils/content-path'
import { docsCanonicalUrl, docsPageTitle, docsSite } from '../utils/seo'

interface DocsSeoOptions {
  /** Route used for canonical and locale alternate links. */
  canonicalPath?: string
  /** Whether a page exists in both locales and should expose hreflang links. */
  translationAvailable?: boolean
  /** Exclude a language fallback from search indexing. */
  noindex?: boolean
}

/** `en-GB` -> `en_GB`, the format Open Graph expects. */
function openGraphLocale(language: string) {
  return language.replace('-', '_')
}

export function useDocsSeo(page: MaybeRefOrGetter<{ title: string, description?: string }>, options: MaybeRefOrGetter<DocsSeoOptions> = {}) {
  const route = useRoute()
  const config = useRuntimeConfig()
  const site = useSiteConfig()
  const { locale, localeOption, defaultLocale, locales } = useDocsLocale()
  const title = computed(() => docsPageTitle(toValue(page).title))
  const description = computed(() => toValue(page).description || docsSite.description)
  const seoOptions = computed(() => toValue(options))
  const canonicalPath = computed(() => seoOptions.value.canonicalPath ?? route.path)
  const canonical = computed(() => docsCanonicalUrl(canonicalPath.value, site.url, config.app.baseURL))
  const defaultPath = computed(() => docsDefaultContentPath(canonicalPath.value, locale.value, defaultLocale.value))
  const defaultLanguage = computed(() => locales.value.find(option => option.code === defaultLocale.value)?.language ?? defaultLocale.value)
  const translatedLocale = computed(() => locales.value.find(option => option.code !== defaultLocale.value))
  const alternates = computed(() => {
    if (!seoOptions.value.translationAvailable)
      return []
    const defaultUrl = docsCanonicalUrl(defaultPath.value, site.url, config.app.baseURL)
    const translatedPath = docsLocalizedRoutePath(defaultPath.value, translatedLocale.value?.code ?? 'id', defaultLocale.value)
    return [
      { rel: 'alternate' as const, type: 'text/html', hreflang: defaultLanguage.value, href: defaultUrl },
      ...(translatedLocale.value?.language ? [{ rel: 'alternate' as const, type: 'text/html', hreflang: translatedLocale.value.language, href: docsCanonicalUrl(translatedPath, site.url, config.app.baseURL) }] : []),
      { rel: 'alternate' as const, type: 'text/html', hreflang: 'x-default', href: defaultUrl },
    ]
  })
  const ogLocale = computed(() => openGraphLocale(localeOption.value.language ?? locale.value))

  useSeoMeta({
    title,
    description,
    ogTitle: title,
    ogDescription: description,
    ogUrl: canonical,
    ogSiteName: docsSite.name,
    ogType: 'website',
    ogLocale,
    twitterCard: 'summary_large_image',
    twitterTitle: title,
    twitterDescription: description,
  })
  useHead(() => ({
    htmlAttrs: { lang: localeOption.value.language ?? locale.value },
    meta: seoOptions.value.noindex ? [{ name: 'robots', content: 'noindex, nofollow' }] : [],
    link: [{ rel: 'canonical', href: canonical.value }, ...alternates.value],
  }))

  defineOgImage('DocsSatori', {
    title: () => toValue(page).title,
    description,
  }, {
    alt: () => `${title.value}: ${description.value}`,
  })
}
