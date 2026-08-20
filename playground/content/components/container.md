---
title: Container
description: A max-width, horizontally-padded wrapper for page layout.
order: 17
---

## Usage

::component-example{name="container-basic"}
::

```vue-html
<SContainer size="sm">
  <p>This content is centered and constrained to a max width.</p>
</SContainer>
```

## Props

| Prop | Type | Default |
| --- | --- | --- |
| `size` | `'sm' \| 'md' \| 'lg' \| 'xl' \| 'full'` | `'lg'` |
| `ui` | `Partial<Record<ContainerSlot, string \| object>>` | - |
