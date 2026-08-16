---
title: Select
description: A select constrained to its options - single or multiple, optionally searchable and virtualized, built on Reka UI's Combobox primitive.
---

## Usage

See it live on the [home page](/). Values must come from `items` - for free text with suggestions, use [Autocomplete](/components/autocomplete) instead.

```vue
<script setup lang="ts">
const fruit = ref('apple')

const fruitItems = [
  { label: 'Apple', value: 'apple' },
  { label: 'Banana', value: 'banana' },
  { label: 'Cherry', value: 'cherry', disabled: true },
]
</script>

<template>
  <SSelect v-model="fruit" placeholder="Pick a fruit" :items="fruitItems" />
</template>
```

Clicking anywhere on the trigger opens it - not just an icon. When `searchable`
is set, the filter input lives inside the popover, not in the trigger itself.

```vue-html
<SSelect v-model="fruit" searchable placeholder="Pick a fruit" :items="fruitItems" />
```

### Multiple selection

`multiple` turns `modelValue` into a string array. `displayMode` controls how
selected values render in the trigger - `comma` (default) joins labels as
text, `chip` renders removable pills. Both modes truncate at `maxChips`
(default 3) and show a "+N more" summary - hovering it reveals the rest in a
tooltip.

```vue-html
<SSelect v-model="fruits" multiple display-mode="chip" :max-chips="2" :items="fruitItems" />
```

### Virtualization

For large option lists, `virtualize` renders only the visible rows (backed by
`@tanstack/vue-virtual` via Reka UI's `ComboboxVirtualizer`). Pass `true` for
defaults, or an object to tune `estimateSize`/`overscan`.

```vue-html
<SSelect v-model="value" searchable virtualize :items="fiveThousandItems" />
```

One caveat: virtualizing a grouped `items` list flattens the groups (a Reka UI
limitation) - group headers won't render while virtualized.

### Custom objects

`items` doesn't have to be `{ label, value }` - point `labelKey`/`valueKey` at
whatever fields your data already has:

```vue-html
<SSelect
  v-model="userId"
  :items="users"
  label-key="fullName"
  value-key="id"
/>
```

### Grouped options

Nest options under `{ label, items }` entries:

```js
const items = [
  { label: 'Fruits', items: [{ label: 'Apple', value: 'apple' }] },
  { label: 'Vegetables', items: [{ label: 'Carrot', value: 'carrot' }] },
]
```

## Props

| Prop | Type | Default |
| --- | --- | --- |
| `items` | `(Option \| { label: string; items: Option[] })[]` | - |
| `valueKey` / `labelKey` | `string` | `'value'` / `'label'` |
| `modelValue` | `string \| string[]` | - |
| `multiple` | `boolean` | `false` |
| `searchable` | `boolean` | `false` |
| `virtualize` | `boolean \| { estimateSize?: number; overscan?: number }` | `false` |
| `displayMode` | `'comma' \| 'chip'` | `'comma'` |
| `maxChips` | `number` | `3` |
| `loading` | `boolean` | `false` |
| `placeholder` | `string` | - |
| `disabled` | `boolean` | `false` |
| `size` | `'sm' \| 'md' \| 'lg'` | `md` |
| `ui` | `Partial<Record<SelectSlot, string \| object>>` | - |

## Slots

| Slot | Props | Description |
| --- | --- | --- |
| `item` | `{ item }` | Custom option rendering (also used for chips) |
| `value` | `{ selected }` | Custom trigger display (single-select only) |
| `empty` | - | Shown when `items` is empty |
| `empty-filter` | - | Shown when a search yields no matches |
| `header` / `footer` | - | Content above/below the option list |
