<script setup lang="ts">
const { open } = useCommandPalette()
const icons = useIcons()
const messages = useMessages()
const docsMessages = useDocsMessages()
</script>

<template>
  <SButton variant="soft" color="neutral" size="sm" :icon="icons.search" :aria-label="docsMessages.searchDocumentation" class="sm:min-w-48 xl:min-w-60" @click="open">
    <span class="hidden sm:inline">{{ messages.search }}</span>
    <span class="ms-auto hidden gap-1 sm:flex">
      <SKbd value="meta" size="sm" />
      <SKbd value="K" size="sm" />
    </span>
  </SButton>
</template>
