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

### Single mode

`type="single"` allows only one item open at a time - opening one closes
whichever was open before it. `collapsible` (default `true`) additionally
lets clicking the open item's own trigger close it, rather than leaving at
least one item permanently forced open:

::component-example{name="accordion-single"}
::

```vue-html
<SAccordion type="single" :items="items" default-value="a">
  <template #a>...</template>
  <template #b>...</template>
</SAccordion>
```

### Sizes

`size` takes `sm` / `md` / `lg`, scaling the trigger's padding/text and
the content's text together:

::component-example{name="accordion-sizes"}
::

```vue-html
<SAccordion size="sm" :items="items">...</SAccordion>
<SAccordion size="md" :items="items">...</SAccordion>
<SAccordion size="lg" :items="items">...</SAccordion>
```

### Disabled

An item's own `disabled: true` blocks just that item; the accordion's own
`disabled` prop blocks every item at once:

::component-example{name="accordion-disabled"}
::

```vue-html
<SAccordion :items="[{ value: 'a', label: '...' }, { value: 'b', label: '...', disabled: true }]">
  ...
</SAccordion>
<SAccordion disabled :items="items">
  ...
</SAccordion>
```

### Accessibility

Accordion renders Reka UI's Accordion primitive, so the accessibility
semantics come from there rather than being reimplemented here: each
trigger is a real `<button>` (keyboard-activatable with
<kbd>Enter</kbd>/<kbd>Space</kbd>), <kbd>↑</kbd>/<kbd>↓</kbd> move focus
between triggers, and each panel is exposed as `role="region"` with
`aria-labelledby` pointing back at its own trigger - a screen reader
always knows which question a given answer belongs to, even if the DOM
order changes.

## Props

| Prop | Type | Default |
| --- | --- | --- |
| `items` | `{ value: string, label: string, disabled?: boolean }[]` | - |
| `type` | `'single' \| 'multiple'` | `'multiple'` |
| `defaultValue` | `string \| string[]` | - |
| `modelValue` | `string \| string[]` | - |
| `collapsible` | `boolean` | `true` |
| `disabled` | `boolean` | `false` |
| `size` | `'sm' \| 'md' \| 'lg'` | `md` |
| `ui` | `Partial<Record<AccordionSlot, string \| object>>` | - |

## Slots

| Slot | Props | Description |
| --- | --- | --- |
| `[item.value]` | - | Content for that item, one named slot per item |
| `label` | `{ item }` | Replaces an item's label content |
| `chevron-icon` | - | Replaces the expand/collapse chevron (default: `ph:caret-down`) |
