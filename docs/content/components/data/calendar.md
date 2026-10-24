---
title: Calendar
description: An inline, accessible date grid with slots for day markers, holidays, and meeting content.
order: 29
---

## Usage

`SCalendar` is an inline date grid. Its value is an `@internationalized/date`
`DateValue`, as in `SDatePicker`. The selected date and the displayed month are
separate: use `v-model` for selection and `v-model:placeholder` when you need to
control the displayed month.

::component-example{name="calendar-basic"}
::

```vue
<script setup lang="ts">
import type { DateValue } from '@internationalized/date'
import { CalendarDate } from '@internationalized/date'
import { shallowRef } from 'vue'

const selected = shallowRef<DateValue>(new CalendarDate(2026, 9, 24))
</script>

<template>
  <SCalendar v-model="selected" />
</template>
```

Use `default-value` and `default-placeholder` for initial uncontrolled state.
`min-value`, `max-value`, `is-date-disabled`, and `is-date-unavailable` control
which dates can be selected. A holiday can be shown without marking its date
unavailable.

### Meeting content

`#day` replaces the content *inside* the date button; it receives the date,
localized day label, and selected/today/disabled/unavailable state. Use it for
compact markers. `#day-details` renders beside that button within the day cell,
so meeting links or buttons do not become nested controls. Selaras associates
that detail area with the date button for assistive technology. The calendar
does not own your events or their data format.

::component-example{name="calendar-meetings"}
::

```vue
<script setup lang="ts">
import { CalendarDate } from '@internationalized/date'

const meetings: Record<string, string[]> = {
  '2026-09-08': ['Planning'],
  '2026-09-16': ['Design review', 'Team sync'],
  '2026-09-24': ['Release check'],
}
</script>

<template>
  <div class="max-w-full overflow-x-auto">
    <SCalendar
      :default-placeholder="new CalendarDate(2026, 9, 1)"
      calendar-label="September meetings"
      class="w-full"
      style="min-width: 42rem"
      :ui="{
        grids: 'block',
        grid: { class: 'w-full', style: { tableLayout: 'fixed' } },
        headCell: { style: { width: '14.285714%' } },
        cell: { class: 'border border-[var(--selaras-resolved-border-default)] p-1 text-start', style: { height: '8rem' } },
        dayDetails: { class: 'space-y-1 overflow-hidden pt-1 text-xs', style: { overflowWrap: 'anywhere', maxHeight: '5rem' } },
      }"
    >
      <template #day-details="{ date }">
        <div v-for="meeting in meetings[date.toString()] ?? []" :key="meeting" class="rounded bg-[var(--selaras-resolved-surface-elevated)] px-1 py-0.5">
          {{ meeting }}
        </div>
      </template>
    </SCalendar>
  </div>
</template>
```

The full month grid needs room on narrow screens. A consumer can scroll its
container, shorten the in-cell preview, or place the complete meeting list
below the calendar. If meetings have their own actions, render actual links or
buttons in `#day-details` and provide an accessible name for each action.

### Schedule composition

The same slots can support a larger schedule: the date sits at the top right
of each day cell, a timed event uses `SBadge`'s status dot, an all-day event
uses its soft badge, and a multi-day event is split into visual segments at
week boundaries. The whole cell selects a date, while each event opens a
popover with details and attendee avatars. This layout is an example-level
`ui` override; the compact calendar keeps centered dates by default.

::component-example{name="calendar-schedule"}
::

The fixture uses a fixed September 2026 date as its highlighted sample
"today" so its SSR and static output stay deterministic. In an application,
derive that date from your own time-zone-aware state. The event records,
week-segment calculation, and scoped layout styles are all in the
[complete example source](https://github.com/sewadahapp/selaras/blob/master/docs/components/content/examples/calendar/CalendarSchedule.vue).

### Styling

`ui` targets `root`, `header`, `heading`, `grids`, `grid`, `gridHead`,
`headCell`, `cell`, `dayButton`, `dayDetails`, and `footer`. `color` styles
unselected day/navigation buttons; `active-color` styles the selected day.
The `#footer` slot adds content below the grids. Each month is compact by
default; use `class="w-full"` with `:ui="{ grid: 'w-full' }"` for a calendar
that fills its container.

## Props

| Prop | Type | Default |
| --- | --- | --- |
| `modelValue` / `defaultValue` | `DateValue` | no selection |
| `placeholder` / `defaultPlaceholder` | `DateValue` | selected date or today |
| `minValue` / `maxValue` | `DateValue` | - |
| `isDateDisabled` / `isDateUnavailable` | `(date: DateValue) => boolean` | - |
| `locale` | BCP-47 locale string | inherited configuration |
| `numberOfMonths` | `number` | `1` |
| `pagedNavigation` | `boolean` | `false` |
| `weekStartsOn` | `0`–`6` (Sunday–Saturday) | locale default |
| `weekdayFormat` | `'narrow' \| 'short' \| 'long'` | `'narrow'` |
| `fixedWeeks` | `boolean` | `false` |
| `disableDaysOutsideCurrentView` | `boolean` | `false` |
| `preventDeselect` | `boolean` | `false` |
| `disabled` / `readonly` | `boolean` | `false` |
| `initialFocus` | `boolean` | `false` |
| `calendarLabel` | `string` | generated calendar label |
| `color` / `activeColor` | `ColorRole`, including registered roles | `'neutral'` / `'primary'` |
| `ui` | `CalendarProps['ui']` | - |

`placeholder` is a date identifying the visible month, separate from selection.
Use `v-model:placeholder` to control it, or `defaultPlaceholder` to initialize it.
`preventDeselect` keeps a selected date selected when activated again.
`disableDaysOutsideCurrentView` prevents selecting adjacent-month dates shown in
the current grid. `readonly` keeps navigation available while preventing selection;
`disabled` disables interaction. `initialFocus` requests focus when mounted.

Calendar selects one date. Use [DatePicker](/components/forms/date-picker#range-selection)
for a date range. Calendar has no native `name`/`form` submission contract; bind
its value to your form state or use DatePicker for a field with native submission.

## Events

| Event | Payload | Purpose |
| --- | --- | --- |
| `update:modelValue` | `DateValue \| undefined` | Selection or deselection proposal |
| `update:placeholder` | `DateValue` | Visible month changes through navigation |

## Slots

| Slot | Props | Purpose |
| --- | --- | --- |
| `day` | `CalendarDaySlotProps` | Date-button content; keep independent actions outside this slot |
| `day-details` | `{ date: DateValue, month: DateValue }` | Content beside the date button, suitable for event links/buttons |
| `footer` | - | Content below the grids |

`CalendarDaySlotProps` contains `date`, `month`, the localized `dayValue`, and
`selected`, `today`, `disabled`, `unavailable`, `outsideView`, and
`outsideVisibleView` booleans. `CalendarProps`, `CalendarEmits`, and
`CalendarDaySlotProps` are exported from `@sewadah/selaras/types`.
