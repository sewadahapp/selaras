<script setup lang="ts">
import type { VariantProps } from 'tailwind-variants'
import type { ToastThemeSlots } from '../theme/toast'
import type { ColorRole } from '../utils/color-registry'
import type { UiProp } from '../utils/ui'
import type { ToastItem } from './programmatic-services'
import { ToastClose, ToastDescription, ToastRoot, ToastTitle } from 'reka-ui'
import { computed } from 'vue'
import Button from '../components/Button.vue'
import Icon from '../components/Icon.vue'
import { useIcons } from '../composables/use-icons'
import { useMessages } from '../composables/use-messages'
import { toastTheme } from '../theme/toast'
import { isFeedbackIntent } from '../utils/icons'
import { resolveRegisteredColorRole } from '../utils/registered-colors'
import { resolveSlot, useComponentTheme, useThemeBindings } from '../utils/ui'

type ToastVariants = VariantProps<typeof toastTheme>

const props = defineProps<{
  toast: ToastItem
  ui?: UiProp<ToastThemeSlots>
}>()
const emit = defineEmits<{
  remove: [id: number]
}>()

const icons = useIcons()
const messages = useMessages()
const theme = useComponentTheme('toast', toastTheme)
const themeBindings = useThemeBindings()
const effectiveColor = computed<ColorRole | undefined>(() => props.toast.color
  ? resolveRegisteredColorRole(props.toast.color, 'info')
  : undefined)
const itemUi = computed(() => theme.value({ color: effectiveColor.value as ToastVariants['color'] }))
const rootProps = computed(() => resolveSlot(itemUi.value.root, props.ui?.root))
const iconProps = computed(() => resolveSlot(itemUi.value.icon, props.ui?.icon))
const titleProps = computed(() => resolveSlot(itemUi.value.title, props.ui?.title))
const descriptionProps = computed(() => resolveSlot(itemUi.value.description, props.ui?.description))
const closeProps = computed(() => resolveSlot(itemUi.value.close, props.ui?.close))
const iconName = computed(() => props.toast.icon ?? (
  effectiveColor.value && isFeedbackIntent(effectiveColor.value)
    ? icons.value[effectiveColor.value]
    : undefined
))
</script>

<template>
  <ToastRoot
    :duration="toast.duration ?? 5000"
    :data-selaras-theme="themeBindings['data-selaras-theme']"
    :data-selaras-mode="themeBindings['data-selaras-mode']"
    :data-selaras-color="effectiveColor"
    :style="themeBindings.style"
    v-bind="rootProps"
    @update:open="(open) => !open && emit('remove', toast.id)"
  >
    <Icon v-if="iconName" :name="iconName" v-bind="iconProps" />
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
</template>
