<script setup lang="ts">
defineProps<{
  id?: string
}>()
</script>

<template>
  <SProseH3 :id="id">
    <slot />
  </SProseH3>
</template>
