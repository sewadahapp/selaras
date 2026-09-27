<script setup lang="ts">
const lastAction = ref('')

const items = [
  [
    { label: 'Rename', icon: 'hugeicons:pencil', shortcut: 'mod+e', hotkey: true, onSelect: () => lastAction.value = 'Rename selected' },
    { label: 'Share', icon: 'hugeicons:share-08', shortcut: 'mod+shift+s', onSelect: () => lastAction.value = 'Share selected' },
  ],
]
</script>

<template>
  <div class="flex flex-col items-start gap-2">
    <SContextMenu :items="items">
      <div class="flex h-32 w-72 select-none items-center justify-center rounded-[var(--selaras-resolved-radius-md)] border border-dashed border-[var(--selaras-resolved-border-default)] text-sm text-[var(--selaras-resolved-text-muted)]">
        Right-click here, then press ⌘/Ctrl+E
      </div>
    </SContextMenu>
    <p v-if="lastAction" class="text-sm text-[var(--selaras-resolved-text-muted)]">
      {{ lastAction }}
    </p>
  </div>
</template>
