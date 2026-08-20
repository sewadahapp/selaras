---
title: ScrollArea
description: A themed scrollable region, built on Reka UI's ScrollArea primitive.
order: 19
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
box it's placed in. [PageAside](/components/page-aside) uses this internally
for its scrollable body.

## Props

| Prop | Type | Default |
| --- | --- | --- |
| `orientation` | `'vertical' \| 'horizontal' \| 'both'` | `'vertical'` |
| `ui` | `Partial<Record<ScrollAreaSlot, string \| object>>` | - |

## Slots

| Slot | Description |
| --- | --- |
| default | Scrollable content |
