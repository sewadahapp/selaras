<script setup lang="ts">
const items = [
  { label: 'List', value: 'list' },
  { label: 'Grid', value: 'grid', disabled: true },
  { label: 'Kanban', value: 'kanban' },
]
</script>

<template>
  <SToggleGroup :items="items" default-value="list" />
</template>
