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
import { shallowRef } from 'vue'

// shallowRef, not ref - DateValue instances carry real private class
// fields that a plain ref's type would strip, breaking assignability
// back into v-model. The value is always replaced wholesale anyway,
// never mutated in place.
const date = shallowRef<DateValue>()
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

### Range selection

`range` switches to picking a start and end date together - `v-model`
becomes `{ start?: DateValue, end?: DateValue }` instead of a single
`DateValue`. Click a first day to set the start (the popover stays open -
the selection isn't finished yet), then a second day to complete the range
and close it. Defaults to showing two months side by side
(`number-of-months="2"`) rather than one, since that's what makes picking a
multi-week range comfortable - pass `:number-of-months="1"` to page through
a single month instead:

::component-example{name="date-picker-range"}
::

```vue
<script setup lang="ts">
import type { DateRange } from 'reka-ui'
import { shallowRef } from 'vue'

const range = shallowRef<DateRange>()
</script>

<template>
  <SDatePicker v-model="range" range />
</template>
```

`allow-non-contiguous-ranges`, `fixed-date` (`'start' | 'end'`, locks one
end in place while re-picking the other), `maximum-days` (caps how far
apart start/end can be), and `is-date-highlightable` are all range-only
passthroughs to the underlying primitive.

`trigger-mode="button"` combines with `range` too - the button's text uses
`DateFormatter.formatRange()` (e.g. "Jun 15 – Jun 20, 2024") instead of a
single formatted date:

::component-example{name="date-picker-range-button-mode"}
::

```vue-html
<SDatePicker v-model="range" range trigger-mode="button" />
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

### Month/year view

Click the calendar heading to drill down from the day grid to a month grid,
then a year grid - picking a month or year jumps the day grid straight
there instead of paging one month at a time. `view` sets which grid opens
initially (`'date'` by default); passing `'year'` starts a birthdate-style
picker straight at the year grid:

::component-example{name="date-picker-month-year-view"}
::

```vue-html
<SDatePicker v-model="date" view="year" />
```

Single-date mode only - `range`'s own heading and navigation are
unaffected by `view`.

### Month/year granularity

`view` only changes which grid the popover *starts* on - picking a month
there still drills down to a day. `granularity` is different: it changes
what the *value itself* represents. Set it to `'month'` or `'year'` for a
picker whose value stops at that precision - the day grid never renders,
and picking a month or year is the final action, closing the popover
(subject to `closeOnSelect`) instead of drilling further:

::component-example{name="date-picker-month-granularity"}
::

```vue-html
<SDatePicker v-model="month" granularity="month" />
<SDatePicker v-model="year" granularity="year" />
```

The underlying date library has no month-only or year-only value type, so
`modelValue` stays the same `DateValue` either way - `granularity="month"`
fixes the day to `1`, and `granularity="year"` fixes both month and day to
`1`. Segmented field mode only shows the segments that matter
(month+year, or just year), and the button-mode/formatted text defaults
adjust too (`"June 2024"` / `"2024"`) - both still overridable via `format`.
The heading can still drill *up* (e.g. a month-granularity picker jumping
to year view to reach a distant year quickly) - only the terminal, "picking
this is the answer" direction changes. Single-date mode only.

### Custom month/year disabling

`is-month-disabled`/`is-year-disabled` (`view="month"`/`"year"` only)
disable a specific month/year on top of whatever `min-value`/`max-value`
already disable - useful for blocking out a specific month for a known
closure, independent of the overall allowed range:

::component-example{name="date-picker-month-year-disabled"}
::

```vue-html
<SDatePicker v-model="date" view="month" :is-month-disabled="(d) => d.month === 7" />
```

### Date-time selection

`granularity="hour"`/`"minute"` add a time-of-day section below the day
grid instead of replacing it - picking a day and setting a time are two
independent things, so the day grid stays fully usable. `modelValue`
becomes a time-capable `CalendarDateTime` (still just a `DateValue`, same
prop type as always). Since there's no single action that means "done"
here, `close-on-select` no longer closes the popover on a day click while
a time granularity is set - a **Done** button appears instead (hidden
entirely if you pass `close-on-select="false"`, since that already means
"never auto-close"):

::component-example{name="date-picker-date-time"}
::

```vue
<script setup lang="ts">
import type { DateValue } from '@internationalized/date'
import { shallowRef } from 'vue'

const value = shallowRef<DateValue>()
</script>

<template>
  <SDatePicker v-model="value" granularity="minute" />
</template>
```

`granularity="hour"` shows only the hour stepper; `"minute"` adds a second
one next to it. Both are built from
[InputNumber](/components/forms/input-number) - type a value directly or
use its ±buttons/arrow keys. `minute-step` (default `1`) only affects the
minute stepper's click/arrow-key increment; typing still commits any exact
minute - pass `5`/`15`/etc for a coarser "pick an appointment time" step.
Picking a day preserves whatever time is already set, and
adjusting the time commits a value using today's date if none has been
picked yet - either can be touched first. Single-date mode only.

The hour stepper follows the same hour cycle as the typed field itself -
both default to whatever `locale` resolves to (12-hour with an AM/PM
toggle for `en-US`, 24-hour for most others), so the two surfaces always
agree instead of one showing "14" and the other "2:00 PM" for the same
moment. Pass `hour-cycle="12"` or `hour-cycle="24"` to force one
regardless of locale:

```vue-html
<SDatePicker v-model="value" granularity="minute" hour-cycle="24" />
```

### Time only

`time-only` drops the date entirely - `modelValue` becomes a bare
`Time` (from `@internationalized/date`, no date component at all, not a
`DateValue`). Everything date-grid-specific (`min-value`/`max-value`,
`view`, `number-of-months`, and so on) simply doesn't apply - the popover
is just the hour/minute steppers, the same ones `granularity="hour"`/
`"minute"` already use:

::component-example{name="date-picker-time-only"}
::

```vue
<script setup lang="ts">
import type { Time } from '@internationalized/date'
import { shallowRef } from 'vue'

const value = shallowRef<Time>()
</script>

<template>
  <SDatePicker v-model="value" time-only />
</template>
```

`granularity`, `hour-cycle`, `minute-step`, `trigger-mode`, `clearable`,
and `close-on-select` all carry over unchanged from the date-time case
above - `granularity` defaults to `'minute'` here (a bare hour is a less
useful default for a *dedicated* time picker than as an add-on to a date).
Single-date mode only - `range` and `time-only` aren't combinable.

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

### Colors

`color` sets the chrome color - the clear/trigger buttons and prev/next
month nav; `active-color` sets the color of whatever's currently "active" -
the selected day/month/year cell and the Done button:

::component-example{name="date-picker-colors"}
::

```vue-html
<SDatePicker v-model="date" color="primary" active-color="danger" />
```

### Arrow

`arrow` shows a small pointer triangle connecting the panel to its
trigger - works the same across single-date, range, and time-only mode:

::component-example{name="date-picker-arrow"}
::

```vue-html
<SDatePicker v-model="value" arrow />
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

### Read-only

`readonly` shows the value and blocks edits without disabling the control -
unlike `disabled`, it stays focusable/readable, just not changeable. Not
applicable to `time-only` (there's no readonly concept for a bare time
field):

::component-example{name="date-picker-readonly"}
::

```vue-html
<SDatePicker v-model="date" readonly />
```

### Preventing deselection

`prevent-deselect` stops a click on the only selected day from clearing it
entirely - useful when the control should always land on *some* value
rather than allowing an empty state. Not applicable to `time-only`:

::component-example{name="date-picker-prevent-deselect"}
::

```vue-html
<SDatePicker v-model="date" prevent-deselect />
```

### Custom day content

The `day` slot replaces a day cell's content (in both single-date and range
grids) - the cell itself, including its selection/keyboard behavior, is
untouched. Scoped with `date`, `dayValue`, `selected`, `disabled`, and (range
mode only) `selectionStart`/`selectionEnd`/`highlighted`:

::component-example{name="date-picker-custom-day"}
::

```vue-html
<SDatePicker v-model="date">
  <template #day="{ date: cellDate, dayValue }">
    <span class="relative flex flex-col items-center">
      {{ dayValue }}
      <span v-if="hasEvent(cellDate)" class="absolute -bottom-1.5 size-1 rounded-full bg-[var(--ui-primary)]" />
    </span>
  </template>
</SDatePicker>
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
| `modelValue` | `DateValue \| DateRange \| Time` (`DateRange` when `range` is set, `Time` when `timeOnly` is set) | - |
| `range` | `boolean` | `false` |
| `timeOnly` | `boolean` | `false` |
| `minValue` | `DateValue` | - |
| `maxValue` | `DateValue` | - |
| `isDateUnavailable` | `(date: DateValue) => boolean` | - |
| `isDateDisabled` | `(date: DateValue) => boolean` | - |
| `isDateHighlightable` | `(date: DateValue) => boolean` (range only) | - |
| `locale` | `string` | - |
| `numberOfMonths` | `number` | `1`, or `2` when `range` is set |
| `pagedNavigation` | `boolean` | `false` |
| `weekStartsOn` | `0 \| 1 \| 2 \| 3 \| 4 \| 5 \| 6` | - |
| `weekdayFormat` | `'narrow' \| 'short' \| 'long'` | `narrow` |
| `fixedWeeks` | `boolean` | `false` |
| `closeOnSelect` | `boolean` | `true` |
| `triggerMode` | `'field' \| 'button'` | `field` |
| `view` | `'date' \| 'month' \| 'year'` (single-date mode only) | `date` |
| `isMonthDisabled` | `(date: DateValue) => boolean` (`view="month"` only) | - |
| `isYearDisabled` | `(year: number) => boolean` (`view="year"` only) | - |
| `granularity` | `'year' \| 'month' \| 'day' \| 'hour' \| 'minute'` (single-date mode only) | `day` |
| `minuteStep` | `number` (hour/minute granularity only) | `1` |
| `hourCycle` | `12 \| 24` (hour/minute granularity only) | locale default |
| `format` | `Intl.DateTimeFormatOptions` | `{ dateStyle: 'medium' }` |
| `allowNonContiguousRanges` | `boolean` (range only) | `false` |
| `fixedDate` | `'start' \| 'end'` (range only) | - |
| `maximumDays` | `number` (range only) | - |
| `disabled` | `boolean` | `false` |
| `readonly` | `boolean` (not `timeOnly`) | `false` |
| `preventDeselect` | `boolean` (not `timeOnly`) | `false` |
| `invalid` | `boolean` | `false` |
| `clearable` | `boolean` | `false` |
| `color` | `'primary' \| 'neutral' \| 'secondary' \| 'success' \| 'danger' \| 'info' \| 'warning'` | `'neutral'` |
| `activeColor` | same as `color` | `'primary'` |
| `size` | `'sm' \| 'md' \| 'lg'` | `md` |
| `arrow` | `boolean` | `false` |
| `ui` | `Partial<Record<'root' \| 'field' \| 'segment' \| 'content' \| 'header' \| 'heading' \| 'grid' \| 'gridHead' \| 'headCell' \| 'cell' \| 'timeSection' \| 'arrow', string \| object>>` | - |

## Slots

| Slot | Props | Description |
| --- | --- | --- |
| `day` | `{ date, dayValue, selected, disabled }` (range mode adds `selectionStart`, `selectionEnd`, `highlighted`) | Custom content inside a day-cell button (single-date and range grids) |
| `clear-icon` | - | Replaces the clear button's icon (default: `hugeicons:cancel-01`) |
| `trigger-icon` | - | Replaces the trigger button's icon in both trigger modes (default: `hugeicons:calendar-01`/`hugeicons:clock-01`) |
| `footer` | - | Content appended below the calendar/time content, above the Done button |

## Emits

| Emit | Payload | Description |
| --- | --- | --- |
| `update:modelValue` | `DateValue \| DateRange \| undefined` | Fires when a day is picked, typed into the field's segments, or cleared |
| `update:view` | `'date' \| 'month' \| 'year'` | Fires when the heading or a month/year cell drills the popover to a different view |
