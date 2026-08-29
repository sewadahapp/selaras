<script setup lang="ts">
const active = ref('day')
const items = [
  { label: 'Day', value: 'day' },
  { label: 'Week', value: 'week' },
  { label: 'Month', value: 'month' },
]
</script>

<template>
  <STabs v-model="active" :items="items" variant="pill">
    <template #day>
      Showing today.
    </template>
    <template #week>
      Showing this week.
    </template>
    <template #month>
      Showing this month.
    </template>
  </STabs>
</template>
