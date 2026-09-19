<script setup lang="ts">
import type { DateValue } from '@internationalized/date'
import { shallowRef } from 'vue'

// shallowRef, not ref - DateValue instances carry real private class
// fields that a plain ref's type would strip, breaking assignability
// back into v-model. The value is always replaced wholesale anyway,
// never mutated in place.
const date = shallowRef<DateValue>()
</script>

<template>
  <SDatePicker v-model="date" />
</template>
