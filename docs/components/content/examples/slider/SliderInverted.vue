<script setup lang="ts">
const value = ref(30)
</script>

<template>
  <div class="flex w-full flex-col gap-4">
    <SSlider v-model="value" aria-label="Volume" />
    <SSlider v-model="value" inverted aria-label="Volume (inverted)" />
  </div>
</template>
