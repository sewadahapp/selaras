<script setup lang="ts">
import type { DateValue } from '@internationalized/date'
import { ref } from 'vue'

const date = ref<DateValue>()
const withFormat = ref<DateValue>()
</script>

<template>
  <div class="flex flex-col items-start gap-4">
    <SDatePicker v-model="date" trigger-mode="button" />
    <SDatePicker v-model="withFormat" trigger-mode="button" :format="{ year: 'numeric', month: '2-digit', day: '2-digit' }" />
  </div>
</template>
