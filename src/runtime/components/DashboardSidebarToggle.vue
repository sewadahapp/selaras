<script setup lang="ts">
import { inject } from 'vue'
import { useIcons } from '../composables/use-icons'
import { useMessages } from '../composables/use-messages'
import { DASHBOARD_INJECTION_KEY } from '../utils/injection-keys'
import { applyClassPrefix } from '../utils/ui'
import Button from './Button.vue'
import Icon from './Icon.vue'

const props = defineProps<DashboardSidebarToggleProps>()

defineSlots<DashboardSidebarToggleSlots>()

export interface DashboardSidebarToggleProps {
  /** @default icons.sidebarCollapse */
  icon?: string
}

export interface DashboardSidebarToggleSlots {
  /** Replaces the themed Button entirely with a fully custom trigger - `toggle`/`isCollapsed` are the exact values the default Button already wires up internally, so a replacement still behaves correctly (call `toggle` on click, style off `isCollapsed`). Not rendered at all outside a DashboardGroup/DashboardSidebar, same as the default. */
  default?: (props: { toggle: () => void, isCollapsed: boolean }) => any
}

// dashboard.toggleSidebar is populated by DashboardSidebar itself, once it
// mounts - absent (rather than a no-op) outside a DashboardGroup, or before
// a sibling DashboardSidebar has mounted into one, so this renders nothing
// until there's an actual sidebar it would control.
const dashboard = inject(DASHBOARD_INJECTION_KEY, null)

const icons = useIcons()
const messages = useMessages()

// No `ui` prop, no theme file of its own, and deliberately no
// `defineOptions({ inheritAttrs: false })` - with nothing else here to
// intercept them, Vue's own automatic attrs fallthrough already forwards
// anything a consumer passes (`color`, `variant`, `size`, `ui`, `class`,
// `as`, an extra `@click`, ...) straight onto whichever single root ends
// up rendered - the default Button below, or a consumer's own slot
// content replacing it - the same way ColorModeToggle does.
</script>

<template>
  <slot
    v-if="dashboard?.toggleSidebar.value"
    :toggle="dashboard.toggleSidebar.value"
    :is-collapsed="dashboard.isSidebarCollapsed.value"
  >
    <Button variant="ghost" color="neutral" :aria-label="messages.toggleSidebar" @click="dashboard.toggleSidebar.value?.()">
      <!--
        A slot override (not Button's own `icon` prop + `:ui.leadingIcon`) -
        that `:ui` object would collide with a consumer's own fallthrough
        `:ui` override on this component (plain props overwrite rather than
        merge), silently dropping this flip. The slot still gets Button's
        own size-driven class via the scoped `klass`, same as Button's own
        icon prop path.
      -->
      <template #icon="{ class: klass }">
        <Icon
          :name="props.icon ?? icons.sidebarCollapse"
          :data-collapsed="dashboard.isSidebarCollapsed.value ? '' : undefined"
          :class="[applyClassPrefix('transition-transform duration-200 rtl:scale-x-[-1] data-[collapsed]:scale-x-[-1] rtl:data-[collapsed]:scale-x-100'), klass]"
        />
      </template>
    </Button>
  </slot>
</template>
