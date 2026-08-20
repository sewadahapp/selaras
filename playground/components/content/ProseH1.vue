<script setup lang="ts">
defineProps<{
  id?: string
}>()
</script>

<template>
  <SProseH1 :id="id">
    <slot />
  </SProseH1>
</template>
