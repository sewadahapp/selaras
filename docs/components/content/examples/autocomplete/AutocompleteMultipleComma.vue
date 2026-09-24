<script setup lang="ts">
const fruits = ref<string[]>(['apple', 'banana'])

const fruitItems = [
  { label: 'Apple', value: 'apple' },
  { label: 'Banana', value: 'banana' },
  { label: 'Cherry', value: 'cherry' },
]
</script>

<template>
  <SAutocomplete v-model="fruits" multiple :items="fruitItems" />
</template>
