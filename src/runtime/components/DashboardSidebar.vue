<script setup lang="ts">
import type { DashboardSidebarThemeSlots } from '../theme/dashboard-sidebar'
import type { UiProp } from '../utils/ui'
import { computed, inject, onMounted, onUnmounted, ref, watch } from 'vue'
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
  collapsedSize: 64,
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
  /** How wide the panel stays once collapsed - an icon-rail width by default, `0` to hide it entirely instead. @default 64 */
  collapsedSize?: number
  /** @default true */
  collapsible?: boolean
  /** @default 'px' */
  sizeUnit?: 'px' | '%'
  ui?: UiProp<DashboardSidebarThemeSlots>
}

export interface DashboardSidebarSlots {
  /** `isCollapsed` lets a header (a logo mark, say) swap to a narrower version once the sidebar collapses to its icon rail - always `false` on mobile, where there's no in-between state, just the drawer open or closed. */
  header?: (props: { isCollapsed: boolean }) => any
  /** Same `isCollapsed` scoping - hide a nav item's own label text once collapsed, keeping just its icon. */
  default?: (props: { isCollapsed: boolean }) => any
  footer?: (props: { isCollapsed: boolean }) => any
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

// DashboardGroup's own `v-if="!isMobile"`/`v-else` (see its own file)
// wraps its *entire* default slot, not just the Splitter - so THIS WHOLE
// COMPONENT is unmounted and freshly re-created on every mobile
// transition, not merely swapping an internal branch the way the
// SplitterPanel/Drawer choice below might suggest. That rules out
// watching `isMobile` for a `true -> false` transition from in here (an
// earlier version of this fix tried exactly that, and it silently never
// fired): the instance that would observe the transition is already
// gone by the time a fresh one mounts with `isMobile` already back at
// `false` - no prior value of its own left to compare against.
//
// `dashboard.lastDesktopWidthPx` is owned by DashboardGroup instead,
// specifically because DashboardGroup is the thing that actually
// persists across this transition (same reasoning as `toggleSidebar`/
// `isSidebarCollapsed` above). Written on every real resize below, read
// back on mount to correct Reka's own cookie-restored *percentage* -
// recalibrated against whatever the container's width happens to be at
// this exact remount (confirmed by reading Reka's own source: the
// persisted layout is always a percentage, never re-derived from the
// literal px value on a later remount) - which can differ from whatever
// it was when last saved for all kinds of ordinary reasons (DevTools'
// device toolbar, a differently-sized window), landing the sidebar at
// the wrong pixel width, sometimes dramatically so. Skipped on a page's
// very first mount - `dashboard.lastDesktopWidthPx.value` is still
// `undefined` then, nothing to correct against yet. `resize()` is
// itself sizeUnit-aware (px in, px out), so this stays accurate
// regardless of what Reka's own percentage did.
function handleResize(size: number) {
  if (dashboard)
    dashboard.lastDesktopWidthPx.value = size
}

onMounted(() => {
  const targetWidthPx = dashboard?.lastDesktopWidthPx.value
  if (isMobile.value || targetWidthPx === undefined)
    return
  // Reka's own initial layout calibration for a freshly (re)registered
  // panel runs off a ResizeObserver callback, not synchronously during
  // mount or even within a Vue `nextTick` - a short delay lets that
  // settle first, so this correction lands last and actually sticks
  // (confirmed empirically: a `nextTick`-only version of this ran too
  // early and got clobbered by Reka's own calibration immediately after).
  setTimeout(() => {
    panelRef.value?.resize(targetWidthPx)
  }, 50)
})

// Populates the shared ref DashboardGroup provides, rather than
// provide()-ing this directly - DashboardSidebar and DashboardNavbar are
// themselves siblings under DashboardGroup (DashboardNavbar sits inside
// DashboardPanel instead), not ancestor/descendant of each other, so a
// provide() from here would never reach it. See injection-keys.ts.
if (dashboard)
  dashboard.toggleSidebar.value = toggle

// Same reasoning, kept in sync via watch (rather than assigned once)
// since this one changes over the sidebar's lifetime, not just at mount -
// DashboardSidebarToggle reads it to mirror its own icon. Named to match
// the context field (not just `isCollapsed`, which template's own
// SplitterPanel-scoped-slot variable of the same name already shadows).
//
// On mobile this tracks `!mobileOpen` (not a hardcoded `false`) - the
// drawer starts closed, which *is* the sidebar's "not currently taking up
// space" state there, the same thing "collapsed" means on desktop. Get
// this wrong (as an earlier version of this file did) and the toggle
// icon shows "sidebar is open, click to collapse" on a fresh mobile load
// where the drawer is actually closed - backwards from what clicking it
// then does.
const isSidebarCollapsed = computed(() => isMobile.value ? !mobileOpen.value : (panelRef.value?.isCollapsed ?? false))
if (dashboard) {
  watch(isSidebarCollapsed, (value) => {
    dashboard.isSidebarCollapsed.value = value
  }, { immediate: true })
}

onUnmounted(() => {
  if (dashboard && dashboard.toggleSidebar.value === toggle)
    dashboard.toggleSidebar.value = undefined
})

const theme = useComponentTheme('dashboardSidebar', dashboardSidebarTheme)
const ui = computed(() => theme.value())

const rootProps = useRootProps(() => ui.value.root, () => props.ui?.root)
const headerProps = computed(() => resolveSlot(ui.value.header, props.ui?.header))
const scrollAreaProps = computed(() => resolveSlot(ui.value.scrollArea, props.ui?.scrollArea))
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
    @resize="handleResize"
  >
    <template #default="{ isCollapsed }">
      <div v-if="$slots.header" v-bind="headerProps">
        <slot name="header" :is-collapsed="isCollapsed" />
      </div>
      <ScrollArea v-bind="scrollAreaProps">
        <div v-bind="bodyProps">
          <slot :is-collapsed="isCollapsed" />
        </div>
      </ScrollArea>
      <div v-if="$slots.footer" v-bind="footerProps">
        <slot name="footer" :is-collapsed="isCollapsed" />
      </div>
    </template>
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
  <Drawer v-else v-model:open="mobileOpen" side="left" :handle="false" :ui="{ content: 'bg-[var(--ui-bg-elevated)]' }">
    <template v-if="$slots.header" #header>
      <slot name="header" :is-collapsed="false" />
    </template>
    <template #body>
      <slot :is-collapsed="false" />
    </template>
    <template v-if="$slots.footer" #footer>
      <slot name="footer" :is-collapsed="false" />
    </template>
  </Drawer>
</template>
