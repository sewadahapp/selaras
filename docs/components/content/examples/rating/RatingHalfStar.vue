<script setup lang="ts">
const value = ref(3.5)
</script>

<template>
  <SRating v-model="value" :step="0.5" aria-label="Rate your experience" />
</template>
