<script setup lang="ts">
import type { VariantProps } from 'tailwind-variants'
import type { SliderThemeSlots } from '../theme/slider'
import type { UiProp } from '../utils/ui'
import { SliderRange, SliderRoot, SliderThumb, SliderTrack } from 'reka-ui'
import { computed, ref, watch } from 'vue'
import { useIcons } from '../composables/use-icons'
import { useMessages } from '../composables/use-messages'
import { sliderTheme } from '../theme/slider'
import { resolveSlot, useComponentTheme, useRootProps } from '../utils/ui'
import Button from './Button.vue'
import Tooltip from './Tooltip.vue'

type SliderVariants = VariantProps<typeof sliderTheme>

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<SliderProps>(), {
  min: 0,
  max: 100,
  step: 1,
})

const emit = defineEmits<SliderEmits>()

defineSlots<SliderSlots>()

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
  /** @default 'circle' */
  thumbVariant?: SliderVariants['thumbVariant']
  /** Shows the current value in a tooltip on hover/focus of each thumb - reuses Tooltip, not a bespoke floating label. */
  tooltip?: boolean
  /** Renders -/+ buttons flanking the track, stepping by `step` - only meaningful (and only rendered) for a single-value slider, since stepping two independent range thumbs with one shared button pair has no obvious single meaning. */
  controls?: boolean
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

export interface SliderSlots {
  /** Content flanking the start of the track (an icon, an emoji, a unit label). */
  start?: () => any
  /** Content flanking the end of the track. */
  end?: () => any
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

// controls (-/+ buttons) only ever act on a single-value slider - see the
// prop's own doc comment for why a range slider is out of scope. Reuses
// the same onUpdateModelValue/onValueCommit path a real drag already
// goes through, clamped the same way InputNumber.vue's own
// canDecrement/canIncrement + stepBy are, just for a single array entry
// instead of a plain number.
const canDecrement = computed(() => !props.disabled && (internalValue.value[0] ?? props.min) > props.min)
const canIncrement = computed(() => !props.disabled && (internalValue.value[0] ?? props.min) < props.max)
function stepBy(delta: number) {
  const next = Math.min(props.max, Math.max(props.min, (internalValue.value[0] ?? props.min) + delta))
  onUpdateModelValue([next])
  onValueCommit([next])
}

const icons = useIcons()
const messages = useMessages()
// One step down from the slider itself - matches InputNumber.vue's own
// buttonSize reasoning (its +/- buttons use the identical mapping).
const buttonSize = computed(() => ({ sm: 'sm', md: 'sm', lg: 'md' } as const)[props.size ?? 'md'])
// Plain :ui override on a nested Button, not an independent theme slot -
// Button already owns variant/size/hover/focus (see InputNumber.vue's own
// stepButtonUi for the identical established pattern).
const controlButtonUi = { base: 'shrink-0' }

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
  thumbVariant: props.thumbVariant,
}))

const rootProps = useRootProps(() => ui.value.root, () => props.ui?.root)
const trackProps = computed(() => resolveSlot(ui.value.track, props.ui?.track))
const rangeProps = computed(() => resolveSlot(ui.value.range, props.ui?.range))
const thumbProps = computed(() => resolveSlot(ui.value.thumb, props.ui?.thumb))
const tickProps = computed(() => resolveSlot(ui.value.tick, props.ui?.tick))
const startProps = computed(() => resolveSlot(ui.value.start, props.ui?.start))
const endProps = computed(() => resolveSlot(ui.value.end, props.ui?.end))
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
    <span v-if="$slots.start" v-bind="startProps">
      <slot name="start" />
    </span>
    <!--
      @pointerdown.stop on both control buttons: Reka's SliderRoot listens
      for pointerdown on its own rendered element with no target filtering
      beyond its own thumbs (confirmed by reading its compiled source) - any
      other descendant's pointerdown, these buttons included, bubbles up and
      gets treated as a drag-to-position gesture computed off the *whole
      root's* bounding box, which silently overrides the click and jumps
      the value to whatever edge that button happens to sit at. Stopping
      propagation here keeps the click from ever reaching that listener.
    -->
    <Button
      v-if="controls && !isRange"
      variant="text"
      color="neutral"
      :size="buttonSize"
      :icon="icons.minus"
      :aria-label="messages.decrement"
      :disabled="!canDecrement"
      :ui="controlButtonUi"
      tabindex="-1"
      @pointerdown.stop
      @click="stepBy(-step)"
    />

    <SliderTrack v-bind="trackProps">
      <span
        v-for="tick in ticks"
        :key="tick.value"
        v-bind="tickProps"
        :style="orientation === 'vertical' ? { bottom: `${tick.percent}%` } : { left: `${tick.percent}%` }"
      />
      <SliderRange v-bind="rangeProps" />
    </SliderTrack>
    <template v-if="tooltip">
      <Tooltip
        v-for="(_, index) in internalValue"
        :key="index"
        :text="String(internalValue[index])"
      >
        <SliderThumb v-bind="thumbProps" :aria-label="ariaLabelFor(index)" />
      </Tooltip>
    </template>
    <SliderThumb
      v-for="(_, index) in internalValue"
      v-else
      :key="index"
      v-bind="thumbProps"
      :aria-label="ariaLabelFor(index)"
    />

    <Button
      v-if="controls && !isRange"
      variant="text"
      color="neutral"
      :size="buttonSize"
      :icon="icons.plus"
      :aria-label="messages.increment"
      :disabled="!canIncrement"
      :ui="controlButtonUi"
      tabindex="-1"
      @pointerdown.stop
      @click="stepBy(step)"
    />
    <span v-if="$slots.end" v-bind="endProps">
      <slot name="end" />
    </span>
  </SliderRoot>
</template>
