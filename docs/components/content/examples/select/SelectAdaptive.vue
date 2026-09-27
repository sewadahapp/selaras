<script setup lang="ts">
const fruit = ref('apple')

const fruitItems = [
  { label: 'Apple', value: 'apple' },
  { label: 'Banana', value: 'banana' },
  { label: 'Cherry', value: 'cherry' },
]
</script>

<template>
  <SSelect v-model="fruit" adaptive placeholder="Pick a fruit" :items="fruitItems" />
</template>
