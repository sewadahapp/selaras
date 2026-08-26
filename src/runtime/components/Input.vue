<script setup lang="ts">
import type { VariantProps } from 'tailwind-variants'
import type { InputSlots } from '../theme/input'
import type { UiProp } from '../utils/ui'
import { computed } from 'vue'
import { useFormField } from '../composables/use-form-field'
import { inputTheme } from '../theme/input'
import { resolveSlot, useComponentTheme, useRootProps } from '../utils/ui'
import Button from './Button.vue'

type InputVariants = VariantProps<typeof inputTheme>

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<{
  id?: string
  name?: string
  modelValue?: string | number
  type?: string
  placeholder?: string
  size?: InputVariants['size']
  disabled?: boolean
  invalid?: boolean
  clearable?: boolean
  icon?: string
  trailingIcon?: string
  ui?: UiProp<InputSlots>
}>(), {
  type: 'text',
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const field = useFormField()

const inputId = computed(() => props.id ?? field?.id)
const inputInvalid = computed(() => props.invalid || (field?.invalid.value ?? false))
const describedBy = computed(() => field?.describedBy.value)

const hasValue = computed(() => props.modelValue !== undefined && props.modelValue !== '')
const showClear = computed(() => !!props.clearable && !props.disabled && hasValue.value)

function clear() {
  emit('update:modelValue', '')
}

const effectiveSize = computed(() => props.size ?? field?.size ?? 'md')

// One size step down from the input itself - a full-size dismiss icon reads
// as too heavy next to the input's own text, especially at lg. sm has no
// smaller step, so it stays sm.
const clearSize = computed(() => ({ sm: 'sm', md: 'sm', lg: 'md' } as const)[effectiveSize.value])

const theme = useComponentTheme('input', inputTheme)

const ui = computed(() => theme.value({
  size: effectiveSize.value,
  invalid: inputInvalid.value,
  hasLeadingIcon: !!props.icon,
  hasTrailingIcon: !!props.trailingIcon || showClear.value,
}))

const rootProps = useRootProps(() => ui.value.root, () => props.ui?.root)
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
    <Button
      v-if="showClear"
      :size="clearSize"
      variant="ghost"
      color="neutral"
      aria-label="Clear"
      v-bind="resolveSlot(ui.clear, props.ui?.clear)"
      @click="clear"
    >
      <template #icon="{ class: iconClass }">
        <slot name="clear-icon">
          <Icon name="lucide:x" :class="iconClass" />
        </slot>
      </template>
    </Button>
    <Icon v-else-if="trailingIcon" :name="trailingIcon" v-bind="resolveSlot(ui.trailingIcon, props.ui?.trailingIcon)" />
  </div>
</template>
