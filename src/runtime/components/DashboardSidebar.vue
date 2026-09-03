<script setup lang="ts">
import type { DashboardSidebarThemeSlots } from '../theme/dashboard-sidebar'
import type { UiProp } from '../utils/ui'
import { computed, inject, onUnmounted, ref } from 'vue'
import { dashboardSidebarTheme } from '../theme/dashboard-sidebar'
import { DASHBOARD_INJECTION_KEY } from '../utils/injection-keys'
import { resolveSlot, useComponentTheme, useRootProps } from '../utils/ui'
import Drawer from './Drawer.vue'
import ScrollArea from './ScrollArea.vue'
import SplitterPanel from './SplitterPanel.vue'

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<DashboardSidebarProps>(), {
  defaultSize: 260,
  minSize: 200,
  maxSize: 400,
  collapsedSize: 0,
  collapsible: true,
  sizeUnit: 'px',
})

defineSlots<DashboardSidebarSlots>()

export interface DashboardSidebarProps {
  /** @default 260 */
  defaultSize?: number
  /** @default 200 */
  minSize?: number
  /** @default 400 */
  maxSize?: number
  /** How wide the panel stays once collapsed - `0` hides it entirely. @default 0 */
  collapsedSize?: number
  /** @default true */
  collapsible?: boolean
  /** @default 'px' */
  sizeUnit?: 'px' | '%'
  ui?: UiProp<DashboardSidebarThemeSlots>
}

export interface DashboardSidebarSlots {
  header?: () => any
  default?: () => any
  footer?: () => any
}

const dashboard = inject(DASHBOARD_INJECTION_KEY, null)
const isMobile = computed(() => dashboard?.isMobile.value ?? false)

const panelRef = ref<InstanceType<typeof SplitterPanel>>()
const mobileOpen = ref(false)

function toggle() {
  if (isMobile.value) {
    mobileOpen.value = !mobileOpen.value
    return
  }
  if (panelRef.value?.isCollapsed)
    panelRef.value.expand()
  else
    panelRef.value?.collapse()
}

// Populates the shared ref DashboardGroup provides, rather than
// provide()-ing this directly - DashboardSidebar and DashboardNavbar are
// themselves siblings under DashboardGroup (DashboardNavbar sits inside
// DashboardPanel instead), not ancestor/descendant of each other, so a
// provide() from here would never reach it. See injection-keys.ts.
if (dashboard)
  dashboard.toggleSidebar.value = toggle

onUnmounted(() => {
  if (dashboard && dashboard.toggleSidebar.value === toggle)
    dashboard.toggleSidebar.value = undefined
})

const theme = useComponentTheme('dashboardSidebar', dashboardSidebarTheme)
const ui = computed(() => theme.value())

const rootProps = useRootProps(() => ui.value.root, () => props.ui?.root)
const headerProps = computed(() => resolveSlot(ui.value.header, props.ui?.header))
const bodyProps = computed(() => resolveSlot(ui.value.body, props.ui?.body))
const footerProps = computed(() => resolveSlot(ui.value.footer, props.ui?.footer))
</script>

<template>
  <SplitterPanel
    v-if="!isMobile"
    ref="panelRef"
    :default-size="defaultSize"
    :min-size="minSize"
    :max-size="maxSize"
    :collapsed-size="collapsedSize"
    :collapsible="collapsible"
    :size-unit="sizeUnit"
    v-bind="rootProps"
  >
    <div v-if="$slots.header" v-bind="headerProps">
      <slot name="header" />
    </div>
    <ScrollArea>
      <div v-bind="bodyProps">
        <slot />
      </div>
    </ScrollArea>
    <div v-if="$slots.footer" v-bind="footerProps">
      <slot name="footer" />
    </div>
  </SplitterPanel>
  <!--
    Drawer's own default slot is its *trigger* (see its own source) -
    not used here, since open/close is driven entirely by mobileOpen
    instead of a rendered trigger element. header/body/footer forward
    straight through to Drawer's own matching slots (and its own
    theming) rather than DashboardSidebar's own header/body/footer
    classes above - Drawer already handles its own chrome (including
    the accessible-name warning its dev-mode console check does when
    neither a `title` prop nor a `header` slot is present), and an
    overlay reads differently from an inline panel anyway, so there's
    no real reason to force the split-pane's exact classes onto it.
  -->
  <Drawer v-else v-model:open="mobileOpen" side="left" :handle="false">
    <template v-if="$slots.header" #header>
      <slot name="header" />
    </template>
    <template #body>
      <slot />
    </template>
    <template v-if="$slots.footer" #footer>
      <slot name="footer" />
    </template>
  </Drawer>
</template>
