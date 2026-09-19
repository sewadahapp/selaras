<script setup lang="ts">
import type { Time } from '@internationalized/date'
import { shallowRef } from 'vue'

const value = shallowRef<Time>()
</script>

<template>
  <SDatePicker v-model="value" time-only />
</template>
