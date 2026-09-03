---
title: Collapsible
description: A single show/hide panel, built on Reka UI's Collapsible primitive.
order: 41.5
---

## Usage

Closed by default - the `trigger` slot is the button's own content, the
default slot is the panel:

::component-example{name="collapsible-basic"}
::

```vue-html
<SCollapsible>
  <template #trigger>
    What's included in the free plan?
  </template>
  Everything you need to get started: unlimited projects, community
  support, and access to every core feature.
</SCollapsible>
```

### Controlled

`v-model:open` controls it from the parent instead of managing its own
state:

::component-example{name="collapsible-controlled"}
::

```vue-html
<SCollapsible v-model:open="open">
  <template #trigger>
    Toggle me
  </template>
  Content controlled by the parent.
</SCollapsible>
```

### Disabled

`disabled` blocks the trigger from toggling at all:

::component-example{name="collapsible-disabled"}
::

```vue-html
<SCollapsible disabled default-open>
  <template #trigger>
    This can't be collapsed
  </template>
  Locked open.
</SCollapsible>
```

## Props

| Prop | Type | Default |
| --- | --- | --- |
| `open` | `boolean` | - |
| `defaultOpen` | `boolean` | `false` |
| `disabled` | `boolean` | - |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` |
| `ui` | `Partial<Record<CollapsibleSlot, string \| object>>` | - |

## Emits

| Event | Payload |
| --- | --- |
| `update:open` | `boolean` |

## Slots

| Slot | Props | Description |
| --- | --- | --- |
| `trigger` | `{ open }` | The trigger button's own content |
| `default` | `{ open }` | The collapsible panel's content |
| `chevron-icon` | `{ open }` | Replaces the default chevron |
