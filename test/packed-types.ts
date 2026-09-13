import type {
  AutocompleteEmits,
  AutocompleteProps,
  AutocompleteSlots,
  ButtonProps,
  ColorRole,
  SelectEmits,
  SelectGroup,
  SelectIdentity,
  SelectModel,
  SelectProps,
  SelectResolvedOption,
  SelectSlots,
  SelectValue,
  TableColumnDef,
  TableEmits,
  TableProps,
  TableRowSelectionState,
  ThemeProps,
  ToastOptions,
} from '@sewadah/selaras/types'
import type * as PublicTypes from '@sewadah/selaras/types'
import { createTableColumnHelper } from '@sewadah/selaras/table'
import { defineColor } from '@sewadah/selaras/theme'

interface PackedUser {
  id: string
  name: string
  age: number
}

const packedButton: ButtonProps = { color: 'primary' }
interface PackedOption { id: number, title: string }
type PackedEntry = PackedOption | SelectGroup<PackedOption>
const authoredItems: SelectProps<PackedEntry, 'id'>['items'] = [
  { id: 1, title: 'One' },
  { label: 'Group', items: [{ id: 2, title: 'Two' }] },
]
const authoredSelect: SelectProps<PackedEntry, 'id'> = { items: authoredItems, valueKey: 'id', modelValue: 2 }
const authoredIdentity: SelectIdentity<PackedEntry, 'id'> = 1
const authoredModel: SelectModel<typeof authoredIdentity, true> = [1]
const authoredResolved: SelectResolvedOption<PackedEntry, 'id'> = { value: 1, label: 'One', disabled: false, raw: undefined }
const primitiveIdentity: SelectValue = 'one'
// @ts-expect-error erased internal option records are not a public authoring API
type RemovedSelectOption = PublicTypes.SelectOption
// @ts-expect-error use ordinary readonly entry arrays or SelectProps['items']
type RemovedSelectItems = PublicTypes.SelectItems
// @ts-expect-error SelectGroup is the single public group shape
type RemovedSelectOptionGroup = PublicTypes.SelectOptionGroup
// @ts-expect-error derive slot data through the public SelectSlots contract
type RemovedSelectEntryItem = PublicTypes.SelectEntryItem
// @ts-expect-error entry unwrapping is internal type machinery
type RemovedSelectEntryGroup = PublicTypes.SelectEntryGroup
// @ts-expect-error key validation is part of SelectProps
type RemovedSelectIdentityKeys = PublicTypes.SelectIdentityKeys
const removedTypes: [RemovedSelectOption, RemovedSelectItems, RemovedSelectOptionGroup, RemovedSelectEntryItem, RemovedSelectEntryGroup, RemovedSelectIdentityKeys] | undefined = undefined
const numericSelect: SelectProps<{ label: string, value: number }> = {
  items: [{ label: 'One', value: 1 }],
  modelValue: 1,
}
const stringAutocomplete: AutocompleteProps<{ label: string, value: string }> = {
  items: [{ label: 'One', value: 'one' }],
  modelValue: 'one',
}
const invalidNumericSelect: SelectProps<{ label: string, value: number }> = {
  items: [{ label: 'One', value: 1 }],
  // @ts-expect-error typed props keep numeric and string value contracts distinct
  modelValue: 'one',
}
const customSelect: SelectProps<{ id: number, title: string }, 'id', true> = {
  items: [{ id: 1, title: 'One' }],
  valueKey: 'id',
  labelKey: 'title',
  multiple: true,
  modelValue: [1],
}
const numericSelectUpdate: SelectEmits<{ value: number }>['update:modelValue'] = [1]
const multipleSelectUpdate: SelectEmits<{ id: number }, 'id', true>['update:modelValue'] = [[]]
// @ts-expect-error single mode updates never contain arrays
const invalidSelectUpdate: SelectEmits<{ value: number }>['update:modelValue'] = [[1]]
const selectSlots: SelectSlots<{ id: number, title: string }, 'id'> = {
  item: ({ item }) => item.title.toUpperCase(),
  value: ({ selected }) => selected?.raw?.title.toUpperCase(),
}
const numericAutocomplete: AutocompleteProps<{ label: string, value: number }, 'value', true> = {
  items: [{ label: 'One', value: 1 }],
  modelValue: [1, 'new entry'],
  defaultValue: ['initial text'],
}
const createdAutocompleteText: AutocompleteEmits<{ value: number }>['update:modelValue'] = ['new entry']
const selectedAutocompleteNumber: AutocompleteEmits<{ value: number }>['update:modelValue'] = [1]
const mixedAutocompleteValues: AutocompleteEmits<{ value: number }, 'value', true>['update:modelValue'] = [[1, 'new entry']]
// @ts-expect-error free text does not permit non-primitive values
const invalidAutocompleteValue: AutocompleteEmits<{ value: number }>['update:modelValue'] = [true]
const invalidAutocompleteSuggestion: AutocompleteProps<{ value: number }> = {
  // @ts-expect-error suggestion identities remain numeric even though new text is allowed
  items: [{ value: 'one' }],
}
const forcedAutocomplete: AutocompleteProps<{ id: number, title: string }, 'id', false, true> = {
  items: [{ id: 1, title: 'One' }],
  valueKey: 'id',
  labelKey: 'title',
  forceSelection: true,
  defaultValue: 1,
}
const forcedAutocompleteUpdate: AutocompleteEmits<{ id: number }, 'id', false, true>['update:modelValue'] = [1]
// @ts-expect-error literal forced selection cannot create arbitrary text
const invalidForcedAutocompleteUpdate: AutocompleteEmits<{ id: number }, 'id', false, true>['update:modelValue'] = ['new entry']
const autocompleteSlots: AutocompleteSlots<{ id: number, title: string }> = { item: ({ item }) => item.title.toUpperCase() }
const packedTheme: ThemeProps = { defaults: { button: { size: 'lg' } } }
// @ts-expect-error scoped defaults replace the pre-1.0 props namespace
const legacyTheme: ThemeProps = { props: { button: { size: 'lg' } } }
const packedRole: ColorRole = 'danger'
const packedColumns: TableColumnDef<PackedUser>[] = [
  { accessorKey: 'name', header: 'Name' },
]
const packedTable: TableProps<PackedUser> = {
  data: [{ id: 'user-a', name: 'Alice', age: 30 }],
  columns: packedColumns,
  getRowId: row => row.id,
  rowClass: row => row.age >= 18 ? 'adult' : undefined,
}
const packedToast: ToastOptions = { title: 'Saved', color: 'success' }
const packedColumnHelper = createTableColumnHelper<PackedUser>()
const packedAccessor = packedColumnHelper.accessor('age', {
  header: 'Age',
  cell: context => context.getValue().toFixed(0),
})
// @ts-expect-error unknown row keys must fail at the authoring boundary
const invalidAccessor = packedColumnHelper.accessor('missing', {})
const packedSelection: TableRowSelectionState = { 'user-a': true }
const packedColor = defineColor({
  light: {
    fill: '#5134a8',
    onFill: '#ffffff',
    subtle: '#eeeaff',
    onSubtle: '#201050',
    text: '#5134a8',
    border: '#765fc0',
  },
  dark: {
    fill: '#a895f0',
    onFill: '#170b38',
    subtle: '#2b2050',
    onSubtle: '#eeeaff',
    text: '#c9bcff',
    border: '#8c78d4',
  },
})
const packedColorLiteral: '#5134a8' = packedColor.light.fill
type TableSortingEvent = TableEmits<PackedUser>['update:sorting']
type TableRowClickEvent = TableEmits<PackedUser>['rowClick']
const packedTableEventShape: TableSortingEvent extends [any[]] ? true : false = true
const packedRowEventShape: TableRowClickEvent extends [PackedUser, MouseEvent] ? true : false = true

void packedButton
void authoredSelect
void authoredIdentity
void authoredModel
void authoredResolved
void primitiveIdentity
void removedTypes
void numericSelect
void customSelect
void numericSelectUpdate
void multipleSelectUpdate
void invalidSelectUpdate
void selectSlots
void stringAutocomplete
void invalidNumericSelect
void numericAutocomplete
void forcedAutocomplete
void forcedAutocompleteUpdate
void invalidForcedAutocompleteUpdate
void autocompleteSlots
void createdAutocompleteText
void selectedAutocompleteNumber
void mixedAutocompleteValues
void invalidAutocompleteValue
void invalidAutocompleteSuggestion
void packedTheme
void legacyTheme
void packedRole
void packedTable
void packedToast
void packedAccessor
void invalidAccessor
void packedSelection
void packedColorLiteral
void packedTableEventShape
void packedRowEventShape
