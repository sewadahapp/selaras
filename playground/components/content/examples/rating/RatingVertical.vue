<script setup lang="ts">
const value = ref(3)
</script>

<template>
  <SRating v-model="value" orientation="vertical" aria-label="Rate your experience" />
</template>
