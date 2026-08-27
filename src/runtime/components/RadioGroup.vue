<script setup lang="ts">
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

defineOptions({ inheritAttrs: false })

const props = defineProps<{
  id?: string
  name?: string
  items: RadioItem[]
  modelValue?: string
  disabled?: boolean
  invalid?: boolean
  ui?: UiProp<RadioGroupSlots>
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const field = useFormField()

const radioGroupId = computed(() => props.id ?? field?.id)
const radioGroupInvalid = computed(() => props.invalid || (field?.invalid.value ?? false))
const describedBy = computed(() => field?.describedBy.value)

const theme = useComponentTheme('radioGroup', radioGroupTheme)
const ui = computed(() => theme.value({ invalid: radioGroupInvalid.value }))

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
    :aria-invalid="radioGroupInvalid || undefined"
    :aria-describedby="describedBy"
    v-bind="rootProps"
    @update:model-value="(value) => emit('update:modelValue', value as string)"
  >
    <label v-for="item in items" :key="item.value" v-bind="itemWrapperProps">
      <RadioGroupItem :value="item.value" :disabled="item.disabled" v-bind="itemProps">
        <RadioGroupIndicator force-mount v-bind="indicatorProps" />
      </RadioGroupItem>
      <span v-bind="labelProps">{{ item.label }}</span>
    </label>
  </RadioGroupRoot>
</template>
