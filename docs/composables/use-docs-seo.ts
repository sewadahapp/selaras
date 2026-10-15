import type { MaybeRefOrGetter } from 'vue'
import { docsCanonicalUrl, docsPageTitle, docsSite } from '../utils/seo'

export function useDocsSeo(page: MaybeRefOrGetter<{ title: string, description?: string }>) {
  const route = useRoute()
  const config = useRuntimeConfig()
  const site = useSiteConfig()
  const title = computed(() => docsPageTitle(toValue(page).title))
  const description = computed(() => toValue(page).description || docsSite.description)
  const canonical = computed(() => docsCanonicalUrl(route.path, site.url, config.app.baseURL))

  useSeoMeta({
    title,
    description,
    ogTitle: title,
    ogDescription: description,
    ogUrl: canonical,
    ogSiteName: docsSite.name,
    ogType: 'website',
    ogLocale: 'en_GB',
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
