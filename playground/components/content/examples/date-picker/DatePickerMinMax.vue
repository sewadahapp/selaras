<script setup lang="ts">
import type { DateValue } from '@internationalized/date'
import { getLocalTimeZone, today } from '@internationalized/date'
import { ref } from 'vue'

const date = ref<DateValue>()
const now = today(getLocalTimeZone())
const min = now
const max = now.add({ days: 14 })
</script>

<template>
  <SDatePicker v-model="date" :min-value="min" :max-value="max" />
</template>
