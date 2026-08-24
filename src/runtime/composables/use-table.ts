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
const { useAppTable } = createTableHook({
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

interface UseTableProps {
  data: unknown[]
  selectable?: boolean
  pageSize?: number
  virtualize?: unknown
  sorting?: any[]
  defaultSorting?: any[]
  rowSelection?: Record<string, boolean>
  globalFilter?: string
  pageIndex?: number
  expanded?: any
  columnVisibility?: Record<string, boolean>
}

interface UseTableEmit {
  (event: 'update:sorting', value: any[]): void
  (event: 'update:rowSelection', value: Record<string, boolean>): void
  (event: 'update:globalFilter', value: string): void
  (event: 'update:pageIndex', value: number): void
  (event: 'update:expanded', value: any): void
  (event: 'update:columnVisibility', value: Record<string, boolean>): void
}

/**
 * Pure TanStack wiring - the final column defs (including any synthetic
 * selection/expand column, which need to render SCheckbox/an expand button
 * and so live in Table.vue instead) are passed in already built.
 */
export function useTable(props: UseTableProps, emit: UseTableEmit, columns: ComputedRef<any[]>, columnPinning: ComputedRef<{ start: string[], end: string[] }>) {
  // defaultSorting seeds the *uncontrolled* starting value once - unlike
  // `sorting`, this only matters the first time (a "presort"), not on every
  // render, matching Accordion/Tabs's own defaultValue-vs-modelValue split.
  const internalSorting = ref<any[]>(props.defaultSorting ?? [])
  const sorting = computed({
    get: () => props.sorting ?? internalSorting.value,
    set: (value: any[]) => {
      internalSorting.value = value
      emit('update:sorting', value)
    },
  })

  const internalRowSelection = ref<Record<string, boolean>>({})
  const rowSelection = computed({
    get: () => props.rowSelection ?? internalRowSelection.value,
    set: (value: Record<string, boolean>) => {
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

  // Virtualization replaces pagination as the strategy for a large dataset -
  // without this, the paginated row model still slices to the default page
  // size first, and virtualization ends up windowing that tiny page instead
  // of the real dataset.
  const effectivePageSize = computed(() => props.virtualize ? props.data.length : (props.pageSize ?? 10))

  const internalExpanded = ref<any>({})
  const expanded = computed({
    get: () => props.expanded ?? internalExpanded.value,
    set: (value: any) => {
      internalExpanded.value = value
      emit('update:expanded', value)
    },
  })

  const internalColumnVisibility = ref<Record<string, boolean>>({})
  const columnVisibility = computed({
    get: () => props.columnVisibility ?? internalColumnVisibility.value,
    set: (value: Record<string, boolean>) => {
      internalColumnVisibility.value = value
      emit('update:columnVisibility', value)
    },
  })

  const table = useAppTable({
    data: computed(() => props.data),
    columns,
    enableRowSelection: computed(() => !!props.selectable),
    // Row expansion otherwise only allows expanding rows that already have
    // real hierarchical subRows - this table's own expansion is manual
    // (detail content via the `expanded` slot), not a subRow tree.
    getRowCanExpand: () => true,
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

  return { table, sorting, rowSelection, globalFilter, pageIndex, expanded, columnVisibility }
}
