---
title: DatePicker
description: A calendar-popover date input built on Reka UI's DatePicker primitive.
order: 23.5
---

## Usage

`v-model` is an `@internationalized/date` `DateValue` (typically a
`CalendarDate` for this component's date-only granularity), not a native
`Date` - the segmented field, calendar grid, `minValue`/`maxValue`, and
`isDateUnavailable` all share that same type, so there's no lossy
conversion at the boundary. It already has an ISO `.toString()`
(`2024-06-15`) and a matching `parseDate()` constructor if you need to
interop with a plain string, and `@internationalized/date`'s own `today()`/
`getLocalTimeZone()` cover the common "relative to now" cases:

::component-example{name="date-picker-basic"}
::

```vue
<script setup lang="ts">
import type { DateValue } from '@internationalized/date'

const date = ref<DateValue>()
</script>

<template>
  <SDatePicker v-model="date" />
</template>
```

Click the calendar icon to open the popover, or type directly into the day/
month/year segments - both stay in sync with the same value.

### Min/max range

`min-value`/`max-value` disable every day outside the range (and block
selecting one, not just style it):

::component-example{name="date-picker-min-max"}
::

```vue-html
<SDatePicker v-model="date" :min-value="today(getLocalTimeZone())" :max-value="..." />
```

### Unavailable dates

`is-date-unavailable` takes a `(date: DateValue) => boolean` predicate. Unlike
`minValue`/`maxValue`, an unavailable day is still selectable - it's marked
(struck through, dimmed) rather than blocked, matching a constraint you want
to flag rather than hard-enforce (e.g. "no weekend deliveries" where the
consumer decides what happens next):

::component-example{name="date-picker-unavailable"}
::

```vue-html
<SDatePicker v-model="date" :is-date-unavailable="(d) => isWeekend(d)" />
```

### Button trigger

`trigger-mode="button"` replaces the typeable segments with a single button
showing the formatted date (or a placeholder message when empty) - a
plainer "click to open" trigger for when the segmented field's inline
typing isn't needed. `format` (an `Intl.DateTimeFormatOptions` object -
the same shape every other JS date-formatting API already uses, default
`{ dateStyle: 'medium' }`) controls how that button's text reads:

::component-example{name="date-picker-button-mode"}
::

```vue-html
<SDatePicker v-model="date" trigger-mode="button" />
<SDatePicker v-model="date" trigger-mode="button" :format="{ year: 'numeric', month: '2-digit', day: '2-digit' }" />
```

### Sizes

`size` takes `sm` / `md` / `lg`, scaling the field, segments, and calendar-
day buttons together:

::component-example{name="date-picker-sizes"}
::

```vue-html
<SDatePicker v-model="date" size="sm" />
<SDatePicker v-model="date" size="md" />
<SDatePicker v-model="date" size="lg" />
```

### Clearable & disabled

`clearable` adds a dismiss button once a value is set; `disabled` disables
the whole control:

::component-example{name="date-picker-clearable"}
::

```vue-html
<SDatePicker v-model="date" clearable />
<SDatePicker v-model="date" disabled />
```

### Forms integration

Wrap it in [FormField](/components/forms/form-field) to get `id`/`name`/
`invalid` and `aria-describedby` wired up automatically - `invalid` and
`size` both fall back to FormField's own state when not set directly.

### Accessibility

DatePicker renders Reka UI's DatePicker primitive, so the accessibility
semantics come from there rather than being reimplemented here: each date
segment is a real `contenteditable` element you can type into directly
(arrow keys/digits cycle a segment's value and auto-advance to the next),
the calendar grid is keyboard-navigable (arrow keys move between days,
paging past a grid edge advances the month), and the current/selected/
unavailable/disabled state of each day is exposed via `aria-selected`/
`aria-disabled` in addition to the visual styling.

## Props

| Prop | Type | Default |
| --- | --- | --- |
| `id` | `string` | - |
| `name` | `string` | - |
| `modelValue` | `DateValue` | - |
| `minValue` | `DateValue` | - |
| `maxValue` | `DateValue` | - |
| `isDateUnavailable` | `(date: DateValue) => boolean` | - |
| `isDateDisabled` | `(date: DateValue) => boolean` | - |
| `locale` | `string` | - |
| `numberOfMonths` | `number` | `1` |
| `pagedNavigation` | `boolean` | `false` |
| `weekStartsOn` | `0 \| 1 \| 2 \| 3 \| 4 \| 5 \| 6` | - |
| `weekdayFormat` | `'narrow' \| 'short' \| 'long'` | `narrow` |
| `fixedWeeks` | `boolean` | `false` |
| `closeOnSelect` | `boolean` | `true` |
| `triggerMode` | `'field' \| 'button'` | `field` |
| `format` | `Intl.DateTimeFormatOptions` | `{ dateStyle: 'medium' }` |
| `disabled` | `boolean` | `false` |
| `invalid` | `boolean` | `false` |
| `clearable` | `boolean` | `false` |
| `size` | `'sm' \| 'md' \| 'lg'` | `md` |
| `ui` | `Partial<Record<'root' \| 'field' \| 'segment' \| 'content' \| 'header' \| 'heading' \| 'grid' \| 'gridHead' \| 'headCell' \| 'cell', string \| object>>` | - |

## Emits

| Emit | Payload | Description |
| --- | --- | --- |
| `update:modelValue` | `DateValue \| undefined` | Fires when a day is picked, typed into the field's segments, or cleared |
