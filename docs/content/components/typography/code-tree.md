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
node's `code` is shown, verbatim, once its file is clicked. The first file
found (depth-first) is selected by default, so the panel is never empty on
load; picking a different file set (a new `items` array, not a mutation of
the existing one) re-picks a default from it, but clicking around the
existing tree doesn't get reset out from under you.

Content renders as plain text, not syntax-highlighted - the same as
[ProsePre](/components/typography/prose) used directly outside markdown.
Real highlighting comes from `@nuxtjs/mdc`'s own pipeline, which only
applies to markdown-sourced code; this component doesn't ship a
standalone highlighter of its own.

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
| `code` | `string` | The file's content, shown verbatim once selected - ignored on a directory |
