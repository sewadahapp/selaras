<script setup lang="ts">
import type { ToastSlots } from '../theme/toast'
import type { UiProp } from '../utils/ui'
import { ToastClose, ToastDescription, ToastPortal, ToastProvider, ToastRoot, ToastTitle, ToastViewport } from 'reka-ui'
import { computed } from 'vue'
import { useToast } from '../composables/use-toast'
import { toastTheme } from '../theme/toast'
import { resolveSlot, useComponentTheme } from '../utils/ui'

const props = defineProps<{
  ui?: UiProp<ToastSlots>
}>()

const { toasts, remove } = useToast()

const theme = useComponentTheme('toast', toastTheme)
const ui = computed(() => theme.value())

const viewportProps = computed(() => resolveSlot(ui.value.viewport, props.ui?.viewport))
const rootProps = computed(() => resolveSlot(ui.value.root, props.ui?.root))
const titleProps = computed(() => resolveSlot(ui.value.title, props.ui?.title))
const descriptionProps = computed(() => resolveSlot(ui.value.description, props.ui?.description))
const closeProps = computed(() => resolveSlot(ui.value.close, props.ui?.close))
</script>

<template>
  <ToastProvider>
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
      <ToastClose v-bind="closeProps">
        <Icon name="lucide:x" class="size-4" />
      </ToastClose>
    </ToastRoot>
    <ToastPortal>
      <ToastViewport v-bind="viewportProps" />
    </ToastPortal>
  </ToastProvider>
</template>
