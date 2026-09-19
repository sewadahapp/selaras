<script setup lang="ts">
const tags = ref<string[]>(['apple'])

const fruitItems = [
  { label: 'Apple', value: 'apple' },
  { label: 'Banana', value: 'banana' },
]
</script>

<template>
  <SAutocomplete v-model="tags" multiple display-mode="chip" :items="fruitItems" />
</template>
