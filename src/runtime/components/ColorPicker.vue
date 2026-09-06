<script setup lang="ts">
import type { VariantProps } from 'tailwind-variants'
import type { ColorPickerThemeSlots } from '../theme/color-picker'
import type { UiProp } from '../utils/ui'
import { ColorSwatch, DialogTitle } from 'reka-ui'
import { computed, ref, watch } from 'vue'
import { useIsMobile } from '../composables/use-media-query'
import { useMessages } from '../composables/use-messages'
import ColorPickerBody from '../internal/ColorPickerBody.vue'
import { colorPickerTheme } from '../theme/color-picker'
import { applyClassPrefix, resolveSlot, useComponentTheme } from '../utils/ui'
import Modal from './Modal.vue'
import Popover from './Popover.vue'

type ColorPickerVariants = VariantProps<typeof colorPickerTheme>

const props = withDefaults(defineProps<ColorPickerProps>(), {
  alpha: true,
})

const emit = defineEmits<ColorPickerEmits>()

export interface ColorPickerProps {
  modelValue?: string
  defaultValue?: string
  disabled?: boolean
  /** Shows an alpha (opacity) slider alongside hue. Reka's own hex output already extends to 8-digit hex (`#RRGGBBAA`) once alpha drops below 1, so this only toggles whether that channel is reachable in the UI - not a format change. @default true */
  alpha?: boolean
  /** A row of preset colors shown below the hex field - omitted entirely (no swatch row) unless given. */
  swatches?: string[]
  placeholder?: string
  /** Below a 768px viewport width, presents the popover as a centered Modal instead of a small anchored panel - easier to tap with a finger. Opt-in (defaults `false`), matching Select/Autocomplete/DatePicker's own mobileModal. */
  mobileModal?: boolean
  size?: ColorPickerVariants['size']
  color?: ColorPickerVariants['color']
  ui?: UiProp<ColorPickerThemeSlots>
}

export interface ColorPickerEmits {
  'update:modelValue': [value: string]
}

const messages = useMessages()

// Mirrors Slider.vue's own internalValue / Popover.vue's own internalOpen
// pattern - an always-concrete local ref synced with an optional external
// prop, rather than binding Reka's roots' `:model-value` directly to a
// prop that's currently undefined. None of Reka's five color primitives
// share a context of their own with each other (confirmed by reading
// their source - each is a fully independent Root), so this ref is what
// actually keeps all of them - area, hue slider, alpha slider, hex
// field, swatch picker - in sync: every one of them binds the exact same
// ref, and every one of them already normalizes/re-emits a hex string on
// its own, so no manual channel math is needed here.
const internalColor = ref(props.modelValue ?? props.defaultValue ?? '#000000')
watch(() => props.modelValue, (value) => {
  if (value !== undefined)
    internalColor.value = value
})

function onUpdateColor(value: string) {
  internalColor.value = value
  emit('update:modelValue', value)
}

// Same reasoning as Popover.vue's own internalOpen - always a concrete
// boolean, never left undefined. Needed here (unlike a plain Popover
// consumer) so open state survives the Popover<->Modal presentation
// swap below on a live resize - neither wrapper owns any state of its
// own that the swap would otherwise lose, since none of the five color
// primitives depend on either one's context.
const internalOpen = ref(false)
function onUpdateOpen(value: boolean) {
  internalOpen.value = value
}

const isMobile = useIsMobile()
const showMobileModal = computed(() => props.mobileModal && isMobile.value)

const theme = useComponentTheme('colorPicker', colorPickerTheme)
const ui = computed(() => theme.value({ size: props.size, color: props.color }))

const triggerProps = computed(() => resolveSlot(ui.value.trigger, props.ui?.trigger))
const triggerSwatchProps = computed(() => resolveSlot(ui.value.triggerSwatch, props.ui?.triggerSwatch))
const triggerValueProps = computed(() => resolveSlot(ui.value.triggerValue, props.ui?.triggerValue))
const areaProps = computed(() => resolveSlot(ui.value.area, props.ui?.area))
const thumbProps = computed(() => resolveSlot(ui.value.thumb, props.ui?.thumb))
const sliderRootProps = computed(() => resolveSlot(ui.value.sliderRoot, props.ui?.sliderRoot))
const trackProps = computed(() => resolveSlot(ui.value.track, props.ui?.track))
const fieldProps = computed(() => resolveSlot(ui.value.field, props.ui?.field))
const swatchListProps = computed(() => resolveSlot(ui.value.swatchList, props.ui?.swatchList))
const swatchProps = computed(() => resolveSlot(ui.value.swatch, props.ui?.swatch))
const swatchFillProps = computed(() => resolveSlot(ui.value.swatchFill, props.ui?.swatchFill))
const swatchIndicatorProps = computed(() => resolveSlot(ui.value.swatchIndicator, props.ui?.swatchIndicator))

const bodyProps = computed(() => ({
  modelValue: internalColor.value,
  disabled: props.disabled,
  alpha: props.alpha,
  swatches: props.swatches,
  placeholder: props.placeholder,
  areaProps: areaProps.value,
  thumbProps: thumbProps.value,
  sliderRootProps: sliderRootProps.value,
  trackProps: trackProps.value,
  fieldProps: fieldProps.value,
  swatchListProps: swatchListProps.value,
  swatchProps: swatchProps.value,
  swatchFillProps: swatchFillProps.value,
  swatchIndicatorProps: swatchIndicatorProps.value,
}))

// Passed to Popover's own `ui.content` override - none of Popover's own
// content chrome needs to change, only its size/padding for this picker's
// own layout, same as ComboboxSelectBase's mobile Modal content override.
const popoverUi = computed(() => ({ content: resolveSlot(ui.value.content, props.ui?.content) }))
// Same radius-matching override as Select/Autocomplete/DatePicker's own
// mobile Modal - Modal's own default content radius (--ui-radius-lg) is
// visibly larger than every desktop popover's own (--ui-radius-md).
// `mobileContent` (the inner div's own padding/spacing) is this
// component's own theme slot, not Modal's - applied directly on that div
// below, not through Modal's `ui` prop.
const mobileModalUi = computed(() => ({ content: 'rounded-[var(--ui-radius-md)]' }))
const mobileContentProps = computed(() => resolveSlot(ui.value.mobileContent, props.ui?.mobileContent))
</script>

<template>
  <Popover v-if="!showMobileModal" :open="internalOpen" :ui="popoverUi" @update:open="onUpdateOpen">
    <button
      type="button"
      :disabled="disabled"
      :aria-label="messages.colorPicker"
      v-bind="triggerProps"
    >
      <ColorSwatch :color="internalColor" v-bind="triggerSwatchProps" />
      <span v-bind="triggerValueProps">{{ internalColor }}</span>
    </button>

    <template #content>
      <ColorPickerBody v-bind="bodyProps" @update:model-value="onUpdateColor" />
    </template>
  </Popover>

  <Modal v-else :open="internalOpen" :ui="mobileModalUi" @update:open="onUpdateOpen">
    <button
      type="button"
      :disabled="disabled"
      :aria-label="messages.colorPicker"
      v-bind="triggerProps"
    >
      <ColorSwatch :color="internalColor" v-bind="triggerSwatchProps" />
      <span v-bind="triggerValueProps">{{ internalColor }}</span>
    </button>

    <template #content>
      <DialogTitle :class="applyClassPrefix('sr-only')">
        {{ messages.colorPicker }}
      </DialogTitle>
      <div v-bind="mobileContentProps">
        <ColorPickerBody v-bind="bodyProps" @update:model-value="onUpdateColor" />
      </div>
    </template>
  </Modal>
</template>
