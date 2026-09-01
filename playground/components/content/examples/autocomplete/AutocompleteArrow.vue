<script setup lang="ts">
const value = ref('apple')

const fruitItems = [
  { label: 'Apple', value: 'apple' },
  { label: 'Banana', value: 'banana' },
]
</script>

<template>
  <SAutocomplete v-model="value" arrow placeholder="Type anything" :items="fruitItems" />
</template>
