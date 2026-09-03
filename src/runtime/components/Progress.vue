<script setup lang="ts">
import type { VariantProps } from 'tailwind-variants'
import type { ProgressThemeSlots } from '../theme/progress'
import type { UiProp } from '../utils/ui'
import { ProgressIndicator, ProgressRoot } from 'reka-ui'
import { computed } from 'vue'
import { progressTheme } from '../theme/progress'
import { resolveSlot, useComponentTheme, useRootProps } from '../utils/ui'

type ProgressVariants = VariantProps<typeof progressTheme>

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<ProgressProps>(), {
  max: 100,
  type: 'linear',
})

defineSlots<ProgressSlots>()

// Circular geometry per size - a real pixel diameter/stroke-width pair, not
// something Tailwind classes alone can drive (the SVG needs actual numbers
// for its viewBox and the stroke-dasharray/dashoffset math).
const CIRCLE_SIZES: Record<'sm' | 'md' | 'lg', { diameter: number, strokeWidth: number }> = {
  sm: { diameter: 32, strokeWidth: 3 },
  md: { diameter: 48, strokeWidth: 4 },
  lg: { diameter: 64, strokeWidth: 5 },
}

export interface ProgressProps {
  /** `null`/unset renders an indeterminate progress - Reka's own ProgressRoot semantics. */
  modelValue?: number | null
  /** @default 100 */
  max?: number
  /** @default 'linear' */
  type?: 'linear' | 'circular'
  size?: ProgressVariants['size']
  color?: ProgressVariants['color']
  ui?: UiProp<ProgressThemeSlots>
}

export interface ProgressSlots {
  /** Custom label content - centered inside the ring for `circular`, placed by you anywhere for `linear` (there's no room to overlay text on an 8px-tall bar). */
  default?: (props: { percent: number | null }) => any
}

const percent = computed(() => {
  if (props.modelValue == null)
    return null
  return Math.min(100, Math.max(0, (props.modelValue / props.max) * 100))
})

const circleSpec = computed(() => CIRCLE_SIZES[props.size ?? 'md'])
const radius = computed(() => (circleSpec.value.diameter - circleSpec.value.strokeWidth) / 2)
const circumference = computed(() => 2 * Math.PI * radius.value)
// Indeterminate: draw a fixed 1/4-circle arc for `animate-spin` to rotate,
// rather than tracking a real (unknown) percentage.
const dashOffset = computed(() => percent.value == null ? circumference.value * 0.75 : circumference.value * (1 - percent.value / 100))

const theme = useComponentTheme('progress', progressTheme)
const ui = computed(() => theme.value({
  size: props.size,
  color: props.color,
  indeterminate: props.modelValue == null,
}))

const rootProps = useRootProps(() => ui.value.root, () => props.ui?.root)
const indicatorProps = computed(() => resolveSlot(ui.value.indicator, props.ui?.indicator))
const circleRootProps = computed(() => resolveSlot(ui.value.circleRoot, props.ui?.circleRoot))
const circleWrapperProps = computed(() => resolveSlot(ui.value.circleWrapper, props.ui?.circleWrapper))
const circleTrackProps = computed(() => resolveSlot(ui.value.circleTrack, props.ui?.circleTrack))
const circleIndicatorProps = computed(() => resolveSlot(ui.value.circleIndicator, props.ui?.circleIndicator))
const labelProps = computed(() => resolveSlot(ui.value.label, props.ui?.label))
</script>

<template>
  <ProgressRoot v-if="type === 'linear'" :model-value="modelValue" :max="max" v-bind="rootProps">
    <ProgressIndicator v-bind="indicatorProps" :style="modelValue == null ? undefined : { width: `${percent}%` }" />
  </ProgressRoot>
  <ProgressRoot v-else :model-value="modelValue" :max="max" v-bind="circleRootProps">
    <svg :width="circleSpec.diameter" :height="circleSpec.diameter" :viewBox="`0 0 ${circleSpec.diameter} ${circleSpec.diameter}`" v-bind="circleWrapperProps">
      <circle
        :cx="circleSpec.diameter / 2"
        :cy="circleSpec.diameter / 2"
        :r="radius"
        fill="none"
        :stroke-width="circleSpec.strokeWidth"
        v-bind="circleTrackProps"
      />
      <ProgressIndicator
        as="circle"
        :cx="circleSpec.diameter / 2"
        :cy="circleSpec.diameter / 2"
        :r="radius"
        fill="none"
        :stroke-width="circleSpec.strokeWidth"
        stroke-linecap="round"
        :stroke-dasharray="circumference"
        :stroke-dashoffset="dashOffset"
        v-bind="circleIndicatorProps"
      />
    </svg>
    <div v-if="$slots.default" v-bind="labelProps">
      <slot :percent="percent" />
    </div>
  </ProgressRoot>
</template>
