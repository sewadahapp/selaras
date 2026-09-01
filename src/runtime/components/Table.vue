<script setup lang="ts">
import type { TableThemeSlots } from '../theme/table'
import type { UiProp } from '../utils/ui'
import { FlexRender } from '@tanstack/vue-table'
import { useVirtualizer } from '@tanstack/vue-virtual'
import { computed, getCurrentInstance, h, nextTick, onMounted, onUnmounted, ref, useSlots, watch, watchEffect } from 'vue'
import { useIcons } from '../composables/use-icons'
import { useMessages } from '../composables/use-messages'
import { useTable } from '../composables/use-table'
import { tableTheme } from '../theme/table'
import { collectColumnPinning, convertChildrenToColumns } from '../utils/table-columns'
import { exportTableToCsv } from '../utils/table-export'
import { resolveSlot, useComponentTheme, useRootProps, withFallthroughClass } from '../utils/ui'
import Button from './Button.vue'
import Checkbox from './Checkbox.vue'
import Icon from './Icon.vue'
import Input from './Input.vue'
import Pagination from './Pagination.vue'

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<{
  data: unknown[]
  columns?: any[]
  selectable?: boolean
  pageSize?: number
  loading?: boolean
  sorting?: any[]
  defaultSorting?: any[]
  rowSelection?: Record<string, boolean>
  globalFilter?: string
  pageIndex?: number
  size?: 'sm' | 'md' | 'lg'
  gridlines?: boolean
  striped?: boolean
  expandable?: boolean
  expanded?: any
  columnVisibility?: Record<string, boolean>
  columnToggle?: boolean
  /** Enables vertical scroll with a sticky header, capped at this CSS height (e.g. '24rem'). */
  scrollHeight?: string
  virtualize?: boolean | { estimateSize?: number, overscan?: number }
  /** Opts out of the local sorted/filtered/paginated row models - set when `data` is already sorted/filtered/paginated server-side, so this table doesn't redundantly (and incorrectly) reprocess an already-server-processed slice. `sorting`/`globalFilter`/`pageIndex` still drive the UI and still emit their `update:*` events the same way - only the *local row model* is skipped, not the state itself. `manualPagination` also suppresses the built-in Pagination UI entirely (there's no way to know the real page count from a server-paginated slice) - bring your own `SPagination`, bound to your own server metadata, the same way this table already expects you to bring your own search input for `globalFilter`. */
  manualSorting?: boolean
  manualFiltering?: boolean
  manualPagination?: boolean
  /** Adds a class to a body row based on its own data - e.g. highlighting a flagged row. Called per row, not per render, so keep it cheap. */
  rowClass?: (row: unknown) => string | undefined
  /** Same as `rowClass`, for inline styles. */
  rowStyle?: (row: unknown) => Record<string, string> | undefined
  ui?: UiProp<TableThemeSlots>
}>(), {
  size: 'md',
})

const emit = defineEmits<{
  'update:sorting': [value: any[]]
  'update:rowSelection': [value: Record<string, boolean>]
  'update:globalFilter': [value: string]
  'update:pageIndex': [value: number]
  'update:expanded': [value: any]
  'update:columnVisibility': [value: Record<string, boolean>]
  'rowClick': [row: unknown, event: MouseEvent]
  'rowContextmenu': [row: unknown, event: MouseEvent]
}>()

const slots = useSlots()

const icons = useIcons()
const messages = useMessages()
const theme = useComponentTheme('table', tableTheme)
const ui = computed(() => theme.value({ size: props.size, gridlines: props.gridlines, striped: props.striped, scrollable: !!props.scrollHeight }))

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

const expandColumn = {
  id: '__expand__',
  header: '',
  cell: ({ row }: any) => h('button', {
    'type': 'button',
    'class': ui.value.expandButton(),
    'aria-label': row.getIsExpanded() ? messages.value.collapseRow : messages.value.expandRow,
    'onClick': () => row.toggleExpanded(),
  }, [h(Icon, { 'name': icons.value.chevronRight, 'class': ui.value.expandChevron(), 'data-expanded': row.getIsExpanded() || undefined })]),
  enableSorting: false,
  enableColumnFilter: false,
}

const columns = computed(() => {
  const base = props.columns ?? convertChildrenToColumns(slots.default?.())
  const withExpand = props.expandable ? [expandColumn, ...base] : base
  return props.selectable ? [selectColumn, ...withExpand] : withExpand
})

const columnPinning = computed(() => collectColumnPinning(columns.value))

const { table, pageIndex, columnVisibility, effectivePageSize } = useTable(props, emit, columns, columnPinning)

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

const rootProps = useRootProps(() => ui.value.root, () => props.ui?.root)
const wrapperProps = computed(() => resolveSlot(ui.value.wrapper, props.ui?.wrapper))
const tableProps = computed(() => resolveSlot(ui.value.table, props.ui?.table))
const theadProps = computed(() => resolveSlot(ui.value.thead, props.ui?.thead))
const trProps = computed(() => resolveSlot(ui.value.tr, props.ui?.tr))

// cursor-pointer only when a consumer actually listens for row-click - a
// real affordance that the row is clickable, not a decoration every table
// gets regardless of whether clicking does anything. useAttrs()/$attrs
// doesn't work for this - Vue excludes a listener from $attrs entirely
// once its event is declared via defineEmits (it's treated as
// "recognized", not fallthrough), so `attrs.onRowClick` is always
// undefined here. vnode.props is the raw, pre-filtered props/attrs bag
// and does still include it - read fresh inside the render (not cached in
// a computed, since vnode replacement isn't itself a tracked reactive
// dependency) so it reflects whichever vnode this specific render pass has.
const instance = getCurrentInstance()
function isRowClickable() {
  return !!(instance?.vnode.props as Record<string, unknown> | null)?.onRowClick
}
function bodyRowProps(rowOriginal: unknown) {
  const extraClass = [
    isRowClickable() ? 'cursor-pointer' : undefined,
    props.rowClass?.(rowOriginal),
  ].filter(Boolean).join(' ') || undefined
  const base = resolveSlot(ui.value.tr, withFallthroughClass(extraClass, props.ui?.tr))
  const rowStyle = props.rowStyle?.(rowOriginal)
  return rowStyle ? { ...base, style: { ...(base as { style?: Record<string, string> }).style, ...rowStyle } } : base
}
function onRowClick(rowOriginal: unknown, event: MouseEvent) {
  emit('rowClick', rowOriginal, event)
}
function onRowContextmenu(rowOriginal: unknown, event: MouseEvent) {
  emit('rowContextmenu', rowOriginal, event)
}

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
const loadingOverlayProps = computed(() => resolveSlot(ui.value.loadingOverlay, props.ui?.loadingOverlay))
const loadingIconProps = computed(() => resolveSlot(ui.value.loadingIcon, props.ui?.loadingIcon))
const expandedRowProps = computed(() => resolveSlot(ui.value.expandedRow, props.ui?.expandedRow))
const expandedCellProps = computed(() => resolveSlot(ui.value.expandedCell, props.ui?.expandedCell))
const columnToggleProps = computed(() => resolveSlot(ui.value.columnToggle, props.ui?.columnToggle))
const columnTogglePanelProps = computed(() => resolveSlot(ui.value.columnTogglePanel, props.ui?.columnTogglePanel))
const columnToggleItemProps = computed(() => resolveSlot(ui.value.columnToggleItem, props.ui?.columnToggleItem))

const hasFooter = computed(() =>
  table.getFooterGroups().some(group => group.headers.some(header => header.column.columnDef.footer)),
)

// --- column pinning: sticky offsets, measured from real rendered widths ---
// (TanStack's own getStart()/getAfter() assume columnSizingFeature is
// registered, which this table doesn't use - every column would otherwise
// report the same generic default size regardless of its real rendered
// width.) Recomputed on mount and whenever the column list or visibility
// changes - not on every possible layout shift (e.g. a later font load),
// a deliberate, documented scope cut for this pass.
const headerRefs = new Map<string, HTMLElement>()
function setHeaderRef(id: string, el: unknown) {
  if (el)
    headerRefs.set(id, el as HTMLElement)
  else
    headerRefs.delete(id)
}

const pinnedOffsets = ref<Record<string, number>>({})

async function recomputePinnedOffsets() {
  await nextTick()
  const offsets: Record<string, number> = {}
  let left = 0
  for (const column of table.getStartVisibleLeafColumns()) {
    offsets[column.id] = left
    left += headerRefs.get(column.id)?.getBoundingClientRect().width ?? 0
  }
  let right = 0
  for (const column of [...table.getEndVisibleLeafColumns()].reverse()) {
    offsets[column.id] = right
    right += headerRefs.get(column.id)?.getBoundingClientRect().width ?? 0
  }
  pinnedOffsets.value = offsets
}

onMounted(recomputePinnedOffsets)
watch([columns, columnVisibility], recomputePinnedOffsets)

function pinnedStyle(cell: { column: { id: string, getIsPinned: () => false | 'start' | 'end' } }) {
  const side = cell.column.getIsPinned()
  if (!side)
    return undefined
  const offset = pinnedOffsets.value[cell.column.id] ?? 0
  return side === 'start' ? { insetInlineStart: `${offset}px` } : { insetInlineEnd: `${offset}px` }
}

// --- virtualization: spacer-row technique - only the visible window of
// <tr> elements actually renders, with a padding-height spacer row above
// and below standing in for the rest. Avoids needing to know column
// widths up front (unlike absolute-positioned-row virtualization), since
// real rows still flow normally and drive the table's own column layout.
const wrapperEl = ref<HTMLElement>()
const virtualizeConfig = computed(() => {
  if (!props.virtualize)
    return null
  const opts = props.virtualize === true ? {} : props.virtualize
  return { estimateSize: opts.estimateSize ?? 40, overscan: opts.overscan ?? 8 }
})

// Always constructed (never conditionally, since virtualize can toggle
// reactively) - its output is only ever read when virtualizeConfig is set.
const rowVirtualizer = useVirtualizer(computed(() => ({
  count: table.getRowModel().rows.length,
  getScrollElement: () => wrapperEl.value ?? null,
  estimateSize: () => virtualizeConfig.value?.estimateSize ?? 40,
  overscan: virtualizeConfig.value?.overscan ?? 8,
})))

const virtualRows = computed(() => rowVirtualizer.value.getVirtualItems())
const virtualPaddingTop = computed(() => virtualRows.value[0]?.start ?? 0)
const virtualPaddingBottom = computed(() => {
  if (!virtualRows.value.length)
    return 0
  const last = virtualRows.value[virtualRows.value.length - 1]!
  return rowVirtualizer.value.getTotalSize() - (last.start + last.size)
})
const visibleRows = computed(() => {
  const rows = table.getRowModel().rows
  return virtualizeConfig.value ? virtualRows.value.map(v => rows[v.index]!) : rows
})

// --- column visibility toggle ---
const showColumnTogglePanel = ref(false)
const toggleableColumns = computed(() => table.getAllLeafColumns().filter(c => !c.id.startsWith('__')))

function onDocumentClick(event: MouseEvent) {
  if (!(event.target as HTMLElement).closest('[data-column-toggle]'))
    showColumnTogglePanel.value = false
}

onMounted(() => document.addEventListener('click', onDocumentClick))
onUnmounted(() => document.removeEventListener('click', onDocumentClick))

defineExpose({
  exportCsv: (filename?: string) => exportTableToCsv(table, filename),
})
</script>

<template>
  <div v-bind="rootProps">
    <div v-if="columnToggle" class="mb-2 flex justify-end">
      <div data-column-toggle v-bind="columnToggleProps">
        <Button variant="outline" size="sm" :icon="icons.columns" @click="showColumnTogglePanel = !showColumnTogglePanel">
          {{ messages.columns }}
        </Button>
        <div v-if="showColumnTogglePanel" v-bind="columnTogglePanelProps">
          <label v-for="column in toggleableColumns" :key="column.id" v-bind="columnToggleItemProps">
            <Checkbox :model-value="column.getIsVisible()" @update:model-value="column.toggleVisibility()" />
            {{ typeof column.columnDef.header === 'string' ? column.columnDef.header : column.id }}
          </label>
        </div>
      </div>
    </div>

    <div ref="wrapperEl" v-bind="wrapperProps" :style="scrollHeight ? { maxHeight: scrollHeight } : undefined">
      <table v-bind="tableProps">
        <thead v-bind="theadProps">
          <tr v-for="headerGroup in table.getHeaderGroups()" :key="headerGroup.id" v-bind="trProps">
            <template v-for="header in headerGroup.headers" :key="header.id">
              <th
                v-if="header.rowSpan !== 0"
                :ref="(el: unknown) => setHeaderRef(header.column.id, el)"
                :colspan="header.colSpan"
                :rowspan="header.rowSpan"
                v-bind="thProps"
                :class="header.column.getCanSort() ? thSortableClass : undefined"
                :data-pinned="header.column.getIsPinned() || undefined"
                :style="pinnedStyle(header)"
                :tabindex="header.column.getCanSort() ? 0 : undefined"
                :aria-sort="header.column.getIsSorted() === 'asc' ? 'ascending' : header.column.getIsSorted() === 'desc' ? 'descending' : header.column.getCanSort() ? 'none' : undefined"
                @click="header.column.getToggleSortingHandler()?.($event)"
                @keydown.enter="header.column.getToggleSortingHandler()?.($event)"
                @keydown.space.prevent="header.column.getToggleSortingHandler()?.($event)"
              >
                <template v-if="!header.isPlaceholder || header.rowSpan > 1">
                  <FlexRender :header="header" />
                  <Icon
                    v-if="header.column.getIsSorted() === 'asc'"
                    :name="icons.sortAscending"
                    v-bind="sortIconProps"
                  />
                  <Icon
                    v-else-if="header.column.getIsSorted() === 'desc'"
                    :name="icons.sortDescending"
                    v-bind="sortIconProps"
                  />
                  <div v-if="header.column.getCanFilter()">
                    <Input
                      size="sm"
                      :model-value="(header.column.getFilterValue() as string) ?? ''"
                      :placeholder="messages.filterPlaceholder"
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
          <tr v-if="virtualizeConfig && virtualPaddingTop > 0">
            <td :colspan="table.getVisibleLeafColumns().length" :style="{ height: `${virtualPaddingTop}px`, padding: 0, border: 0 }" />
          </tr>
          <template v-for="row in visibleRows" :key="row.id">
            <tr
              v-bind="bodyRowProps(row.original)"
              @click="onRowClick(row.original, $event)"
              @contextmenu="onRowContextmenu(row.original, $event)"
            >
              <td
                v-for="cell in row.getVisibleCells()"
                :key="cell.id"
                v-bind="tdProps"
                :data-pinned="cell.column.getIsPinned() || undefined"
                :style="pinnedStyle(cell)"
              >
                <FlexRender :cell="cell" />
              </td>
            </tr>
            <tr v-if="row.getIsExpanded()" v-bind="expandedRowProps">
              <td :colspan="row.getVisibleCells().length" v-bind="expandedCellProps">
                <slot name="expanded" :row="row.original" />
              </td>
            </tr>
          </template>
          <tr v-if="virtualizeConfig && virtualPaddingBottom > 0">
            <td :colspan="table.getVisibleLeafColumns().length" :style="{ height: `${virtualPaddingBottom}px`, padding: 0, border: 0 }" />
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
          {{ messages.noData }}
        </slot>
      </div>
    </div>

    <div v-if="loading" v-bind="loadingOverlayProps">
      <Icon :name="icons.loading" v-bind="loadingIconProps" />
    </div>

    <div v-if="!manualPagination && table.getPageCount() > 1" v-bind="paginationWrapperProps">
      <span v-bind="paginationInfoProps">
        {{ messages.paginationInfo(pageIndex + 1, table.getPageCount()) }}
      </span>
      <div v-bind="paginationButtonsProps">
        <Pagination
          :page="pageIndex + 1"
          :total="table.getFilteredRowModel().rows.length"
          :items-per-page="effectivePageSize"
          :size="size"
          @update:page="(value) => table.setPageIndex(value - 1)"
        />
      </div>
    </div>
  </div>
</template>
