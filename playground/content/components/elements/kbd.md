---
title: Kbd
description: A themed keyboard key/shortcut hint.
order: 12.95
---

## Usage

`value` resolves a small set of common key names to their symbol -
anything else (a letter, a digit) renders as-is:

::component-example{name="kbd-basic"}
::

```vue-html
<SKbd value="meta" /><SKbd>K</SKbd>
```

### Keys

Every built-in symbol `value` resolves:

::component-example{name="kbd-keys"}
::

`meta`/`command`/`cmd` → ⌘, `ctrl`/`control` → ⌃, `alt`/`option` → ⌥,
`shift` → ⇧, `enter`/`return` → ↵, `backspace` → ⌫, `delete` → ⌦,
`tab` → ⇥, `capslock` → ⇪, `escape`/`esc` → Esc, `up`/`down`/`left`/`right`
→ ↑/↓/←/→, `space` → Space. Anything else - a bare `K`, a digit - is
kept as the literal string, so `value` also works as a plain shorthand
for the default slot.

### Sizes

::component-example{name="kbd-sizes"}
::

```vue-html
<SKbd size="sm" value="meta" />
<SKbd size="md" value="meta" />
<SKbd size="lg" value="meta" />
```

## Props

| Prop | Type | Default |
| --- | --- | --- |
| `value` | `string` | - |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` |
| `ui` | `Partial<Record<'base', string \| object>>` | - |

## Slots

| Slot | Props | Description |
| --- | --- | --- |
| `default` | - | Overrides `value` entirely - a pre-assembled combo, an icon, anything |
