<script setup lang="ts">
const value = ref('')

const fruitItems = [
  { label: 'Apple', value: 'apple' },
  { label: 'Banana', value: 'banana' },
  { label: 'Cherry', value: 'cherry' },
]
</script>

<template>
  <SAutocomplete v-model="value" dropdown placeholder="Type or browse" :items="fruitItems" />
</template>
