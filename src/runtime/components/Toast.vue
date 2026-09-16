<script setup lang="ts">
import type { ToastThemeSlots } from '../theme/toast'
import type { UiProp } from '../utils/ui'
import { ToastPortal, ToastViewport } from 'reka-ui'
import { computed, onUnmounted } from 'vue'
import { useToastService } from '../internal/programmatic-services'
import ProgrammaticTheme from '../internal/ProgrammaticTheme.vue'
import ToastItemRenderer from '../internal/ToastItemRenderer.vue'
import { toastTheme } from '../theme/toast'
import { resolveSlot, useComponentTheme } from '../utils/ui'

export interface ToastProps {
  ui?: UiProp<ToastThemeSlots>
}

const props = defineProps<ToastProps>()

const { toasts, remove, dispose } = useToastService()
const theme = useComponentTheme('toast', toastTheme)
const ui = computed(() => theme.value())

const viewportProps = computed(() => resolveSlot(ui.value.viewport, props.ui?.viewport))
onUnmounted(dispose)
</script>

<template>
  <ProgrammaticTheme
    v-for="toast in toasts"
    :key="toast.id"
    :snapshot="toast._theme"
  >
    <ToastItemRenderer :toast="toast" :ui="props.ui" @remove="remove" />
  </ProgrammaticTheme>
  <ToastPortal>
    <ToastViewport v-bind="viewportProps" />
  </ToastPortal>
</template>
