---
title: Timeline
description: An ordered timeline for activity feeds, project milestones, and event history, with flexible orientation and item slots.
order: 31
---

## Usage

`STimeline` renders an ordered sequence of events. It is display-only; use
[Stepper](/components/navigation/stepper) when people need to navigate or
advance through a workflow.

::component-example{name="timeline-basic"}
::

```vue
<script setup lang="ts">
const items = [
  { id: 'created', date: '9:15 AM', title: 'Request created', description: 'A new request was submitted.' },
  { id: 'approved', date: '10:30 AM', title: 'Approved', color: 'success' },
]
</script>

<template>
  <STimeline :items="items" />
</template>
```

Each item can provide a stable `id`, a display `date`, an ISO `datetime`, a
`title`, a `description`, an `icon`, a semantic `color`, and a custom `slot`
name. Caller order is preserved. Dates are displayed as supplied so the
component does not assume a locale or time zone.

Set `icon` to any registered icon name to replace the solid dot with a larger
outlined marker. A per-item `color` changes that marker's accent:

::component-example{name="timeline-icons"}
::

```vue-html
<STimeline :items="[
  { date: '9:15 AM', title: 'Request submitted', icon: 'hugeicons:file-01' },
  { date: '10:30 AM', title: 'Review completed', icon: 'hugeicons:checkmark-circle-01', color: 'success' },
]" />
```

### Orientation and alignment

The default is a vertical feed aligned to the start. `align` accepts `start`,
`end`, or `alternate`; the same choices place horizontal content below, above,
or alternately around the marker line.

::component-example{name="timeline-horizontal"}
::

```vue-html
<STimeline :items="milestones" orientation="horizontal" align="alternate" />
```

### Custom content

Use `#marker`, `#date`, `#title`, and `#description` to replace individual
parts, or `#content` to build each event body. A `#item` slot replaces all
default content for every event. An item's `slot` field can choose a named
slot for just that event. Scoped slots receive `{ item, index }`, including
any custom fields supplied in the item data.

::component-example{name="timeline-activity"}
::

```vue-html
<STimeline :items="activity" align="alternate">
  <template #marker="{ item }">
    <SAvatar :name="item.actor" :text="item.initials" size="sm" />
  </template>
  <template #content="{ item }">
    <strong>{{ item.title }}</strong>
    <SBadge :label="item.action" :color="item.color" variant="soft" />
  </template>
</STimeline>
```

The marker and connector remain decorative; put links and buttons in the
content slots so they keep their native interaction and accessibility.

### Styling

`size` accepts `sm`, `md`, or `lg`; `color` sets the default marker color and
each item can override it. `ui` can override `root`, `item`, `track`, `marker`,
`icon`, `connector`, `content`, `date`, `title`, and `description`. An item may
also provide its own `class` and partial `ui` overrides. The theme can be
configured globally under `ui.timeline`.

::theme-source{name="timeline"}
::

## Props

| Prop | Type | Default |
| --- | --- | --- |
| `items` | `TimelineItem[]` | required |
| `orientation` | `'vertical' \| 'horizontal'` | `vertical` |
| `align` | `'start' \| 'end' \| 'alternate'` | `start` |
| `size` | `'sm' \| 'md' \| 'lg'` | `md` |
| `color` | `ColorRole` | `primary` |
| `ui` | `Partial<Record<TimelineThemeSlot, string \| object>>` | - |

`TimelineItem` supports `id`, `date`, `datetime`, `title`, `description`,
`icon`, `color`, `slot`, `class`, per-item `ui`, and custom application data.

## Slots

| Slot | Props | Description |
| --- | --- | --- |
| `marker` | `{ item, index }` | Replaces the marker content; defaults to the item's icon or a dot |
| `connector` | `{ item, index }` | Content inside the decorative connector between items |
| `date` | `{ item, index }` | Replaces the displayed date |
| `title` | `{ item, index }` | Replaces the title text |
| `description` | `{ item, index }` | Replaces the description text |
| `content` | `{ item, index }` | Replaces the whole default event body |
| `item` | `{ item, index }` | Replaces the whole default event body, including date/title/description |
| Named item slot | `{ item, index }` | An item's `slot` property can select a named slot for that item |
