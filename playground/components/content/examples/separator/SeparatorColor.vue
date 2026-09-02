<script setup lang="ts">
const colors = ['neutral', 'primary', 'secondary', 'success', 'danger', 'info', 'warning'] as const
</script>

<template>
  <div class="flex w-full flex-col gap-4">
    <SSeparator v-for="color in colors" :key="color" :color="color" />
  </div>
</template>
