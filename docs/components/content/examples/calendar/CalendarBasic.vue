<script setup lang="ts">
import type { DateValue } from '@internationalized/date'
import { CalendarDate } from '@internationalized/date'
import { shallowRef } from 'vue'

const selected = shallowRef<DateValue>(new CalendarDate(2026, 9, 24))
</script>

<template>
  <SCalendar v-model="selected" />
</template>
