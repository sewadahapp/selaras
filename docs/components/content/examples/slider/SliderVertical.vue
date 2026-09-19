<script setup lang="ts">
const value = ref(40)
</script>

<template>
  <SSlider v-model="value" orientation="vertical" aria-label="Height" />
</template>
