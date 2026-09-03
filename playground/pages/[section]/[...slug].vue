<script setup lang="ts">
const route = useRoute()

const { data: page } = await useAsyncData(route.path, () => queryCollection('docs').path(route.path).first())

if (!page.value) {
  throw createError({ statusCode: 404, statusMessage: 'Page not found', fatal: true })
}

// @nuxtjs/mdc ships its own built-in default prose components under the
// exact bare names (ProseH1, ProsePre, ...) this module's own second
// addComponentsDir registration also targets - confirmed by reading its
// source (dist/runtime/components/prose/*.vue) that its own defaults win
// that collision regardless of an explicit `priority`, since MDCRenderer
// never does global-name component resolution for these tags at all; it
// resolves through this `components` prop instead (spread last, over its
// own `prose-*` defaults - see MDCRenderer.vue's own `tags` computed).
// This is the actual, verified-working way to wire Selaras's own
// ProsePre/ProseH1-H6 into @nuxt/content - see prose.md.
const proseComponents = {
  h1: 'SProseH1',
  h2: 'SProseH2',
  h3: 'SProseH3',
  h4: 'SProseH4',
  h5: 'SProseH5',
  h6: 'SProseH6',
  pre: 'SProsePre',
}

const surround = useDocsSurround()
</script>

<template>
  <div class="flex gap-8">
    <SContainer size="full" class="min-w-0 flex-1 px-0">
      <SPageHeader :title="page?.title" :description="page?.description" />
      <ContentRenderer :value="page" :components="proseComponents" class="docs-content selaras-prose pt-6" />
      <SContentSurround :prev="surround.prev" :next="surround.next" class="mt-8" />
    </SContainer>
    <SPageAside v-if="page?.body?.toc?.links?.length" :ui="{ root: 'top-16 h-[calc(100vh-4rem)]' }">
      <SContentToc :links="page.body.toc.links" />
    </SPageAside>
  </div>
</template>
