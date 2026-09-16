<script setup lang="ts">
const items = [
  [
    { label: 'Edit', icon: 'hugeicons:pencil', shortcut: '⌘E' },
    { label: 'Duplicate', icon: 'hugeicons:copy', shortcut: '⌘D' },
  ],
]
</script>

<template>
  <SContextMenu :items="items">
    <template #item="{ item }">
      <span class="flex flex-1 items-center justify-between gap-4">
        {{ item.label }}
        <span class="text-xs text-[var(--selaras-resolved-text-muted)]">{{ item.shortcut }}</span>
      </span>
    </template>
    <div class="flex h-32 w-64 select-none items-center justify-center rounded-[var(--selaras-resolved-radius-md)] border border-dashed border-[var(--selaras-resolved-border-default)] text-sm text-[var(--selaras-resolved-text-muted)]">
      Right-click here
    </div>
  </SContextMenu>
</template>
