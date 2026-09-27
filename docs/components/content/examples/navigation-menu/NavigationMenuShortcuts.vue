<script setup lang="ts">
const lastAction = ref('')

const items = [
  { label: 'Overview', icon: 'hugeicons:home-01', shortcut: 'mod+1', hotkey: true, onSelect: () => lastAction.value = 'Overview selected' },
  { label: 'Settings', icon: 'hugeicons:settings-01', shortcut: 'mod+2', hotkey: true, onSelect: () => lastAction.value = 'Settings selected' },
  { label: 'Help', icon: 'hugeicons:help-circle', shortcut: 'mod+/', onSelect: () => lastAction.value = 'Help selected' },
]
</script>

<template>
  <div class="flex flex-col items-start gap-2">
    <SNavigationMenu :items="items" />
    <p v-if="lastAction" class="text-sm text-[var(--selaras-resolved-text-muted)]">
      {{ lastAction }}
    </p>
  </div>
</template>
