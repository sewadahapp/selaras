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
builds on for its own file-to-content pairing.

## Props

| Prop | Type | Default |
| --- | --- | --- |
| `items` | `FileTreeNode[]` | - (required) |
| `selected` | `FileTreeNode` | - |
| `defaultExpanded` | `boolean` | `true` |
| `ui` | `Partial<Record<FileTreeSlot, string \| object>>` | - |

## Emits

| Event | Payload |
| --- | --- |
| `update:selected` | `FileTreeNode` |
