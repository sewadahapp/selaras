import type { MaybeRefOrGetter } from 'vue'
import { docsCanonicalUrl, docsPageTitle, docsSite } from '../utils/seo'

/** `en-GB` -> `en_GB`, the format Open Graph expects. */
function openGraphLocale(language: string) {
  return language.replace('-', '_')
}

export function useDocsSeo(page: MaybeRefOrGetter<{ title: string, description?: string }>) {
  const route = useRoute()
  const config = useRuntimeConfig()
  const site = useSiteConfig()
  const { locale, localeOption } = useDocsLocale()
  const title = computed(() => docsPageTitle(toValue(page).title))
  const description = computed(() => toValue(page).description || docsSite.description)
  // The docs site serves both languages from one URL, so the canonical stays
  // the English route; only the declared language changes with the locale.
  const canonical = computed(() => docsCanonicalUrl(route.path, site.url, config.app.baseURL))
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
  useHead(() => ({ link: [{ rel: 'canonical', href: canonical.value }] }))

  defineOgImage('DocsSatori', {
    title: () => toValue(page).title,
    description,
  }, {
    alt: () => `${title.value}: ${description.value}`,
  })
}
