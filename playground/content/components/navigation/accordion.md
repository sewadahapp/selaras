---
title: Accordion
description: An items-driven collapsible list, built on Reka UI's Accordion primitive.
order: 41
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
[ContentNavigation](/components/navigation/content-navigation) uses this internally for
its collapsible nav groups.

### Custom label content

The `label` slot replaces an item's plain-text label with anything -
scoped with `item`, so a single template can vary per item:

::component-example{name="accordion-custom-label"}
::

```vue-html
<SAccordion :items="items">
  <template #label="{ item }">
    <span class="flex items-center gap-2">
      {{ item.label }}
      <SBadge v-if="item.value === 'a'" label="New" color="primary" size="sm" />
    </span>
  </template>
  ...
</SAccordion>
```

`chevron-icon` replaces the expand/collapse chevron the same way any other
icon-swap slot in this library does (default: `ph:caret-down`).

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

| Slot | Props | Description |
| --- | --- | --- |
| `[item.value]` | - | Content for that item, one named slot per item |
| `label` | `{ item }` | Replaces an item's label content |
| `chevron-icon` | - | Replaces the expand/collapse chevron (default: `ph:caret-down`) |
