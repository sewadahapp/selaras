<script setup lang="ts">
import type { DateValue } from '@internationalized/date'
import { CalendarDate } from '@internationalized/date'
import { shallowRef } from 'vue'

const clearable = shallowRef<DateValue>(new CalendarDate(2024, 6, 15))
const disabled = shallowRef<DateValue>()
</script>

<template>
  <div class="flex flex-col items-start gap-4">
    <SDatePicker v-model="clearable" clearable />
    <SDatePicker v-model="disabled" disabled />
  </div>
</template>
