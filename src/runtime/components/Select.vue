<script setup lang="ts">
import type { VariantProps } from 'tailwind-variants'
import type { SelectItems } from '../composables/use-combobox-select'
import type { SelectSlots, selectTheme } from '../theme/select'
import type { UiProp } from '../utils/ui'
import { useForwardPropsEmits } from 'reka-ui'
import ComboboxSelectBase from '../internal/ComboboxSelectBase.vue'

type SelectVariants = VariantProps<typeof selectTheme>

const props = defineProps<{
  id?: string
  name?: string
  items: SelectItems
  valueKey?: string
  labelKey?: string
  modelValue?: string | string[]
  multiple?: boolean
  searchable?: boolean
  virtualize?: boolean | { estimateSize?: number, overscan?: number }
  displayMode?: 'comma' | 'chip'
  maxChips?: number
  loading?: boolean
  placeholder?: string
  disabled?: boolean
  size?: SelectVariants['size']
  invalid?: boolean
  searchTerm?: string
  resetSearchTermOnBlur?: boolean
  resetSearchTermOnSelect?: boolean
  ui?: UiProp<SelectSlots>
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string | string[] | undefined]
  'update:searchTerm': [value: string]
}>()

const forwarded = useForwardPropsEmits(props, emit)
</script>

<template>
  <ComboboxSelectBase v-bind="forwarded" :creatable="false">
    <template v-for="(_, slotName) in $slots" #[slotName]="slotProps">
      <slot :name="slotName" v-bind="slotProps ?? {}" />
    </template>
  </ComboboxSelectBase>
</template>
