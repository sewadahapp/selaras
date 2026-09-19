<script setup lang="ts">
const { open } = useCommandPalette()
const icons = useIcons()
const messages = useMessages()
</script>

<template>
  <SButton variant="outline" color="neutral" size="sm" :icon="icons.search" aria-label="Search documentation" @click="open">
    <span class="hidden sm:inline">{{ messages.search }}</span>
    <SKbd value="meta" size="sm" />
    <SKbd value="K" size="sm" />
  </SButton>
</template>
