<script setup lang="ts">
import type { ToastSlots } from '../theme/toast'
import type { UiProp } from '../utils/ui'
import { ToastClose, ToastDescription, ToastPortal, ToastRoot, ToastTitle, ToastViewport } from 'reka-ui'
import { computed } from 'vue'
import { useIcons } from '../composables/use-icons'
import { useToast } from '../composables/use-toast'
import { toastTheme } from '../theme/toast'
import { resolveSlot, useComponentTheme } from '../utils/ui'
import Button from './Button.vue'

const props = defineProps<{
  ui?: UiProp<ToastSlots>
}>()

const { toasts, remove } = useToast()

const icons = useIcons()
const theme = useComponentTheme('toast', toastTheme)
const ui = computed(() => theme.value())

const viewportProps = computed(() => resolveSlot(ui.value.viewport, props.ui?.viewport))
const rootProps = computed(() => resolveSlot(ui.value.root, props.ui?.root))
const titleProps = computed(() => resolveSlot(ui.value.title, props.ui?.title))
const descriptionProps = computed(() => resolveSlot(ui.value.description, props.ui?.description))
const closeProps = computed(() => resolveSlot(ui.value.close, props.ui?.close))
</script>

<template>
  <ToastRoot
    v-for="toast in toasts"
    :key="toast.id"
    :duration="toast.duration ?? 5000"
    v-bind="rootProps"
    @update:open="(open) => !open && remove(toast.id)"
  >
    <div>
      <ToastTitle v-if="toast.title" v-bind="titleProps">
        {{ toast.title }}
      </ToastTitle>
      <ToastDescription v-if="toast.description" v-bind="descriptionProps">
        {{ toast.description }}
      </ToastDescription>
    </div>
    <ToastClose as-child>
      <Button size="sm" variant="ghost" color="neutral" :icon="icons.close" aria-label="Close" v-bind="closeProps" />
    </ToastClose>
  </ToastRoot>
  <ToastPortal>
    <ToastViewport v-bind="viewportProps" />
  </ToastPortal>
</template>
