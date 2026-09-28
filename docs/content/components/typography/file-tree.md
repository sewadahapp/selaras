---
title: FileTree
description: A collapsible file/directory browser.
order: 75
---

## Usage

::component-example{name="file-tree-basic"}
::

```vue-html
<SFileTree :items="[
  { name: 'src', children: [{ name: 'index.ts' }] },
  { name: 'package.json' },
]" />
```

A node with `children` renders as a directory (click to expand/collapse), one
without renders as a file (click to select it, emitting `update:selected`
with that node). Pass `selected` back in to highlight the active row - a
controlled pattern, the same shape [CodeTree](/components/typography/code-tree)
builds on for its own file-to-content pairing. File rows use the matching VS
Code icon when the filename is recognized; `icon` always overrides it.

### Controlled selection

`selected`/`update:selected` follow Vue's `v-model:selected` shorthand -
clicking a file emits the node back out, and passing it back in as
`selected` highlights that row:

::component-example{name="file-tree-selection"}
::

```vue-html
<SFileTree v-model:selected="selected" :items="items" />
<p>Selected: {{ selected?.name ?? 'none' }}</p>
```

### Custom `:ui`

To see exactly what you'd be overriding - the current default classes for
every slot and variant - here's `FileTree`'s own theme file:

::theme-source{name="file-tree"}
::

## Props

| Prop | Type | Default |
| --- | --- | --- |
| `items` | `FileTreeNode[]` | - (required) |
| `selected` | `FileTreeNode` | - |
| `defaultExpanded` | `boolean` | `true` |
| `ui` | `Partial<Record<FileTreeSlot, string \| object>>` | - |

Each node accepts `name`, optional `children`, optional `icon`, and optional
`language`. `language` is used as a fallback hint when the filename does not
identify a VS Code file icon.

## Emits

| Event | Payload |
| --- | --- |
| `update:selected` | `FileTreeNode` |
