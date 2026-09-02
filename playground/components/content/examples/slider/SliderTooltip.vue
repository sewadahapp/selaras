<script setup lang="ts">
const value = ref(30)
</script>

<template>
  <SSlider v-model="value" tooltip aria-label="Volume" />
</template>
