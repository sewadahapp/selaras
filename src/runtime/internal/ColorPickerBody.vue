<script setup lang="ts">
import type { AcceptableValue, Color } from 'reka-ui'
import {
  ColorAreaArea,
  ColorAreaRoot,
  ColorAreaThumb,
  ColorFieldInput,
  ColorFieldRoot,
  ColorSliderRoot,
  ColorSliderThumb,
  ColorSliderTrack,
  ColorSwatchPickerItem,
  ColorSwatchPickerItemIndicator,
  ColorSwatchPickerItemSwatch,
  ColorSwatchPickerRoot,
} from 'reka-ui'
import Icon from '../components/Icon.vue'
import { useIcons } from '../composables/use-icons'

// ColorPicker.vue's own popover/mobile-modal-shared content - everything
// that used to sit inside its <Popover>'s #content slot, split out so the
// exact same markup can be instantiated once for either presentation
// (desktop Popover or mobile Modal) without duplicating the area/slider/
// field/swatch-picker wiring between them. None of these five Reka
// primitives share context with a Popover/Modal ancestor (each is a
// fully independent Root keyed only off the shared `modelValue` hex
// string passed in), so unlike ComboboxSelectBody/DatePicker*Body this
// has no popper-positioning-only chrome to leave out - the whole thing
// is equally at home in either wrapper.
export interface ColorPickerBodyProps {
  modelValue: string
  disabled?: boolean
  alpha?: boolean
  swatches?: string[]
  placeholder?: string
  areaProps?: Record<string, unknown>
  thumbProps?: Record<string, unknown>
  sliderRootProps?: Record<string, unknown>
  trackProps?: Record<string, unknown>
  fieldProps?: Record<string, unknown>
  swatchListProps?: Record<string, unknown>
  swatchProps?: Record<string, unknown>
  swatchFillProps?: Record<string, unknown>
  swatchIndicatorProps?: Record<string, unknown>
}

export interface ColorPickerBodyEmits {
  'update:modelValue': [value: string]
}

defineProps<ColorPickerBodyProps>()
const emit = defineEmits<ColorPickerBodyEmits>()

const icons = useIcons()

// ColorAreaRoot/ColorSliderRoot/ColorSwatchPickerRoot's own emitted type is
// broader than what they actually produce here (string | Color |
// AcceptableValue) - every one of these Roots was fed a plain hex string
// as its own model-value, so it only ever hands one back, never the
// object-shaped Color/AcceptableValue branches those types also allow for
// other usage patterns.
function onUpdateColor(value: string | Color | AcceptableValue) {
  if (typeof value === 'string')
    emit('update:modelValue', value)
}
</script>

<template>
  <ColorAreaRoot
    :model-value="modelValue"
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
    :model-value="modelValue"
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
    :model-value="modelValue"
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
    :model-value="modelValue"
    :placeholder="placeholder"
    :disabled="disabled"
    @update:model-value="onUpdateColor"
  >
    <ColorFieldInput v-bind="fieldProps" />
  </ColorFieldRoot>

  <ColorSwatchPickerRoot
    v-if="swatches?.length"
    :model-value="modelValue"
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
