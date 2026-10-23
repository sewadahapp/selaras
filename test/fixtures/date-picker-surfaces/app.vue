<script setup>
import { CalendarDate, Time } from '@internationalized/date'

const route = useRoute()
useHead({ htmlAttrs: { class: route.query.dark ? 'dark' : '' } })
const mode = computed(() => route.query.mode || 'single')
const value = ref()
watch(mode, () => {
  value.value = mode.value === 'time'
    ? new Time(14, 30)
    : mode.value === 'range'
      ? { start: new CalendarDate(2024, 1, 15), end: new CalendarDate(2024, 1, 20) }
      : new CalendarDate(2024, 1, 15)
}, { immediate: true })
</script>

<template>
  <SApp>
    <main style="padding: 32px">
      <SFormField v-for="triggerMode in ['field', 'button']" :key="triggerMode" :label="triggerMode" style="margin-bottom: 24px; width: 320px">
        <SDatePicker
          v-model="value"
          :trigger-mode="triggerMode"
          :size="route.query.size || 'md'"
          :range="mode === 'range'"
          :time-only="mode === 'time'"
          :invalid="!!route.query.invalid"
          :disabled="!!route.query.disabled"
          :ui="{ field: { 'data-surface': triggerMode, 'class': route.query.local ? 'tw:ring-[#56665a]' : undefined } }"
          clearable
        />
      </SFormField>
    </main>
  </SApp>
</template>
