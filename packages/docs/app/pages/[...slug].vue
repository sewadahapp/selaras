<script setup lang="ts">
import type { TocLink } from '@sewadah/selaras/components/ContentToc.vue'
import ProseH1 from '@sewadah/selaras/components/ProseH1.vue'
import ProseH2 from '@sewadah/selaras/components/ProseH2.vue'
import ProseH3 from '@sewadah/selaras/components/ProseH3.vue'
import ProseH4 from '@sewadah/selaras/components/ProseH4.vue'
import ProseH5 from '@sewadah/selaras/components/ProseH5.vue'
import ProseH6 from '@sewadah/selaras/components/ProseH6.vue'
import ProsePre from '@sewadah/selaras/components/ProsePre.vue'

const route = useRoute()
const appConfig = useAppConfig()
const nuxtApp = useNuxtApp()
const { data: page, error, status, refresh } = await useAsyncData(`selaras-docs:${route.path}`, () => queryCollection('docs').path(route.path).first())

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
useSeoMeta({
  title: () => page.value?.title ?? appConfig.selarasDocs?.errors?.page?.title ?? 'Documentation unavailable',
  description: () => page.value?.description ?? appConfig.selarasDocs?.site?.description,
  robots: () => error.value ? 'noindex' : undefined,
})
useHead(() => ({
  ...(appConfig.selarasDocs?.site?.titleTemplate && { titleTemplate: appConfig.selarasDocs.site.titleTemplate }),
  ...(appConfig.selarasDocs?.site?.url && {
    link: [{ rel: 'canonical', href: new URL(route.path, appConfig.selarasDocs.site.url).href }],
  }),
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
        <ContentRenderer :value="page!" :components="proseComponents" class="selaras-docs-content selaras-prose">
          <template #empty>
            <DocsEmptyState />
          </template>
        </ContentRenderer>
        <DocsPageActions
          :path="route.path"
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
        <DocsPageActions :path="route.path" :title="page!.title" :edit-link="page!.editLink !== false" :issue-link="page!.issueLink !== false" />
      </DocsTableOfContents>
    </div>
  </SContainer>
</template>
