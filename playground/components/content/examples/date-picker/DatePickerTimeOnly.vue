<script setup lang="ts">
import type { Time } from '@internationalized/date'
import { ref } from 'vue'

const value = ref<Time>()
</script>

<template>
  <SDatePicker v-model="value" time-only />
</template>
