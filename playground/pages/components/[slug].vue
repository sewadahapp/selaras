<script setup lang="ts">
const route = useRoute()

const { data: page } = await useAsyncData(route.path, () => queryCollection('docs').path(route.path).first())

if (!page.value) {
  throw createError({ statusCode: 404, statusMessage: 'Component not found', fatal: true })
}
</script>

<template>
  <div class="flex gap-8">
    <SContainer size="full" class="min-w-0 flex-1 px-0">
      <SPageHeader :title="page?.title" :description="page?.description" />
      <ContentRenderer :value="page" class="docs-content flex flex-col gap-4 pt-6" />
    </SContainer>
    <SPageAside v-if="page?.body?.toc?.links?.length">
      <SContentToc :links="page.body.toc.links" />
    </SPageAside>
  </div>
</template>
