<script setup lang="ts">
const colors = ['primary', 'neutral', 'secondary', 'success', 'danger', 'info', 'warning'] as const
</script>

<template>
  <div class="flex w-full flex-col gap-3">
    <SRating v-for="color in colors" :key="color" :default-value="4" :color="color" :aria-label="color" />
  </div>
</template>
