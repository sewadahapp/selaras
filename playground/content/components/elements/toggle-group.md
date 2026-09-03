---
title: Toggle Group
description: A set of related toggles sharing one selection - single or multiple - built on Reka UI's ToggleGroup primitive.
order: 12.94
---

## Usage

Joined into one segmented control, same visual technique as
[ButtonGroup](/components/elements/button-group). `type="single"`
(the default) behaves like a segmented radio group - selecting one
item deselects the rest:

::component-example{name="toggle-group-basic"}
::

```vue-html
<SToggleGroup :items="['List', 'Grid', 'Kanban']" default-value="List" />
```

### Multiple selection

`type="multiple"` lets any number of items stay pressed at once -
`modelValue`/`defaultValue` become an array instead of a single value:

::component-example{name="toggle-group-multiple"}
::

```vue-html
<SToggleGroup type="multiple" :items="items" :default-value="['bold']" />
```

### Icon only

The `item` slot replaces an item's default icon+label content
entirely - pair it with a visually-hidden label so the item still has
an accessible name:

::component-example{name="toggle-group-icon-only"}
::

```vue-html
<SToggleGroup :items="items" default-value="list">
  <template #item="{ item }">
    <SIcon :name="item.icon" class="size-4.5" />
    <span class="sr-only">{{ item.label }}</span>
  </template>
</SToggleGroup>
```

### Orientation

::component-example{name="toggle-group-orientation"}
::

```vue-html
<SToggleGroup orientation="vertical" :items="['List', 'Grid', 'Kanban']" />
```

### Disabled

`disabled` on the group blocks every item; `disabled` on one item
blocks only that item:

::component-example{name="toggle-group-disabled"}
::

```vue-html
<SToggleGroup :items="[
  { label: 'List', value: 'list' },
  { label: 'Grid', value: 'grid', disabled: true },
]" />
```

## Props

| Prop | Type | Default |
| --- | --- | --- |
| `items` | `(string \| ToggleGroupItem)[]` | - |
| `type` | `'single' \| 'multiple'` | `'single'` |
| `modelValue` | `string \| string[]` | - |
| `defaultValue` | `string \| string[]` | - |
| `disabled` | `boolean` | - |
| `orientation` | `'horizontal' \| 'vertical'` | `'horizontal'` |
| `color` | `'primary' \| 'neutral' \| 'secondary' \| 'success' \| 'danger' \| 'info' \| 'warning'` | `'primary'` |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` |
| `ui` | `Partial<Record<ToggleGroupSlot, string \| object>>` | - |

`ToggleGroupItem` is `{ label: string, value: string, icon?: string, disabled?: boolean }`.

## Emits

| Event | Payload |
| --- | --- |
| `update:modelValue` | `string \| string[]` |

## Slots

| Slot | Props | Description |
| --- | --- | --- |
| `item` | `{ item, pressed }` | Replaces an item's default icon+label content |
