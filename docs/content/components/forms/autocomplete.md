---
title: Autocomplete
description: A free-text input with suggestions - the typed value doesn't have to match an option, built on the same Combobox foundation as Select.
order: 23
---

## Usage

Existing suggestions preserve string or finite-number identities, including
the distinction between numeric `1` and string `"1"`. Newly created free text
is always a string; numeric suggestions do not cause typed text to be coerced.
Use `forceSelection` to disallow creating values.

Autocomplete infers models and update events from its suggestion identity field.
Numeric suggestions allow `number | string | undefined` in single mode and
`(number | string)[]` in multiple mode. A literal `forceSelection` narrows those
types to the suggestion identity; a dynamic boolean retains the string union.
Readonly option/group arrays and custom top-level `valueKey`/`labelKey` fields
are supported. Every suggestion identity must be unique across the whole list,
including disabled suggestions and suggestions in different groups; a duplicate
throws when Autocomplete reads the options. Numeric `1` and string `'1'` remain
distinct. Declare the item type for initially empty async arrays.

The exported types use option entries: replace `AutocompleteProps<number>` with
`AutocompleteProps<{ value: number, label: string }>`. The parameters are entry,
identity key, multiple mode and forced mode.

Author suggestions as a readonly `Row[]`, or as `readonly (Row | SelectGroup<Row>)[]`
when mixing suggestions and groups; there are no separate `SelectItems`,
`SelectOption`, or `SelectOptionGroup` authoring aliases. A wrapper that needs
the exact validated items type can use `AutocompleteProps<Row, 'id'>['items']`. For example,
`AutocompleteProps<Row, 'id', true, true>` describes forced multiple selection.
`AutocompleteEmits` uses the same parameters. Render functions can specialize
`Autocomplete<Row, 'id', true, true>` directly; templates normally infer it.
Import public helpers from `@sewadah/selaras/types`; derive slot types through
`AutocompleteSlots`.

`forceSelection` blocks new unmatched text. It does not erase existing values
when toggled dynamically or require that a selected async identity already be
in the current options. Native reset restores the captured default, including
strings created before a dynamic switch. Idle inputs refresh their selected
label when options load; active queries and parent-controlled `searchTerm`
retain their text.

`defaultValue` initializes uncontrolled selection and is the native form reset
target. `modelValue` remains parent-controlled. With `name`, selected values
submit as repeated string-valued fields; empty or disabled selections submit
none. `form` may reference an external form ID.

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

### Changing selection mode

For an uncontrolled Autocomplete, changing `multiple` converts its local
selection once: single `value` becomes `[value]`, single `undefined` becomes
`[]`, a multiple selection becomes its first value, and an empty array becomes
`undefined`. Switching to single mode drops later active selections. That
conversion emits one `update:modelValue` event. The captured
`defaultValue` does not change after mount; reset projects it into the current
mode. For example, `defaultValue: [0, 1]` resets to `0` in single mode and to
`[0, 1]` after changing back to multiple mode.

A controlled parent must change `modelValue` and `multiple` in the same render:
an array when `multiple` is true, and a scalar or `undefined` when it is false.
`undefined` is allowed as the empty multiple value. A scalar value in
multiple mode, or any array in single mode, throws a descriptive error.
Each value in a multiple `modelValue` or `defaultValue` array must also be
unique, including created or unresolved async identities. Numeric `1` and
string `'1'` are distinct values.
Autocomplete does not convert controlled values or emit an update solely
because the mode changed. Changing modes also preserves an active query, open
popover, and focus when the input was focused. It does not take focus from a
mode button or another control. A parent-controlled `searchTerm` retains its
text; idle input labels follow `resetSearchTermOnSelect`.
Changing mode during IME composition cancels editing and requests that the
query and popup be cleared. Complete composition before changing mode to retain
the query.

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

Pressing <kbd>Enter</kbd> on unmatched text creates it (or rejects it with
`forceSelection`) and consumes the key. A matching highlighted suggestion is
selected by the combobox first. With an empty, idle input and no highlighted
suggestion, Enter keeps its normal native form-submission behavior.

::component-example{name="autocomplete-force-selection"}
::

```vue-html
<SAutocomplete v-model="value" force-selection :items="fruitItems" />
```

### Arrow

`arrow` works the same as [Select's](/components/forms/select#arrow) - a
small pointer triangle connecting the panel to its trigger:

::component-example{name="autocomplete-arrow"}
::

```vue-html
<SAutocomplete v-model="value" arrow :items="fruitItems" />
```

### Custom option rendering, objects, and groups

The `item`/`group` slots and `labelKey`/`valueKey` mapping all work
identically to Select's - see
[Custom option rendering](/components/forms/select#custom-option-rendering),
[Custom objects](/components/forms/select#custom-objects), and
[Grouped options](/components/forms/select#grouped-options).

Created text and async selections can be absent from `items`. Their chips use
the selected text until a complete option exists; the `item` slot receives only
real option records. Autocomplete's selection display is its editable input;
it has no `value` slot.

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

`size`, `loading`, `disabled`, `invalid`, and `color` all behave the same as
[Select's](/components/forms/select#sizes) - see the [Props](#props) table
below.

### Adaptive presentation

`adaptive` uses the same breakpoint and open-time latch as
[Select](/components/forms/select#adaptive-presentation). Because its editor
must remain the combobox focus owner, Autocomplete uses a wider nonmodal panel
rather than a dialog:

```vue-html
<SAutocomplete v-model="value" adaptive placeholder="Type anything" :items="fruitItems" />
```

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

### Custom `:ui`

Autocomplete renders the same internal combobox base as
[Select](/components/forms/select#custom-ui), so they share one theme file:

Global and scoped overrides use the `ui.select` key for both components.

::theme-source{name="select"}
::

## Props

Same as [Select](/components/forms/select#props), minus `searchable` (always
on), plus these Autocomplete-only additions:

| Prop | Type | Default |
| --- | --- | --- |
| `dropdown` | `boolean` | `false` |
| `forceSelection` | `boolean` | `false` |

## Slots

Autocomplete supports `item`, `group`, `header`, `footer`, `empty`,
`empty-filter`, `clear-icon`, `loading-icon` and `dropdown-icon`. Its input
displays the selected label directly. Select's `value` and `filter-icon` slots
are specific to Select's trigger display and separate filter field.
