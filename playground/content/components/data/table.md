---
title: Table
description: A table built on TanStack Table, with a declarative column API - sorting, row selection, pagination, and filtering out of the box.
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

Every column is sortable by default (click a header to cycle
ascending/descending/none) - set `sortable="false"` on a column to opt out.
`filterable` adds a per-column text filter input to that column's header.
`selectable` adds a leading checkbox column wired to `v-model:row-selection`.

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

`page-size` (default `10`) controls how many rows render per page. Prev/next
controls appear automatically once there's more than one page, and bind to
`v-model:page-index` if you need to read or control the current page
yourself.

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
unique to `STable` - any declarative-column-as-children table API in Vue
has the identical gap. As a cheap safety net, `STable` warns in dev mode (not
production) if a column's `field` doesn't exist as a key on the first row of
`data` - catching typos without any type-system gymnastics. For actual
compile-time safety, use the `columns` escape hatch above instead.

## Props

### STable

| Prop | Type | Default |
| --- | --- | --- |
| `data` | `unknown[]` | - |
| `columns` | `ColumnDef[]` | - |
| `selectable` | `boolean` | `false` |
| `pageSize` | `number` | `10` |
| `loading` | `boolean` | `false` |
| `sorting` | `SortingState` | - |
| `rowSelection` | `Record<string, boolean>` | - |
| `globalFilter` | `string` | - |
| `pageIndex` | `number` | - |
| `ui` | `Partial<Record<TableSlot, string \| object>>` | - |

### SColumn

| Prop | Type | Default |
| --- | --- | --- |
| `field` | `string` | - (required) |
| `header` | `string` | - |
| `footer` | `string` | - |
| `sortable` | `boolean` | `true` |
| `filterable` | `boolean` | `false` |

### SColumnGroup

| Prop | Type | Default |
| --- | --- | --- |
| `header` | `string` | - |
| `footer` | `string` | - |

## Slots

| Slot | Props | Description |
| --- | --- | --- |
| `empty` | - | Shown when `data` is empty |

`SColumn`'s own default slot customizes that column's cell content - see
[Custom cell content](#custom-cell-content) above.
