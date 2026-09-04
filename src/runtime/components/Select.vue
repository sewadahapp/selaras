<script setup lang="ts">
import type { VariantProps } from 'tailwind-variants'
import type { SelectItems } from '../composables/use-combobox-select'
import type { selectTheme, SelectThemeSlots } from '../theme/select'
import type { UiProp } from '../utils/ui'
import { useForwardPropsEmits } from 'reka-ui'
import ComboboxSelectBase from '../internal/ComboboxSelectBase.vue'

type SelectVariants = VariantProps<typeof selectTheme>

export interface SelectProps {
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
  /** The focus-ring color - the resting (unfocused) ring stays neutral regardless. */
  color?: SelectVariants['color']
  clearable?: boolean
  searchTerm?: string
  resetSearchTermOnBlur?: boolean
  resetSearchTermOnSelect?: boolean
  /** Shows a small pointer triangle connecting the panel to its trigger. */
  arrow?: boolean
  /** Below 768px viewport width, presents the dropdown as a centered Modal instead of a small anchored panel - easier to tap with a finger. Opt-in (defaults `false`) rather than automatic, so an existing usage's look never changes without asking for it. */
  mobileModal?: boolean
  ui?: UiProp<SelectThemeSlots>
}

export interface SelectEmits {
  'update:modelValue': [value: string | string[] | undefined]
  'update:searchTerm': [value: string]
}

const props = defineProps<SelectProps>()

const emit = defineEmits<SelectEmits>()

const forwarded = useForwardPropsEmits(props, emit)
</script>

<template>
  <ComboboxSelectBase v-bind="forwarded" :creatable="false">
    <template v-for="(_, slotName) in $slots" #[slotName]="slotProps">
      <slot :name="slotName" v-bind="slotProps ?? {}" />
    </template>
  </ComboboxSelectBase>
</template>
