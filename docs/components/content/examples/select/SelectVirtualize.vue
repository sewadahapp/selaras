<script setup lang="ts">
const value = ref('')

const manyItems = Array.from({ length: 5000 }, (_, i) => ({ label: `Item ${i + 1}`, value: `item-${i + 1}` }))
</script>

<template>
  <SSelect v-model="value" searchable virtualize placeholder="Pick an item" :items="manyItems" />
</template>
