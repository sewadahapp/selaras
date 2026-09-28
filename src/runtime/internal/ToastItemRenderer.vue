<script setup lang="ts">
import type { VariantProps } from 'tailwind-variants'
import type { ToastPosition, ToastThemeSlots } from '../theme/toast'
import type { ColorRole } from '../utils/color-registry'
import type { UiProp } from '../utils/ui'
import type { ToastItem } from './programmatic-services'
import type { ToastStackItem } from './toast-stack'
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
  placement: ToastStackItem | undefined
  leaving: boolean
}>()
const emit = defineEmits<{
  remove: [id: number]
  resize: [height: number]
}>()

const rootElement = ref<HTMLElement | null>(null)
function setRootElement(instance: unknown) {
  if (typeof HTMLElement === 'undefined')
    return
  const element = instance instanceof HTMLElement
    ? instance
    : (instance as { $el?: unknown } | null)?.$el
  if (element instanceof HTMLElement)
    rootElement.value = element
}

// A leaving card keeps the spot it had, so it animates out from there
// while the cards behind it move forward.
const placement = ref(props.placement)
watch(() => [props.placement, props.leaving] as const, ([next, leaving]) => {
  if (!leaving && next)
    placement.value = next
})

// While a card borrows the front card's height its own size says nothing
// about its content, so only a card at its natural height is measured. The
// layout box is read rather than the bounding rect, which the stack's scale
// transform would shrink.
const clamped = computed(() => placement.value?.height !== undefined)
watch(rootElement, (element, _previous, onCleanup) => {
  if (!element)
    return
  const updateHeight = () => {
    if (!clamped.value && !props.leaving)
      emit('resize', element.offsetHeight)
  }
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
  'data-stack': placement.value?.state,
  'style': [
    themeBindings.value.style,
    placement.value && { transform: placement.value.transform, height: placement.value.height, zIndex: placement.value.zIndex },
    rootProps.value.style,
  ],
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
    :open="!leaving"
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
      <Button size="sm" variant="ghost" :color="effectiveColor ?? 'neutral'" :icon="icons.close" :aria-label="messages.close" v-bind="closeProps" />
    </ToastClose>
  </ToastRoot>
</template>
