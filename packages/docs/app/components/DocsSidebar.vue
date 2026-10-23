<script setup lang="ts">
const appConfig = useAppConfig()
const { data: navigation } = useDocsNavigation()
const messages = useDocsMessages()
const sidebar = computed(() => appConfig.selarasDocs?.sidebar)
</script>

<template>
  <SPageAside
    v-if="sidebar?.enabled !== false"
    class="selaras-docs-sidebar"
    :aria-label="messages.documentationNavigation"
    :ui="{ root: 'top-16 h-[calc(100vh-4rem)]' }"
  >
    <SContentNavigation :navigation="navigation ?? []" :collapsed="sidebar?.collapsed" />
  </SPageAside>
</template>
