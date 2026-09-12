import type { ButtonProps, ColorRole, TableEmits, TableProps } from '@sewadah/selaras/types'

const packedButton: ButtonProps = { color: 'primary' }
const packedRole: ColorRole = 'danger'
const packedTable: TableProps = {
  data: [{ name: 'Alice' }],
  columns: [{ accessorKey: 'name', header: 'Name' }],
}
type TableSortingEvent = TableEmits['update:sorting']
const packedTableEventShape: TableSortingEvent extends [any[]] ? true : false = true

void packedButton
void packedRole
void packedTable
void packedTableEventShape
