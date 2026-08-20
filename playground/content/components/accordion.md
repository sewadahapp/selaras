---
title: Accordion
description: An items-driven collapsible list, built on Reka UI's Accordion primitive.
order: 20
---

## Usage

::component-example{name="accordion-basic"}
::

```vue-html
<SAccordion :items="[{ value: 'a', label: 'Question one' }]">
  <template #a>
    Answer one.
  </template>
</SAccordion>
```

Each item's content comes from a named slot matching its `value`. `type`
defaults to `'multiple'` (independent items can each be open at once) -
[ContentNavigation](/components/content-navigation) uses this internally for
its collapsible nav groups.

## Props

| Prop | Type | Default |
| --- | --- | --- |
| `items` | `{ value: string, label: string, disabled?: boolean }[]` | - |
| `type` | `'single' \| 'multiple'` | `'multiple'` |
| `defaultValue` | `string \| string[]` | - |
| `modelValue` | `string \| string[]` | - |
| `collapsible` | `boolean` | `true` |
| `ui` | `Partial<Record<AccordionSlot, string \| object>>` | - |

## Slots

| Slot | Description |
| --- | --- |
| `[item.value]` | Content for that item, one named slot per item |
