<script setup lang="ts">
import type { DateRange } from 'reka-ui'
import { shallowRef } from 'vue'

const range = shallowRef<DateRange>()
</script>

<template>
  <SDatePicker v-model="range" range trigger-mode="button" />
</template>
