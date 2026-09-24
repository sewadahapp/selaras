<script setup lang="ts">
import type { DateValue } from '@internationalized/date'
import { CalendarDate, getDayOfWeek } from '@internationalized/date'

// Fixed fixture dates keep the documentation example identical during SSR,
// hydration, and static generation. The circled date stands in for "today".
const displayMonth = new CalendarDate(2026, 9, 1)
const sampleToday = '2026-09-24'

type EventColor = 'primary' | 'info' | 'success' | 'warning' | 'danger'
interface Attendee { name: string, initials: string, color: EventColor }
interface ScheduleEvent {
  title: string
  when: string
  description: string
  color: EventColor
  attendees: Attendee[]
}
interface TimedEvent extends ScheduleEvent { time: string }
interface MultiDayEvent extends ScheduleEvent { start: CalendarDate, end: CalendarDate }

const timedEvents: Record<string, TimedEvent[]> = {
  '2026-09-16': [{
    title: 'Design review',
    when: 'September 16 · 9:00–10:00 AM',
    time: '9:00 AM',
    description: 'Review the next release with design and engineering.',
    color: 'info',
    attendees: [{ name: 'Maya Putri', initials: 'MP', color: 'primary' }, { name: 'Arif Rahman', initials: 'AR', color: 'success' }],
  }],
  '2026-09-24': [{
    title: 'Roadmap cut',
    when: 'September 24 · 9:00–9:30 AM',
    time: '9:00 AM',
    description: 'Agree on the final scope for the next milestone.',
    color: 'success',
    attendees: [{ name: 'Maya Putri', initials: 'MP', color: 'primary' }, { name: 'Dina Sari', initials: 'DS', color: 'warning' }],
  }],
  '2026-09-25': [{
    title: 'Team sync',
    when: 'September 25 · 11:00–11:30 AM',
    time: '11:00 AM',
    description: 'Share progress, blockers, and the plan for next week.',
    color: 'warning',
    attendees: [{ name: 'Arif Rahman', initials: 'AR', color: 'success' }, { name: 'Dina Sari', initials: 'DS', color: 'warning' }],
  }],
}

const allDayEvents: Record<string, ScheduleEvent> = {
  '2026-09-08': {
    title: 'Company holiday',
    when: 'September 8 · All day',
    description: 'The team is away. Meetings resume the following day.',
    color: 'info',
    attendees: [],
  },
}

const multiDayEvent: MultiDayEvent = {
  title: 'Launch freeze',
  when: 'September 23–27 · All day',
  description: 'Only release-critical changes are merged during the launch freeze.',
  color: 'danger',
  attendees: [{ name: 'Maya Putri', initials: 'MP', color: 'primary' }, { name: 'Arif Rahman', initials: 'AR', color: 'success' }],
  start: new CalendarDate(2026, 9, 23),
  end: new CalendarDate(2026, 9, 27),
}

function coversMultiDay(date: DateValue) {
  return date.compare(multiDayEvent.start) >= 0 && date.compare(multiDayEvent.end) <= 0
}

// A single visual bar spans the remaining cells in its week. A new segment
// begins on Sunday when the event continues into another week.
function multiDaySegment(date: DateValue) {
  if (!coversMultiDay(date))
    return undefined
  const weekDay = getDayOfWeek(date, 'en-US')
  const continuation = date.compare(multiDayEvent.start) > 0
  if (continuation && weekDay !== 0)
    return undefined

  let days = 0
  let cursor = date
  while (days < 7 - weekDay && cursor.compare(multiDayEvent.end) <= 0) {
    days++
    cursor = cursor.add({ days: 1 })
  }
  return { days, continuation }
}
</script>

<template>
  <div class="max-w-full overflow-x-auto">
    <SCalendar
      :default-placeholder="displayMonth"
      :week-starts-on="0"
      calendar-label="September 2026 team schedule"
      class="schedule-calendar w-full"
      style="width: 100%; min-width: 44rem"
      :ui="{
        grid: { style: { display: 'table', width: '100%', tableLayout: 'fixed' } },
        headCell: { style: { width: '14.285714%' } },
        cell: { class: 'border border-[var(--selaras-resolved-border-default)]', style: { height: '8rem', padding: 0, position: 'relative', textAlign: 'end', verticalAlign: 'top' } },
        dayButton: { style: { position: 'absolute', inset: 0, width: '100%', height: '100%', padding: '0.5rem', borderRadius: 0, alignItems: 'flex-start', justifyContent: 'flex-end' } },
        dayDetails: { style: { textAlign: 'start' } },
      }"
    >
      <template #day="{ date, dayValue, selected }">
        <span :class="date.toString() === sampleToday && !selected ? 'schedule-today' : undefined">
          {{ dayValue }}
        </span>
      </template>

      <template #day-details="{ date }">
        <div v-if="allDayEvents[date.toString()]" class="schedule-all-day">
          <SPopover align="start" :ui="{ content: { 'aria-label': `${allDayEvents[date.toString()]!.title} details` } }">
            <button type="button" class="schedule-event-trigger" :aria-label="`Show details for ${allDayEvents[date.toString()]!.title}`">
              <SBadge
                :label="allDayEvents[date.toString()]!.title"
                :color="allDayEvents[date.toString()]!.color"
                variant="soft"
                size="sm"
              />
            </button>
            <template #content>
              <div class="schedule-popover">
                <strong>{{ allDayEvents[date.toString()]!.title }}</strong>
                <p>{{ allDayEvents[date.toString()]!.when }}</p>
                <p>{{ allDayEvents[date.toString()]!.description }}</p>
              </div>
            </template>
          </SPopover>
        </div>

        <div v-if="multiDaySegment(date)" class="schedule-span" :style="{ '--event-days': multiDaySegment(date)!.days }">
          <SPopover align="start" :ui="{ content: { 'aria-label': `${multiDayEvent.title} details` } }">
            <button type="button" class="schedule-event-trigger" :aria-label="`Show details for ${multiDayEvent.title}`">
              <SBadge
                :label="`${multiDaySegment(date)!.continuation ? '↳ ' : ''}${multiDayEvent.title}`"
                :color="multiDayEvent.color"
                variant="soft"
                size="sm"
              />
            </button>
            <template #content>
              <div class="schedule-popover">
                <strong>{{ multiDayEvent.title }}</strong>
                <p>{{ multiDayEvent.when }}</p>
                <p>{{ multiDayEvent.description }}</p>
                <div class="schedule-attendees">
                  <SAvatarGroup size="sm">
                    <SAvatar v-for="person in multiDayEvent.attendees" :key="person.name" :text="person.initials" :alt="person.name" :color="person.color" />
                  </SAvatarGroup>
                  <span>{{ multiDayEvent.attendees.map(person => person.name).join(', ') }}</span>
                </div>
              </div>
            </template>
          </SPopover>
        </div>
        <span v-else-if="coversMultiDay(date)" class="sr-only">{{ multiDayEvent.title }} continues</span>

        <div v-if="timedEvents[date.toString()]" class="schedule-timed">
          <SPopover v-for="event in timedEvents[date.toString()]" :key="event.title" align="start" :ui="{ content: { 'aria-label': `${event.title} details` } }">
            <button type="button" class="schedule-timed-event" :aria-label="`Show details for ${event.title}, ${event.when}`">
              <SBadge dot :color="event.color" aria-hidden="true" />
              <span class="schedule-timed-title">{{ event.title }}</span>
              <time>{{ event.time }}</time>
            </button>
            <template #content>
              <div class="schedule-popover">
                <strong>{{ event.title }}</strong>
                <p>{{ event.when }}</p>
                <p>{{ event.description }}</p>
                <div class="schedule-attendees">
                  <SAvatarGroup size="sm">
                    <SAvatar v-for="person in event.attendees" :key="person.name" :text="person.initials" :alt="person.name" :color="person.color" />
                  </SAvatarGroup>
                  <span>{{ event.attendees.map(person => person.name).join(', ') }}</span>
                </div>
              </div>
            </template>
          </SPopover>
        </div>
      </template>
    </SCalendar>
  </div>
</template>

<style scoped>
.schedule-calendar :deep([data-today]::after) {
  display: none;
}

/* Keep the full-cell selection, but give it the primary soft-button recipe. */
.schedule-calendar :deep([data-reka-calendar-cell-trigger][data-selected]) {
  background-color: var(--_selaras-color-subtle);
  color: var(--_selaras-color-on-subtle);
}

.schedule-calendar :deep([data-reka-calendar-cell-trigger][data-selected]:hover) {
  background-color: var(--_selaras-color-subtle-hover);
}

.schedule-calendar :deep([data-reka-calendar-cell-trigger][data-selected]:active) {
  background-color: var(--_selaras-color-subtle-pressed);
}

.schedule-today {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.75rem;
  height: 1.75rem;
  border-radius: 9999px;
  background: var(--selaras-resolved-color-success-subtle);
  color: var(--selaras-resolved-color-success-text);
  font-weight: 700;
}

.schedule-all-day,
.schedule-span {
  position: absolute;
  z-index: 2;
  inset-inline-start: 0.25rem;
  top: 2.4rem;
  width: calc(100% - 0.5rem);
  min-width: 0;
  text-align: start;
}

.schedule-span {
  z-index: 3;
  width: calc(var(--event-days) * 100% - 0.5rem);
}

.schedule-event-trigger {
  display: block;
  width: 100%;
  min-width: 0;
  cursor: pointer;
  text-align: start;
}

.schedule-event-trigger:focus-visible,
.schedule-timed-event:focus-visible {
  outline: 2px solid var(--_selaras-color-focus, currentColor);
  outline-offset: 2px;
}

.schedule-all-day :deep([data-selaras-color]),
.schedule-span :deep([data-selaras-color]) {
  display: flex;
  width: 100%;
  min-width: 0;
  justify-content: flex-start;
  overflow: hidden;
}

.schedule-timed {
  position: absolute;
  inset-inline: 0.25rem;
  top: 4.35rem;
  display: grid;
  gap: 0.25rem;
  min-width: 0;
  text-align: start;
}

.schedule-timed-event {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  min-width: 0;
  width: 100%;
  cursor: pointer;
  text-align: start;
  font-size: 0.7rem;
  line-height: 1rem;
}

.schedule-timed-title {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.schedule-timed-event time {
  flex: none;
  color: var(--selaras-resolved-text-muted);
  font-size: 0.65rem;
}

.schedule-calendar :deep(td[aria-selected="true"] .schedule-timed-event),
.schedule-calendar :deep(td[aria-selected="true"] .schedule-timed-event time) {
  color: var(--_selaras-color-on-subtle);
}

.schedule-popover {
  display: grid;
  width: min(18rem, calc(100vw - 3rem));
  gap: 0.5rem;
  font-size: 0.875rem;
  color: var(--selaras-resolved-text-default);
}

.schedule-popover strong {
  font-weight: 600;
}

.schedule-popover p {
  margin: 0;
}

.schedule-popover p:nth-of-type(1) {
  color: var(--selaras-resolved-text-muted);
}

.schedule-attendees {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-top: 0.25rem;
  color: var(--selaras-resolved-text-muted);
  font-size: 0.75rem;
}
</style>
