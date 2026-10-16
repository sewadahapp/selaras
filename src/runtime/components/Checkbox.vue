<script setup lang="ts">
import type { VariantProps } from 'tailwind-variants'
import type { CheckboxThemeSlots } from '../theme/checkbox'
import type { ColorRole } from '../utils/color-registry'
import type { UiProp } from '../utils/ui'
import { CheckboxIndicator, CheckboxRoot } from 'reka-ui'
import { computed, mergeProps } from 'vue'
import { useFormField } from '../composables/use-form-field'
import { checkboxTheme } from '../theme/checkbox'
import { resolveRegisteredColorRole } from '../utils/registered-colors'
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
  /** Renders only the visual indicator, without a focus target, form input, or inherited FormField state. Selection is owned by the surrounding control. */
  decorative?: boolean
  size?: CheckboxVariants['size']
  color?: ColorRole
  /** `card` wraps the checkbox and label in a bordered box, highlighted when checked - the same treatment RadioGroup's own `card` variant already applies per item. */
  variant?: CheckboxVariants['variant']
  ui?: UiProp<CheckboxThemeSlots>
}

export interface CheckboxEmits {
  'update:modelValue': [value: boolean | 'indeterminate']
}

const inheritedField = useFormField()
const field = computed(() => props.decorative ? undefined : inheritedField)

const checkboxId = computed(() => props.id ?? field.value?.id)
const checkboxInvalid = computed(() => props.invalid || (field.value?.invalid.value ?? false))
const effectiveSize = computed(() => props.size ?? field.value?.size ?? 'md')
const describedBy = computed(() => field.value?.describedBy.value)

const theme = useComponentTheme('checkbox', checkboxTheme)
const effectiveColor = computed(() => resolveRegisteredColorRole(props.color ?? 'primary', 'primary'))
const ui = computed(() => theme.value({
  invalid: checkboxInvalid.value,
  size: effectiveSize.value,
  color: effectiveColor.value as CheckboxVariants['color'],
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
const controlProps = computed(() => props.decorative
  ? {
      ...boxProps.value,
      'data-state': glyphState.value,
      'data-disabled': props.disabled ? '' : undefined,
    }
  : mergeProps({
      'id': checkboxId.value,
      'modelValue': props.modelValue,
      'name': props.name ?? field.value?.name,
      'disabled': props.disabled,
      'required': props.required,
      'aria-invalid': checkboxInvalid.value || undefined,
      'aria-describedby': describedBy.value,
    }, boxProps.value, {
      'onUpdate:modelValue': (value: boolean | 'indeterminate') => emit('update:modelValue', value),
    }))
const visualIndicatorProps = computed(() => props.decorative
  ? { 'data-state': glyphState.value, 'data-disabled': props.disabled ? '' : undefined, ...indicatorProps.value }
  : { forceMount: true, ...indicatorProps.value })
</script>

<template>
  <component :is="decorative ? 'span' : 'label'" :data-selaras-color="checkboxInvalid ? 'danger' : effectiveColor" v-bind="rootProps" :aria-hidden="decorative ? true : rootProps['aria-hidden']">
    <component :is="decorative ? 'span' : CheckboxRoot" v-bind="controlProps">
      <component :is="decorative ? 'span' : CheckboxIndicator" v-bind="visualIndicatorProps">
        <svg viewBox="0 0 24 24" :class="applyClassPrefix('size-full')" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M5 13l4 4L19 7" :data-state="glyphState" v-bind="checkIconProps" />
          <path d="M5 12h14" :data-state="glyphState" v-bind="indeterminateIconProps" />
        </svg>
      </component>
    </component>
    <span v-if="description" v-bind="labelGroupProps">
      <span v-if="label || $slots.default" v-bind="labelProps"><slot>{{ label }}</slot></span>
      <span v-bind="descriptionProps">
        <slot name="description">{{ description }}</slot>
      </span>
    </span>
    <span v-else-if="label || $slots.default" v-bind="labelProps">
      <slot>{{ label }}</slot>
    </span>
  </component>
</template>
