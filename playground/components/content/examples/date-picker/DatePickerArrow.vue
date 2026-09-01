<script setup lang="ts">
import type { DateValue } from '@internationalized/date'
import { CalendarDate } from '@internationalized/date'
import { shallowRef } from 'vue'

const value = shallowRef<DateValue>(new CalendarDate(2024, 6, 15))
</script>

<template>
  <SDatePicker v-model="value" arrow />
</template>
