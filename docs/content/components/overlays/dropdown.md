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
      [{ label: 'Edit', icon: 'hugeicons:pencil' }, { label: 'Duplicate', icon: 'hugeicons:copy' }],
      [{ label: 'Delete', icon: 'hugeicons:delete-02' }],
    ]"
  >
    <SButton variant="outline">
      Open dropdown
    </SButton>
  </SDropdown>
</template>
```

Items are an array of groups — a separator is rendered between each group.
Items can run `onSelect` actions or navigate through `to` (including
external URLs, with `target`/`rel` when needed). `shortcut` renders a Kbd
hint; set `hotkey: true` to bind it while the dropdown is open.

### Shortcuts and links

`shortcut` only displays the hint. Add `hotkey: true` to activate the item
with that key while this dropdown is open. Use `mod` for the platform's
primary modifier (⌘ on macOS, Ctrl elsewhere). Items with `to` navigate as
links by mouse, keyboard selection, or shortcut; action items call
`onSelect` through the same selection path.

::component-example{name="dropdown-shortcuts"}
::

```vue
<script setup lang="ts">
const lastAction = ref('')
const items = [[
  { label: 'Save draft', icon: 'hugeicons:floppy-disk', shortcut: 'mod+s', hotkey: true, onSelect: () => lastAction.value = 'Saved draft' },
  { label: 'Preview', shortcut: 'mod+p', onSelect: () => lastAction.value = 'Preview opened' },
  { label: 'Documentation', to: '/components/overlays/context-menu', shortcut: 'mod+shift+d', hotkey: true },
]]
</script>

<template>
  <SDropdown :items="items">
    <SButton variant="outline">Open actions</SButton>
  </SDropdown>
</template>
```

In this example, `Save draft` and `Documentation` respond to their shortcuts;
`Preview` shows a hint only. Open the dropdown before pressing a menu shortcut.

### Custom item content

The `item` slot replaces an item's plain-text label with anything,
scoped with `item`, so a single template can vary per item. The component
continues to render `shortcut` after the slot content automatically:

::component-example{name="dropdown-custom-item"}
::

```vue-html
<SDropdown :items="items">
  <template #item="{ item }">
    <span class="flex-1">{{ item.label }}</span>
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
    [{ label: 'Edit', icon: 'hugeicons:pencil' }, { label: 'Duplicate', icon: 'hugeicons:copy' }],
    [{ label: 'Delete', icon: 'hugeicons:delete-02', destructive: true }],
  ]"
>
  ...
</SDropdown>
```

### Arrow

`arrow` shows a small pointer triangle connecting the menu to its trigger.
Pass an object to configure its width, height, rounded tip, or corner
clearance (`padding`):

::component-example{name="dropdown-arrow"}
::

```vue-html
<SDropdown :items="items" arrow>...</SDropdown>
<SDropdown :items="items" :arrow="{ width: 16, height: 8, rounded: true, padding: 12 }">...</SDropdown>
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

### Custom `:ui`

To see exactly what you'd be overriding - the current default classes for
every slot and variant - here's the menu's own theme file:

::theme-source{name="dropdown"}
::

### Positioning and portal

Use `positioning` for the menu's side, alignment, offsets, and collision
behavior. `portal` defaults to the document body; set it to `false` to render
inline or pass a CSS selector or `HTMLElement` as the teleport target.
`ui.content` remains the styling override.

```vue-html
<SDropdown :items="items" :positioning="{ side: 'top', align: 'end' }" portal="#overlay-root">...</SDropdown>
```

## Props

For link items, use `to` with optional `target` and `rel`. Shortcut hints
are display-only unless `hotkey: true` is set.

| Prop | Type | Default |
| --- | --- | --- |
| `items` | `{ label: string; icon?: string; disabled?: boolean; destructive?: boolean; onSelect?: () => void; to?: string; target?: string; rel?: string; shortcut?: string; hotkey?: boolean }[][]` | - |
| `arrow` | `boolean \| RoundedArrowConfig` | `false` |
| `positioning` | `OverlayPositioning` | menu defaults |
| `portal` | `boolean \| string \| HTMLElement` | `true` (document body) |
| `ui` | `Partial<Record<'content' \| 'item' \| 'icon' \| 'separator' \| 'arrow', string \| object>>` | - |

## Slots

| Slot | Props | Description |
| --- | --- | --- |
| `default` | - | The trigger element |
| `item` | `{ item }` | Replaces an item's label content |
