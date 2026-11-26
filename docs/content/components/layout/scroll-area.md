---
title: ScrollArea
description: A themed scrollable region, built on Reka UI's ScrollArea primitive.
order: 65
---

## Usage

::component-example{name="scroll-area-basic"}
::

```vue-html
<SScrollArea class="h-32">
  <div class="flex flex-col gap-2 p-3">
    <p v-for="i in 15" :key="i">Line {{ i }}</p>
  </div>
</SScrollArea>
```

Give it a height via `class` (fallthrough) - `SScrollArea` fills whatever
box it's placed in. [PageAside](/composites/documentation/page-aside) uses this internally
for its scrollable body.

## Programmatic scrolling

The component ref exposes `viewport`, the HTML element that scrolls.
Use it after mount, for example from a click handler.

```vue
<script setup lang="ts">
const area = useTemplateRef('area')

function scrollToBottom() {
  const viewport = area.value?.viewport
  viewport?.scrollTo({ top: viewport.scrollHeight })
}
</script>

<template>
  <SScrollArea ref="area" class="h-32">
    <p v-for="i in 15" :key="i">
      Line {{ i }}
    </p>
  </SScrollArea>
  <SButton @click="scrollToBottom">
    Jump to bottom
  </SButton>
</template>
```

## Custom `:ui`

To see exactly what you'd be overriding - the current default classes for
every slot - here's `ScrollArea`'s own theme file:

Global and scoped theme recipes use `ui.scrollArea`.

::theme-source{name="scroll-area"}
::

## Props

| Prop | Type | Default |
| --- | --- | --- |
| `orientation` | `'vertical' \| 'horizontal' \| 'both'` | `'vertical'` |
| `type` | `'auto' \| 'always' \| 'scroll' \| 'hover' \| 'glimpse'` | `'hover'` |
| `scrollHideDelay` | `number` | `600` ms |
| `dir` | `'ltr' \| 'rtl'` | Inherited |
| `ui` | `Partial<Record<ScrollAreaSlot, string \| object>>` | - |

Set app-wide defaults for `type`, `scrollHideDelay`, and `dir` in
`app.config.selaras.defaults.scrollArea`.

## Slots

| Slot | Description |
| --- | --- |
| default | Scrollable content |
