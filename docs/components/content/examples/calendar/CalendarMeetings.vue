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
