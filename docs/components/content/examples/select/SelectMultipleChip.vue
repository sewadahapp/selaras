<script setup lang="ts">
const fruits = ref(['apple', 'banana', 'cherry'])

const fruitItems = [
  { label: 'Apple', value: 'apple' },
  { label: 'Banana', value: 'banana' },
  { label: 'Cherry', value: 'cherry' },
  { label: 'Date', value: 'date' },
  { label: 'Elderberry', value: 'elderberry' },
]
</script>

<template>
  <SSelect v-model="fruits" multiple display-mode="chip" :max-chips="2" :items="fruitItems" />
</template>
