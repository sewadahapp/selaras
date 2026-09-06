<script setup lang="ts">
import type { DashboardGroupThemeSlots } from '../theme/dashboard-group'
import type { UiProp } from '../utils/ui'
import { computed, onMounted, onUnmounted, provide, ref } from 'vue'
import { useCookie } from '#imports'
import { dashboardGroupTheme } from '../theme/dashboard-group'
import { DASHBOARD_INJECTION_KEY } from '../utils/injection-keys'
import { useComponentTheme, useRootProps } from '../utils/ui'
import Splitter from './Splitter.vue'

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<DashboardGroupProps>(), {
  autoSaveId: 'selaras-dashboard',
  mobileBreakpoint: 768,
})

export interface DashboardGroupProps {
  /** Persistence key for the sidebar's own width/collapse state - reuse the same id across pages that should share one remembered layout, or set a distinct one for pages that shouldn't. @default 'selaras-dashboard' */
  autoSaveId?: string
  /** Below this viewport width (px), DashboardSidebar switches from a resizable split-pane panel to a Drawer overlay. @default 768 */
  mobileBreakpoint?: number
  ui?: UiProp<DashboardGroupThemeSlots>
}

// Defaults to desktop on SSR/first render (no window there) - corrected
// once mounted, the same "safer default, corrected client-side" precedent
// ReadMore's own `truncated` default already uses. A real mismatch here
// self-corrects on hydration; there's no layout to reflow either way,
// since DashboardSidebar's own two branches (Splitter panel vs Drawer)
// occupy the same slot content.
const isMobile = ref(false)
let mediaQuery: MediaQueryList | undefined

function updateIsMobile() {
  isMobile.value = mediaQuery?.matches ?? false
}

onMounted(() => {
  mediaQuery = window.matchMedia(`(max-width: ${props.mobileBreakpoint - 1}px)`)
  updateIsMobile()
  mediaQuery.addEventListener('change', updateIsMobile)
})
onUnmounted(() => mediaQuery?.removeEventListener('change', updateIsMobile))

const toggleSidebar = ref<(() => void) | undefined>(undefined)
const isSidebarCollapsed = ref(false)
const lastDesktopWidthPx = ref<number | undefined>(undefined)
provide(DASHBOARD_INJECTION_KEY, { isMobile, toggleSidebar, isSidebarCollapsed, lastDesktopWidthPx })

// Cookie-backed, not Reka's own default localStorage-backed storage -
// same-origin server-readable, portable across a full page reload (not
// just client-side navigation), and works with privacy tooling that
// blocks localStorage but allows first-party cookies. Reka calls
// getItem/setItem with its own internal key (a "reka:<autoSaveId>"
// string) - ignored here in favor of always reading/writing this one
// cookie, since there's exactly one per DashboardGroup instance anyway.
//
// Doesn't eliminate a first-paint flash of the default width, though,
// even though the value is genuinely available server-side - confirmed
// by reading Reka's own source: its layout-restore call
// (loadPanelGroupState, SplitterGroup.js) lives inside a plain `watch()`
// callback triggered by a child panel registering itself, not something
// invoked synchronously during setup(). Vue's SSR render pass doesn't
// flush pending watchers the way client-side reactivity does, so that
// callback simply never runs server-side regardless of what the storage
// object returns - a pre-existing Reka limitation, not something wiring
// in a cookie can work around from here. The corrected width still
// applies quickly once mounted, just not before that first paint.
// Custom encode/decode - the value handed to setItem is already a JSON
// string (Reka's own JSON.stringify of its layout state, not a plain JS
// value). Nuxt's default cookie codec doesn't know that: it JSON.parses
// the string to check its type, sees an object, and JSON.stringifies the
// whole thing again on top - a real, still-correct-either-way round trip
// (decode symmetrically unwraps it), but it leaves the cookie itself
// doubly-escaped and roughly twice the size for no reason. Treating the
// value as already-opaque text here keeps the wire value a plain,
// directly-readable JSON blob instead.
const layoutCookie = useCookie<string | undefined>(props.autoSaveId, {
  default: () => undefined,
  encode: value => encodeURIComponent(value ?? ''),
  decode: value => (value ? decodeURIComponent(value) : undefined),
})
const storage = {
  getItem: () => layoutCookie.value ?? null,
  setItem: (_name: string, value: string) => {
    layoutCookie.value = value
  },
}

const theme = useComponentTheme('dashboardGroup', dashboardGroupTheme)
const ui = computed(() => theme.value())

const rootProps = useRootProps(() => ui.value.root, () => props.ui?.root)
</script>

<template>
  <Splitter v-if="!isMobile" direction="horizontal" :auto-save-id="autoSaveId" :storage="storage" v-bind="rootProps">
    <slot />
  </Splitter>
  <div v-else v-bind="rootProps">
    <slot />
  </div>
</template>
