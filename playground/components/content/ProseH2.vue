<script setup lang="ts">
defineProps<{
  id?: string
}>()
</script>

<template>
  <SProseH2 :id="id">
    <slot />
  </SProseH2>
</template>
