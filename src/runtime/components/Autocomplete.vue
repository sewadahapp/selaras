<script setup lang="ts">
import type { VariantProps } from 'tailwind-variants'
import type { SelectItems, SelectValue } from '../composables/use-combobox-select'
import type { selectTheme, SelectThemeSlots } from '../theme/select'
import type { ColorRole } from '../utils/color-registry'
import type { UiProp } from '../utils/ui'
import { useForwardPropsEmits } from 'reka-ui'
import ComboboxSelectBase from '../internal/ComboboxSelectBase.vue'

type SelectVariants = VariantProps<typeof selectTheme>

export interface AutocompleteProps<Value extends SelectValue = SelectValue> {
  id?: string
  name?: string
  /** ID of an associated form outside the component's ancestors. */
  form?: string
  items: SelectItems<Value>
  valueKey?: string
  labelKey?: string
  open?: boolean
  /** Initial uncontrolled open state. */
  defaultOpen?: boolean
  modelValue?: Value | Value[]
  /** Initial uncontrolled selection and native form reset target. */
  defaultValue?: Value | Value[]
  multiple?: boolean
  virtualize?: boolean | { estimateSize?: number, overscan?: number }
  displayMode?: 'comma' | 'chip'
  maxChips?: number
  loading?: boolean
  placeholder?: string
  disabled?: boolean
  required?: boolean
  size?: SelectVariants['size']
  invalid?: boolean
  /** The focus-ring color - the resting (unfocused) ring stays neutral regardless. */
  color?: ColorRole
  clearable?: boolean
  dropdown?: boolean
  forceSelection?: boolean
  searchTerm?: string
  resetSearchTermOnBlur?: boolean
  resetSearchTermOnSelect?: boolean
  /** Shows a small pointer triangle connecting the panel to its trigger. */
  arrow?: boolean
  /** Below 768px viewport width, presents the dropdown as a centered Modal instead of a small anchored panel - easier to tap with a finger. Opt-in (defaults `false`) rather than automatic, so an existing usage's look never changes without asking for it. */
  mobileModal?: boolean
  ui?: UiProp<SelectThemeSlots>
}

export interface AutocompleteEmits<Value extends SelectValue = SelectValue> {
  'update:open': [value: boolean]
  'update:modelValue': [value: Value | Value[] | undefined]
  'update:searchTerm': [value: string]
}

const props = defineProps<AutocompleteProps>()

const emit = defineEmits<AutocompleteEmits>()

const forwarded = useForwardPropsEmits(props, emit)
</script>

<template>
  <ComboboxSelectBase v-bind="forwarded" :creatable="true" :searchable="true">
    <template v-for="(_, slotName) in $slots" #[slotName]="slotProps">
      <slot :name="slotName" v-bind="slotProps ?? {}" />
    </template>
  </ComboboxSelectBase>
</template>
