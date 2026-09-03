---
title: Command Palette
description: A ⌘K search-and-act overlay - fuzzy search across grouped commands, keyboard-navigable, opened from anywhere.
order: 54.5
---

## Usage

Place `SCommandPalette` once (your root layout is a good spot) and
control it from anywhere with `useCommandPalette()` - the same
composable-driven pattern as `useModal()`/`useSlideover()`. Press
<kbd>⌘</kbd><kbd>K</kbd> (or <kbd>Ctrl</kbd><kbd>K</kbd>) to open it too -
that shortcut is bound automatically, nothing to wire up yourself:

::component-example{name="command-palette-basic"}
::

```vue
<script setup lang="ts">
const palette = useCommandPalette()

const groups = [
  {
    label: 'Actions',
    items: [
      { label: 'New file', icon: 'hugeicons:file-add', shortcut: 'meta+n', onSelect: () => {} },
      { label: 'New folder', icon: 'hugeicons:folder-add', onSelect: () => {} },
    ],
  },
]
</script>

<template>
  <SButton @click="palette.open()">
    Open command palette
  </SButton>
  <SCommandPalette :groups="groups" />
</template>
```

`items` are an array of groups, same shape as
[Dropdown](/components/overlays/dropdown)/[ContextMenu](/components/overlays/context-menu) -
a separator (here, a small group label) between each group. Typing
filters every item with a lightweight fuzzy match (not a plain
substring check) - "nf" matches "New File" - and results re-rank live
as the query changes; an empty search keeps each group's own
authoring order rather than reshuffling the default view.

### Shortcut hints

An item's own `shortcut` renders via [Kbd](/components/elements/kbd) -
a display hint only, this component doesn't bind that key itself
(`meta+n` above is just shown next to "New file", pressing it does
nothing on its own):

```vue-html
{ label: 'New file', shortcut: 'meta+n', onSelect: () => {} }
```

### Disabling the built-in shortcut

Set `:shortcut="false"` if you'd rather wire your own trigger (a menu
item, a different key combo) instead of the automatic
<kbd>⌘</kbd><kbd>K</kbd>/<kbd>Ctrl</kbd><kbd>K</kbd> binding -
`useCommandPalette().open()` still works from anywhere either way.

```vue-html
<SCommandPalette :groups="groups" :shortcut="false" />
```

### Keyboard interaction

<kbd>↑</kbd>/<kbd>↓</kbd> move the highlighted result (wrapping past
either end, skipping disabled items), <kbd>Enter</kbd> runs the
highlighted item's `onSelect` and closes the palette, <kbd>Esc</kbd>
or an outside click closes it without running anything.

## Props

| Prop | Type | Default |
| --- | --- | --- |
| `groups` | `{ label?: string; items: { label: string; icon?: string; shortcut?: string; disabled?: boolean; onSelect?: () => void }[] }[]` | - |
| `shortcut` | `boolean` | `true` |
| `ui` | `Partial<Record<CommandPaletteSlot, string \| object>>` | - |

## `useCommandPalette()`

| Member | Type | Description |
| --- | --- | --- |
| `isOpen` | `Ref<boolean>` | The shared open state |
| `open` | `() => void` | Opens it |
| `close` | `() => void` | Closes it |
| `toggle` | `() => void` | Flips it |
