---
title: Autocomplete
description: A free-text input with suggestions - the typed value doesn't have to match an option, built on the same Combobox foundation as Select.
order: 23
---

## Usage

Unlike [Select](/components/forms/select), whatever the user types can become the
value even if it doesn't match a suggestion - picking a suggestion is a
shortcut, not a requirement.

::component-example{name="autocomplete-basic"}
::

```vue
<script setup lang="ts">
const value = ref('')

const fruitItems = [
  { label: 'Apple', value: 'apple' },
  { label: 'Banana', value: 'banana' },
]
</script>

<template>
  <SAutocomplete v-model="value" placeholder="Type anything" :items="fruitItems" />
</template>
```

The input itself is always the trigger - typing works immediately, with no
separate "open" step, since there's no equivalent of Select's
`searchable: false` mode here.

### Multiple, with new tags

`multiple` renders selected values as removable chips (`displayMode="chip"`)
and lets the user create entries that aren't in `items` by pressing Enter -
each becomes its own chip.

::component-example{name="autocomplete-multiple"}
::

```vue-html
<SAutocomplete v-model="tags" multiple display-mode="chip" :items="fruitItems" />
```

Everything else - `virtualize`, `loading`, grouped `items`, `valueKey`/`labelKey`,
chip overflow with a "+N more" tooltip - works identically to
[Select](/components/forms/select#props), since both share the same underlying
implementation and differ only in whether unmatched typed text is accepted.

### Search text

Since the input here IS the trigger, its text doubles as both the filter and
the display of the current value: single-select shows the picked option's
label after you choose one, multi-select clears after each commit (the chips
show the selection instead). Same `v-model:search-term` and
`resetSearchTermOnBlur`/`resetSearchTermOnSelect` escape hatches as
[Select](/components/forms/select#search-text) apply here too.

## Props

Same as [Select](/components/forms/select#props), minus `searchable` (always on).

## Slots

Same as [Select](/components/forms/select#slots).
