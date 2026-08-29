---
title: Dropdown
description: A menu of grouped actions built on Reka UI's DropdownMenu primitive.
order: 51
---

## Usage

::component-example{name="dropdown-basic"}
::

```vue
<template>
  <SDropdown
    :items="[
      [{ label: 'Edit', icon: 'ph:pencil' }, { label: 'Duplicate', icon: 'ph:copy' }],
      [{ label: 'Delete', icon: 'ph:trash' }],
    ]"
  >
    <SButton variant="outline">
      Open dropdown
    </SButton>
  </SDropdown>
</template>
```

Items are an array of groups — a separator is rendered between each group.

### Custom item content

The `item` slot replaces an item's plain-text label with anything -
scoped with `item`, so a single template can vary per item (here, a
right-aligned keyboard-shortcut hint):

::component-example{name="dropdown-custom-item"}
::

```vue-html
<SDropdown :items="items">
  <template #item="{ item }">
    <span class="flex flex-1 items-center justify-between gap-4">
      {{ item.label }}
      <span class="text-xs text-[var(--ui-text-muted)]">{{ item.shortcut }}</span>
    </span>
  </template>
  ...
</SDropdown>
```

### Destructive items

`destructive: true` styles an item for a delete/remove-style action
(danger text, danger-tinted hover) - just this one flag rather than a
full color choice, since a menu item realistically only ever needs this
one special case:

::component-example{name="dropdown-destructive"}
::

```vue-html
<SDropdown
  :items="[
    [{ label: 'Edit', icon: 'ph:pencil' }, { label: 'Duplicate', icon: 'ph:copy' }],
    [{ label: 'Delete', icon: 'ph:trash', destructive: true }],
  ]"
>
  ...
</SDropdown>
```

### Accessibility

Dropdown renders Reka UI's DropdownMenu primitive, so the accessibility
semantics come from there rather than being reimplemented here: the
trigger exposes `aria-haspopup`/`aria-expanded`, the menu itself is
`role="menu"` with each item as `role="menuitem"`,
<kbd>↑</kbd>/<kbd>↓</kbd> move between items (wrapping past either end),
typing a letter jumps to the next matching item, and
<kbd>Enter</kbd>/<kbd>Space</kbd> selects the highlighted one -
<kbd>Escape</kbd> or an outside click closes the menu and returns focus
to the trigger.

## Props

| Prop | Type | Default |
| --- | --- | --- |
| `items` | `{ label: string; icon?: string; disabled?: boolean; destructive?: boolean; onSelect?: () => void }[][]` | - |
| `ui` | `Partial<Record<'content' \| 'item' \| 'icon' \| 'separator', string \| object>>` | - |

## Slots

| Slot | Props | Description |
| --- | --- | --- |
| `item` | `{ item }` | Replaces an item's label content |
