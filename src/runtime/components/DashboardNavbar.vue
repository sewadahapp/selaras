<script setup lang="ts">
import type { DashboardNavbarThemeSlots } from '../theme/dashboard-navbar'
import type { UiProp } from '../utils/ui'
import { computed } from 'vue'
import { dashboardNavbarTheme } from '../theme/dashboard-navbar'
import { resolveSlot, useComponentTheme, useRootProps } from '../utils/ui'

defineOptions({ inheritAttrs: false })

const props = defineProps<DashboardNavbarProps>()

defineSlots<DashboardNavbarSlots>()

export interface DashboardNavbarProps {
  title?: string
  ui?: UiProp<DashboardNavbarThemeSlots>
}

export interface DashboardNavbarSlots {
  /** Empty by default - nothing else in the Dashboard family auto-inserts content the consumer didn't ask for (DashboardResizeHandle, a DashboardPanel's own body, ...), so a sidebar-toggle button belongs here explicitly (`SDashboardSidebarToggle`) rather than being baked in, the same way it'd be composed anywhere else. */
  leading?: () => any
  title?: () => any
  /** Trailing content - actions, a search trigger, whatever the page needs. */
  default?: () => any
}

const theme = useComponentTheme('dashboardNavbar', dashboardNavbarTheme)
const ui = computed(() => theme.value())

const rootProps = useRootProps(() => ui.value.root, () => props.ui?.root)
const leftProps = computed(() => resolveSlot(ui.value.left, props.ui?.left))
const titleProps = computed(() => resolveSlot(ui.value.title, props.ui?.title))
const rightProps = computed(() => resolveSlot(ui.value.right, props.ui?.right))
</script>

<template>
  <div v-bind="rootProps">
    <div v-bind="leftProps">
      <slot name="leading" />
      <slot name="title">
        <p v-if="title" v-bind="titleProps">
          {{ title }}
        </p>
      </slot>
    </div>
    <div v-if="$slots.default" v-bind="rightProps">
      <slot />
    </div>
  </div>
</template>
