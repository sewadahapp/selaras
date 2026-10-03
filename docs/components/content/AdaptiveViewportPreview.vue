<script setup lang="ts">
const devices = [
  { value: 'desktop', label: 'Desktop', icon: 'hugeicons:computer', width: 1024 },
  { value: 'tablet', label: 'Tablet', icon: 'hugeicons:tablet-01', width: 768 },
  { value: 'mobile', label: 'Mobile', icon: 'hugeicons:smart-phone-01', width: 390 },
] as const
const selected = ref<(typeof devices)[number]['value']>('mobile')
const device = computed(() => devices.find(device => device.value === selected.value)!)
const preset = useDocsThemePreset()
const colorMode = useColorMode()
const baseURL = useRuntimeConfig().app.baseURL
const previewUrl = `${baseURL.replace(/\/$/, '')}/examples/adaptive-interfaces`
</script>

<template>
  <section class="not-prose min-w-0" aria-label="Adaptive interfaces interactive preview">
    <div class="mb-3 flex flex-wrap items-center justify-between gap-3">
      <p class="text-sm text-[var(--selaras-resolved-text-muted)]" aria-live="polite">
        {{ device.label }} · {{ device.width }}px
      </p>
      <div class="inline-flex gap-1 rounded-[var(--selaras-resolved-radius-md)] border border-[var(--selaras-resolved-border-default)] p-1" role="group" aria-label="Preview viewport">
        <SButton
          v-for="option in devices" :key="option.value"
          :icon="option.icon" :aria-label="option.label" :aria-pressed="selected === option.value"
          :variant="selected === option.value ? 'solid' : 'ghost'"
          :color="selected === option.value ? 'primary' : 'neutral'"
          size="sm" square @click="selected = option.value"
        />
      </div>
    </div>
    <div class="overflow-x-auto rounded-[var(--selaras-resolved-radius-md)] border border-[var(--selaras-resolved-border-default)] bg-[var(--selaras-resolved-surface-elevated)] p-3 sm:p-4">
      <iframe
        :key="`${preset}:${colorMode.value}`" :src="previewUrl"
        :title="`${device.label} adaptive interfaces preview`"
        :style="{ width: `${device.width}px`, boxSizing: 'content-box' }"
        class="mx-auto block h-[540px] max-w-none rounded-[var(--selaras-resolved-radius-md)] border border-[var(--selaras-resolved-border-default)] bg-[var(--selaras-resolved-surface-default)]"
      />
    </div>
  </section>
</template>
