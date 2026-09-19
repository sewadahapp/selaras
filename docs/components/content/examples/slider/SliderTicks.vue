<script setup lang="ts">
const value = ref(50)
</script>

<template>
  <SSlider v-model="value" :step="25" show-ticks aria-label="Quality" />
</template>
