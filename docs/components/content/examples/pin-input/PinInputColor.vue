<script setup lang="ts">
const colors = ['primary', 'neutral', 'secondary', 'success', 'danger', 'info', 'warning'] as const
</script>

<template>
  <div class="flex w-full flex-col gap-3">
    <SPinInput v-for="color in colors" :key="color" :color="color" :aria-label="color" />
  </div>
</template>
