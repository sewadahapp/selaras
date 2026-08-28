<script setup lang="ts">
import type { DateRange } from 'reka-ui'
import { ref } from 'vue'

const range = ref<DateRange>()
</script>

<template>
  <SDatePicker v-model="range" range trigger-mode="button" />
</template>
