<script setup lang="ts">
defineProps<{
  id?: string
}>()
</script>

<template>
  <SProseH6 :id="id">
    <slot />
  </SProseH6>
</template>
