<script setup lang="ts">
import type { DocsThemePreset } from '../composables/use-docs-theme-preset'

const preset = useDocsThemePreset()
const open = ref(false)

const themes: Array<{
  value: DocsThemePreset
  label: string
  description: string
  primary: string
  surface: string
  border: string
}> = [
  {
    value: 'pelog',
    label: 'Pelog',
    description: 'Selaras violet',
    primary: '#4d02e1',
    surface: '#f5f3ff',
    border: '#ddd6fe',
  },
  {
    value: 'slendro',
    label: 'Slendro',
    description: 'Sunset and forest',
    primary: '#fd5e53',
    surface: '#fff3f2',
    border: '#ffc3bf',
  },
  {
    value: 'degung',
    label: 'Degung',
    description: 'Classic media player',
    primary: '#2b4c9b',
    surface: '#e9ecf1',
    border: '#8f99aa',
  },
]
</script>

<template>
  <SPopover v-model:open="open" :positioning="{ side: 'bottom', align: 'end', sideOffset: 8 }" :ui="{ content: 'p-2' }">
    <SButton
      variant="ghost"
      color="neutral"
      square
      aria-label="Choose documentation theme"
      title="Choose documentation theme"
      :aria-expanded="open"
    >
      <svg aria-hidden="true" viewBox="0 0 24 24" class="size-4.5" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">
        <path d="M12 3a9 9 0 1 0 0 18h1.1a2 2 0 0 0 1.4-3.4 1.7 1.7 0 0 1 1.2-2.9H18a3 3 0 0 0 3-3c0-4.8-4-8.7-9-8.7Z" />
        <circle cx="7.5" cy="11" r="1" fill="currentColor" stroke="none" />
        <circle cx="10" cy="7.5" r="1" fill="currentColor" stroke="none" />
        <circle cx="14" cy="7.5" r="1" fill="currentColor" stroke="none" />
      </svg>
    </SButton>

    <template #content>
      <section class="w-[min(19rem,calc(100vw-2rem))] p-1" aria-labelledby="docs-theme-picker-title">
        <div class="px-1 pb-1.5 pt-0.5">
          <h2 id="docs-theme-picker-title" class="text-sm font-semibold text-[var(--selaras-resolved-text-default)]">
            Appearance
          </h2>
          <p class="mt-0.5 text-xs text-[var(--selaras-resolved-text-muted)]">
            Choose a documentation theme
          </p>
        </div>

        <div class="flex flex-col gap-0.5" role="group" aria-label="Documentation themes">
          <button
            v-for="theme in themes"
            :key="theme.value"
            type="button"
            class="group flex w-full items-center gap-2.5 rounded-[var(--selaras-resolved-radius-md)] border p-1 text-start transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--_selaras-color-focus)]"
            :class="preset === theme.value
              ? 'border-[var(--selaras-resolved-color-primary-fill)] bg-[var(--selaras-resolved-surface-elevated)]'
              : 'border-transparent hover:bg-[var(--selaras-resolved-surface-elevated)]'"
            :aria-pressed="preset === theme.value"
            @click="preset = theme.value; open = false"
          >
            <span
              aria-hidden="true"
              class="flex h-10 w-14 shrink-0 items-end gap-1 overflow-hidden rounded-md border p-1.5 shadow-sm"
              :style="{ backgroundColor: theme.surface, borderColor: theme.border }"
            >
              <span class="h-full w-2 rounded-sm opacity-70" :style="{ backgroundColor: theme.border }" />
              <span class="h-4 flex-1 rounded-sm" :style="{ backgroundColor: theme.primary }" />
              <span class="h-2 w-2 rounded-full" :style="{ backgroundColor: theme.primary }" />
            </span>

            <span class="min-w-0 flex-1">
              <span class="block text-sm font-medium text-[var(--selaras-resolved-text-default)]">
                {{ theme.label }}
              </span>
              <span class="mt-0.5 block text-xs text-[var(--selaras-resolved-text-muted)]">
                {{ theme.description }}
              </span>
            </span>

            <svg
              v-if="preset === theme.value"
              aria-hidden="true"
              viewBox="0 0 20 20"
              class="size-4 shrink-0 text-[var(--selaras-resolved-color-primary-text)]"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="m4 10 4 4 8-8" />
            </svg>
          </button>
        </div>
      </section>
    </template>
  </SPopover>
</template>
