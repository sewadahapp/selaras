<script setup lang="ts">
const items = [
  { label: 'Home', to: '/' },
  { label: 'Components', to: '/components' },
  { label: 'Breadcrumb' },
]
</script>

<template>
  <SBreadcrumb :items="items" separator-icon="hugeicons:slash" />
</template>
