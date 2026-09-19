<script setup lang="ts">
const { data: navigation } = useDocsNavigation()
</script>

<template>
  <SPageAside
    class="selaras-docs-sidebar"
    aria-label="Documentation navigation"
    :ui="{ root: 'top-16 h-[calc(100vh-4rem)]' }"
  >
    <SContentNavigation :navigation="navigation ?? []" />
  </SPageAside>
</template>
