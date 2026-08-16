<script setup lang="ts">
import type { VariantProps } from 'tailwind-variants'
import type { TextareaSlots } from '../theme/textarea'
import type { UiProp } from '../utils/ui'
import { computed } from 'vue'
import { textareaTheme } from '../theme/textarea'
import { resolveSlot, useComponentTheme } from '../utils/ui'

type TextareaVariants = VariantProps<typeof textareaTheme>

const props = withDefaults(defineProps<{
  modelValue?: string
  placeholder?: string
  rows?: number
  size?: TextareaVariants['size']
  disabled?: boolean
  invalid?: boolean
  ui?: UiProp<TextareaSlots>
}>(), {
  rows: 3,
})

defineEmits<{
  'update:modelValue': [value: string]
}>()

const theme = useComponentTheme('textarea', textareaTheme)

const ui = computed(() => theme.value({
  size: props.size,
  invalid: props.invalid,
}))

const baseProps = computed(() => resolveSlot(ui.value.base, props.ui?.base))
</script>

<template>
  <textarea
    :value="modelValue"
    :placeholder="placeholder"
    :rows="rows"
    :disabled="disabled"
    v-bind="baseProps"
    @input="$emit('update:modelValue', ($event.target as HTMLTextAreaElement).value)"
  />
</template>
