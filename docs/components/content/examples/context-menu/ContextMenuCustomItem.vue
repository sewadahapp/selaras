<script setup lang="ts">
const items = [
  [
    { label: 'Edit', icon: 'hugeicons:pencil', shortcut: 'mod+e', hotkey: true },
    { label: 'Duplicate', icon: 'hugeicons:copy', shortcut: 'mod+d', hotkey: true },
  ],
]
</script>

<template>
  <SContextMenu :items="items">
    <template #item="{ item }">
      <span class="flex-1">{{ item.label }}</span>
    </template>
    <div class="flex h-32 w-64 select-none items-center justify-center rounded-[var(--selaras-resolved-radius-md)] border border-dashed border-[var(--selaras-resolved-border-default)] text-sm text-[var(--selaras-resolved-text-muted)]">
      Right-click here
    </div>
  </SContextMenu>
</template>
