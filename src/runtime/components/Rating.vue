<script setup lang="ts">
import type { VariantProps } from 'tailwind-variants'
import type { RatingThemeSlots } from '../theme/rating'
import type { UiProp } from '../utils/ui'
import { RatingItem, RatingItemIndicator, RatingRoot } from 'reka-ui'
import { computed } from 'vue'
import { useFormField } from '../composables/use-form-field'
import { useIcons } from '../composables/use-icons'
import { ratingTheme } from '../theme/rating'
import { resolveSlot, useComponentTheme, useRootProps } from '../utils/ui'
import Icon from './Icon.vue'

type RatingVariants = VariantProps<typeof ratingTheme>

defineOptions({ inheritAttrs: false })

// An unpassed `boolean` prop with no explicit default casts to `false`
// (Vue's own Boolean-prop casting), not `undefined` - see Stepper.vue's
// `linear` for the same caveat. hoverable defaults to true here - live
// hover preview is the near-universal expectation for an interactive
// star rating - deliberately deviating from Reka's own conservative
// `false` default.
const props = withDefaults(defineProps<RatingProps>(), {
  hoverable: true,
})

const emit = defineEmits<RatingEmits>()

export interface RatingProps {
  id?: string
  modelValue?: number
  defaultValue?: number
  /** Number of stars. @default 5 */
  length?: number
  /** Fractional precision per star - 0.5 for half-star ratings. Matches Reka's own restricted set of granularities, not an arbitrary number. @default 1 */
  step?: 1 | 0.5 | 0.25 | 0.1
  /** Clicking the currently-selected value again resets it to 0. */
  clearable?: boolean
  /** Preview the rating on hover before clicking. @default true */
  hoverable?: boolean
  disabled?: boolean
  invalid?: boolean
  orientation?: RatingVariants['orientation']
  size?: RatingVariants['size']
  color?: RatingVariants['color']
  name?: string
  required?: boolean
  ui?: UiProp<RatingThemeSlots>
}

export interface RatingEmits {
  'update:modelValue': [value: number]
}

const field = useFormField()

const ratingId = computed(() => props.id ?? field?.id)
const ratingInvalid = computed(() => props.invalid || (field?.invalid.value ?? false))
const effectiveSize = computed(() => props.size ?? field?.size ?? 'md')
const describedBy = computed(() => field?.describedBy.value)

const icons = useIcons()

const theme = useComponentTheme('rating', ratingTheme)
const ui = computed(() => theme.value({
  orientation: props.orientation,
  size: effectiveSize.value,
  color: props.color,
}))

const rootProps = useRootProps(() => ui.value.root, () => props.ui?.root)
const itemProps = computed(() => resolveSlot(ui.value.item, props.ui?.item))
const iconProps = computed(() => resolveSlot(ui.value.icon, props.ui?.icon))
const indicatorProps = computed(() => resolveSlot(ui.value.indicator, props.ui?.indicator))
const fillIconProps = computed(() => resolveSlot(ui.value.fillIcon, props.ui?.fillIcon))
</script>

<template>
  <RatingRoot
    :id="ratingId"
    :model-value="modelValue"
    :default-value="defaultValue"
    :length="length"
    :step="step"
    :clearable="clearable"
    :hoverable="hoverable"
    :disabled="disabled"
    :orientation="orientation"
    :name="name ?? field?.name"
    :required="required"
    :aria-invalid="ratingInvalid || undefined"
    :aria-describedby="describedBy"
    v-bind="rootProps"
    @update:model-value="(value) => emit('update:modelValue', value as number)"
  >
    <RatingItem
      v-for="n in (length ?? 5)"
      :key="n"
      v-slot="{ steps }"
      :item="n"
      v-bind="itemProps"
    >
      <Icon :name="icons.star" v-bind="iconProps" />
      <RatingItemIndicator
        v-for="stepValue in steps"
        :key="stepValue"
        :step="stepValue"
        v-bind="indicatorProps"
      >
        <Icon :name="icons.star" v-bind="fillIconProps" />
      </RatingItemIndicator>
    </RatingItem>
  </RatingRoot>
</template>
