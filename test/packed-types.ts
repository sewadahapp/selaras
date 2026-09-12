import type {
  ButtonProps,
  ColorRole,
  TableColumnDef,
  TableEmits,
  TableProps,
  TableRowSelectionState,
  ToastOptions,
} from '@sewadah/selaras/types'
import { createTableColumnHelper } from '@sewadah/selaras/table'

interface PackedUser {
  id: string
  name: string
  age: number
}

const packedButton: ButtonProps = { color: 'primary' }
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
type TableSortingEvent = TableEmits<PackedUser>['update:sorting']
type TableRowClickEvent = TableEmits<PackedUser>['rowClick']
const packedTableEventShape: TableSortingEvent extends [any[]] ? true : false = true
const packedRowEventShape: TableRowClickEvent extends [PackedUser, MouseEvent] ? true : false = true

void packedButton
void packedRole
void packedTable
void packedToast
void packedAccessor
void invalidAccessor
void packedSelection
void packedTableEventShape
void packedRowEventShape
