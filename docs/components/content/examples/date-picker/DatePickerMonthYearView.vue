<script setup lang="ts">
import type { DateValue } from '@internationalized/date'
import { shallowRef } from 'vue'

const date = shallowRef<DateValue>()
</script>

<template>
  <SDatePicker v-model="date" view="year" />
</template>
