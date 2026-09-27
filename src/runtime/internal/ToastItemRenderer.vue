<script setup lang="ts">
import type { VariantProps } from 'tailwind-variants'
import type { ToastPosition, ToastThemeSlots } from '../theme/toast'
import type { ColorRole } from '../utils/color-registry'
import type { UiProp } from '../utils/ui'
import type { ToastItem } from './programmatic-services'
import { ToastClose, ToastDescription, ToastRoot, ToastTitle } from 'reka-ui'
import { computed, ref, watch } from 'vue'
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
  duration: number
  expand: boolean
  position: ToastPosition
  stackMargin: string | undefined
}>()
const emit = defineEmits<{
  remove: [id: number]
  resize: [height: number]
}>()

const rootElement = ref<HTMLElement | null>(null)
const setRootElement = (instance: unknown) => {
  if (typeof HTMLElement === 'undefined')
    return
  const element = instance instanceof HTMLElement
    ? instance
    : (instance as { $el?: unknown } | null)?.$el
  if (element instanceof HTMLElement)
    rootElement.value = element
}

watch(rootElement, (element, _previous, onCleanup) => {
  if (!element)
    return
  const updateHeight = () => emit('resize', element.getBoundingClientRect().height)
  updateHeight()
  if (typeof ResizeObserver === 'undefined')
    return
  const observer = new ResizeObserver(updateHeight)
  observer.observe(element)
  onCleanup(() => observer.disconnect())
}, { flush: 'post' })

const icons = useIcons()
const messages = useMessages()
const theme = useComponentTheme('toast', toastTheme)
const themeBindings = useThemeBindings()
const effectiveColor = computed<ColorRole | undefined>(() => props.toast.color
  ? resolveRegisteredColorRole(props.toast.color, 'info')
  : undefined)
const itemUi = computed(() => theme.value({
  color: effectiveColor.value as ToastVariants['color'],
  expand: props.expand as ToastVariants['expand'],
  position: props.position as ToastVariants['position'],
}))
const rootProps = computed(() => resolveSlot(itemUi.value.root, props.ui?.root))
const rootBindings = computed(() => ({
  ...rootProps.value,
  style: [themeBindings.value.style, { marginBlockStart: props.stackMargin }, rootProps.value.style],
}))
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
    :ref="setRootElement"
    :duration="toast.duration ?? duration"
    :data-selaras-theme="themeBindings['data-selaras-theme']"
    :data-selaras-mode="themeBindings['data-selaras-mode']"
    :data-selaras-color="effectiveColor"
    v-bind="rootBindings"
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
