<script setup lang="ts">
import type { TocLink } from '@sewadah/selaras/components/ContentToc.vue'

defineProps<{
  links: TocLink[]
}>()

const appConfig = useAppConfig()
const docsConfig = computed(() => appConfig.selarasDocs ?? {})
</script>

<template>
  <SPageAside
    v-if="links.length && docsConfig.toc?.enabled !== false"
    class="selaras-docs-toc"
    aria-label="Table of contents"
    :ui="{ root: 'top-16 h-[calc(100vh-4rem)]' }"
  >
    <SContentToc :links="links" :title="docsConfig.toc?.title" />
  </SPageAside>
</template>
