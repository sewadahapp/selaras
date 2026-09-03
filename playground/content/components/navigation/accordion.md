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
[ContentNavigation](/blocks/documentation/content-navigation) uses this internally for
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
icon-swap slot in this library does (default: `hugeicons:arrow-down-01`).

### Icon in the label

An icon next to the label is just more `label` slot content - it's
independent of the chevron on the other end of the trigger:

::component-example{name="accordion-icon"}
::

```vue-html
<SAccordion :items="items">
  <template #label="{ item }">
    <span class="flex items-center gap-2">
      <SIcon :name="item.icon" class="size-4 text-[var(--ui-text-muted)]" />
      {{ item.label }}
    </span>
  </template>
  ...
</SAccordion>
```

### Custom chevron

`chevron-icon` isn't limited to a single swapped-in icon - here two icons
are cross-faded via `group-data-[state=open]:` instead of the default
icon's rotation, for a plus/minus toggle instead of an arrow:

::component-example{name="accordion-custom-chevron"}
::

```vue-html
<SAccordion :items="items">
  <template #chevron-icon>
    <span class="relative size-4 shrink-0 text-[var(--ui-text-muted)]">
      <SIcon name="hugeicons:plus-sign" class="absolute inset-0 transition-opacity group-data-[state=open]:opacity-0" />
      <SIcon name="hugeicons:minus-sign" class="absolute inset-0 opacity-0 transition-opacity group-data-[state=open]:opacity-100" />
    </span>
  </template>
  ...
</SAccordion>
```

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

### Variant

`list` (default) is a flat list with a shared divider between items.
`pill` gives each item its own bordered, rounded card instead, with a gap
between them - the same visual language as [Card](/components/layout/card)'s
own `outline` variant:

::component-example{name="accordion-variant"}
::

```vue-html
<SAccordion variant="list" :items="items">...</SAccordion>
<SAccordion variant="pill" :items="items">...</SAccordion>
```

### Chevron position

`chevronPosition` moves the chevron to the start of the trigger instead of
the end - the label stays flush next to it rather than pushed to the
opposite side, since `justify-between` only applies in the (default) `end`
position:

::component-example{name="accordion-chevron-position"}
::

```vue-html
<SAccordion chevron-position="start" :items="items">...</SAccordion>
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
| `variant` | `'list' \| 'pill'` | `list` |
| `chevronPosition` | `'start' \| 'end'` | `end` |
| `ui` | `Partial<Record<AccordionSlot, string \| object>>` | - |

## Slots

| Slot | Props | Description |
| --- | --- | --- |
| `[item.value]` | - | Content for that item, one named slot per item |
| `label` | `{ item }` | Replaces an item's label content |
| `chevron-icon` | - | Replaces the expand/collapse chevron (default: `hugeicons:arrow-down-01`) |
