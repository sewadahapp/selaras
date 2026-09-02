<script setup lang="ts">
const colors = ['primary', 'neutral', 'secondary', 'success', 'danger', 'info', 'warning'] as const
</script>

<template>
  <div class="flex w-full flex-col gap-4">
    <SSlider v-for="color in colors" :key="color" :model-value="60" :color="color" :aria-label="color" />
  </div>
</template>
