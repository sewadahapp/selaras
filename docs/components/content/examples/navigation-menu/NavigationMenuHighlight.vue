<script setup lang="ts">
const items = [
  { label: 'Home', to: '/' },
  { label: 'Docs', to: '/docs', active: true },
  { label: 'Pricing', to: '/pricing' },
]
</script>

<template>
  <SNavigationMenu :items="items" highlight />
</template>
