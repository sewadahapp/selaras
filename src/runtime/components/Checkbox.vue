<script setup lang="ts">
import type { VariantProps } from 'tailwind-variants'
import type { CheckboxThemeSlots } from '../theme/checkbox'
import type { UiProp } from '../utils/ui'
import { CheckboxIndicator, CheckboxRoot } from 'reka-ui'
import { computed } from 'vue'
import { useFormField } from '../composables/use-form-field'
import { checkboxTheme } from '../theme/checkbox'
import { applyClassPrefix, resolveSlot, useComponentTheme, useRootProps, withFallthroughClass } from '../utils/ui'

type CheckboxVariants = VariantProps<typeof checkboxTheme>

defineOptions({ inheritAttrs: false })

const props = defineProps<CheckboxProps>()

const emit = defineEmits<CheckboxEmits>()

export interface CheckboxProps {
  id?: string
  name?: string
  modelValue?: boolean | 'indeterminate'
  label?: string
  /** A second, muted line under the label - for a standalone checkbox (e.g. "Accept terms") where wrapping it in its own FormField would be needless ceremony. */
  description?: string
  disabled?: boolean
  invalid?: boolean
  required?: boolean
  size?: CheckboxVariants['size']
  color?: CheckboxVariants['color']
  /** `card` wraps the checkbox and label in a bordered box, highlighted when checked - the same treatment RadioGroup's own `card` variant already applies per item. */
  variant?: CheckboxVariants['variant']
  ui?: UiProp<CheckboxThemeSlots>
}

export interface CheckboxEmits {
  'update:modelValue': [value: boolean | 'indeterminate']
}

const field = useFormField()

const checkboxId = computed(() => props.id ?? field?.id)
const checkboxInvalid = computed(() => props.invalid || (field?.invalid.value ?? false))
const effectiveSize = computed(() => props.size ?? field?.size ?? 'md')
const describedBy = computed(() => field?.describedBy.value)

const theme = useComponentTheme('checkbox', checkboxTheme)
const ui = computed(() => theme.value({
  invalid: checkboxInvalid.value,
  size: effectiveSize.value,
  color: props.color,
  variant: props.variant,
}))

// A description pushes the label onto a second line, so the box top-
// aligns with the label's first line instead of centering against the
// whole two-line block - same conditional treatment Switch already
// applies for the same reason.
const rootProps = useRootProps(() => ui.value.root, () => withFallthroughClass(props.description ? 'items-start' : undefined, props.ui?.root))
const boxProps = computed(() => resolveSlot(ui.value.box, withFallthroughClass(props.description ? 'mt-0.5' : undefined, props.ui?.box)))
const indicatorProps = computed(() => resolveSlot(ui.value.indicator, props.ui?.indicator))
const labelGroupProps = computed(() => resolveSlot(ui.value.labelGroup, props.ui?.labelGroup))
const labelProps = computed(() => resolveSlot(ui.value.label, props.ui?.label))
const descriptionProps = computed(() => resolveSlot(ui.value.description, props.ui?.description))
const checkIconProps = computed(() => resolveSlot(ui.value.checkIcon, props.ui?.checkIcon))
const indeterminateIconProps = computed(() => resolveSlot(ui.value.indeterminateIcon, props.ui?.indeterminateIcon))

// force-mount (see RadioGroup's own indicator dot for the same reasoning)
// keeps both paths in the DOM at all times so their stroke-dashoffset
// transitions can actually animate in and out, instead of the glyph just
// popping in/out with Presence's default (non-animated) show/hide.
const glyphState = computed(() => props.modelValue === 'indeterminate' ? 'indeterminate' : props.modelValue ? 'checked' : 'unchecked')
</script>

<template>
  <label v-bind="rootProps">
    <CheckboxRoot
      :id="checkboxId"
      :model-value="modelValue"
      :name="name ?? field?.name"
      :disabled="disabled"
      :required="required"
      :aria-invalid="checkboxInvalid || undefined"
      :aria-describedby="describedBy"
      v-bind="boxProps"
      @update:model-value="(value) => emit('update:modelValue', value)"
    >
      <CheckboxIndicator force-mount v-bind="indicatorProps">
        <svg viewBox="0 0 24 24" :class="applyClassPrefix('size-full')" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M5 13l4 4L19 7" :data-state="glyphState" v-bind="checkIconProps" />
          <path d="M5 12h14" :data-state="glyphState" v-bind="indeterminateIconProps" />
        </svg>
      </CheckboxIndicator>
    </CheckboxRoot>
    <span v-if="description" v-bind="labelGroupProps">
      <span v-if="label || $slots.default" v-bind="labelProps"><slot>{{ label }}</slot></span>
      <span v-bind="descriptionProps">
        <slot name="description">{{ description }}</slot>
      </span>
    </span>
    <span v-else-if="label || $slots.default" v-bind="labelProps">
      <slot>{{ label }}</slot>
    </span>
  </label>
</template>
