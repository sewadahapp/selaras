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

Requires `<SApp>` around your root `app.vue` (already done by this docs site's
shell) - it establishes Reka UI's shared `TooltipProvider`, so quickly
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
hides the little pointer triangle for a plain floating tooltip. An object can
set the arrow's width, height, and corner clearance (`padding`):

```vue-html
<STooltip text="Won't show" disabled>...</STooltip>
<STooltip text="No arrow" :arrow="false">...</STooltip>
<STooltip text="Wide arrow" :arrow="{ width: 16, height: 8, padding: 12 }">...</STooltip>
```

### Custom content

The `content` slot replaces the plain-text `text` prop with anything -
useful for a richer hint than a single line of text can give:

```vue-html
<STooltip>
  <SButton variant="outline">
    Hover me
  </SButton>
  <template #content>
    <span class="flex items-center gap-1">
      <SIcon name="hugeicons:information-circle" />
      Custom content
    </span>
  </template>
</STooltip>
```

### Custom `:ui`

To see exactly what you'd be overriding - the current default classes for
every slot - here's `Tooltip`'s own theme file:

::theme-source{name="tooltip"}
::

### Positioning and portal

Use `positioning` for the tooltip's side, alignment, offsets, and collision
behavior. It overrides the older top-level `side` prop when both are supplied.
`portal` defaults to the document body; set it to `false` to render inline or
pass a CSS selector or `HTMLElement` as the teleport target. `ui.content`
controls styling, while `#content` supplies custom content.

```vue-html
<STooltip text="Help" :positioning="{ side: 'bottom', align: 'end' }" portal="#overlay-root">...</STooltip>
```

## Props

| Prop | Type | Default |
| --- | --- | --- |
| `text` | `string` | - |
| `side` | `'top' \| 'right' \| 'bottom' \| 'left'` | `top` |
| `positioning` | `OverlayPositioning` | tooltip defaults |
| `portal` | `boolean \| string \| HTMLElement` | `true` (document body) |
| `delayDuration` | `number` | `200` |
| `kbds` | `string[]` | - |
| `arrow` | `boolean \| ArrowConfig` | `true` |
| `disabled` | `boolean` | `false` |
| `ui` | `Partial<Record<'content' \| 'arrow' \| 'kbds' \| 'kbd', string \| object>>` | - |

## Slots

| Slot | Description |
| --- | --- |
| default | The trigger element |
| `content` | Replaces the plain-text `text` with custom content |
