---
title: Tooltip
description: A short hint shown on hover or focus, built on Reka UI's Tooltip primitive.
---

## Usage

::component-example{name="tooltip-basic"}
::

```vue
<template>
  <STooltip text="I'm a tooltip">
    <SButton variant="outline">
      Hover me
    </SButton>
  </STooltip>
</template>
```

## Props

| Prop | Type | Default |
| --- | --- | --- |
| `text` | `string` | - |
| `side` | `'top' \| 'right' \| 'bottom' \| 'left'` | `top` |
| `delayDuration` | `number` | `200` |
| `ui` | `Partial<Record<'content' \| 'arrow', string \| object>>` | - |
