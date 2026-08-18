<script setup lang="ts">
import type { VariantProps } from 'tailwind-variants'
import type { InputSlots } from '../theme/input'
import type { UiProp } from '../utils/ui'
import { computed } from 'vue'
import { useFormField } from '../composables/use-form-field'
import { inputTheme } from '../theme/input'
import { resolveSlot, useComponentTheme } from '../utils/ui'

type InputVariants = VariantProps<typeof inputTheme>

const props = withDefaults(defineProps<{
  id?: string
  name?: string
  modelValue?: string | number
  type?: string
  placeholder?: string
  size?: InputVariants['size']
  disabled?: boolean
  invalid?: boolean
  icon?: string
  trailingIcon?: string
  ui?: UiProp<InputSlots>
}>(), {
  type: 'text',
})

defineEmits<{
  'update:modelValue': [value: string]
}>()

const field = useFormField()

const inputId = computed(() => props.id ?? field?.id)
const inputInvalid = computed(() => props.invalid || (field?.invalid.value ?? false))
const describedBy = computed(() => field?.describedBy.value)

const theme = useComponentTheme('input', inputTheme)

const ui = computed(() => theme.value({
  size: props.size ?? field?.size,
  invalid: inputInvalid.value,
  hasLeadingIcon: !!props.icon,
  hasTrailingIcon: !!props.trailingIcon,
}))

const rootProps = computed(() => resolveSlot(ui.value.root, props.ui?.root))
const baseProps = computed(() => resolveSlot(ui.value.base, props.ui?.base))
</script>

<template>
  <div v-bind="rootProps">
    <Icon v-if="icon" :name="icon" v-bind="resolveSlot(ui.leadingIcon, props.ui?.leadingIcon)" />
    <input
      :id="inputId"
      :value="modelValue"
      :type="type"
      :name="name ?? field?.name"
      :placeholder="placeholder"
      :disabled="disabled"
      :aria-invalid="inputInvalid || undefined"
      :aria-describedby="describedBy"
      v-bind="baseProps"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    >
    <Icon v-if="trailingIcon" :name="trailingIcon" v-bind="resolveSlot(ui.trailingIcon, props.ui?.trailingIcon)" />
  </div>
</template>
