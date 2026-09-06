---
title: CodeButton
description: A standalone copy-to-clipboard button for a command or snippet referenced inline in prose.
order: 73
---

## Usage

::component-example{name="code-button-basic"}
::

```vue-html
<SCodeButton code="npm install selaras" />
```

Unlike [ProsePre](/components/typography/prose) (a full code block) or
[CodeGroup](/components/typography/code-group) (several of those, tabbed),
`SCodeButton` is meant to sit inline in a sentence - referencing a single
command without breaking the reading flow into a block. `code` is both what's
displayed and what actually gets copied; override just the displayed text
with the default slot when they should differ:

```vue-html
<SCodeButton code="npm install selaras">
  Copy install command
</SCodeButton>
```

### Custom `:ui`

To see exactly what you'd be overriding - the current default classes for
every slot and variant - here's `CodeButton`'s own theme file:

::theme-source{name="code-button"}
::

## Props

| Prop | Type | Default |
| --- | --- | --- |
| `code` | `string` | - (required) |
| `ui` | `Partial<Record<CodeButtonSlot, string \| object>>` | - |

## Slots

| Slot | Description |
| --- | --- |
| default | Overrides the displayed text - `code` still governs what's copied |
