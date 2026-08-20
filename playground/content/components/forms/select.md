---
title: Select
description: A select constrained to its options - single or multiple, optionally searchable and virtualized, built on Reka UI's Combobox primitive.
order: 22
---

## Usage

::component-example{name="select-basic"}
::

Values must come from `items` - for free text with suggestions, use [Autocomplete](/components/forms/autocomplete) instead.

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

::component-example{name="select-searchable"}
::

```vue-html
<SSelect v-model="fruit" searchable placeholder="Pick a fruit" :items="fruitItems" />
```

### Multiple selection

`multiple` turns `modelValue` into a string array. `displayMode` controls how
selected values render in the trigger - `comma` (default) joins labels as
text, `chip` renders removable pills. Both modes truncate at `maxChips`
(default 3) and show a "+N more" summary - hovering it reveals the rest in a
tooltip, and clicking it still opens the popover like the rest of the trigger.

::component-example{name="select-multiple-comma"}
::

```vue-html
<SSelect v-model="fruits" multiple :max-chips="2" :items="fruitItems" />
```

::component-example{name="select-multiple-chip"}
::

```vue-html
<SSelect v-model="fruits" multiple display-mode="chip" :max-chips="2" :items="fruitItems" />
```

### Virtualization

For large option lists, `virtualize` renders only the visible rows (backed by
`@tanstack/vue-virtual` via Reka UI's `ComboboxVirtualizer`). Pass `true` for
defaults, or an object to tune `estimateSize`/`overscan`.

::component-example{name="select-virtualize"}
::

```vue-html
<SSelect v-model="value" searchable virtualize :items="fiveThousandItems" />
```

One caveat: virtualizing a grouped `items` list flattens the groups (a Reka UI
limitation) - group headers won't render while virtualized.

### Custom objects

`items` doesn't have to be `{ label, value }` - point `labelKey`/`valueKey` at
whatever fields your data already has:

::component-example{name="select-custom-objects"}
::

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

::component-example{name="select-grouped"}
::

```js
const items = [
  { label: 'Fruits', items: [{ label: 'Apple', value: 'apple' }] },
  { label: 'Vegetables', items: [{ label: 'Carrot', value: 'carrot' }] },
]
```

Wrap it in [FormField](/components/forms/form-field) to get `id`/`name`/`invalid` and
`aria-describedby` wired up automatically.

### Search text

The popover's search field is a pure filter, not a display of the current
selection - it always resets to empty when you pick an option or close the
popover. Bind `v-model:search-term` if you need to read or control the typed
text yourself (e.g. to drive a remote search):

```vue-html
<SSelect v-model="fruit" v-model:search-term="query" searchable :items="fruitItems" />
```

`resetSearchTermOnBlur`/`resetSearchTermOnSelect` (both default `true`,
forwarded from Reka UI's `ComboboxRoot`) control whether it resets at all -
set either to `false` if you're driving the field yourself and don't want it
cleared out from under you.

## Props

| Prop | Type | Default |
| --- | --- | --- |
| `id` | `string` | - |
| `name` | `string` | - |
| `items` | `(Option \| { label: string; items: Option[] })[]` | - |
| `valueKey` / `labelKey` | `string` | `'value'` / `'label'` |
| `modelValue` | `string \| string[]` | - |
| `multiple` | `boolean` | `false` |
| `searchable` | `boolean` | `false` |
| `searchTerm` | `string` | - |
| `resetSearchTermOnBlur` | `boolean` | `true` |
| `resetSearchTermOnSelect` | `boolean` | `true` |
| `virtualize` | `boolean \| { estimateSize?: number; overscan?: number }` | `false` |
| `displayMode` | `'comma' \| 'chip'` | `'comma'` |
| `maxChips` | `number` | `3` |
| `loading` | `boolean` | `false` |
| `placeholder` | `string` | - |
| `disabled` | `boolean` | `false` |
| `size` | `'sm' \| 'md' \| 'lg'` | `md` |
| `invalid` | `boolean` | `false` |
| `ui` | `Partial<Record<SelectSlot, string \| object>>` | - |

## Slots

| Slot | Props | Description |
| --- | --- | --- |
| `item` | `{ item }` | Custom option rendering (also used for chips) |
| `value` | `{ selected }` | Custom trigger display (single-select only) |
| `empty` | - | Shown when `items` is empty |
| `empty-filter` | - | Shown when a search yields no matches |
| `header` / `footer` | - | Content above/below the option list |
