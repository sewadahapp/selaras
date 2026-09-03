<script setup lang="ts">
import type { DashboardNavbarThemeSlots } from '../theme/dashboard-navbar'
import type { UiProp } from '../utils/ui'
import { computed, inject } from 'vue'
import { useIcons } from '../composables/use-icons'
import { useMessages } from '../composables/use-messages'
import { dashboardNavbarTheme } from '../theme/dashboard-navbar'
import { DASHBOARD_INJECTION_KEY } from '../utils/injection-keys'
import { resolveSlot, useComponentTheme, useRootProps } from '../utils/ui'
import Button from './Button.vue'

defineOptions({ inheritAttrs: false })

const props = defineProps<DashboardNavbarProps>()

defineSlots<DashboardNavbarSlots>()

export interface DashboardNavbarProps {
  title?: string
  ui?: UiProp<DashboardNavbarThemeSlots>
}

export interface DashboardNavbarSlots {
  title?: () => any
  /** Trailing content - actions, a search trigger, whatever the page needs. */
  default?: () => any
}

// dashboard.toggleSidebar is populated by DashboardSidebar itself, once it
// mounts - absent (rather than a no-op) outside a DashboardGroup, or
// before a sibling DashboardSidebar has mounted into one, so the toggle
// button only renders once there's an actual sidebar it would control.
const dashboard = inject(DASHBOARD_INJECTION_KEY, null)

const icons = useIcons()
const messages = useMessages()

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
      <Button
        v-if="dashboard?.toggleSidebar.value"
        :icon="icons.chevronsLeft"
        variant="ghost"
        color="neutral"
        :aria-label="messages.toggleSidebar"
        @click="dashboard.toggleSidebar.value?.()"
      />
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
