---
title: v-hotkey
description: Bind a keyboard shortcut to an element or handler.
order: 15
---

`v-hotkey` listens for a keyboard shortcut while its bound element is
mounted. It is auto-imported in Nuxt apps and is also available from
`@sewadah/selaras/directives`.

## Usage

Bind a shortcut to the element's regular click behavior:

```vue-html
<SButton v-hotkey="'mod+k'" @click="openSearch">
  Search
</SButton>
```

Or pass a handler directly:

```vue-html
<SButton v-hotkey="{ keys: 'mod+s', handler: save }">
  Save
</SButton>
```

`mod` resolves to Command on macOS and Control on other platforms. Other
modifiers include `ctrl`, `meta`, `alt`, and `shift`; common keys include
`enter`, `escape`, `space`, and the arrow names.

## Options

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `keys` | `string` | - | A `+`-separated key chord, such as `mod+k`. |
| `handler` | `(event: KeyboardEvent) => void` | bound element click | Runs instead of clicking the bound element. |
| `when` | `boolean \| (element, event) => boolean` | `true` | Enables the shortcut only while the condition is true. |
| `allowInEditable` | `boolean` | `false` | Allows the shortcut while focus is in an input, textarea, select, or editable region. |

Printable single-key shortcuts only run while the bound element (or one of
its descendants) has focus. Modifier shortcuts are global while mounted; use
`when` to scope them to state such as an open menu. Editable controls are
ignored by default.

## Menu item shortcuts

Dropdown, ContextMenu, NavigationMenu, and CommandPalette items accept
`shortcut` to show a [`Kbd`](/components/elements/kbd) hint. Add
`hotkey: true` to activate it too. Menu shortcuts only run while their menu
is active; NavigationMenu shortcuts run while that item is focused. The
shortcut follows the item's normal activation path, so it calls `onSelect`
or follows the item's link destination. A visible hint alone does not
register a shortcut.

```ts
const item = { label: 'Save', shortcut: 'mod+s', hotkey: true, onSelect: save }
```
