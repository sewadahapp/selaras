<script setup lang="ts">
const items = [
  { label: 'Home', to: '/' },
  { label: 'Archived project', to: '/projects/archived', disabled: true },
  { label: 'Report' },
]
</script>

<template>
  <SBreadcrumb :items="items" />
</template>
