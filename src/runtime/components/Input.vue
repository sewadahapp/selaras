<script setup lang="ts">
import type { VariantProps } from 'tailwind-variants'
import type { InputSlots } from '../theme/input'
import type { UiProp } from '../utils/ui'
import { computed } from 'vue'
import { inputTheme } from '../theme/input'
import { resolveSlot, useComponentTheme } from '../utils/ui'

type InputVariants = VariantProps<typeof inputTheme>

const props = withDefaults(defineProps<{
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

const theme = useComponentTheme('input', inputTheme)

const ui = computed(() => theme.value({
  size: props.size,
  invalid: props.invalid,
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
      :value="modelValue"
      :type="type"
      :placeholder="placeholder"
      :disabled="disabled"
      v-bind="baseProps"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    >
    <Icon v-if="trailingIcon" :name="trailingIcon" v-bind="resolveSlot(ui.trailingIcon, props.ui?.trailingIcon)" />
  </div>
</template>
