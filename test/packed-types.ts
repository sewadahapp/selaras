import type {
  AutocompleteEmits,
  AutocompleteProps,
  ButtonProps,
  ColorRole,
  SelectProps,
  TableColumnDef,
  TableEmits,
  TableProps,
  TableRowSelectionState,
  ThemeProps,
  ToastOptions,
} from '@sewadah/selaras/types'
import { createTableColumnHelper } from '@sewadah/selaras/table'
import { defineColor } from '@sewadah/selaras/theme'

interface PackedUser {
  id: string
  name: string
  age: number
}

const packedButton: ButtonProps = { color: 'primary' }
const numericSelect: SelectProps<number> = {
  items: [{ label: 'One', value: 1 }],
  modelValue: 1,
}
const stringAutocomplete: AutocompleteProps<string> = {
  items: [{ label: 'One', value: 'one' }],
  modelValue: 'one',
}
const invalidNumericSelect: SelectProps<number> = {
  items: [{ label: 'One', value: 1 }],
  // @ts-expect-error typed props keep numeric and string value contracts distinct
  modelValue: 'one',
}
const numericAutocomplete: AutocompleteProps<number> = {
  items: [{ label: 'One', value: 1 }],
  modelValue: [1, 'new entry'],
  defaultValue: 'initial text',
}
const createdAutocompleteText: AutocompleteEmits<number>['update:modelValue'] = ['new entry']
const selectedAutocompleteNumber: AutocompleteEmits<number>['update:modelValue'] = [1]
const mixedAutocompleteValues: AutocompleteEmits<number>['update:modelValue'] = [[1, 'new entry']]
// @ts-expect-error free text does not permit non-primitive values
const invalidAutocompleteValue: AutocompleteEmits<number>['update:modelValue'] = [true]
const invalidAutocompleteSuggestion: AutocompleteProps<number> = {
  // @ts-expect-error suggestion identities remain numeric even though new text is allowed
  items: [{ value: 'one' }],
}
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
void numericSelect
void stringAutocomplete
void invalidNumericSelect
void numericAutocomplete
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
