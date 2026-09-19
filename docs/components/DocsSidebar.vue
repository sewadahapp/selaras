<script setup lang="ts">
const route = useRoute()
const { data: navigation } = useDocsNavigation()

// The package default shows an entire consumer's tree. Selaras has several
// large top-level areas, so the desktop rail stays focused on the current one;
// the persistent header links remain the way to switch between areas.
const sectionNavigation = computed(() => {
  const section = `/${route.path.split('/')[1]}`
  return navigation.value?.find(item => item.path === section)?.children ?? []
})
</script>

<template>
  <SPageAside
    v-if="sectionNavigation.length"
    class="selaras-docs-sidebar"
    aria-label="Documentation navigation"
    :ui="{ root: 'top-16 h-[calc(100vh-4rem)]' }"
  >
    <SContentNavigation :navigation="sectionNavigation" />
  </SPageAside>
</template>
