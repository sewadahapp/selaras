<script setup lang="ts">
import type { VariantProps } from 'tailwind-variants'
import type { ToastItem } from '../composables/use-toast'
import type { ToastThemeSlots } from '../theme/toast'
import type { ColorRole } from '../utils/color-registry'
import type { UiProp } from '../utils/ui'
import { ToastClose, ToastDescription, ToastPortal, ToastRoot, ToastTitle, ToastViewport } from 'reka-ui'
import { computed } from 'vue'
import { useIcons } from '../composables/use-icons'
import { useMessages } from '../composables/use-messages'
import { useToast } from '../composables/use-toast'
import { toastTheme } from '../theme/toast'
import { isFeedbackIntent } from '../utils/icons'
import { resolveRegisteredColorRole } from '../utils/registered-colors'
import { resolveSlot, useComponentTheme } from '../utils/ui'
import Button from './Button.vue'
import Icon from './Icon.vue'

type ToastVariants = VariantProps<typeof toastTheme>

export interface ToastProps {
  ui?: UiProp<ToastThemeSlots>
}

const props = defineProps<ToastProps>()

const { toasts, remove } = useToast()

const icons = useIcons()
const messages = useMessages()
const theme = useComponentTheme('toast', toastTheme)
const ui = computed(() => theme.value())

const viewportProps = computed(() => resolveSlot(ui.value.viewport, props.ui?.viewport))
const titleProps = computed(() => resolveSlot(ui.value.title, props.ui?.title))
const descriptionProps = computed(() => resolveSlot(ui.value.description, props.ui?.description))
const closeProps = computed(() => resolveSlot(ui.value.close, props.ui?.close))

// Resolved per toast (not a single shared computed) - `color` can differ
// between toasts stacked in the same viewport.
function rootPropsFor(toast: ToastItem) {
  return resolveSlot(theme.value({ color: effectiveColorFor(toast) as ToastVariants['color'] }).root, props.ui?.root)
}
function iconPropsFor(toast: ToastItem) {
  return resolveSlot(theme.value({ color: effectiveColorFor(toast) as ToastVariants['color'] }).icon, props.ui?.icon)
}
// The color's own default icon, unless an explicit icon overrides it (or
// there's no color at all, in which case there's nothing to show).
function iconNameFor(toast: ToastItem) {
  const color = effectiveColorFor(toast)
  return toast.icon ?? (color && isFeedbackIntent(color) ? icons.value[color] : undefined)
}
function effectiveColorFor(toast: ToastItem): ColorRole | undefined {
  return toast.color ? resolveRegisteredColorRole(toast.color, 'info') : undefined
}
</script>

<template>
  <ToastRoot
    v-for="toast in toasts"
    :key="toast.id"
    :duration="toast.duration ?? 5000"
    :data-selaras-theme="toast._themeScope ?? 'global'"
    :data-selaras-color="effectiveColorFor(toast)"
    v-bind="rootPropsFor(toast)"
    @update:open="(open) => !open && remove(toast.id)"
  >
    <Icon v-if="iconNameFor(toast)" :name="iconNameFor(toast)!" v-bind="iconPropsFor(toast)" />
    <div>
      <ToastTitle v-if="toast.title" v-bind="titleProps">
        {{ toast.title }}
      </ToastTitle>
      <ToastDescription v-if="toast.description" v-bind="descriptionProps">
        {{ toast.description }}
      </ToastDescription>
    </div>
    <ToastClose as-child>
      <Button size="sm" variant="ghost" color="neutral" :icon="icons.close" :aria-label="messages.close" v-bind="closeProps" />
    </ToastClose>
  </ToastRoot>
  <ToastPortal>
    <ToastViewport v-bind="viewportProps" />
  </ToastPortal>
</template>
