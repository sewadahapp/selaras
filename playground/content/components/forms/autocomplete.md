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

### Dropdown

There's no built-in "browse everything" button by default - typing is the
whole interaction. `dropdown` adds one anyway: a trailing chevron that opens
the popover and clears whatever's typed, so it always shows the full list
rather than staying scoped to the current filter.

::component-example{name="autocomplete-dropdown"}
::

```vue-html
<SAutocomplete v-model="value" dropdown placeholder="Type or browse" :items="fruitItems" />
```

### Multiple, with new tags

`multiple` renders selected values as removable chips (`displayMode="chip"`)
and lets the user create entries that aren't in `items` by pressing Enter -
each becomes its own chip.

::component-example{name="autocomplete-multiple"}
::

```vue-html
<SAutocomplete v-model="tags" multiple display-mode="chip" :items="fruitItems" />
```

### Clear

`clearable` works the same as [Select's](/components/forms/select#clear) - a
button that resets the selection once there's something to clear. Clearing
also blanks the displayed text back to the placeholder, the same way picking
a suggestion fills it in.

::component-example{name="autocomplete-clear"}
::

```vue-html
<SAutocomplete v-model="value" clearable placeholder="Type anything" :items="fruitItems" />
```

### Force selection

This is the one real behavioral difference from Select, not just a shared
prop: `forceSelection` reverts typed text that doesn't match any option back
to blank on blur or Enter, instead of accepting it as a new value. It exists
for consumers who want Autocomplete's UX (input-as-trigger, inline filtering)
without actually allowing arbitrary values - if that's the goal from the
start, [Select](/components/forms/select) does the same job more directly.

::component-example{name="autocomplete-force-selection"}
::

```vue-html
<SAutocomplete v-model="value" force-selection :items="fruitItems" />
```

### Custom option rendering, objects, and groups

The `item`/`value`/`group` slots and `labelKey`/`valueKey` mapping all work
identically to Select's - see
[Custom option rendering](/components/forms/select#custom-option-rendering),
[Custom objects](/components/forms/select#custom-objects), and
[Grouped options](/components/forms/select#grouped-options).

### Virtualization

Also identical to [Select's](/components/forms/select#virtualization) -
`virtualize` renders only the visible rows, grouped `items` flatten while
virtualized, and it windows what's already in `items` rather than
lazy-loading more of it.

### Search text

Since the input here IS the trigger, its text doubles as both the filter and
the display of the current value: single-select shows the picked option's
label after you choose one, multi-select clears after each commit (the chips
show the selection instead). Same `v-model:search-term` and
`resetSearchTermOnBlur`/`resetSearchTermOnSelect` escape hatches as
[Select](/components/forms/select#search-text) apply here too.

### Sizes and states

`size`, `loading`, `disabled`, and `invalid` all behave the same as
[Select's](/components/forms/select#sizes) - see the [Props](#props) table
below.

### Forms integration

Also the same as [Select's](/components/forms/select#forms-integration) -
wrap it in [FormField](/components/forms/form-field) for `id`/`name`/`invalid`
and `aria-describedby` wired up automatically.

### Accessibility

Autocomplete renders the same Reka UI Combobox primitive as
[Select](/components/forms/select#accessibility), so the same ARIA combobox
semantics apply - `role="combobox"` with `aria-expanded`/`aria-controls` on
the input, `role="option"` per suggestion, arrow keys to move the highlight,
<kbd>Enter</kbd> to select. The one addition here is `aria-autocomplete="list"`,
since (unlike Select) the trigger is a real editable text field with live
suggestions as you type.

## Props

Same as [Select](/components/forms/select#props), minus `searchable` (always
on), plus these Autocomplete-only additions:

| Prop | Type | Default |
| --- | --- | --- |
| `dropdown` | `boolean` | `false` |
| `forceSelection` | `boolean` | `false` |

## Slots

Same as [Select](/components/forms/select#slots), minus `filter-icon` - that
one only renders in Select's separate popover search field, and
Autocomplete's own input already doubles as the trigger.
