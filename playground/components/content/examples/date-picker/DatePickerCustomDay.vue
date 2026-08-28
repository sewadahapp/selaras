<script setup lang="ts">
import type { DateValue } from '@internationalized/date'
import { getLocalTimeZone, today } from '@internationalized/date'
import { ref } from 'vue'

const date = ref<DateValue>()
const now = today(getLocalTimeZone())
const eventDates = [now.add({ days: 3 }), now.add({ days: 10 })]

function hasEvent(value: DateValue) {
  return eventDates.some(d => d.compare(value) === 0)
}
</script>

<template>
  <SDatePicker v-model="date">
    <template #day="{ date: cellDate, dayValue }">
      <span class="relative flex flex-col items-center">
        {{ dayValue }}
        <span v-if="hasEvent(cellDate)" class="absolute -bottom-1.5 size-1 rounded-full bg-[var(--ui-primary)]" />
      </span>
    </template>
  </SDatePicker>
</template>
