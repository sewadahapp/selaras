import type { TransferListThemeSlots } from '../theme/transfer-list'
import type { ListboxItemSlot, ListboxProps } from './listbox-contracts'
import type { SelectEntry, SelectIdentity } from './select-contracts'
import type { UiProp } from './ui'

export type TransferDirection = 'to-target' | 'to-source'
export type TransferSide = 'source' | 'target'

export interface TransferListProps<Entry extends SelectEntry = SelectEntry, Key extends string = 'value'> extends Omit<ListboxProps<Entry, Key, true>, 'multiple' | 'checkbox' | 'selectAll' | 'selectionBehavior' | 'searchTerm' | 'ui' | 'label'> {
  checked?: NoInfer<SelectIdentity<Entry, Key>[]>
  sourceLabel?: string
  targetLabel?: string
  sourceSearchTerm?: string
  targetSearchTerm?: string
  showSelectAll?: boolean
  layout?: 'auto' | 'horizontal' | 'vertical'
  ui?: UiProp<TransferListThemeSlots>
}

export interface TransferListEmits<Entry extends SelectEntry = SelectEntry, Key extends string = 'value'> {
  'update:modelValue': [value: SelectIdentity<Entry, Key>[]]
  'update:checked': [value: SelectIdentity<Entry, Key>[]]
  'update:sourceSearchTerm': [value: string]
  'update:targetSearchTerm': [value: string]
  'transfer': [payload: { direction: TransferDirection, items: ListboxItemSlot<Entry>['item'][], values: SelectIdentity<Entry, Key>[] }]
}

export interface TransferListSlots<Entry extends SelectEntry> {
  'item'?: (props: ListboxItemSlot<Entry> & { side: TransferSide }) => any
  'source-header'?: (props: { count: number, checkedCount: number }) => any
  'target-header'?: (props: { count: number, checkedCount: number }) => any
  'source-footer'?: () => any
  'target-footer'?: () => any
  'empty'?: (props: { side: TransferSide }) => any
  'empty-filter'?: (props: { side: TransferSide }) => any
}
