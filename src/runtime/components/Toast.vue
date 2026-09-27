<script setup lang="ts">
import type { ToastPosition as ToastPositionType, ToastThemeSlots } from '../theme/toast'
import type { UiProp } from '../utils/ui'
import { ToastPortal, ToastViewport } from 'reka-ui'
import { computed, onUnmounted, ref, watch } from 'vue'
import { useToastService } from '../internal/programmatic-services'
import ProgrammaticTheme from '../internal/ProgrammaticTheme.vue'
import ToastItemRenderer from '../internal/ToastItemRenderer.vue'
import { getToastStackMargin } from '../internal/toast-stack'
import { toastTheme } from '../theme/toast'
import { resolveSlot, useComponentTheme } from '../utils/ui'

export type ToastPosition = ToastPositionType

export interface ToastProps {
  /** Where the toast viewport is pinned. @default 'bottom-right' */
  position?: ToastPositionType
  /** Shows every toast separately; set to `false` to layer them into a stack. @default true */
  expand?: boolean
  /** Default visibility time in milliseconds; a toast's own duration takes precedence. @default 5000 */
  duration?: number
  /** Maximum number of toasts shown at once; older toasts are removed when the limit is reached. @default 5 */
  max?: number
  ui?: UiProp<ToastThemeSlots>
}

const props = withDefaults(defineProps<ToastProps>(), {
  duration: 5000,
  max: 5,
})

const { toasts, remove, setMax, dispose } = useToastService()
const theme = useComponentTheme('toast', toastTheme)
const position = computed(() => props.position ?? 'bottom-right')
const hovered = ref(false)
const expanded = computed(() => (props.expand ?? true) || hovered.value)
const displayToasts = computed(() => position.value.startsWith('top') ? [...toasts.value].reverse() : toasts.value)
const ui = computed(() => theme.value({ position: position.value, expand: expanded.value }))
const toastHeights = ref(new Map<number, number>())

const viewportProps = computed(() => resolveSlot(ui.value.viewport, props.ui?.viewport))
function stackMargin(index: number): string | undefined {
  if (expanded.value || index === 0)
    return undefined

  const previousToast = displayToasts.value[index - 1]
  const previousHeight = previousToast ? toastHeights.value.get(previousToast.id) ?? 52 : 52
  return getToastStackMargin(previousHeight)
}

function updateToastHeight(id: number, height: number) {
  if (!Number.isFinite(height) || height <= 0)
    return
  const next = new Map(toastHeights.value)
  next.set(id, height)
  toastHeights.value = next
}

watch(() => props.max, setMax, { immediate: true })
onUnmounted(dispose)
</script>

<template>
  <ProgrammaticTheme
    v-for="(toast, index) in displayToasts"
    :key="toast.id"
    :snapshot="toast._theme"
  >
    <ToastItemRenderer :toast="toast" :ui="props.ui" :duration="props.duration" :expand="expanded" :position="position" :stack-margin="stackMargin(index)" @remove="remove" @resize="updateToastHeight(toast.id, $event)" />
  </ProgrammaticTheme>
  <ToastPortal>
    <ToastViewport v-bind="viewportProps" @mouseenter="hovered = true" @mouseleave="hovered = false" />
  </ToastPortal>
</template>
