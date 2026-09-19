<script setup lang="ts">
const items = [
  { label: 'Home', to: '/' },
  { label: 'Docs', to: '/docs' },
  { label: 'Pricing', to: '/pricing' },
  { label: 'About', to: '/about' },
]
</script>

<template>
  <SNavigationMenu :items="items" />
</template>
