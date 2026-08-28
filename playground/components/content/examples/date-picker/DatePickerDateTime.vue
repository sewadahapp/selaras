<script setup lang="ts">
import type { DateValue } from '@internationalized/date'
import { ref } from 'vue'

const value = ref<DateValue>()
</script>

<template>
  <SDatePicker v-model="value" granularity="minute" />
</template>
