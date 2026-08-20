<script setup lang="ts">
defineProps<{
  id?: string
}>()
</script>

<template>
  <SProseH5 :id="id">
    <slot />
  </SProseH5>
</template>
