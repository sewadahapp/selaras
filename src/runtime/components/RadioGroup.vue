<script setup lang="ts">
import type { RadioGroupSlots } from '../theme/radio-group'
import type { UiProp } from '../utils/ui'
import { RadioGroupIndicator, RadioGroupItem, RadioGroupRoot } from 'reka-ui'
import { computed } from 'vue'
import { radioGroupTheme } from '../theme/radio-group'
import { resolveSlot, useComponentTheme } from '../utils/ui'

export interface RadioItem {
  label: string
  value: string
  disabled?: boolean
}

const props = defineProps<{
  items: RadioItem[]
  modelValue?: string
  disabled?: boolean
  ui?: UiProp<RadioGroupSlots>
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const theme = useComponentTheme('radioGroup', radioGroupTheme)
const ui = computed(() => theme.value())

const rootProps = computed(() => resolveSlot(ui.value.root, props.ui?.root))
const itemWrapperProps = computed(() => resolveSlot(ui.value.itemWrapper, props.ui?.itemWrapper))
const itemProps = computed(() => resolveSlot(ui.value.item, props.ui?.item))
const indicatorProps = computed(() => resolveSlot(ui.value.indicator, props.ui?.indicator))
const labelProps = computed(() => resolveSlot(ui.value.label, props.ui?.label))
</script>

<template>
  <RadioGroupRoot
    :model-value="modelValue"
    :disabled="disabled"
    v-bind="rootProps"
    @update:model-value="(value) => emit('update:modelValue', value as string)"
  >
    <label v-for="item in items" :key="item.value" v-bind="itemWrapperProps">
      <RadioGroupItem :value="item.value" :disabled="item.disabled" v-bind="itemProps">
        <RadioGroupIndicator v-bind="indicatorProps" />
      </RadioGroupItem>
      <span v-bind="labelProps">{{ item.label }}</span>
    </label>
  </RadioGroupRoot>
</template>
