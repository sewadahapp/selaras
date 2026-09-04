<script setup lang="ts">
const open = ref(false)
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
    <SButton variant="outline" @click="open = true">
      Open command palette
    </SButton>
    <p v-if="result" class="text-sm text-[var(--ui-text-muted)]">
      Ran: {{ result }}
    </p>
  </div>

  <!--
    This docs page already has the site's own real command palette mounted
    globally (its Cmd/Ctrl+K), so this self-contained demo runs as its own
    locally-controlled instance instead of the shared useCommandPalette()
    singleton - shortcut disabled to avoid a second dialog stacking on top
    of the real one when the same key is pressed.
  -->
  <SCommandPalette v-model:open="open" :groups="groups" :shortcut="false" />
</template>
