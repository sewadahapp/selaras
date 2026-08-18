<script setup lang="ts">
const fruit = ref('apple')

const fruitItems = [
  { label: 'Apple', value: 'apple' },
  { label: 'Banana', value: 'banana' },
  { label: 'Cherry', value: 'cherry', disabled: true },
]
</script>

<template>
  <SSelect v-model="fruit" searchable placeholder="Pick a fruit" :items="fruitItems" />
</template>
