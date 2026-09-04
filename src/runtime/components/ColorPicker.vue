<script setup lang="ts">
import type { VariantProps } from 'tailwind-variants'
import type { ColorPickerThemeSlots } from '../theme/color-picker'
import type { UiProp } from '../utils/ui'
import {
  ColorAreaArea,
  ColorAreaRoot,
  ColorAreaThumb,
  ColorFieldInput,
  ColorFieldRoot,
  ColorSliderRoot,
  ColorSliderThumb,
  ColorSliderTrack,
  ColorSwatch,
  ColorSwatchPickerItem,
  ColorSwatchPickerItemIndicator,
  ColorSwatchPickerItemSwatch,
  ColorSwatchPickerRoot,
} from 'reka-ui'
import { computed, ref, watch } from 'vue'
import { useIcons } from '../composables/use-icons'
import { useMessages } from '../composables/use-messages'
import { colorPickerTheme } from '../theme/color-picker'
import { resolveSlot, useComponentTheme } from '../utils/ui'
import Icon from './Icon.vue'
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
  size?: ColorPickerVariants['size']
  color?: ColorPickerVariants['color']
  ui?: UiProp<ColorPickerThemeSlots>
}

export interface ColorPickerEmits {
  'update:modelValue': [value: string]
}

const icons = useIcons()
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

// Passed to Popover's own `ui.content` override - none of Popover's own
// content chrome needs to change, only its size/padding for this picker's
// own layout, same as ComboboxSelectBase's mobile Modal content override.
const popoverUi = computed(() => ({ content: resolveSlot(ui.value.content, props.ui?.content) }))
</script>

<template>
  <Popover :ui="popoverUi">
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
      <ColorAreaRoot
        :model-value="internalColor"
        color-space="hsb"
        x-channel="saturation"
        y-channel="brightness"
        :disabled="disabled"
        @update:model-value="onUpdateColor"
      >
        <template #default="{ style }">
          <ColorAreaArea :style="style" v-bind="areaProps">
            <ColorAreaThumb v-bind="thumbProps" />
          </ColorAreaArea>
        </template>
      </ColorAreaRoot>

      <ColorSliderRoot
        :model-value="internalColor"
        channel="hue"
        :disabled="disabled"
        v-bind="sliderRootProps"
        @update:model-value="onUpdateColor"
      >
        <ColorSliderTrack v-bind="trackProps">
          <ColorSliderThumb v-bind="thumbProps" />
        </ColorSliderTrack>
      </ColorSliderRoot>

      <ColorSliderRoot
        v-if="alpha"
        :model-value="internalColor"
        channel="alpha"
        :disabled="disabled"
        v-bind="sliderRootProps"
        @update:model-value="onUpdateColor"
      >
        <ColorSliderTrack v-bind="trackProps">
          <ColorSliderThumb v-bind="thumbProps" />
        </ColorSliderTrack>
      </ColorSliderRoot>

      <ColorFieldRoot
        :model-value="internalColor"
        :placeholder="placeholder"
        :disabled="disabled"
        @update:model-value="onUpdateColor"
      >
        <ColorFieldInput v-bind="fieldProps" />
      </ColorFieldRoot>

      <ColorSwatchPickerRoot
        v-if="swatches?.length"
        :model-value="internalColor"
        :disabled="disabled"
        v-bind="swatchListProps"
        @update:model-value="onUpdateColor"
      >
        <ColorSwatchPickerItem
          v-for="hex in swatches"
          :key="hex"
          :value="hex"
          v-bind="swatchProps"
        >
          <ColorSwatchPickerItemSwatch v-bind="swatchFillProps" />
          <ColorSwatchPickerItemIndicator v-bind="swatchIndicatorProps">
            <Icon :name="icons.check" class="size-3" />
          </ColorSwatchPickerItemIndicator>
        </ColorSwatchPickerItem>
      </ColorSwatchPickerRoot>
    </template>
  </Popover>
</template>
