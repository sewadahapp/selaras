<script setup lang="ts">
import type { DateValue } from '@internationalized/date'
import { shallowRef } from 'vue'

const value = shallowRef<DateValue>()
</script>

<template>
  <SDatePicker v-model="value" granularity="minute" />
</template>
