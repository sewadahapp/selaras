<script setup lang="ts">
const items = [
  { label: 'Home', icon: 'hugeicons:home-01', to: '/' },
  { label: 'Docs', icon: 'hugeicons:book-02', to: '/docs' },
  { label: 'Settings', icon: 'hugeicons:settings-01', to: '/settings' },
]
</script>

<template>
  <SNavigationMenu :items="items" />
</template>
