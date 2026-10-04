<script setup lang="ts">
import type { SplitterResizeHandleThemeSlots } from '../theme/splitter-resize-handle'
import type { UiProp } from '../utils/ui'
import { computed, inject } from 'vue'
import { dashboardResizeHandleTheme } from '../theme/dashboard-resize-handle'
import { DASHBOARD_INJECTION_KEY } from '../utils/injection-keys'
import { resolveSlot, useComponentTheme } from '../utils/ui'
import SplitterResizeHandle from './SplitterResizeHandle.vue'

const props = defineProps<DashboardResizeHandleProps>()

export interface DashboardResizeHandleProps {
  ui?: UiProp<SplitterResizeHandleThemeSlots>
}

const dashboard = inject(DASHBOARD_INJECTION_KEY, null)
const isMobile = computed(() => dashboard?.isMobile.value ?? false)

const theme = useComponentTheme('dashboardResizeHandle', dashboardResizeHandleTheme)
const ui = computed(() => theme.value())

// Merge the dashboard defaults before forwarding each slot to the splitter.
const rootUi = computed(() => resolveSlot(ui.value.root, props.ui?.root))
const lineUi = computed(() => resolveSlot(ui.value.line, props.ui?.line))
</script>

<template>
  <SplitterResizeHandle v-if="!isMobile" direction="horizontal" :ui="{ root: rootUi, line: lineUi }" />
</template>
