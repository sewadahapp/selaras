<script setup lang="ts">
const items = [
  [
    { label: 'Edit', icon: 'hugeicons:pencil', shortcut: 'mod+e', hotkey: true },
    { label: 'Duplicate', icon: 'hugeicons:copy', shortcut: 'mod+d', hotkey: true },
  ],
]
</script>

<template>
  <SDropdown :items="items">
    <template #item="{ item }">
      <span class="flex-1">{{ item.label }}</span>
    </template>
    <SButton variant="outline">
      Open dropdown
    </SButton>
  </SDropdown>
</template>
