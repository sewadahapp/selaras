<script setup lang="ts">
defineProps<{
  code?: string
  language?: string
  filename?: string
  highlights?: number[]
  meta?: string
}>()
</script>

<template>
  <SProsePre :code="code" :language="language" :filename="filename" :highlights="highlights" :meta="meta">
    <slot />
  </SProsePre>
</template>
