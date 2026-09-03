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

// Forwarded into SplitterResizeHandle's own `ui` prop (not bound to an
// element directly here) - resolveSlot's returned {class, ...attrs} shape
// is itself a valid UiSlotValue, so this default background plus whatever
// a consumer overrides via `:ui.root` on DashboardResizeHandle itself both
// still land correctly. `line` passes straight through untouched -
// SplitterResizeHandle merges its own default there the same way it
// always has.
const rootUi = computed(() => resolveSlot(ui.value.root, props.ui?.root))
</script>

<template>
  <SplitterResizeHandle v-if="!isMobile" direction="horizontal" :ui="{ root: rootUi, line: props.ui?.line }" />
</template>
