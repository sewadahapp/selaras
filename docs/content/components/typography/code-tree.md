---
title: CodeTree
description: A file tree paired with a code viewer - click a file, see its content.
order: 76
---

## Usage

::component-example{name="code-tree-basic"}
::

```vue-html
<SCodeTree :items="[
  { name: 'src', children: [{ name: 'index.ts', code: 'export default 1' }] },
  { name: 'package.json', code: '{}' },
]" />
```

Built on [FileTree](/components/typography/file-tree) for the left panel - a
node's `code` is syntax-highlighted for its filename once selected. Set
`language` on a file to override the language inferred from its extension.
The first file found (depth-first) is selected by default, so the panel is
never empty on load. Replacing `items` with a new array selects a new default;
mutating the existing array leaves the current selection alone.

### Custom `:ui`

To see exactly what you'd be overriding - the current default classes for
every slot and variant - here's `CodeTree`'s own theme file:

::theme-source{name="code-tree"}
::

## Props

| Prop | Type | Default |
| --- | --- | --- |
| `items` | `CodeTreeFile[]` | - (required) |
| `defaultExpanded` | `boolean` | `true` |
| `ui` | `Partial<Record<CodeTreeSlot, string \| object>>` | - |

### `CodeTreeFile`

Extends [`FileTreeNode`](/components/typography/file-tree) with one added field:

| Field | Type | Description |
| --- | --- | --- |
| `name` | `string` | The file/directory's displayed label |
| `children` | `CodeTreeFile[]` | Present on a directory node, absent on a file |
| `icon` | `string` | Overrides the default file/folder icon |
| `code` | `string` | The file's content, shown with syntax highlighting once selected - ignored on a directory |
| `language` | `string` | Syntax language override; otherwise inferred from the filename |
