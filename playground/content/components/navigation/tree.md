---
title: Tree
description: An expandable, selectable hierarchy - file browsers, nested settings, org structures - built on Reka UI's Tree primitive.
order: 41.75
---

## Usage

`items` is a nested array - a node with `children` renders as an
expandable row, one without renders as a leaf. Click a row to expand it
(and select it, if it's a leaf):

::component-example{name="tree-basic"}
::

```vue
<script setup lang="ts">
const items = [
  {
    label: 'Documents',
    value: 'documents',
    children: [
      { label: 'Resume.pdf', value: 'resume' },
      { label: 'Cover Letter.docx', value: 'cover-letter' },
    ],
  },
  { label: 'Notes.txt', value: 'notes' },
]
</script>

<template>
  <STree :items="items" />
</template>
```

### Multiple selection

`multiple` makes `v-model` an array instead of a single node.
`default-expanded` (an array of keys) opens branches immediately, no
click needed:

::component-example{name="tree-multiple"}
::

```vue-html
<STree v-model="selected" :items="items" multiple :default-expanded="['frontend', 'backend']" />
```

### Checkbox mode

`checkbox` shows a tri-state checkbox per row (reusing `SCheckbox`'s own
checked/unchecked/indeterminate model) and turns on `multiple` together
with parent↔child propagation: selecting a parent checks every one of
its descendants, and checking all of a node's children checks the
parent too (partially checking them marks it indeterminate instead):

::component-example{name="tree-checkbox"}
::

```vue-html
<STree v-model="selected" :items="items" checkbox :default-expanded="['permissions']" />
```

### Custom item content

The `item` slot replaces a row's default icon+label content, scoped
with the node itself plus its live `expanded`/`selected`/`indeterminate`
state:

::component-example{name="tree-custom-item"}
::

```vue-html
<STree :items="items">
  <template #item="{ item }">
    <span class="flex flex-1 items-center justify-between">
      <span>{{ item.label }}</span>
      <SBadge v-if="item.badge" :label="item.badge" size="sm" variant="soft" />
    </span>
  </template>
</STree>
```

### Disabled items

A node's own `disabled: true` blocks just that row - siblings stay
interactive:

::component-example{name="tree-disabled"}
::

```vue-html
<STree :items="items" />
```

```ts
const items = [
  { label: 'Members', value: 'members' },
  { label: 'Billing', value: 'billing', disabled: true },
]
```

## Props

| Prop | Type | Default |
| --- | --- | --- |
| `items` | `TreeItemType[]` | - (required) |
| `modelValue` | `TreeItemType \| TreeItemType[]` | - |
| `defaultValue` | `TreeItemType \| TreeItemType[]` | - |
| `expanded` | `string[]` | - |
| `defaultExpanded` | `string[]` | - |
| `multiple` | `boolean` | `false` |
| `checkbox` | `boolean` | `false` |
| `propagateSelect` | `boolean` | `false` |
| `bubbleSelect` | `boolean` | `false` |
| `disabled` | `boolean` | `false` |
| `getKey` | `(item: TreeItemType) => string` | `item => item.value ?? item.label` |
| `getChildren` | `(item: TreeItemType) => TreeItemType[] \| undefined` | `item => item.children` |
| `size` | `'sm' \| 'md' \| 'lg'` | `md` |
| `ui` | `Partial<Record<TreeSlot, string \| object>>` | - |

## Events

| Event | Payload | Description |
| --- | --- | --- |
| `update:modelValue` | `TreeItemType \| TreeItemType[]` | Fires on selection |
| `update:expanded` | `string[]` | Fires when a row is expanded or collapsed |

## Slots

| Slot | Props | Description |
| --- | --- | --- |
| `item` | `{ item, level, expanded, selected, indeterminate }` | Replaces a row's default icon+label content |
