<script setup lang="ts">
import type { SelarasDocsViewportDevice } from '@sewadah/selaras-docs'

const selected = ref('compact')
const devices: SelarasDocsViewportDevice[] = [
  { value: 'compact', label: 'Compact', width: 360 },
  { value: 'wide', label: 'Wide', width: 1000 },
]
</script>

<template>
  <SButton id="consumer-example" color="primary">
    Consumer example
  </SButton>
  <DocsViewportPreview id="consumer-viewport" v-model:device="selected" src="/brand.svg" title="Consumer viewport" :devices="devices" :height="180">
    <template #toolbar-end="{ device }">
      <output id="viewport-selection">{{ selected }}:{{ device.width }}</output>
    </template>
  </DocsViewportPreview>
</template>
