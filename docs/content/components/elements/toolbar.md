---
title: Toolbar
description: A keyboard-navigable group of actions, toggles and custom controls.
order: 12.95
---

## Usage

Use Toolbar for related actions. ToolbarButton, ToolbarToggleGroup and
ToolbarSeparator share the toolbar's size, color and disabled state. Controls
use one tab stop; arrow keys move between enabled controls, including across
toggle groups. Give every toolbar and icon-only action an accessible label.

::component-example{name="toolbar-basic"}
::

```vue-html
<SToolbar aria-label="Document actions">
  <SToolbarButton icon="hugeicons:floppy-disk" @click="save">Save</SToolbarButton>
  <SToolbarSeparator />
  <SToolbarButton icon="hugeicons:undo" aria-label="Undo" :disabled="!canUndo" @click="undo" />
</SToolbar>
```

### Formatting state

ToolbarButton accepts `pressed` for a state owned by another system, such as
the current editor selection. It emits normal click events; it does not maintain
a second copy of the formatting state. ToolbarToggleGroup supports the same
string/object `items` and single/multiple selection conventions as ToggleGroup,
with one shared toolbar focus sequence. `icon-only` keeps each item's label as
its accessible name.

```vue-html
<SToolbar aria-label="Text formatting">
  <SToolbarButton icon="hugeicons:text-bold" aria-label="Bold" :pressed="boldActive" @click="toggleBold" />
</SToolbar>
```

Toolbar does not change editor content itself. See the ready-to-copy
[Tiptap](/blocks/editors/tiptap), [Lexical](/blocks/editors/lexical), and
[Quill](/blocks/editors/quill) blocks for formatting and selection handling.

### Custom triggers

Use `as-child` on ToolbarButton to include a custom trigger in toolbar keyboard
navigation. The slot must have one interactive root that forwards its attributes.
For editor commands, preserve the editor selection before moving focus to a
popover or dialog, then restore it when applying the command. A pointer-only
`@mousedown.prevent` can keep selection for simple formatting actions; it must
not prevent keyboard focus or text entry into other controls.

### Orientation and appearance

`orientation="vertical"` changes layout and keyboard navigation. `dir="rtl"`
reverses horizontal navigation. Navigation wraps by default; use `:loop="false"`
to stop at either end. Separators follow the opposite orientation unless
explicitly overridden. The default size is `sm`; `md` and `lg` match Button.

Use `ui.root`, `ui.base`, or item slots for local styling. Shared recipes are
`toolbar`, `toolbarButton`, `toolbarToggleGroup`, and `toolbarSeparator` in
`app.config.selaras.ui` or `STheme`. Default toolbar size/color can be set in
`selaras.defaults.toolbar`.

## Props

| Component | Props |
| --- | --- |
| `SToolbar` | `orientation` (`horizontal` by default), `size` (`sm`), `color` (`primary`), `disabled`, `loop` (`true`), `dir`, `ui.root` |
| `SToolbarButton` | Button props, `pressed?: boolean`, `asChild`, `ui.base`, `ui.leadingIcon`, `ui.trailingIcon` |
| `SToolbarToggleGroup` | `items`, `type` (`single`), `modelValue`, `defaultValue`, `iconOnly`, `disabled`, `size`, `color`, `ui.root`, `ui.item`, `ui.icon` |
| `SToolbarSeparator` | `orientation`, `decorative` (`true`), `ui.root` |

## Slots and events

Toolbar and ToolbarButton expose the default slot. ToolbarToggleGroup exposes
`#item="{ item }"` and emits `update:modelValue` with a string or string array.
ToolbarButton forwards button events, including `click`. Buttons use
`type="button"` by default, so a toolbar inside a form does not submit it.
