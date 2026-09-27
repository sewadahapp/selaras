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
`shortcut` renders a Kbd hint; set `hotkey: true` to activate it while the
context menu is open.

### Shortcuts

`shortcut` is a display hint by itself. Add `hotkey: true` to run the item's
normal `onSelect` action while the context menu is open. Use `mod` for ⌘ on
macOS or Ctrl on other platforms. Right-click the example area first, then
try the enabled shortcut; the item with only `shortcut` does not bind a key.

::component-example{name="context-menu-shortcuts"}
::

```vue
<script setup lang="ts">
const lastAction = ref('')
const items = [[
  { label: 'Rename', shortcut: 'mod+e', hotkey: true, onSelect: () => lastAction.value = 'Rename selected' },
  { label: 'Share', shortcut: 'mod+shift+s', onSelect: () => lastAction.value = 'Share selected' },
]]
</script>

<template>
  <SContextMenu :items="items">
    <div>Right-click here</div>
  </SContextMenu>
</template>
```

### Custom item content

The `item` slot replaces an item's plain-text label with anything,
scoped with `item`, so a single template can vary per item. The component
continues to render `shortcut` after the slot content automatically:

::component-example{name="context-menu-custom-item"}
::

```vue-html
<SContextMenu :items="items">
  <template #item="{ item }">
    <span class="flex-1">{{ item.label }}</span>
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

### Custom `:ui`

To see exactly what you'd be overriding - the current default classes for
every slot - here's `ContextMenu`'s own theme file:

::theme-source{name="context-menu"}
::

### Positioning and portal

ContextMenu anchors to the right-click point, so it does not accept `side` or
`align`. Its `positioning` prop controls supported offsets and collision
behavior. `portal` defaults to the document body; set it to `false` to render
inline or pass a CSS selector or `HTMLElement` as the teleport target.

```vue-html
<SContextMenu :items="items" :positioning="{ collisionPadding: 12 }" portal="#overlay-root">...</SContextMenu>
```

## Props

Set `hotkey: true` alongside `shortcut` to register the displayed key while
the context menu is open. Otherwise the shortcut is a visual hint only.

| Prop | Type | Default |
| --- | --- | --- |
| `items` | `{ label: string; icon?: string; disabled?: boolean; destructive?: boolean; onSelect?: () => void; shortcut?: string; hotkey?: boolean }[][]` | - |
| `positioning` | `ContextMenuPositioning` | pointer-anchored defaults |
| `portal` | `boolean \| string \| HTMLElement` | `true` (document body) |
| `ui` | `Partial<Record<'content' \| 'item' \| 'icon' \| 'separator', string \| object>>` | - |

## Slots

| Slot | Props | Description |
| --- | --- | --- |
| `default` | - | The right-click target area |
| `item` | `{ item }` | Replaces an item's label content |
