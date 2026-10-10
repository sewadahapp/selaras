import type { ListboxThemeSlots } from '../theme/listbox'
import type { SelectEntry, SelectEntryGroup, SelectEntryItem, SelectIdentity, SelectModel, SelectProps } from './select-contracts'
import type { UiProp } from './ui'

export interface ListboxProps<Entry extends SelectEntry = SelectEntry, Key extends string = 'value', Multiple extends boolean = false> extends Pick<SelectProps<Entry, Key, Multiple>, 'items' | 'modelValue' | 'defaultValue' | 'valueKey' | 'labelKey' | 'multiple' | 'searchable' | 'searchTerm' | 'virtualize' | 'disabled' | 'loading' | 'invalid' | 'size' | 'color' | 'id' | 'name' | 'form' | 'required'> {
  label?: string
  descriptionKey?: keyof SelectEntryItem<Entry> & string
  selectionBehavior?: 'toggle' | 'replace'
  checkbox?: boolean
  selectAll?: boolean
  ui?: UiProp<ListboxThemeSlots>
}

export interface ListboxEmits<Entry extends SelectEntry = SelectEntry, Key extends string = 'value', Multiple extends boolean = false> {
  'update:modelValue': [value: SelectModel<SelectIdentity<Entry, Key>, Multiple>]
  'update:searchTerm': [value: string]
}

export interface ListboxItemSlot<Entry extends SelectEntry> {
  item: SelectEntryItem<Entry>
  index: number
  selected: boolean
  disabled: boolean
}

export interface ListboxSlots<Entry extends SelectEntry> {
  'item'?: (props: ListboxItemSlot<Entry>) => any
  'group'?: (props: { group: SelectEntryGroup<Entry> }) => any
  'header'?: () => any
  'footer'?: () => any
  'empty'?: () => any
  'empty-filter'?: () => any
}
