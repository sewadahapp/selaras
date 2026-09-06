<script setup lang="ts">
const items = [
  { label: 'Home', to: '/' },
  { label: 'Docs', to: '/docs' },
  { label: 'Coming soon', disabled: true },
]
</script>

<template>
  <SNavigationMenu :items="items" />
</template>
