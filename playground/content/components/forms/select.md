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

Selected options always show a checkmark in the list, via Reka UI's
`ComboboxItemIndicator` - this is on by default rather than an opt-in
alternative to a highlighted row.

### Filtering

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

### Checkbox selection

There's no separate "checkbox mode" prop - the `item` slot already gives you
the option to render whatever you want per row, including a purely visual
[Checkbox](/components/forms/checkbox) that mirrors the row's selected state:

::component-example{name="select-checkbox-selection"}
::

```vue-html
<SSelect v-model="fruits" multiple :items="fruitItems">
  <template #item="{ item }">
    <SCheckbox :model-value="fruits.includes(item.value)" class="pointer-events-none" tabindex="-1" />
    {{ item.label }}
  </template>
</SSelect>
```

The checkbox is decorative (`pointer-events-none`, `tabindex="-1"`) - clicking
the row is still what drives selection, same as any other option.

### Clear

`clearable` adds a button that resets the selection - `undefined` for a single
select, an empty array for `multiple`. It only renders once there's something
to clear, and clicking it never opens the popover.

::component-example{name="select-clear"}
::

```vue-html
<SSelect v-model="fruit" clearable placeholder="Pick a fruit" :items="fruitItems" />
```

### Custom option rendering

The `item` slot replaces an option's content in the list (and doubles as a
chip's content in `displayMode="chip"`); the `value` slot replaces the
trigger's own display for a single select. Together they let a select carry
more than plain text end to end:

::component-example{name="select-custom-option"}
::

```vue-html
<SSelect v-model="status" :items="statusItems">
  <template #item="{ item }">
    <span class="size-2 rounded-full" :class="item.color" />
    {{ item.label }}
  </template>
  <template #value="{ selected }">
    <span v-if="selected" class="inline-flex items-center gap-2">
      <span class="size-2 rounded-full" :class="selected.raw.color" />
      {{ selected.label }}
    </span>
  </template>
</SSelect>
```

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

The group header is plain text by default, but the `group` slot can replace
it entirely - it receives the whole `{ label, items }` entry:

::component-example{name="select-group-custom-header"}
::

```vue-html
<SSelect :items="items">
  <template #group="{ group }">
    <span class="flex items-center justify-between">
      <span>{{ group.label }}</span>
      <span class="text-[var(--ui-text-muted)]">{{ group.items.length }}</span>
    </span>
  </template>
</SSelect>
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

This only windows what's already in `items` - it doesn't fetch more data as
you scroll. There's no built-in lazy-loading of additional pages; fetch or
page into `items` yourself if the full set can't live in memory.

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

### Sizes

`size` takes `sm` / `md` / `lg`, matching every other form control in this
library - see the [Props](#props) table below.

### States

`loading` swaps the trailing chevron for a spinner (the trigger stays
clickable - it doesn't disable the select), `disabled` prevents opening it
entirely, and `invalid` switches the ring to `--ui-danger`. All three compose
with everything above them on this page - see [Props](#props).

### Forms integration

Wrap it in [FormField](/components/forms/form-field) to get `id`/`name`/`invalid` and
`aria-describedby` wired up automatically - `invalid` and `size` both fall
back to FormField's own state when not set directly on the select.

### Accessibility

Select renders Reka UI's Combobox primitive, so the accessibility semantics
come from there rather than being reimplemented here: the trigger/search
input exposes `role="combobox"` with `aria-expanded`/`aria-controls`, each
option is `role="option"`, and each group is `aria-labelledby` its header.
Arrow keys move the highlighted option, <kbd>Enter</kbd> selects it,
<kbd>Escape</kbd> closes the popover, and typing while closed (or while
`searchable`) filters the list - all standard behavior for the
[ARIA combobox pattern](https://www.w3.org/WAI/ARIA/apg/patterns/combobox/),
not something to configure here.

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
| `clearable` | `boolean` | `false` |
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
| `group` | `{ group }` | Custom group header (replaces the plain label text) |
| `empty` | - | Shown when `items` is empty |
| `empty-filter` | - | Shown when a search yields no matches |
| `header` / `footer` | - | Content above/below the option list |
