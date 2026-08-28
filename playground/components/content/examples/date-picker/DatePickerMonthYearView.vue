<script setup lang="ts">
import type { DateValue } from '@internationalized/date'
import { ref } from 'vue'

const date = ref<DateValue>()
</script>

<template>
  <SDatePicker v-model="date" view="year" />
</template>
