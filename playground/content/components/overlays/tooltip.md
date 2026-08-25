---
title: Tooltip
description: A short hint shown on hover or focus, built on Reka UI's Tooltip primitive.
order: 52
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

Requires `<SApp>` around your root `app.vue` (already done in this
playground) - it establishes Reka UI's shared `TooltipProvider`, so quickly
moving between adjacent tooltips skips the full delay the second time,
instead of every tooltip waiting out `delayDuration` independently.

## Props

| Prop | Type | Default |
| --- | --- | --- |
| `text` | `string` | - |
| `side` | `'top' \| 'right' \| 'bottom' \| 'left'` | `top` |
| `delayDuration` | `number` | `200` |
| `ui` | `Partial<Record<'content' \| 'arrow', string \| object>>` | - |
