<script setup lang="ts">
const { open } = useCommandPalette()
</script>

<template>
  <SButton variant="ghost" color="neutral" aria-label="Search documentation" @click="open">
    Search
    <SKbd value="meta" size="sm" />
    <SKbd value="K" size="sm" />
  </SButton>
</template>
