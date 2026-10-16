---
title: TransferList
description: Assign items between two searchable selection panels with responsive layout.
order: 22.75
---

## Usage

TransferList separates available items from assigned items. `items` is the
complete collection; `v-model` contains the destination values. Checking a row
marks it for transfer, and pressing the add or remove arrow button updates the
destination model. The component never mutates the supplied collection.

::component-example{name="transfer-list-basic"}
::

```vue
<script setup lang="ts">
const assigned = ref([2])
const items = [
  { id: 1, name: 'Alex Morgan', description: 'Product designer' },
  { id: 2, name: 'Sam Lee', description: 'Software engineer' },
  { id: 3, name: 'Dina Sari', description: 'Project manager' },
  { id: 4, name: 'Taylor Kim', description: 'Workspace owner', disabled: true },
]
</script>

<template>
  <div class="w-full space-y-4">
    <STransferList v-model="assigned" :items="items" value-key="id" label-key="name" source-label="Available members" target-label="Project team" searchable />
    <p class="text-sm text-[var(--selaras-resolved-text-muted)]">
      Assigned member IDs: {{ assigned.join(', ') || 'None' }}
    </p>
  </div>
</template>
```

## Values and selection

Value rules match [Listbox](/components/forms/listbox) and Select: strings and
finite numbers are their own values; objects use `value` when present and
otherwise the whole object. Set `valueKey` and `labelKey` for custom fields.
Groups use `{ label, items }`, and identities must be unique across the collection.
Use a stable `valueKey` for records loaded from an API.

```vue-html
<STransferList v-model="assignedRoles" :items="['admin', 'editor', 'viewer']" />
<STransferList v-model="assignedIds" :items="users" value-key="id" label-key="name" />
```

Checked rows are internal by default. Bind `v-model:checked` when the application
needs to control them separately. Destination values absent from `items` are
preserved and appear in the assigned panel when their records arrive. Both
controlled models can reject updates without adopting the proposed state.

Disabled items cannot be checked or moved. Select all affects only visible,
enabled items in its panel. Transfer actions move all checked, enabled items
from that panel, including checked items hidden by a subsequent search.
Both panels retain the original collection order; model array order does not
reorder the displayed rows. Drag-and-drop and manual reordering are not provided.

## Search and layout

`searchable` adds independent label filters. Bind `v-model:source-search-term`
and `v-model:target-search-term` to control their text. Search preserves both
destination membership and checked rows.

`layout="auto"` places panels beside each other on larger screens and stacks
them on smaller screens. `horizontal` and `vertical` force a layout. The panels
remain inline; no modal presentation or adaptive prop is needed.

## Custom content

The `item` slot provides original item metadata, selection state, and `side`:

::component-example{name="transfer-list-custom-item"}
::

```vue
<script setup lang="ts">
const assigned = ref(['editor'])
const items = [
  { label: 'Administrator', value: 'admin', description: 'Full workspace access' },
  { label: 'Editor', value: 'editor', description: 'Create and edit content' },
  { label: 'Viewer', value: 'viewer', description: 'Read-only access' },
]
</script>

<template>
  <STransferList v-model="assigned" :items="items" source-label="Available roles" target-label="Assigned roles" class="w-full">
    <template #item="{ item, side }">
      <div class="min-w-0 flex-1">
        <p class="font-medium">
          {{ item.label }}
        </p>
        <p class="text-xs text-[var(--selaras-resolved-text-muted)]">
          {{ item.description }}
        </p>
      </div>
      <SBadge v-if="side === 'target'" size="sm" variant="soft" label="Assigned" />
    </template>
  </STransferList>
</template>
```

`source-header` and `target-header` receive `count` and `checkedCount`. Panel
footers and empty states are also customizable. Options should contain display
content rather than independently interactive links or buttons.

## Forms and accessibility

Use `name`, `form`, and `required` as with Listbox. Only destination values are
submitted; checked panel values are excluded. Object values serialize as JSON.
FormField supplies size, name, descriptions, and validation state.
Native reset restores the captured destination default and clears checked rows
and searches. Controlled parents receive reset proposals; canceled resets do
not update state.

Each panel has an accessible name from `sourceLabel` or `targetLabel`. Transfer
buttons use arrow icons with accessible labels and hover titles. Keyboard focus
moves to the receiving panel after
a transfer. A live region announces the number of transferred items.

The `transfer` event receives `{ direction, items, values }`, where direction is
`to-target` or `to-source` and the arrays contain only the moved items/values.
For a controlled model, events propose changes for the parent to accept.

## Styling and messages

Override `ui.transferList` for the layout and panel chrome; `ui.listbox` styles
the selection panels. Both support global app config, scoped Theme overrides,
and local `:ui` values. `ui.listbox` on a transfer instance can include attributes
such as `{ ui: { content: 'max-h-96' } }` to configure its panels.

Both the item indicators and select-all controls use
[Checkbox](/components/forms/checkbox), so global or scoped `ui.checkbox` overrides
apply to both panels. Item indicators are decorative: the option owns selection,
keyboard focus, and accessibility semantics. They do not submit extra form values.

```vue-html
<STheme :ui="{ checkbox: { slots: { box: 'rounded-none' } } }">
  <STransferList v-model="assigned" :items="items" />
</STheme>
```

Labels use the message registry: `transferSource`, `transferTarget`,
`moveToTarget`, `moveToSource`, `selectAll`, `listSelectionCount`, and
`transferItems`. Search and empty messages reuse `search`, `noOptions`, and
`noResultsFound`. Action icons use the shared chevron registry.

::theme-source{name="transfer-list"}
::

## Props

| Prop | Type | Default |
| --- | --- | --- |
| `items` | readonly primitive, object, or grouped entries | required |
| `modelValue` / `defaultValue` | destination value array | empty |
| `checked` | temporarily checked value array | internal |
| `labelKey` / `valueKey` / `descriptionKey` | object property | same as Listbox |
| `sourceLabel` / `targetLabel` | string | configured Available / Assigned |
| `searchable` | boolean | `false` |
| `sourceSearchTerm` / `targetSearchTerm` | string | empty |
| `showSelectAll` | boolean | `true` |
| `layout` | `auto` / `horizontal` / `vertical` | `auto` |
| `virtualize` | boolean or `{ estimateSize, overscan }` | `false` |
| `disabled` / `loading` / `invalid` | boolean | `false` |
| `size` / `color` | control size / semantic role | `md` / `primary` |
| `id` / `name` / `form` | string | - |
| `required` | boolean | `false` |
| `ui` | slot overrides | - |

## Slots

| Slot | Props | Purpose |
| --- | --- | --- |
| `item` | `{ item, index, selected, disabled, side }` | Original option content |
| `source-header` / `target-header` | `{ count, checkedCount }` | Panel heading |
| `source-footer` / `target-footer` | - | Panel footer |
| `empty` / `empty-filter` | `{ side }` | Empty panel / unmatched search |

`TransferListProps`, `TransferListEmits`, `TransferListSlots`, `TransferSide`, and
`TransferDirection` are exported from `@sewadah/selaras/types`.
