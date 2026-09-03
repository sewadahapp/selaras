<script setup lang="ts">
const palette = useCommandPalette()
const result = ref<string>()

const groups = [
  {
    label: 'Actions',
    items: [
      { label: 'New file', icon: 'hugeicons:file-add', shortcut: 'meta+n', onSelect: () => result.value = 'New file' },
      { label: 'New folder', icon: 'hugeicons:folder-add', onSelect: () => result.value = 'New folder' },
    ],
  },
  {
    label: 'Navigation',
    items: [
      { label: 'Go to settings', icon: 'hugeicons:settings-01', shortcut: 'meta+,', onSelect: () => result.value = 'Go to settings' },
      { label: 'Go to profile', icon: 'hugeicons:user', onSelect: () => result.value = 'Go to profile' },
    ],
  },
]
</script>

<template>
  <div class="flex flex-col items-start gap-2">
    <SButton variant="outline" @click="palette.open()">
      Open command palette
      <template #trailing-icon>
        <SKbd value="meta" size="sm" /><SKbd value="k" size="sm" />
      </template>
    </SButton>
    <p v-if="result" class="text-sm text-[var(--ui-text-muted)]">
      Ran: {{ result }}
    </p>
  </div>

  <SCommandPalette :groups="groups" />
</template>
