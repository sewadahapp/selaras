<script setup lang="ts">
import type { DateValue } from '@internationalized/date'
import { ref } from 'vue'

const date = ref<DateValue>()

// Blocks July for a known closure - independent of minValue/maxValue.
function isMonthDisabled(monthDate: DateValue) {
  return monthDate.month === 7
}
</script>

<template>
  <SDatePicker v-model="date" view="month" :is-month-disabled="isMonthDisabled" />
</template>
