<script setup lang="ts">
import type { TocLink } from '@sewadah/selaras/components/ContentToc.vue'
import ProseH1 from '@sewadah/selaras/components/ProseH1.vue'
import ProseH2 from '@sewadah/selaras/components/ProseH2.vue'
import ProseH3 from '@sewadah/selaras/components/ProseH3.vue'
import ProseH4 from '@sewadah/selaras/components/ProseH4.vue'
import ProseH5 from '@sewadah/selaras/components/ProseH5.vue'
import ProseH6 from '@sewadah/selaras/components/ProseH6.vue'
import ProsePre from '@sewadah/selaras/components/ProsePre.vue'
import { docsDefaultContentPath, docsLocalizedRoutePath } from '../utils/content-path'
import { docsCanonicalUrl } from '../utils/seo'

const route = useRoute()
const appConfig = useAppConfig()
const nuxtApp = useNuxtApp()
const messages = useDocsMessages()
const { page, fallback, contentPath, hasTranslation, error, status, refresh } = await useDocsPageContent()

const recoveringBuild = import.meta.client && (!page.value || error.value)
  && await nuxtApp.$docsCheckBuild(route.fullPath, true)
if (!page.value && !error.value && !recoveringBuild) {
  throw createError({ statusCode: 404, statusMessage: 'Documentation page not found', fatal: true })
}
if (import.meta.server && error.value)
  setResponseStatus(500)

async function retryPage() {
  await refresh()
  if (import.meta.client && error.value) {
    window.location.reload()
    return
  }
  if (!page.value && !error.value)
    showError({ statusCode: 404, statusMessage: 'Documentation page not found' })
}

definePageMeta({ layout: 'selaras-docs' })
const { locale, defaultLocale, locales, localeOption } = useDocsLocale()
const siteUrl = appConfig.selarasDocs?.site?.url
const config = useRuntimeConfig()
const defaultRoutePath = computed(() => docsDefaultContentPath(contentPath.value, locale.value, defaultLocale.value))
const translatedPage = computed(() => locale.value !== defaultLocale.value && contentPath.value.startsWith(`/${locale.value}/`))
const canonicalPath = computed(() => contentPath.value)
const canonicalUrl = computed(() => siteUrl ? docsCanonicalUrl(canonicalPath.value, siteUrl, config.app.baseURL) : undefined)
const alternateLinks = computed(() => {
  if ((locale.value !== defaultLocale.value && !translatedPage.value) || !hasTranslation.value || !siteUrl)
    return []
  const translatedLocale = locales.value.find(item => item.code !== defaultLocale.value)
  const defaultLanguage = locales.value.find(item => item.code === defaultLocale.value)?.language ?? defaultLocale.value
  const translatedPath = docsLocalizedRoutePath(defaultRoutePath.value, translatedLocale?.code ?? 'id', defaultLocale.value)
  const defaultUrl = docsCanonicalUrl(defaultRoutePath.value, siteUrl, config.app.baseURL)
  return [
    { rel: 'alternate' as const, type: 'text/html', hreflang: defaultLanguage, href: defaultUrl },
    ...(translatedLocale?.language ? [{ rel: 'alternate' as const, type: 'text/html', hreflang: translatedLocale.language, href: docsCanonicalUrl(translatedPath, siteUrl, config.app.baseURL) }] : []),
    { rel: 'alternate' as const, type: 'text/html', hreflang: 'x-default', href: defaultUrl },
  ]
})
useSeoMeta({
  title: () => page.value?.title ?? appConfig.selarasDocs?.errors?.page?.title ?? messages.value.documentationUnavailable,
  description: () => page.value?.description ?? appConfig.selarasDocs?.site?.description,
  robots: () => error.value || fallback.value ? 'noindex' : undefined,
  ogUrl: () => canonicalUrl.value,
  ogLocale: () => (localeOption.value.language ?? locale.value).replace('-', '_'),
})
useHead(() => ({
  htmlAttrs: { lang: localeOption.value.language ?? locale.value },
  ...(fallback.value && { meta: [{ name: 'robots', content: 'noindex, follow' }] }),
  ...(appConfig.selarasDocs?.site?.titleTemplate && { titleTemplate: appConfig.selarasDocs.site.titleTemplate }),
  ...(canonicalUrl.value && { link: [{ rel: 'canonical', href: canonicalUrl.value, key: 'canonical', tagPriority: 'critical' }, ...alternateLinks.value] }),
}))

const proseComponents = {
  h1: ProseH1,
  h2: ProseH2,
  h3: ProseH3,
  h4: ProseH4,
  h5: ProseH5,
  h6: ProseH6,
  pre: ProsePre,
}

const tocLinks = computed(() => (page.value?.body?.toc?.links ?? []) as unknown as TocLink[])
const hasToc = computed(() => page.value?.toc !== false && page.value?.aside !== false && appConfig.selarasDocs?.toc?.enabled !== false && tocLinks.value.length > 0)
const surround = useDocsSurround()
</script>

<template>
  <DocsErrorState v-if="error || !page" kind="page" :pending="status === 'pending'" @retry="retryPage" />
  <SContainer v-else size="full" class="selaras-docs-page" :class="{ 'selaras-docs-page--fluid': appConfig.selarasDocs?.main?.fluid }">
    <div class="selaras-docs-page-grid" :class="{ 'selaras-docs-page-grid--wide': !hasToc }">
      <article class="selaras-docs-article">
        <p v-if="page!.description" class="selaras-docs-description">
          {{ page!.description }}
        </p>
        <p v-if="fallback" class="selaras-docs-translation-notice" role="note">
          {{ messages.untranslatedNotice }}
        </p>
        <ContentRenderer :value="page!" :components="proseComponents" class="selaras-docs-content selaras-prose">
          <template #empty>
            <DocsEmptyState />
          </template>
        </ContentRenderer>
        <DocsPageActions
          :path="contentPath"
          :title="page!.title"
          :edit-link="page!.editLink !== false"
          :issue-link="page!.issueLink !== false"
          :class="{ 'selaras-docs-page-actions--mobile': hasToc }"
        />
        <SContentSurround
          v-if="page!.prevNext !== false"
          :prev="surround.prev"
          :next="surround.next"
          class="selaras-docs-surround"
        />
      </article>
      <DocsTableOfContents v-if="hasToc" :links="tocLinks">
        <DocsPageActions :path="contentPath" :title="page!.title" :edit-link="page!.editLink !== false" :issue-link="page!.issueLink !== false" />
      </DocsTableOfContents>
    </div>
  </SContainer>
</template>
