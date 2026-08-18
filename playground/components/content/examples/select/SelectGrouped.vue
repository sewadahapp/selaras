<script setup lang="ts">
const value = ref('')

const items = [
  { label: 'Fruits', items: [{ label: 'Apple', value: 'apple' }, { label: 'Banana', value: 'banana' }] },
  { label: 'Vegetables', items: [{ label: 'Carrot', value: 'carrot' }, { label: 'Potato', value: 'potato' }] },
]
</script>

<template>
  <SSelect v-model="value" placeholder="Pick one" :items="items" />
</template>
