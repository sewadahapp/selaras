<script setup lang="ts">
const links = [
  { id: 'usage', text: 'Usage', depth: 2 },
  { id: 'props', text: 'Props', depth: 2 },
]
</script>

<template>
  <SContentToc :links="links" class="w-48" />
</template>
