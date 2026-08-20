---
title: Button
description: A clickable action element with color, variant and size options.
order: 10
---

## Usage

::component-example{name="button-basic"}
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

### Colors

::s-button{color="primary"}
Primary
::

::s-button{color="secondary"}
Secondary
::

::s-button{color="success"}
Success
::

::s-button{color="danger"}
Danger
::

::s-button{color="info"}
Info
::

::s-button{color="warning"}
Warning
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
| `color` | `'primary' \| 'neutral' \| 'secondary' \| 'success' \| 'danger' \| 'info' \| 'warning'` | `primary` |
| `variant` | `'solid' \| 'soft' \| 'outline' \| 'ghost'` | `solid` |
| `size` | `'sm' \| 'md' \| 'lg'` | `md` |
| `block` | `boolean` | `false` |
| `disabled` | `boolean` | `false` |
| `icon` | `string` | - |
| `trailingIcon` | `string` | - |
| `ui` | `Partial<Record<'base' \| 'leadingIcon' \| 'trailingIcon', string \| object>>` | - |
