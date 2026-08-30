<script setup lang="ts">
const items = [
  [
    { label: 'Edit', icon: 'hugeicons:pencil', shortcut: '⌘E' },
    { label: 'Duplicate', icon: 'hugeicons:copy', shortcut: '⌘D' },
  ],
]
</script>

<template>
  <SDropdown :items="items">
    <template #item="{ item }">
      <span class="flex flex-1 items-center justify-between gap-4">
        {{ item.label }}
        <span class="text-xs text-[var(--ui-text-muted)]">{{ item.shortcut }}</span>
      </span>
    </template>
    <SButton variant="outline">
      Open dropdown
    </SButton>
  </SDropdown>
</template>
