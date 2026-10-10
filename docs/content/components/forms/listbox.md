---
title: Listbox
description: An inline selection list with search, groups, rich content, and virtualization.
order: 22.5
---

## Usage

Listbox presents its options directly on the page. Use it when choices should
remain visible; use [Select](/components/forms/select) when they should open in
a popup. Selection is single by default.

::component-example{name="listbox-basic"}
::

`items` accepts strings, finite numbers, and objects. A primitive is both its
label and value. Objects display `label` and use their `value` property when
present; otherwise the complete object is the value. Explicit `labelKey` and
`valueKey` select different properties. Numeric `1` and string `'1'` are distinct.
Values must be unique across all groups. Whole objects compare by identity;
use a stable `valueKey` when replacing records fetched from an API.

### Multiple selection

`multiple` uses an array model. Clicking or pressing Space toggles a row without
requiring a modifier key. `selectionBehavior="replace"` enables replacement
selection with modifier keys for additive selection. `checkbox` shows decorative
checkbox indicators; the option remains the only interactive element in each row.

::component-example{name="listbox-multiple"}
::

`selectAll` adds a header checkbox in multiple mode. It checks or unchecks only
visible, enabled options and preserves selections outside the current filter.
Ctrl/Cmd+A within the list follows the same rules.
Groups use the same `{ label, items }` shape as Select.

### Search and empty states

`searchable` adds a filter input. Bind `v-model:search-term` to control its text.
Search matches labels without case or accent sensitivity. Filtering preserves
selection, and choosing an item leaves the search text intact.
Use `empty` for an empty collection and `empty-filter` for no matching results.

### Rich items and custom keys

Objects can include `description`, `icon`, and `disabled`. `descriptionKey`
defaults to `description`. The `item` slot receives the original item plus
`index`, `selected`, and `disabled`; the index identifies its position in the
complete flattened collection. Use `group` to replace a group label.

::component-example{name="listbox-custom-objects"}
::

Keep custom options to display content. Put independent links or action buttons
in a regular list or table rather than inside a listbox option.

### Virtualization

`virtualize` renders a window of options for large collections. Pass `true` or
`{ estimateSize, overscan }`. Group headers are omitted while virtualized.
This does not fetch additional pages.

::component-example{name="listbox-virtualize"}
::

### Controlled values and forms

Use `v-model` for controlled selection, or `defaultValue` for initial uncontrolled
selection. Explicit `modelValue: undefined` stays controlled and empty until the
parent accepts an update. Missing async values remain selected as options load.

An uncontrolled change to `multiple` converts a scalar to an array or keeps the
first array item for single mode. Controlled parents must update the model shape
and mode together. Duplicate model/default values are rejected.

Wrap Listbox in [FormField](/components/forms/form-field) for its label,
description, invalid state, size, and name. `name` submits each selected value;
objects serialize as JSON. `form` associates an external form, and `required`
requires a nonempty selection. Native reset restores the mount-captured default
in the current selection mode and clears search. Canceled resets are ignored.

### Accessibility

`label` or `aria-label` names the listbox; FormField can supply its label instead.
Arrow keys move focus, Home/End reach the edges, and Enter/Space select an option.
Focus and selection remain separate. Search uses an editable combobox linked to
the inline options. Listbox stays inline at every viewport size.

### Styling

`size` accepts `sm`, `md`, or `lg`; `color` controls selection and focus tokens.
`invalid` uses the danger role. Override `ui.listbox` globally or within Theme,
or pass `:ui` to a single instance.

::theme-source{name="listbox"}
::

## Props

| Prop | Type | Default |
| --- | --- | --- |
| `items` | readonly primitive, object, or grouped entries | required |
| `modelValue` / `defaultValue` | selected value or array | - |
| `labelKey` / `valueKey` | object property | `label` / `value` when present, otherwise the object |
| `descriptionKey` | object property | `description` |
| `multiple` | boolean | `false` |
| `selectionBehavior` | `toggle` / `replace` | `toggle` |
| `checkbox` / `selectAll` | boolean | `false` |
| `searchable` | boolean | `false` |
| `searchTerm` | string | empty |
| `virtualize` | boolean or `{ estimateSize, overscan }` | `false` |
| `label` | string | form label or configured select message |
| `disabled` / `loading` / `invalid` | boolean | `false` |
| `size` / `color` | control size / semantic role | `md` / `primary` |
| `id` / `name` / `form` | string | - |
| `required` | boolean | `false` |
| `ui` | slot overrides | - |

## Slots

| Slot | Props | Purpose |
| --- | --- | --- |
| `item` | `{ item, index, selected, disabled }` | Original option content |
| `group` | `{ group }` | Group heading |
| `header` / `footer` | - | Content surrounding the list |
| `empty` / `empty-filter` | - | Empty collection / unmatched search |

Public `ListboxProps`, `ListboxEmits`, and `ListboxSlots` types are available from
`@sewadah/selaras/types`. They infer the item, identity key, and multiple mode in
the same way as Select.
