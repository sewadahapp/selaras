<script setup lang="ts">
const fruits = ref(['apple'])

const fruitItems = [
  { label: 'Apple', value: 'apple' },
  { label: 'Banana', value: 'banana' },
  { label: 'Cherry', value: 'cherry' },
]
</script>

<template>
  <SSelect v-model="fruits" multiple :items="fruitItems" placeholder="Pick fruits">
    <template #item="{ item }">
      <SCheckbox :model-value="fruits.includes(item.value)" class="pointer-events-none" tabindex="-1" />
      {{ item.label }}
    </template>
  </SSelect>
</template>
