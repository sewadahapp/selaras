<script setup lang="ts">
import type { ToastItem } from '../internal/programmatic-services'
import type { ToastStackItem } from '../internal/toast-stack'
import type { ToastPosition as ToastPositionType, ToastThemeSlots } from '../theme/toast'
import type { UiProp } from '../utils/ui'
import { ToastPortal, ToastViewport } from 'reka-ui'
import { computed, onUnmounted, ref, watch } from 'vue'
import { useToastService } from '../internal/programmatic-services'
import ProgrammaticTheme from '../internal/ProgrammaticTheme.vue'
import { FALLBACK_TOAST_HEIGHT, layoutToastStack, placeToast, TOAST_EXIT_DURATION } from '../internal/toast-stack'
import ToastItemRenderer from '../internal/ToastItemRenderer.vue'
import { toastTheme } from '../theme/toast'
import { resolveSlot, useComponentTheme } from '../utils/ui'

export type ToastPosition = ToastPositionType

export interface ToastProps {
  /** Where the toast viewport is pinned. @default 'bottom-right' */
  position?: ToastPositionType
  /** Shows every toast separately instead of layering them into a stack that fans open on hover. @default false */
  expand?: boolean
  /** Default visibility time in milliseconds; a toast's own duration takes precedence. @default 5000 */
  duration?: number
  /** Maximum number of toasts shown at once; older toasts are removed when the limit is reached. @default 5 */
  max?: number
  ui?: UiProp<ToastThemeSlots>
}

const props = withDefaults(defineProps<ToastProps>(), {
  expand: false,
  duration: 5000,
  max: 5,
})

const { toasts, remove, setMax, dispose } = useToastService()
const theme = useComponentTheme('toast', toastTheme)
const position = computed(() => props.position ?? 'bottom-right')
const lift = computed(() => position.value.startsWith('top') ? 1 : -1)
const hovered = ref(false)
const focused = ref(false)
const expanded = computed(() => props.expand || hovered.value || focused.value)
const ui = computed(() => theme.value({ position: position.value, expand: expanded.value }))

// A toast removed from the queue stays rendered for a moment so it can
// animate out, while the rest of the stack already moves into place.
const rendered = ref<ToastItem[]>([])
const toastHeights = ref(new Map<number, number>())
const leaving = ref(new Set<number>())
const exitTimers = new Map<number, ReturnType<typeof setTimeout>>()

watch(() => [...toasts.value], (queued) => {
  const queuedIds = new Set(queued.map(toast => toast.id))
  const departing = rendered.value.filter(toast => !queuedIds.has(toast.id))
  if (departing.length) {
    const next = new Set(leaving.value)
    for (const toast of departing) {
      next.add(toast.id)
      if (!exitTimers.has(toast.id))
        exitTimers.set(toast.id, setTimeout(finishExit, TOAST_EXIT_DURATION, toast.id))
    }
    leaving.value = next
  }
  rendered.value = [...queued, ...departing].sort((a, b) => a.id - b.id)
}, { immediate: true })

function finishExit(id: number) {
  exitTimers.delete(id)
  rendered.value = rendered.value.filter(toast => toast.id !== id)
  const next = new Set(leaving.value)
  next.delete(id)
  leaving.value = next
  const heights = new Map(toastHeights.value)
  heights.delete(id)
  toastHeights.value = heights
}

// Front (newest) toast first.
const stacked = computed(() => rendered.value.filter(toast => !leaving.value.has(toast.id)).reverse())
const layout = computed(() => layoutToastStack(
  stacked.value.map(toast => toastHeights.value.get(toast.id) ?? FALLBACK_TOAST_HEIGHT),
  expanded.value,
))
const placements = computed(() => {
  const byId = new Map<number, ToastStackItem>()
  stacked.value.forEach((toast, index) => byId.set(toast.id, placeToast(index, layout.value, expanded.value, lift.value)))
  return byId
})

const viewportProps = computed(() => {
  const resolved = resolveSlot(ui.value.viewport, props.ui?.viewport)
  // The cards are positioned absolutely, so the viewport is sized to the
  // stack to keep the whole fanned-out area hoverable.
  const height = layout.value.height ? { height: `calc(${layout.value.height}px + 2rem)` } : undefined
  return { ...resolved, style: [height, resolved.style] }
})

function updateToastHeight(id: number, height: number) {
  if (!Number.isFinite(height) || height <= 0 || toastHeights.value.get(id) === height)
    return
  const next = new Map(toastHeights.value)
  next.set(id, height)
  toastHeights.value = next
}

function onFocusOut(event: FocusEvent) {
  const viewport = event.currentTarget as HTMLElement | null
  if (!viewport?.contains(event.relatedTarget as Node | null))
    focused.value = false
}

watch(() => props.max, setMax, { immediate: true })
onUnmounted(() => {
  for (const timer of exitTimers.values())
    clearTimeout(timer)
  exitTimers.clear()
  dispose()
})
</script>

<template>
  <ProgrammaticTheme
    v-for="toast in rendered"
    :key="toast.id"
    :snapshot="toast._theme"
  >
    <ToastItemRenderer
      :toast="toast"
      :ui="props.ui"
      :duration="props.duration"
      :expand="expanded"
      :position="position"
      :placement="placements.get(toast.id)"
      :leaving="leaving.has(toast.id)"
      @remove="remove"
      @resize="updateToastHeight(toast.id, $event)"
    />
  </ProgrammaticTheme>
  <ToastPortal>
    <ToastViewport
      v-bind="viewportProps"
      @mouseenter="hovered = true"
      @mouseleave="hovered = false"
      @focusin="focused = true"
      @focusout="onFocusOut"
    />
  </ToastPortal>
</template>
