<script setup lang="ts">
const route = useRoute()
const { data: navigation } = useDocsNavigation()
const messages = useDocsMessages()

// The package default shows an entire consumer's tree. Selaras has several
// large top-level areas, so the desktop rail stays focused on the current one;
// the persistent header links remain the way to switch between areas.
const sectionNavigation = computed(() => {
  return navigation.value?.find(item => item.children?.length && (
    route.path === item.path || route.path.startsWith(`${item.path}/`)
  ))?.children ?? []
})
</script>

<template>
  <SPageAside
    v-if="sectionNavigation.length"
    class="selaras-docs-sidebar"
    :aria-label="messages.documentationNavigation"
    :ui="{ root: 'top-16 h-[calc(100vh-4rem)]' }"
  >
    <SContentNavigation :navigation="sectionNavigation" />
  </SPageAside>
</template>
