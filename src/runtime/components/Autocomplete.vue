<script setup lang="ts">
import type { VariantProps } from 'tailwind-variants'
import type { SelectItems } from '../composables/use-combobox-select'
import type { SelectSlots, selectTheme } from '../theme/select'
import type { UiProp } from '../utils/ui'
import ComboboxSelectBase from '../internal/ComboboxSelectBase.vue'

type SelectVariants = VariantProps<typeof selectTheme>

defineProps<{
  items: SelectItems
  valueKey?: string
  labelKey?: string
  modelValue?: string | string[]
  multiple?: boolean
  virtualize?: boolean | { estimateSize?: number, overscan?: number }
  displayMode?: 'comma' | 'chip'
  maxChips?: number
  loading?: boolean
  placeholder?: string
  disabled?: boolean
  size?: SelectVariants['size']
  ui?: UiProp<SelectSlots>
}>()

defineEmits<{
  'update:modelValue': [value: string | string[] | undefined]
}>()
</script>

<template>
  <ComboboxSelectBase
    v-bind="$props"
    :creatable="true"
    :searchable="true"
    @update:model-value="(value) => $emit('update:modelValue', value)"
  >
    <template v-for="(_, name) in $slots" #[name]="slotProps">
      <slot :name="name" v-bind="slotProps ?? {}" />
    </template>
  </ComboboxSelectBase>
</template>
