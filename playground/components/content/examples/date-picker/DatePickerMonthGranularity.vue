<script setup lang="ts">
import type { DateValue } from '@internationalized/date'
import { shallowRef } from 'vue'

const month = shallowRef<DateValue>()
const year = shallowRef<DateValue>()
</script>

<template>
  <div class="flex flex-wrap gap-4">
    <SDatePicker v-model="month" granularity="month" />
    <SDatePicker v-model="year" granularity="year" />
  </div>
</template>
