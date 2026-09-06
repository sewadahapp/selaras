---
title: Context Menu
description: A right-click menu built on Reka UI's ContextMenu primitive.
order: 51.5
---

## Usage

Right-click the target area - anywhere inside the default slot opens
the menu at the cursor position, instead of at a fixed trigger element
the way `Dropdown` does:

::component-example{name="context-menu-basic"}
::

```vue
<template>
  <SContextMenu
    :items="[
      [{ label: 'Edit', icon: 'hugeicons:pencil' }, { label: 'Duplicate', icon: 'hugeicons:copy' }],
      [{ label: 'Delete', icon: 'hugeicons:delete-02' }],
    ]"
  >
    <div>Right-click here</div>
  </SContextMenu>
</template>
```

Items are an array of groups — a separator is rendered between each group,
same shape as [Dropdown](/components/overlays/dropdown).

### Custom item content

The `item` slot replaces an item's plain-text label with anything -
scoped with `item`, so a single template can vary per item (here, a
right-aligned keyboard-shortcut hint):

::component-example{name="context-menu-custom-item"}
::

```vue-html
<SContextMenu :items="items">
  <template #item="{ item }">
    <span class="flex flex-1 items-center justify-between gap-4">
      {{ item.label }}
      <span class="text-xs text-[var(--ui-text-muted)]">{{ item.shortcut }}</span>
    </span>
  </template>
  ...
</SContextMenu>
```

### Destructive items

`destructive: true` styles an item for a delete/remove-style action,
the same single flag `Dropdown`'s own items use:

::component-example{name="context-menu-destructive"}
::

```vue-html
<SContextMenu
  :items="[
    [{ label: 'Edit', icon: 'hugeicons:pencil' }, { label: 'Duplicate', icon: 'hugeicons:copy' }],
    [{ label: 'Delete', icon: 'hugeicons:delete-02', destructive: true }],
  ]"
>
  ...
</SContextMenu>
```

### Accessibility

Same underlying menu machinery as [Dropdown](/components/overlays/dropdown#accessibility):
the menu itself is `role="menu"` with each item as `role="menuitem"`,
<kbd>↑</kbd>/<kbd>↓</kbd> move between items (wrapping past either
end), typing a letter jumps to the next matching item, and
<kbd>Enter</kbd>/<kbd>Space</kbd> selects the highlighted one -
<kbd>Escape</kbd> or an outside click closes the menu. A touch/pen
long-press opens it too, not just a mouse right-click.

## Props

| Prop | Type | Default |
| --- | --- | --- |
| `items` | `{ label: string; icon?: string; disabled?: boolean; destructive?: boolean; onSelect?: () => void; shortcut?: string }[][]` | - |
| `ui` | `Partial<Record<'content' \| 'item' \| 'icon' \| 'separator', string \| object>>` | - |

## Slots

| Slot | Props | Description |
| --- | --- | --- |
| `default` | - | The right-click target area |
| `item` | `{ item }` | Replaces an item's label content |
