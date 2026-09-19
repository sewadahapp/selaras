<script setup lang="ts">
const { data: navigation } = useDocsNavigation()
</script>

<template>
  <SPageAside class="selaras-docs-sidebar" aria-label="Documentation navigation">
    <SContentNavigation :navigation="navigation ?? []" />
  </SPageAside>
</template>
