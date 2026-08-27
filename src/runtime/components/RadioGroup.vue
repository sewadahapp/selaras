<script setup lang="ts">
import type { VariantProps } from 'tailwind-variants'
import type { RadioGroupSlots } from '../theme/radio-group'
import type { UiProp } from '../utils/ui'
import { RadioGroupIndicator, RadioGroupItem, RadioGroupRoot } from 'reka-ui'
import { computed } from 'vue'
import { useFormField } from '../composables/use-form-field'
import { radioGroupTheme } from '../theme/radio-group'
import { resolveSlot, useComponentTheme, useRootProps } from '../utils/ui'

export interface RadioItem {
  label: string
  value: string
  disabled?: boolean
}

type RadioGroupVariants = VariantProps<typeof radioGroupTheme>

defineOptions({ inheritAttrs: false })

const props = defineProps<{
  id?: string
  name?: string
  /** A plain string is shorthand for `{ label: value, value }`. */
  items: (string | RadioItem)[]
  modelValue?: string
  disabled?: boolean
  invalid?: boolean
  size?: RadioGroupVariants['size']
  orientation?: RadioGroupVariants['orientation']
  variant?: RadioGroupVariants['variant']
  ui?: UiProp<RadioGroupSlots>
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

defineSlots<{
  /** Replaces an item's plain label text - useful for a description, price, or other rich content alongside it (e.g. with `variant="card"`). */
  label?: (props: { item: RadioItem, checked: boolean, disabled: boolean }) => any
}>()

const field = useFormField()

const radioGroupId = computed(() => props.id ?? field?.id)
const radioGroupInvalid = computed(() => props.invalid || (field?.invalid.value ?? false))
const effectiveSize = computed(() => props.size ?? field?.size ?? 'md')
const describedBy = computed(() => field?.describedBy.value)

const normalizedItems = computed<RadioItem[]>(() =>
  props.items.map(item => typeof item === 'string' ? { label: item, value: item } : item),
)

const theme = useComponentTheme('radioGroup', radioGroupTheme)
const ui = computed(() => theme.value({
  invalid: radioGroupInvalid.value,
  size: effectiveSize.value,
  orientation: props.orientation,
  variant: props.variant,
}))

const rootProps = useRootProps(() => ui.value.root, () => props.ui?.root)
const itemWrapperProps = computed(() => resolveSlot(ui.value.itemWrapper, props.ui?.itemWrapper))
const itemProps = computed(() => resolveSlot(ui.value.item, props.ui?.item))
const indicatorProps = computed(() => resolveSlot(ui.value.indicator, props.ui?.indicator))
const labelProps = computed(() => resolveSlot(ui.value.label, props.ui?.label))
</script>

<template>
  <RadioGroupRoot
    :id="radioGroupId"
    :model-value="modelValue"
    :name="name ?? field?.name"
    :disabled="disabled"
    :orientation="orientation"
    :aria-invalid="radioGroupInvalid || undefined"
    :aria-describedby="describedBy"
    v-bind="rootProps"
    @update:model-value="(value) => emit('update:modelValue', value as string)"
  >
    <label v-for="item in normalizedItems" :key="item.value" v-bind="itemWrapperProps">
      <RadioGroupItem :value="item.value" :disabled="item.disabled" v-bind="itemProps">
        <RadioGroupIndicator force-mount v-bind="indicatorProps" />
      </RadioGroupItem>
      <slot
        name="label"
        :item="item"
        :checked="modelValue === item.value"
        :disabled="Boolean(disabled || item.disabled)"
      >
        <span v-bind="labelProps">{{ item.label }}</span>
      </slot>
    </label>
  </RadioGroupRoot>
</template>
