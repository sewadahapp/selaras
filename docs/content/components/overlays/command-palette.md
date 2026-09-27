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
      { label: 'New file', icon: 'hugeicons:file-add', shortcut: 'mod+n', hotkey: true, onSelect: () => {} },
      { label: 'New folder', icon: 'hugeicons:folder-add', onSelect: () => {} },
    ],
  },
  {
    label: 'Navigation',
    items: [
      { label: 'Go to settings', icon: 'hugeicons:settings-01', shortcut: 'mod+,', hotkey: true, onSelect: () => {} },
      { label: 'Go to profile', icon: 'hugeicons:user', onSelect: () => {} },
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

### Item shortcuts

An item's own `shortcut` renders via [Kbd](/components/elements/kbd) as a
display hint. Add `hotkey: true` to bind it while the palette is open; the
item's normal selection behavior runs and the palette closes. Use `mod` to
show ⌘ on macOS and Ctrl on other platforms. The live example above includes
enabled shortcuts for creating a file and opening settings, plus items that
show no hint and therefore have no item-specific shortcut:

```vue-html
{ label: 'New file', shortcut: 'mod+n', hotkey: true, onSelect: () => {} }
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

### Custom `:ui`

To see exactly what you'd be overriding - the current default classes for
every slot and variant - here's the palette's own theme file:

::theme-source{name="command-palette"}
::

## Props

| Prop | Type | Default |
| --- | --- | --- |
| `groups` | `{ label?: string; items: { label: string; icon?: string; shortcut?: string; hotkey?: boolean; disabled?: boolean; onSelect?: () => void }[] }[]` | - |
| `open` | `boolean` | - |
| `shortcut` | `boolean` | `true` |
| `ui` | `Partial<Record<CommandPaletteSlot, string \| object>>` | - |

### Multiple instances

Pass `v-model:open` if you need a second, independently-controlled palette
(a different `groups` list, scoped to some part of the app) instead of the
one shared instance:

```vue-html
<SCommandPalette v-model:open="open" :groups="scopedGroups" />
```

This instance stops reacting to `useCommandPalette()` entirely - its own
`open`/`close`/Cmd-K state is fully local. The default (no `open` prop)
stays wired to the shared singleton described above, which is what you
want for the single app-wide palette.

## `useCommandPalette()`

| Member | Type | Description |
| --- | --- | --- |
| `isOpen` | `Ref<boolean>` | The shared open state |
| `open` | `() => void` | Opens it |
| `close` | `() => void` | Closes it |
| `toggle` | `() => void` | Flips it |
