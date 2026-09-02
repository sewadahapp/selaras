<script setup lang="ts">
import type { VariantProps } from 'tailwind-variants'
import type { SliderThemeSlots } from '../theme/slider'
import type { UiProp } from '../utils/ui'
import { SliderRange, SliderRoot, SliderThumb, SliderTrack } from 'reka-ui'
import { computed, ref, watch } from 'vue'
import { sliderTheme } from '../theme/slider'
import { resolveSlot, useComponentTheme, useRootProps } from '../utils/ui'

type SliderVariants = VariantProps<typeof sliderTheme>

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<SliderProps>(), {
  min: 0,
  max: 100,
  step: 1,
})

const emit = defineEmits<SliderEmits>()

export interface SliderProps {
  modelValue?: number | number[]
  defaultValue?: number | number[]
  min?: number
  max?: number
  step?: number
  /** The minimum permitted number of steps between adjacent thumbs on a multi-thumb (range) slider. */
  minStepsBetweenThumbs?: number
  disabled?: boolean
  orientation?: SliderVariants['orientation']
  /** Visually (and directionally) flips the slider - the max end renders where the min end normally would. */
  inverted?: boolean
  /** Shows a tick mark at every step along the track - own addition, Reka's primitive has no tick/mark concept of its own. */
  showTicks?: boolean
  size?: SliderVariants['size']
  color?: SliderVariants['color']
  /** Accessible name for each thumb - a single string applies to all of them (fine for a single-thumb slider), an array maps one per thumb by index (e.g. `['Minimum', 'Maximum']` for a range slider). */
  ariaLabel?: string | string[]
  /** Submitted with an owning `<form>` under this name, via a real hidden input Reka renders internally - only takes effect when actually inside a form. */
  name?: string
  ui?: UiProp<SliderThemeSlots>
}

export interface SliderEmits {
  'update:modelValue': [value: number | number[]]
  /** Fires once, when a drag/interaction finishes with a changed value - unlike update:modelValue, which fires continuously while dragging. Useful for only acting once the user lets go (e.g. a debounced request). */
  'valueCommit': [value: number | number[]]
}

function toArray(value: number | number[] | undefined): number[] | undefined {
  if (value === undefined)
    return undefined
  return Array.isArray(value) ? value : [value]
}

// Decided once from whichever of modelValue/defaultValue is actually
// given (falling back to single-number if neither is), not re-derived
// from Reka's own always-array emit - a range slider stays a range
// slider even at a moment its two thumbs happen to share one value.
const isRange = computed(() => {
  if (props.modelValue !== undefined)
    return Array.isArray(props.modelValue)
  if (props.defaultValue !== undefined)
    return Array.isArray(props.defaultValue)
  return false
})

// Mirrors Modal.vue/Slideover.vue/Drawer.vue's own internalOpen pattern -
// an always-concrete local ref synced with an optional external prop,
// rather than binding `:model-value` straight through. See Slideover.vue
// for why: a compiled SFC binding Reka's own root `:model-value` directly
// to a prop that's currently `undefined` (genuinely uncontrolled, no
// v-model) breaks Reka's own passive/uncontrolled mode in a real browser
// once a second instance of the same SFC exists on the page.
const internalValue = ref<number[]>(toArray(props.modelValue) ?? toArray(props.defaultValue) ?? [props.min])
watch(() => props.modelValue, (value) => {
  if (value !== undefined)
    internalValue.value = toArray(value)!
})

function fromArray(value: number[]): number | number[] {
  return isRange.value ? value : (value[0] ?? props.min)
}

function onUpdateModelValue(value: number[]) {
  internalValue.value = value
  emit('update:modelValue', fromArray(value))
}

function onValueCommit(value: number[]) {
  emit('valueCommit', fromArray(value))
}

function ariaLabelFor(index: number) {
  return Array.isArray(props.ariaLabel) ? props.ariaLabel[index] : props.ariaLabel
}

const ticks = computed(() => {
  if (!props.showTicks)
    return []
  const count = Math.floor((props.max - props.min) / props.step) + 1
  return Array.from({ length: count }, (_, i) => {
    const value = props.min + i * props.step
    return { value, percent: ((value - props.min) / (props.max - props.min)) * 100 }
  })
})

const theme = useComponentTheme('slider', sliderTheme)
const ui = computed(() => theme.value({
  size: props.size,
  color: props.color,
  orientation: props.orientation,
}))

const rootProps = useRootProps(() => ui.value.root, () => props.ui?.root)
const trackProps = computed(() => resolveSlot(ui.value.track, props.ui?.track))
const rangeProps = computed(() => resolveSlot(ui.value.range, props.ui?.range))
const thumbProps = computed(() => resolveSlot(ui.value.thumb, props.ui?.thumb))
const tickProps = computed(() => resolveSlot(ui.value.tick, props.ui?.tick))
</script>

<template>
  <SliderRoot
    :model-value="internalValue"
    :min="min"
    :max="max"
    :step="step"
    :min-steps-between-thumbs="minStepsBetweenThumbs"
    :disabled="disabled"
    :orientation="orientation"
    :inverted="inverted"
    :name="name"
    v-bind="rootProps"
    @update:model-value="onUpdateModelValue"
    @value-commit="onValueCommit"
  >
    <SliderTrack v-bind="trackProps">
      <span
        v-for="tick in ticks"
        :key="tick.value"
        v-bind="tickProps"
        :style="orientation === 'vertical' ? { bottom: `${tick.percent}%` } : { left: `${tick.percent}%` }"
      />
      <SliderRange v-bind="rangeProps" />
    </SliderTrack>
    <SliderThumb
      v-for="(_, index) in internalValue"
      :key="index"
      v-bind="thumbProps"
      :aria-label="ariaLabelFor(index)"
    />
  </SliderRoot>
</template>
