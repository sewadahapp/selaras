<script setup lang="ts">
import type { DateValue } from '@internationalized/date'
import { getLocalTimeZone, today } from '@internationalized/date'
import { ref } from 'vue'

const date = ref<DateValue>()
const now = today(getLocalTimeZone())

// Weekends unavailable - still selectable (isDateUnavailable only marks the
// day, it doesn't block clicking it), matching a "no weekend deliveries"
// style constraint where you'd validate the choice yourself afterward.
function isWeekend(value: DateValue) {
  const day = value.toDate(getLocalTimeZone()).getDay()
  return day === 0 || day === 6
}
</script>

<template>
  <SDatePicker v-model="date" :is-date-unavailable="isWeekend" :min-value="now" />
</template>
