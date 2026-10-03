<script setup lang="ts">
import type { SelarasDocsViewportDevice } from '../../../types'

const props = withDefaults(defineProps<{
  src: string
  title?: string
  devices?: readonly SelarasDocsViewportDevice[]
  defaultDevice?: string
  height?: number
  reloadKey?: string | number
}>(), {
  title: 'Responsive example',
  defaultDevice: 'mobile',
  height: 540,
})
const selected = defineModel<string>('device')
const defaultDevices: readonly SelarasDocsViewportDevice[] = [
  { value: 'desktop', label: 'Desktop', icon: 'hugeicons:computer', width: 1024 },
  { value: 'tablet', label: 'Tablet', icon: 'hugeicons:tablet-01', width: 768 },
  { value: 'mobile', label: 'Mobile', icon: 'hugeicons:smart-phone-01', width: 390 },
]
const devices = computed(() => props.devices?.length ? props.devices : defaultDevices)
const device = computed(() => devices.value.find(device => device.value === (selected.value ?? props.defaultDevice)) ?? devices.value[0]!)
function selectDevice(value: string) {
  selected.value = value
}
const assetUrl = useDocsAssetUrl()
const previewUrl = computed(() => assetUrl(props.src))
</script>

<template>
  <section class="not-prose min-w-0" :aria-label="title">
    <slot name="toolbar" :device="device" :devices="devices" :select-device="selectDevice">
      <div class="mb-3 flex flex-wrap items-center justify-between gap-3">
        <slot name="toolbar-start" :device="device">
          <p class="text-sm text-[var(--selaras-resolved-text-muted)]" aria-live="polite">
            {{ device.label }} · {{ device.width }}px
          </p>
        </slot>
        <div class="flex items-center gap-2">
          <div class="inline-flex gap-1 rounded-[var(--selaras-resolved-radius-md)] border border-[var(--selaras-resolved-border-default)] p-1" role="group" aria-label="Preview viewport">
            <SButton
              v-for="option in devices" :key="option.value"
              :icon="option.icon" :aria-label="option.label" :aria-pressed="device.value === option.value"
              :variant="device.value === option.value ? 'solid' : 'ghost'"
              :color="device.value === option.value ? 'primary' : 'neutral'"
              size="sm" :square="!!option.icon" @click="selectDevice(option.value)"
            >
              <template v-if="!option.icon">
                {{ option.label }}
              </template>
            </SButton>
          </div>
          <slot name="toolbar-end" :device="device" />
        </div>
      </div>
    </slot>
    <div class="overflow-x-auto rounded-[var(--selaras-resolved-radius-md)] border border-[var(--selaras-resolved-border-default)] bg-[var(--selaras-resolved-surface-elevated)] p-3 sm:p-4">
      <iframe
        :key="reloadKey" :src="previewUrl"
        :title="`${title} — ${device.label}`"
        :style="{ width: `${device.width}px`, height: `${height}px`, boxSizing: 'content-box' }"
        class="mx-auto block max-w-none rounded-[var(--selaras-resolved-radius-md)] border border-[var(--selaras-resolved-border-default)] bg-[var(--selaras-resolved-surface-default)]"
      />
    </div>
  </section>
</template>
