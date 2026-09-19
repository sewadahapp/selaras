<script setup lang="ts">
const colors = ['primary', 'neutral', 'secondary', 'success', 'danger', 'info', 'warning'] as const

const items = [
  { label: 'Home', to: '/' },
  { label: 'Docs', to: '/docs', active: true },
  { label: 'Pricing', to: '/pricing' },
]
</script>

<template>
  <div class="flex flex-col gap-4">
    <SNavigationMenu v-for="color in colors" :key="color" :items="items" :color="color" />
  </div>
</template>
