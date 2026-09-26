<script setup lang="ts">
const { open } = useCommandPalette()
const icons = useIcons()
const messages = useMessages()
</script>

<template>
  <SButton variant="soft" color="neutral" size="sm" :icon="icons.search" aria-label="Search documentation" class="sm:min-w-48 xl:min-w-60" @click="open">
    <span class="hidden sm:inline">{{ messages.search }}</span>
    <span class="ms-auto flex gap-1">
      <SKbd value="meta" size="sm" />
      <SKbd value="K" size="sm" />
    </span>
  </SButton>
</template>
