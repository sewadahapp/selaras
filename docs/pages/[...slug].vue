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
const { data: page, error, status, refresh } = await useAsyncData(`selaras-docs:${route.path}`, () => queryCollection('docs').path(route.path).first())

if (!page.value && !error.value) {
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
useDocsSeo(() => ({ title: page.value?.title ?? 'Documentation unavailable', description: page.value?.description ?? appConfig.selarasDocs?.site?.description }))
useSeoMeta({ robots: () => error.value ? 'noindex' : undefined })

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
const surround = useDocsSurround()
</script>

<template>
  <DocsErrorState v-if="error || !page" kind="page" :pending="status === 'pending'" @retry="retryPage" />
  <SContainer v-else size="full" class="selaras-docs-page">
    <div class="selaras-docs-page-grid" :class="{ 'selaras-docs-page-grid--wide': page!.toc === false }">
      <article class="selaras-docs-article">
        <SPageHeader :title="page!.title" :description="page!.description" class="selaras-docs-page-header" />
        <ContentRenderer :value="page!" :components="proseComponents" class="selaras-docs-content selaras-prose" />
        <DocsEditLink v-if="page!.editLink !== false" :path="route.path" />
        <SContentSurround v-if="page!.prevNext !== false" :prev="surround.prev" :next="surround.next" class="selaras-docs-surround" />
      </article>
      <DocsTableOfContents v-if="page!.toc !== false" :links="tocLinks" />
    </div>
  </SContainer>
</template>

<style scoped>
.selaras-docs-page-grid--wide {
  grid-template-columns: minmax(0, 1fr);
}
</style>
