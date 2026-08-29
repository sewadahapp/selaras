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

### Keyboard shortcut

`kbds` renders a row of small key badges alongside the text - useful for
surfacing a shortcut on the action a button already performs. It takes the
literal symbols to display, not semantic key names - there's no
platform-specific mapping (e.g. `'meta'` to `⌘`) built in, so pass whatever
you want shown (`['⌘', 'S']`, `['Ctrl', 'S']`, ...).

::component-example{name="tooltip-kbds"}
::

```vue-html
<STooltip text="Save" :kbds="['⌘', 'S']">
  <SButton variant="outline">Save</SButton>
</STooltip>
```

### Disabling and the arrow

`disabled` suppresses the tooltip entirely (it never opens); `arrow="false"`
hides the little pointer triangle for a plain floating tooltip:

```vue-html
<STooltip text="Won't show" disabled>...</STooltip>
<STooltip text="No arrow" :arrow="false">...</STooltip>
```

## Props

| Prop | Type | Default |
| --- | --- | --- |
| `text` | `string` | - |
| `side` | `'top' \| 'right' \| 'bottom' \| 'left'` | `top` |
| `delayDuration` | `number` | `200` |
| `kbds` | `string[]` | - |
| `arrow` | `boolean` | `true` |
| `disabled` | `boolean` | `false` |
| `ui` | `Partial<Record<'content' \| 'arrow' \| 'kbds' \| 'kbd', string \| object>>` | - |
