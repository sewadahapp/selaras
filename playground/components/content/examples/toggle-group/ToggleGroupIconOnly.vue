<script setup lang="ts">
const items = [
  { label: 'List view', value: 'list', icon: 'hugeicons:list-view' },
  { label: 'Grid view', value: 'grid', icon: 'hugeicons:grid-view' },
]
</script>

<template>
  <SToggleGroup :items="items" default-value="list">
    <template #item="{ item }">
      <SIcon :name="item.icon!" class="size-4.5" />
      <span class="sr-only">{{ item.label }}</span>
    </template>
  </SToggleGroup>
</template>
