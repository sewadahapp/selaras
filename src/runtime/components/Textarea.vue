<script setup lang="ts">
import type { VariantProps } from 'tailwind-variants'
import type { TextareaSlots } from '../theme/textarea'
import type { UiProp } from '../utils/ui'
import { computed } from 'vue'
import { useFormField } from '../composables/use-form-field'
import { textareaTheme } from '../theme/textarea'
import { resolveSlot, useComponentTheme } from '../utils/ui'

type TextareaVariants = VariantProps<typeof textareaTheme>

const props = withDefaults(defineProps<{
  id?: string
  name?: string
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

const field = useFormField()

const textareaId = computed(() => props.id ?? field?.id)
const textareaInvalid = computed(() => props.invalid || (field?.invalid.value ?? false))
const describedBy = computed(() => field?.describedBy.value)

const theme = useComponentTheme('textarea', textareaTheme)

const ui = computed(() => theme.value({
  size: props.size ?? field?.size,
  invalid: textareaInvalid.value,
}))

const baseProps = computed(() => resolveSlot(ui.value.base, props.ui?.base))
</script>

<template>
  <textarea
    :id="textareaId"
    :value="modelValue"
    :name="name ?? field?.name"
    :placeholder="placeholder"
    :rows="rows"
    :disabled="disabled"
    :aria-invalid="textareaInvalid || undefined"
    :aria-describedby="describedBy"
    v-bind="baseProps"
    @input="$emit('update:modelValue', ($event.target as HTMLTextAreaElement).value)"
  />
</template>
