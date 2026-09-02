<script setup lang="ts">
const value = ref(30)
</script>

<template>
  <SSlider v-model="value" thumb-variant="bar" aria-label="Volume" />
</template>
