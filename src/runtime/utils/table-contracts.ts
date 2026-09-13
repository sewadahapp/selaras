import type { RowData } from '@tanstack/vue-table'
import type {
  TableColumnDef,
  TableColumnVisibilityState,
  TableExpandedState,
  TableGetRowId,
  TableRowSelectionState,
  TableSortingState,
} from '../composables/use-table'
import type { TableThemeSlots } from '../theme/table'
import type { ColorRole } from './color-registry'
import type { UiProp } from './ui'

export interface TableProps<TData extends RowData = RowData> {
  data: TData[]
  columns?: TableColumnDef<TData>[]
  selectable?: boolean
  pageSize?: number
  loading?: boolean
  sorting?: TableSortingState
  defaultSorting?: TableSortingState
  rowSelection?: TableRowSelectionState
  globalFilter?: string
  pageIndex?: number
  size?: 'sm' | 'md' | 'lg'
  /** The sortable-header focus ring and loading indicator accent. @default 'primary' */
  color?: ColorRole
  gridlines?: boolean
  striped?: boolean
  expandable?: boolean
  expanded?: TableExpandedState
  columnVisibility?: TableColumnVisibilityState
  columnToggle?: boolean
  /** Enables vertical scroll with a sticky header, capped at this CSS height (e.g. '24rem'). */
  scrollHeight?: string
  virtualize?: boolean | { estimateSize?: number, overscan?: number }
  /** Opts out of the local sorted/filtered/paginated row models - set when `data` is already sorted/filtered/paginated server-side, so this table doesn't redundantly (and incorrectly) reprocess an already-server-processed slice. `sorting`/`globalFilter`/`pageIndex` still drive the UI and still emit their `update:*` events the same way - only the *local row model* is skipped, not the state itself. `manualPagination` also suppresses the built-in Pagination UI entirely (there's no way to know the real page count from a server-paginated slice) - bring your own `SPagination`, bound to your own server metadata, the same way this table already expects you to bring your own search input for `globalFilter`. */
  manualSorting?: boolean
  manualFiltering?: boolean
  manualPagination?: boolean
  /** Returns the stable id used by selection and expansion state. Defaults to the row index. */
  getRowId?: TableGetRowId<TData>
  /** Adds a class to a body row based on its own data - e.g. highlighting a flagged row. Called per row, not per render, so keep it cheap. */
  rowClass?: (row: TData) => string | undefined
  /** Same as `rowClass`, for inline styles. */
  rowStyle?: (row: TData) => Record<string, string> | undefined
  ui?: UiProp<TableThemeSlots>
}

export interface TableEmits<TData extends RowData = RowData> {
  'update:sorting': [value: TableSortingState]
  'update:rowSelection': [value: TableRowSelectionState]
  'update:globalFilter': [value: string]
  'update:pageIndex': [value: number]
  'update:expanded': [value: TableExpandedState]
  'update:columnVisibility': [value: TableColumnVisibilityState]
  'rowClick': [row: TData, event: MouseEvent]
  'rowContextmenu': [row: TData, event: MouseEvent]
}

export interface TableSlots<TData extends RowData = RowData> {
  default?: () => any
  empty?: () => any
  expanded?: (props: { row: TData }) => any
}
