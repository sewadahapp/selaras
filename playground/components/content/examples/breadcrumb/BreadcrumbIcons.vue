<script setup lang="ts">
const items = [
  { label: 'Home', to: '/', icon: 'hugeicons:home-01' },
  { label: 'Settings', to: '/settings', icon: 'hugeicons:settings-01' },
  { label: 'Profile', icon: 'hugeicons:user' },
]
</script>

<template>
  <SBreadcrumb :items="items" />
</template>
