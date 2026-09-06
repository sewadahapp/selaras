---
title: Container
description: A max-width, horizontally-padded wrapper for page layout.
order: 60
---

## Usage

::component-example{name="container-basic"}
::

```vue-html
<SContainer size="sm">
  <p>This content is centered and constrained to a max width.</p>
</SContainer>
```

## Custom `:ui`

To see exactly what you'd be overriding - the current default classes for
every slot and size - here's `Container`'s own theme file:

::theme-source{name="container"}
::

## Props

| Prop | Type | Default |
| --- | --- | --- |
| `size` | `'sm' \| 'md' \| 'lg' \| 'xl' \| 'full'` | `'lg'` |
| `ui` | `Partial<Record<ContainerSlot, string \| object>>` | - |
