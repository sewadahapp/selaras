<script setup lang="ts">
import type { DashboardPanelThemeSlots } from '../theme/dashboard-panel'
import type { UiProp } from '../utils/ui'
import { computed, inject } from 'vue'
import { dashboardPanelTheme } from '../theme/dashboard-panel'
import { DASHBOARD_INJECTION_KEY } from '../utils/injection-keys'
import { useComponentTheme, useRootProps } from '../utils/ui'
import SplitterPanel from './SplitterPanel.vue'

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<DashboardPanelProps>(), {
  minSize: 30,
})

export interface DashboardPanelProps {
  /** Minimum width as a percentage of the group - non-collapsible, just guards against the sidebar squeezing this panel down to nothing. @default 30 */
  minSize?: number
  ui?: UiProp<DashboardPanelThemeSlots>
}

const dashboard = inject(DASHBOARD_INJECTION_KEY, null)
const isMobile = computed(() => dashboard?.isMobile.value ?? false)

const theme = useComponentTheme('dashboardPanel', dashboardPanelTheme)
const ui = computed(() => theme.value())

const rootProps = useRootProps(() => ui.value.root, () => props.ui?.root)
</script>

<template>
  <SplitterPanel v-if="!isMobile" :min-size="minSize" v-bind="rootProps">
    <slot />
  </SplitterPanel>
  <div v-else v-bind="rootProps">
    <slot />
  </div>
</template>
