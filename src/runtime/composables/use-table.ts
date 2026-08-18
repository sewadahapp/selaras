import type { ComputedRef } from 'vue'
import {
  columnFilteringFeature,
  createFilteredRowModel,
  createPaginatedRowModel,
  createSortedRowModel,
  createTableHook,
  filterFn_includesString,
  globalFilteringFeature,
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
 * who only ever get this one capability set (sorting, selection, pagination,
 * filtering) rather than TanStack's full a-la-carte feature menu.
 */
const { useAppTable } = createTableHook({
  features: {
    rowSortingFeature,
    rowSelectionFeature,
    rowPaginationFeature,
    columnFilteringFeature,
    globalFilteringFeature,
    sortedRowModel: createSortedRowModel(),
    paginatedRowModel: createPaginatedRowModel(),
    filteredRowModel: createFilteredRowModel(),
    sortFns: { alphanumeric: sortFn_alphanumeric },
    filterFns: { includesString: filterFn_includesString },
  },
})

interface UseTableProps {
  data: unknown[]
  selectable?: boolean
  pageSize?: number
  sorting?: any[]
  rowSelection?: Record<string, boolean>
  globalFilter?: string
  pageIndex?: number
}

interface UseTableEmit {
  (event: 'update:sorting', value: any[]): void
  (event: 'update:rowSelection', value: Record<string, boolean>): void
  (event: 'update:globalFilter', value: string): void
  (event: 'update:pageIndex', value: number): void
}

/**
 * Pure TanStack wiring - the final column defs (including any synthetic
 * selection column, which needs to render SCheckbox and so lives in Table.vue
 * instead) are passed in already built.
 */
export function useTable(props: UseTableProps, emit: UseTableEmit, columns: ComputedRef<any[]>) {
  const internalSorting = ref<any[]>([])
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

  const table = useAppTable({
    data: computed(() => props.data),
    columns,
    enableRowSelection: computed(() => !!props.selectable),
    state: computed(() => ({
      sorting: sorting.value,
      rowSelection: rowSelection.value,
      globalFilter: globalFilter.value,
      pagination: { pageIndex: pageIndex.value, pageSize: props.pageSize ?? 10 },
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
      const current = { pageIndex: pageIndex.value, pageSize: props.pageSize ?? 10 }
      const next = typeof updater === 'function' ? updater(current) : updater
      pageIndex.value = next.pageIndex
    },
  } as any)

  return { table, sorting, rowSelection, globalFilter, pageIndex }
}
