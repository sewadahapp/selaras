import type { SelectIdentity, SelectModel, SelectProps, SelectSlots, SelectValue } from './select-contracts'

export type AutocompleteValue<Entry, Key extends string = 'value', Forced extends boolean = false> = Forced extends true
  ? SelectIdentity<Entry, Key>
  : SelectIdentity<Entry, Key> | string

export interface AutocompleteProps<Entry extends object = { value: SelectValue, label?: string, disabled?: boolean }, Key extends string = 'value', Multiple extends boolean = false, Forced extends boolean = false> extends Omit<SelectProps<Entry, Key, Multiple>, 'searchable' | 'modelValue' | 'defaultValue'> {
  /** Suggestion identities plus created strings, unless selection is forced. */
  modelValue?: NoInfer<SelectModel<AutocompleteValue<Entry, Key, Forced>, Multiple>>
  /** Mount-captured selection/reset target, adapted to the current multiple mode. */
  defaultValue?: NoInfer<SelectModel<AutocompleteValue<Entry, Key, Forced>, Multiple>>
  dropdown?: boolean
  /** Blocks unmatched free-text commits; does not require async option membership. */
  forceSelection?: Forced
}

export interface AutocompleteEmits<Entry extends object = { value: SelectValue }, Key extends string = 'value', Multiple extends boolean = false, Forced extends boolean = false> {
  'update:open': [value: boolean]
  'update:modelValue': [value: SelectModel<AutocompleteValue<Entry, Key, Forced>, Multiple>]
  'update:searchTerm': [value: string]
}

/** Autocomplete's editable input has no value or filter-icon slot. */
export type AutocompleteSlots<Entry extends object> = Omit<SelectSlots<Entry>, 'value' | 'filter-icon'>
