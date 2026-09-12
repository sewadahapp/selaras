import type { ButtonProps, ColorRole, TableEmits, TableProps, ToastOptions } from '@sewadah/selaras/types'

const packedButton: ButtonProps = { color: 'primary' }
const packedRole: ColorRole = 'danger'
const packedTable: TableProps = {
  data: [{ name: 'Alice' }],
  columns: [{ accessorKey: 'name', header: 'Name' }],
}
const packedToast: ToastOptions = { title: 'Saved', color: 'success' }
type TableSortingEvent = TableEmits['update:sorting']
const packedTableEventShape: TableSortingEvent extends [any[]] ? true : false = true

void packedButton
void packedRole
void packedTable
void packedToast
void packedTableEventShape
