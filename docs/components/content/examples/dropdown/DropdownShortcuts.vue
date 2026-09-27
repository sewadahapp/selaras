<script setup lang="ts">
const lastAction = ref('')

const items = [
  [
    { label: 'Save draft', icon: 'hugeicons:floppy-disk', shortcut: 'mod+s', hotkey: true, onSelect: () => lastAction.value = 'Saved draft' },
    { label: 'Preview', icon: 'hugeicons:view', shortcut: 'mod+p', onSelect: () => lastAction.value = 'Preview opened' },
  ],
  [
    { label: 'Context menu docs', icon: 'hugeicons:book-open-01', to: '/components/overlays/context-menu', shortcut: 'mod+shift+d', hotkey: true },
  ],
]
</script>

<template>
  <div class="flex flex-col items-start gap-2">
    <SDropdown :items="items">
      <SButton variant="outline">
        Open actions
      </SButton>
    </SDropdown>
    <p v-if="lastAction" class="text-sm text-[var(--selaras-resolved-text-muted)]">
      {{ lastAction }}
    </p>
  </div>
</template>
