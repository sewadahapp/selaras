<script setup lang="ts">
defineProps<{
  id?: string
}>()
</script>

<template>
  <SProseH4 :id="id">
    <slot />
  </SProseH4>
</template>
