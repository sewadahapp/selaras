<script setup lang="ts">
import type { DocsThemePreset } from '../composables/use-docs-theme-preset'

const preset = useDocsThemePreset()

const items = computed(() => [[
  {
    label: 'Pelog',
    onSelect: () => preset.value = 'pelog',
  },
  {
    label: 'Slendro',
    onSelect: () => preset.value = 'slendro',
  },
  {
    label: 'Degung',
    onSelect: () => preset.value = 'degung',
  },
]])

function swatchColor(theme: DocsThemePreset) {
  return theme === 'slendro' ? '#fd5e53' : theme === 'degung' ? '#2f6bff' : '#4d02e1'
}
</script>

<template>
  <SDropdown :items="items" :positioning="{ side: 'bottom', align: 'end' }">
    <SButton
      icon="hugeicons:paint-brush-01"
      variant="ghost"
      color="neutral"
      aria-label="Choose color theme"
      title="Choose color theme"
    />
    <template #item="{ item }">
      <span class="flex w-full min-w-32 items-center gap-2">
        <span class="size-3.5 rounded-full" :style="{ backgroundColor: swatchColor(item.label.toLowerCase() as DocsThemePreset) }" />
        <span class="flex-1">{{ item.label }}</span>
        <span v-if="preset === item.label.toLowerCase()" aria-hidden="true" class="text-[var(--selaras-resolved-color-primary-text)]">✓</span>
      </span>
    </template>
  </SDropdown>
</template>
