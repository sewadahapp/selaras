import type {
  ColumnDef,
  ColumnVisibilityState,
  ExpandedState,
  RowData,
  RowSelectionState,
  SortingState,
} from '@tanstack/vue-table'
import type { ComputedRef } from 'vue'
import {
  columnFilteringFeature,
  columnPinningFeature,
  columnVisibilityFeature,
  createExpandedRowModel,
  createFilteredRowModel,
  createPaginatedRowModel,
  createSortedRowModel,
  createTableHook,
  filterFn_includesString,
  globalFilteringFeature,
  rowExpandingFeature,
  rowPaginationFeature,
  rowSelectionFeature,
  rowSortingFeature,
  sortFn_alphanumeric,
} from '@tanstack/vue-table'
import { computed, ref } from 'vue'

/**
 * One fixed feature set for every STable instance, registered once at module
 * scope - not per-instance. This is what createTableHook is for: it pre-binds
 * TFeatures so STable never needs to expose a features generic to consumers,
 * who only ever get this one capability set rather than TanStack's full
 * a-la-carte feature menu. columnPinning/columnVisibility need no row model
 * of their own (they don't change which rows exist, only column layout).
 */
const tableHook = createTableHook({
  features: {
    rowSortingFeature,
    rowSelectionFeature,
    rowPaginationFeature,
    rowExpandingFeature,
    columnFilteringFeature,
    columnVisibilityFeature,
    columnPinningFeature,
    globalFilteringFeature,
    sortedRowModel: createSortedRowModel(),
    paginatedRowModel: createPaginatedRowModel(),
    filteredRowModel: createFilteredRowModel(),
    expandedRowModel: createExpandedRowModel(),
    sortFns: { alphanumeric: sortFn_alphanumeric },
    filterFns: { includesString: filterFn_includesString },
  },
})

const { useAppTable } = tableHook

export type TableColumnDef<TData extends RowData = RowData> = ColumnDef<typeof tableHook.appFeatures, TData, any>
export type TableSortingState = SortingState
export type TableRowSelectionState = RowSelectionState
export type TableExpandedState = ExpandedState
export type TableColumnVisibilityState = ColumnVisibilityState
export type TableGetRowId<TData extends RowData = RowData> = (row: TData, index: number) => string

/** Creates TanStack v9 column definitions bound to STable's fixed feature set. */
export const createTableColumnHelper = tableHook.createAppColumnHelper

interface UseTableProps<TData extends RowData> {
  data: TData[]
  selectable?: boolean
  pageSize?: number
  virtualize?: unknown
  sorting?: TableSortingState
  defaultSorting?: TableSortingState
  rowSelection?: TableRowSelectionState
  globalFilter?: string
  pageIndex?: number
  expanded?: TableExpandedState
  columnVisibility?: TableColumnVisibilityState
  getRowId?: TableGetRowId<TData>
  manualSorting?: boolean
  manualFiltering?: boolean
  manualPagination?: boolean
}

interface UseTableEmit {
  (event: 'update:sorting', value: TableSortingState): void
  (event: 'update:rowSelection', value: TableRowSelectionState): void
  (event: 'update:globalFilter', value: string): void
  (event: 'update:pageIndex', value: number): void
  (event: 'update:expanded', value: TableExpandedState): void
  (event: 'update:columnVisibility', value: TableColumnVisibilityState): void
}

/**
 * Pure TanStack wiring - the final column defs (including any synthetic
 * selection/expand column, which need to render SCheckbox/an expand button
 * and so live in Table.vue instead) are passed in already built.
 */
export function useTable<TData extends RowData>(props: UseTableProps<TData>, emit: UseTableEmit, columns: ComputedRef<TableColumnDef<TData>[]>, columnPinning: ComputedRef<{ start: string[], end: string[] }>) {
  // defaultSorting seeds the *uncontrolled* starting value once - unlike
  // `sorting`, this only matters the first time (a "presort"), not on every
  // render, matching Accordion/Tabs's own defaultValue-vs-modelValue split.
  const internalSorting = ref<TableSortingState>(props.defaultSorting ?? [])
  const sorting = computed({
    get: () => props.sorting ?? internalSorting.value,
    set: (value: TableSortingState) => {
      internalSorting.value = value
      emit('update:sorting', value)
    },
  })

  const internalRowSelection = ref<TableRowSelectionState>({})
  const rowSelection = computed({
    get: () => props.rowSelection ?? internalRowSelection.value,
    set: (value: TableRowSelectionState) => {
      internalRowSelection.value = value
      emit('update:rowSelection', value)
    },
  })

  const internalGlobalFilter = ref('')
  const globalFilter = computed({
    get: () => props.globalFilter ?? internalGlobalFilter.value,
    set: (value: string) => {
      internalGlobalFilter.value = value
      emit('update:globalFilter', value)
    },
  })

  const internalPageIndex = ref(0)
  const pageIndex = computed({
    get: () => props.pageIndex ?? internalPageIndex.value,
    set: (value: number) => {
      internalPageIndex.value = value
      emit('update:pageIndex', value)
    },
  })

  // Pagination is opt-in, not a silent default - without an explicit
  // pageSize, every row renders on one page (same as virtualize, which
  // replaces pagination as the strategy for a large dataset instead of
  // letting the paginated row model window it to a default page size).
  const effectivePageSize = computed(() => (props.virtualize || props.pageSize === undefined) ? Math.max(props.data.length, 1) : props.pageSize)

  const internalExpanded = ref<TableExpandedState>({})
  const expanded = computed({
    get: () => props.expanded ?? internalExpanded.value,
    set: (value: TableExpandedState) => {
      internalExpanded.value = value
      emit('update:expanded', value)
    },
  })

  const internalColumnVisibility = ref<TableColumnVisibilityState>({})
  const columnVisibility = computed({
    get: () => props.columnVisibility ?? internalColumnVisibility.value,
    set: (value: TableColumnVisibilityState) => {
      internalColumnVisibility.value = value
      emit('update:columnVisibility', value)
    },
  })

  const table = useAppTable<TData>({
    data: computed(() => props.data),
    columns,
    enableRowSelection: computed(() => !!props.selectable),
    getRowId: props.getRowId,
    // Row expansion otherwise only allows expanding rows that already have
    // real hierarchical subRows - this table's own expansion is manual
    // (detail content via the `expanded` slot), not a subRow tree.
    getRowCanExpand: () => true,
    // Opts out of the local sorted/filtered/paginated row models - state
    // still lives here (sorting/globalFilter/pageIndex above, still
    // emitting their own update:* events the normal way), only the row
    // model itself defers to whatever `data` already is. Captured once at
    // setup, not wrapped in `computed()` - a table's manual/local mode
    // isn't realistically expected to flip reactively mid-session (it's
    // established once, alongside how `data` itself is sourced), and
    // wrapping `manualPagination` specifically in a reactive computed was
    // found to corrupt @tanstack/vue-table's own internal page-index
    // auto-reset tracking (Previous/Next silently stopped changing pages,
    // even though the resolved boolean value was identical either way) -
    // a real bug in this exact adapter version, not a misuse on our part.
    // Kept all three plain for consistency rather than reactive-except-one.
    manualSorting: !!props.manualSorting,
    manualFiltering: !!props.manualFiltering,
    manualPagination: !!props.manualPagination,
    state: computed(() => ({
      sorting: sorting.value,
      rowSelection: rowSelection.value,
      globalFilter: globalFilter.value,
      pagination: { pageIndex: pageIndex.value, pageSize: effectivePageSize.value },
      expanded: expanded.value,
      columnVisibility: columnVisibility.value,
      columnPinning: columnPinning.value,
    })),
    onSortingChange: (updater: any) => {
      sorting.value = typeof updater === 'function' ? updater(sorting.value) : updater
    },
    onRowSelectionChange: (updater: any) => {
      rowSelection.value = typeof updater === 'function' ? updater(rowSelection.value) : updater
    },
    onGlobalFilterChange: (updater: any) => {
      globalFilter.value = typeof updater === 'function' ? updater(globalFilter.value) : updater
    },
    onPaginationChange: (updater: any) => {
      const current = { pageIndex: pageIndex.value, pageSize: effectivePageSize.value }
      const next = typeof updater === 'function' ? updater(current) : updater
      pageIndex.value = next.pageIndex
    },
    onExpandedChange: (updater: any) => {
      expanded.value = typeof updater === 'function' ? updater(expanded.value) : updater
    },
    onColumnVisibilityChange: (updater: any) => {
      columnVisibility.value = typeof updater === 'function' ? updater(columnVisibility.value) : updater
    },
  } as any)

  return { table, sorting, rowSelection, globalFilter, pageIndex, expanded, columnVisibility, effectivePageSize }
}
