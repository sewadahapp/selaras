---
title: Button
description: A clickable action element with color, variant and size options.
---

## Usage

::s-button
Click me
::

### Variants

::s-button{variant="solid"}
Solid
::

::s-button{variant="soft"}
Soft
::

::s-button{variant="outline"}
Outline
::

::s-button{variant="ghost"}
Ghost
::

### Custom `:ui`

Every slot can be overridden without fighting the defaults — the override is
tailwind-merge'd, so conflicting utilities resolve instead of both applying.

```vue-html
<SButton :ui="{ base: 'rounded-full' }">Pill button</SButton>
```

## Props

| Prop | Type | Default |
| --- | --- | --- |
| `color` | `'primary' \| 'neutral' \| 'danger'` | `primary` |
| `variant` | `'solid' \| 'soft' \| 'outline' \| 'ghost'` | `solid` |
| `size` | `'sm' \| 'md' \| 'lg'` | `md` |
| `block` | `boolean` | `false` |
| `disabled` | `boolean` | `false` |
| `icon` | `string` | - |
| `trailingIcon` | `string` | - |
| `ui` | `Partial<Record<'base' \| 'leadingIcon' \| 'trailingIcon', string \| object>>` | - |
