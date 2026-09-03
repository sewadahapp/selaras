<script setup lang="ts">
import type { SplitterResizeHandleThemeSlots } from '../theme/splitter-resize-handle'
import type { UiProp } from '../utils/ui'
import { computed, inject } from 'vue'
import { DASHBOARD_INJECTION_KEY } from '../utils/injection-keys'
import SplitterResizeHandle from './SplitterResizeHandle.vue'

defineProps<DashboardResizeHandleProps>()

export interface DashboardResizeHandleProps {
  ui?: UiProp<SplitterResizeHandleThemeSlots>
}

const dashboard = inject(DASHBOARD_INJECTION_KEY, null)
const isMobile = computed(() => dashboard?.isMobile.value ?? false)
</script>

<template>
  <SplitterResizeHandle v-if="!isMobile" direction="horizontal" :ui="ui" />
</template>
