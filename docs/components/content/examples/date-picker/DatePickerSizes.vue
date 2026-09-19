<script setup lang="ts">
import type { DateValue } from '@internationalized/date'
import { shallowRef } from 'vue'

const sm = shallowRef<DateValue>()
const md = shallowRef<DateValue>()
const lg = shallowRef<DateValue>()
</script>

<template>
  <div class="flex flex-col items-start gap-4">
    <SDatePicker v-model="sm" size="sm" />
    <SDatePicker v-model="md" size="md" />
    <SDatePicker v-model="lg" size="lg" />
  </div>
</template>
