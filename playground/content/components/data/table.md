---
title: Table
description: A table built on TanStack Table, with a declarative column API - sorting, row selection, pagination, filtering, expansion, column visibility, virtual scroll, and pinned columns out of the box.
order: 30
---

## Usage

Pass `data` and declare columns with `<SColumn>` children - no column config
objects required for the common case:

::component-example{name="table-basic"}
::

```vue
<script setup lang="ts">
interface User { name: string, email: string, role: string }

const users = ref<User[]>([
  { name: 'Alice Johnson', email: 'alice@example.com', role: 'Admin' },
  { name: 'Bob Smith', email: 'bob@example.com', role: 'Member' },
])

const rowSelection = ref({})
const globalFilter = ref('')
</script>

<template>
  <SInput v-model="globalFilter" placeholder="Search users..." />
  <STable
    v-model:row-selection="rowSelection"
    v-model:global-filter="globalFilter"
    :data="users"
    selectable
    :page-size="3"
  >
    <SColumn field="name" header="Name" filterable />
    <SColumn field="email" header="Email" />
    <SColumn field="role" header="Role" />
  </STable>
</template>
```

Every column is sortable by default (click a header, or focus it and press
<kbd>Enter</kbd>/<kbd>Space</kbd>, to cycle ascending/descending/none) - set
`sortable="false"` on a column to opt out. Shift-click a second sortable
header to add it as a secondary sort without clearing the first (a third
click on the same header clears its own sort instead of cycling back to
ascending) - both come from TanStack Table's own defaults, not something
`STable` implements itself. `filterable` adds a per-column text filter
input to that column's header. `selectable` adds a leading checkbox column
wired to `v-model:row-selection`.

`STable` doesn't render a global search input itself - wire one up yourself
and bind it to `v-model:global-filter`, same compositional approach as the
rest of the library.

### Grouped headers

Wrap columns in `<SColumnGroup>` to produce a multi-row header with the
correct `colspan`/`rowspan` - nest as deeply as needed:

::component-example{name="table-grouped"}
::

```vue-html
<STable :data="employees">
  <SColumn field="name" header="Name" />
  <SColumnGroup header="Details">
    <SColumn field="age" header="Age" />
    <SColumn field="city" header="City" />
    <SColumn field="department" header="Department" />
  </SColumnGroup>
</STable>
```

### Pagination

Pagination is opt-in: every row renders on one page until you set
`page-size`. Once set, a [Pagination](/components/navigation/pagination)
control (page numbers, Prev/Next, scaling with `size`) appears automatically
once there's more than one page, and binds to `v-model:page-index` if you
need to read or control the current page yourself. `virtualize` is the
better fit for windowing a large dataset instead - see
[Virtual scroll](#virtual-scroll) below.

### Presort

`default-sorting` seeds the initial sort without needing `v-model:sorting` -
useful when you want a table to open already sorted but still let the user
change it freely afterward:

```vue-html
<STable :data="users" :default-sorting="[{ id: 'name', desc: false }]">
  <SColumn field="name" header="Name" />
</STable>
```

Unlike `sorting`, this is read once as a starting value, not on every render -
the same uncontrolled-default pattern as `Accordion`/`Tabs`'s `defaultValue`.

### Custom cell content

Give an `<SColumn>` a default slot to customize how each cell renders. It
receives `{ row, value }`, where `row` is the full row object and `value` is
that column's own field value:

```vue-html
<SColumn field="role" header="Role">
  <template #default="{ value }">
    <SBadge :label="value" />
  </template>
</SColumn>
```

### Custom header content

`<SColumn>`/`<SColumnGroup>` take the same treatment for their `header`/
`footer` - a named slot (scoped with `{ column }`, TanStack's own column
API) that replaces the plain string prop when given:

::component-example{name="table-custom-header"}
::

```vue-html
<SColumn field="role">
  <template #header>
    <span class="inline-flex items-center gap-1">
      Role
      <STooltip text="Admins can manage billing and members">
        <SIcon name="ph:info" class="size-3.5 text-[var(--ui-text-muted)]" />
      </STooltip>
    </span>
  </template>
</SColumn>
```

### Row expansion

`expandable` adds a leading toggle column; give `STable` an `expanded` slot
for the detail content, receiving `{ row }` (the row's original data object):

::component-example{name="table-expandable"}
::

```vue-html
<STable :data="orders" expandable>
  <SColumn field="id" header="Order" />
  <SColumn field="customer" header="Customer" />
  <SColumn field="total" header="Total" />
  <template #expanded="{ row }">
    <strong>Items:</strong> {{ row.items.join(', ') }}
  </template>
</STable>
```

Expansion state is uncontrolled by default; bind `v-model:expanded` if you
need to read or drive it yourself (e.g. to expand a row programmatically).

### Row click

`@row-click`/`@row-contextmenu` fire with the row's original data object
and the native event - useful for navigating to a detail page, for
instance. A row only gets a pointer cursor when `@row-click` actually has
a listener attached, so a plain, non-interactive table isn't misleadingly
styled as clickable:

::component-example{name="table-row-click"}
::

```vue-html
<STable :data="users" @row-click="(row) => router.push(`/users/${row.id}`)">
  <SColumn field="name" header="Name" />
  <SColumn field="email" header="Email" />
  <SColumn field="role" header="Role" />
</STable>
```

### Per-row styling

`row-class`/`row-style` are called with each row's own data, letting you
style a row conditionally - highlighting an overdue order, say:

::component-example{name="table-row-styling"}
::

```vue-html
<STable :data="orders" :row-class="(row) => row.overdue ? 'bg-[var(--ui-danger-soft)]' : undefined">
  <SColumn field="id" header="Order" />
  <SColumn field="customer" header="Customer" />
  <SColumn field="total" header="Total" />
</STable>
```

### Column visibility toggle

`column-toggle` renders a "Columns" button above the table that opens a panel
of checkboxes, one per column, letting the user hide/show columns on the fly:

::component-example{name="table-column-toggle"}
::

```vue-html
<STable :data="users" column-toggle>
  <SColumn field="name" header="Name" />
  <SColumn field="email" header="Email" />
  <SColumn field="role" header="Role" />
</STable>
```

Bind `v-model:column-visibility` if you need to read or control which
columns are shown yourself (e.g. to persist the choice).

### Frozen columns

Give a column `pinned="left"` or `pinned="right"` to keep it fixed at that
edge during horizontal scroll - pair it with `scroll-height` (below) and
enough columns (or a `ui.table` min-width override) that the table actually
needs to scroll:

::component-example{name="table-pinned"}
::

```vue-html
<STable :data="employees" scroll-height="16rem" :ui="{ table: 'min-w-[960px]' }">
  <SColumn field="name" header="Name" pinned="left" />
  <SColumn field="department" header="Department" />
  <SColumn field="role" header="Role" />
  <SColumn field="email" header="Email" />
  <SColumn field="phone" header="Phone" />
  <SColumn field="city" header="City" />
  <SColumn field="startDate" header="Start date" />
  <SColumn field="actions" header="Actions" sortable="false" pinned="right">
    <template #default>
      <SButton variant="outline" size="sm">Edit</SButton>
    </template>
  </SColumn>
</STable>
```

Sticky offsets are measured from each header's real rendered width after
mount and whenever the column list or visibility changes - not on every
possible layout shift (a later web-font load, a window resize), which is a
deliberate scope cut for this pass.

### Virtual scroll

`scroll-height` caps the table at a fixed CSS height with a sticky header and
vertical scroll. Add `virtualize` to only render the rows currently in view,
for datasets too large to put in the DOM all at once:

::component-example{name="table-virtualized"}
::

```vue-html
<STable :data="tenThousandRows" scroll-height="16rem" virtualize>
  <SColumn field="id" header="ID" />
  <SColumn field="name" header="Name" />
</STable>
```

Pass an object instead of `true` to tune `estimateSize`/`overscan`:

```vue-html
<STable :data="rows" scroll-height="16rem" :virtualize="{ estimateSize: 48, overscan: 12 }" />
```

Virtualizing replaces pagination as the strategy for a large dataset - while
`virtualize` is set, `page-size` has no effect and the pagination controls
don't render.

### Sizes, grid lines & striped rows

`size` (`sm` / `md` / `lg`) controls cell padding and text size. `gridlines`
adds borders around every cell instead of just row dividers, and `striped`
alternates row backgrounds:

::component-example{name="table-styling"}
::

```vue-html
<STable :data="users" gridlines striped size="sm">
  <SColumn field="name" header="Name" />
  <SColumn field="email" header="Email" />
  <SColumn field="role" header="Role" />
</STable>
```

### Loading

`loading` overlays the table with a spinner while keeping the existing rows
visible underneath, rather than swapping to an empty state:

::component-example{name="table-loading"}
::

```vue-html
<STable :data="users" :loading="loading">
  <SColumn field="name" header="Name" />
  <SColumn field="email" header="Email" />
</STable>
```

### Export

`STable` exposes an `exportCsv(filename?)` method via a template ref - it
downloads every row matching the current filters/sort across all pages (not
just the current page), skipping any synthetic selection/expand column:

::component-example{name="table-export"}
::

```vue-html
<script setup lang="ts">
const tableRef = ref()
</script>

<template>
  <SButton @click="tableRef.exportCsv('users.csv')">
    Export CSV
  </SButton>
  <STable ref="tableRef" :data="users">
    <SColumn field="name" header="Name" />
    <SColumn field="email" header="Email" />
  </STable>
</template>
```

### Server-side / manual mode

By default, `STable` sorts/filters/paginates `data` itself, locally, every
time. Set `manual-sorting`/`manual-filtering`/`manual-pagination` when
`data` is already sorted/filtered/paginated server-side instead - each one
opts that specific concern out of the local row model, so `STable` doesn't
redundantly (and incorrectly) reprocess a slice the server already
handled. `sorting`/`global-filter`/`page-index` still drive the UI and
still emit their own `update:*` events the normal way; only the local row
model backing them changes.

`manual-pagination` also suppresses the built-in pagination UI entirely -
there's no way to derive a real page count from a server-paginated slice
of `data`, and guessing at one would be misleading. Bring your own
[SPagination](/components/navigation/pagination) instead, bound to
whatever your server actually returns, the same way this table already
expects you to bring your own search input for `global-filter` (see
[Usage](#usage) above) rather than rendering one itself:

```vue-html
<script setup lang="ts">
const sorting = ref([])
const pageIndex = ref(0)
const total = ref(0)
const rows = ref([])

watch([sorting, pageIndex], async () => {
  const result = await fetchUsers({ sorting: sorting.value, page: pageIndex.value })
  rows.value = result.rows
  total.value = result.total
}, { immediate: true })
</script>

<template>
  <STable
    v-model:sorting="sorting"
    v-model:page-index="pageIndex"
    :data="rows"
    manual-sorting
    manual-pagination
  >
    <SColumn field="name" header="Name" />
    <SColumn field="email" header="Email" />
  </STable>
  <SPagination
    :page="pageIndex + 1"
    :total="total"
    :items-per-page="10"
    @update:page="(page) => pageIndex = page - 1"
  />
</template>
```

### Escape hatch: raw column defs

For full TanStack type inference (or features `<SColumn>` doesn't expose),
pass a `columns` prop instead of `<SColumn>` children - a plain
`ColumnDef[]` array, same shape TanStack itself accepts:

```vue-html
<STable :data="users" :columns="columns" />
```

## Known limitation

`<SColumn>`'s `field` prop is typed as plain `string`, not `keyof TData` -
this is a genuine Vue limitation (a parent's generic type parameter doesn't
propagate into child components referenced in its template), not something
unique to `STable` - any declarative-column-as-children table API in Vue has
the identical gap. As a cheap safety net, `STable` warns in dev mode (not
production) if a column's `field` doesn't exist as a key on the first row of
`data` - catching typos without any type-system gymnastics. For actual
compile-time safety, use the `columns` escape hatch above instead.

The same limitation applies to the `expanded` slot's `row` prop - it's typed
generically, so accessing a field specific to your data shape needs a local
cast, e.g. `(row as Order).items`.

### Accessibility

Sortable headers are keyboard-operable (<kbd>Enter</kbd>/<kbd>Space</kbd>
toggle the sort, same as a click) and expose `aria-sort` reflecting the
current state. The row-expansion toggle is a real `<button>` with an
`aria-label` of "Expand row"/"Collapse row" that updates with its state.
Column-visibility checkboxes are standard `SCheckbox` elements, and
pagination is a nested [SPagination](/components/navigation/pagination), so
both inherit those components' own accessibility behavior rather than
reimplementing it here.

## Props

### STable

| Prop | Type | Default |
| --- | --- | --- |
| `data` | `unknown[]` | - |
| `columns` | `ColumnDef[]` | - |
| `selectable` | `boolean` | `false` |
| `pageSize` | `number` | - (no pagination until set) |
| `loading` | `boolean` | `false` |
| `sorting` | `SortingState` | - |
| `defaultSorting` | `SortingState` | - |
| `rowSelection` | `Record<string, boolean>` | - |
| `globalFilter` | `string` | - |
| `pageIndex` | `number` | - |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` |
| `gridlines` | `boolean` | `false` |
| `striped` | `boolean` | `false` |
| `expandable` | `boolean` | `false` |
| `expanded` | `ExpandedState` | - |
| `columnVisibility` | `Record<string, boolean>` | - |
| `columnToggle` | `boolean` | `false` |
| `scrollHeight` | `string` | - |
| `virtualize` | `boolean \| { estimateSize?: number; overscan?: number }` | `false` |
| `manualSorting` | `boolean` | `false` |
| `manualFiltering` | `boolean` | `false` |
| `manualPagination` | `boolean` | `false` |
| `rowClass` | `(row: unknown) => string \| undefined` | - |
| `rowStyle` | `(row: unknown) => Record<string, string> \| undefined` | - |
| `ui` | `Partial<Record<TableSlot, string \| object>>` | - |

## Emits

| Event | Payload | Description |
| --- | --- | --- |
| `rowClick` | `(row, event: MouseEvent)` | Fired when a body row is clicked |
| `rowContextmenu` | `(row, event: MouseEvent)` | Fired when a body row is right-clicked |

### SColumn

| Prop | Type | Default |
| --- | --- | --- |
| `field` | `string` | - (required) |
| `header` | `string` | - |
| `footer` | `string` | - |
| `sortable` | `boolean` | `true` |
| `filterable` | `boolean` | `false` |
| `pinned` | `'left' \| 'right'` | - |

### SColumnGroup

| Prop | Type | Default |
| --- | --- | --- |
| `header` | `string` | - |
| `footer` | `string` | - |

## Slots

| Slot | Props | Description |
| --- | --- | --- |
| `empty` | - | Shown when `data` is empty |
| `expanded` | `{ row }` | Detail content for an expanded row (requires `expandable`) |

`SColumn`'s own default slot customizes that column's cell content - see
[Custom cell content](#custom-cell-content) above. `SColumn`/`SColumnGroup`
also both take `header`/`footer` slots (scoped with `{ column }`) - see
[Custom header content](#custom-header-content) above.

## Methods

Access these via a template ref on `STable`.

| Method | Description |
| --- | --- |
| `exportCsv(filename?: string)` | Downloads all matching rows (across every page) as a CSV file |
