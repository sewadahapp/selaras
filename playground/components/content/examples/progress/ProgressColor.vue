<script setup lang="ts">
const colors = ['primary', 'neutral', 'secondary', 'success', 'danger', 'info', 'warning'] as const
</script>

<template>
  <div class="flex w-64 flex-col gap-3">
    <SProgress v-for="color in colors" :key="color" :model-value="65" :color="color" />
  </div>
</template>
