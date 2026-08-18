<script setup lang="ts">
import type { TableSlots } from '../theme/table'
import type { UiProp } from '../utils/ui'
import { FlexRender } from '@tanstack/vue-table'
import { computed, h, useSlots, watchEffect } from 'vue'
import { useTable } from '../composables/use-table'
import { tableTheme } from '../theme/table'
import { convertChildrenToColumns } from '../utils/table-columns'
import { resolveSlot, useComponentTheme, useRootProps } from '../utils/ui'
import Checkbox from './Checkbox.vue'

defineOptions({ inheritAttrs: false })

const props = defineProps<{
  data: unknown[]
  columns?: any[]
  selectable?: boolean
  pageSize?: number
  loading?: boolean
  sorting?: any[]
  rowSelection?: Record<string, boolean>
  globalFilter?: string
  pageIndex?: number
  ui?: UiProp<TableSlots>
}>()

const emit = defineEmits<{
  'update:sorting': [value: any[]]
  'update:rowSelection': [value: Record<string, boolean>]
  'update:globalFilter': [value: string]
  'update:pageIndex': [value: number]
}>()

const slots = useSlots()

const selectColumn = {
  id: '__select__',
  header: ({ table }: any) => h(Checkbox, {
    'modelValue': table.getIsAllRowsSelected() ? true : table.getIsSomeRowsSelected() ? 'indeterminate' : false,
    'onUpdate:modelValue': () => table.toggleAllRowsSelected(),
  }),
  cell: ({ row }: any) => h(Checkbox, {
    'modelValue': row.getIsSelected(),
    'disabled': !row.getCanSelect(),
    'onUpdate:modelValue': () => row.toggleSelected(),
  }),
  enableSorting: false,
  enableColumnFilter: false,
}

const columns = computed(() => {
  const base = props.columns ?? convertChildrenToColumns(slots.default?.())
  return props.selectable ? [selectColumn, ...base] : base
})

const { table, pageIndex } = useTable(props, emit, columns)

if (import.meta.dev) {
  watchEffect(() => {
    const firstRow = props.data[0] as Record<string, unknown> | undefined
    if (!firstRow)
      return
    for (const column of columns.value) {
      if (column.accessorKey && !(column.accessorKey in firstRow))
        console.warn(`[SColumn] field "${column.accessorKey}" was not found on the first row of data.`)
    }
  })
}

const theme = useComponentTheme('table', tableTheme)
const ui = computed(() => theme.value())

const rootProps = useRootProps(() => ui.value.root, () => props.ui?.root)
const wrapperProps = computed(() => resolveSlot(ui.value.wrapper, props.ui?.wrapper))
const tableProps = computed(() => resolveSlot(ui.value.table, props.ui?.table))
const theadProps = computed(() => resolveSlot(ui.value.thead, props.ui?.thead))
const trProps = computed(() => resolveSlot(ui.value.tr, props.ui?.tr))
const thProps = computed(() => resolveSlot(ui.value.th, props.ui?.th))
const thSortableClass = computed(() => ui.value.thSortable())
const sortIconProps = computed(() => resolveSlot(ui.value.sortIcon, props.ui?.sortIcon))
const tdProps = computed(() => resolveSlot(ui.value.td, props.ui?.td))
const tfootProps = computed(() => resolveSlot(ui.value.tfoot, props.ui?.tfoot))
const emptyStateProps = computed(() => resolveSlot(ui.value.emptyState, props.ui?.emptyState))
const filterInputProps = computed(() => resolveSlot(ui.value.filterInput, props.ui?.filterInput))
const paginationWrapperProps = computed(() => resolveSlot(ui.value.paginationWrapper, props.ui?.paginationWrapper))
const paginationInfoProps = computed(() => resolveSlot(ui.value.paginationInfo, props.ui?.paginationInfo))
const paginationButtonsProps = computed(() => resolveSlot(ui.value.paginationButtons, props.ui?.paginationButtons))

const hasFooter = computed(() =>
  table.getFooterGroups().some(group => group.headers.some(header => header.column.columnDef.footer)),
)
</script>

<template>
  <div v-bind="rootProps">
    <div v-bind="wrapperProps">
      <table v-bind="tableProps">
        <thead v-bind="theadProps">
          <tr v-for="headerGroup in table.getHeaderGroups()" :key="headerGroup.id" v-bind="trProps">
            <template v-for="header in headerGroup.headers" :key="header.id">
              <th
                v-if="header.rowSpan !== 0"
                :colspan="header.colSpan"
                :rowspan="header.rowSpan"
                v-bind="thProps"
                :class="header.column.getCanSort() ? thSortableClass : undefined"
                @click="header.column.getToggleSortingHandler()?.($event)"
              >
                <template v-if="!header.isPlaceholder || header.rowSpan > 1">
                  <FlexRender :header="header" />
                  <Icon
                    v-if="header.column.getIsSorted() === 'asc'"
                    name="lucide:arrow-up"
                    v-bind="sortIconProps"
                  />
                  <Icon
                    v-else-if="header.column.getIsSorted() === 'desc'"
                    name="lucide:arrow-down"
                    v-bind="sortIconProps"
                  />
                  <div v-if="header.column.getCanFilter()">
                    <SInput
                      size="sm"
                      :model-value="(header.column.getFilterValue() as string) ?? ''"
                      placeholder="Filter..."
                      v-bind="filterInputProps"
                      @click.stop
                      @update:model-value="(value) => header.column.setFilterValue(value)"
                    />
                  </div>
                </template>
              </th>
            </template>
          </tr>
        </thead>

        <tbody v-if="table.getRowModel().rows.length">
          <tr v-for="row in table.getRowModel().rows" :key="row.id" v-bind="trProps">
            <td v-for="cell in row.getAllCells()" :key="cell.id" v-bind="tdProps">
              <FlexRender :cell="cell" />
            </td>
          </tr>
        </tbody>

        <tfoot v-if="hasFooter" v-bind="tfootProps">
          <tr v-for="footerGroup in table.getFooterGroups()" :key="footerGroup.id" v-bind="trProps">
            <th v-for="header in footerGroup.headers" :key="header.id" :colspan="header.colSpan" v-bind="thProps">
              <FlexRender v-if="!header.isPlaceholder" :footer="header" />
            </th>
          </tr>
        </tfoot>
      </table>

      <div v-if="!table.getRowModel().rows.length" v-bind="emptyStateProps">
        <slot name="empty">
          No data
        </slot>
      </div>
    </div>

    <div v-if="table.getPageCount() > 1" v-bind="paginationWrapperProps">
      <span v-bind="paginationInfoProps">
        Page {{ pageIndex + 1 }} of {{ table.getPageCount() }}
      </span>
      <div v-bind="paginationButtonsProps">
        <SButton variant="outline" size="sm" :disabled="!table.getCanPreviousPage()" @click="table.previousPage()">
          Previous
        </SButton>
        <SButton variant="outline" size="sm" :disabled="!table.getCanNextPage()" @click="table.nextPage()">
          Next
        </SButton>
      </div>
    </div>
  </div>
</template>
