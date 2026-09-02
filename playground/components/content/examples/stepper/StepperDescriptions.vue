<script setup lang="ts">
const items = [
  { title: 'Address', description: 'Where to ship' },
  { title: 'Delivery', description: 'Pick a speed' },
  { title: 'Review', description: 'Confirm order' },
]
</script>

<template>
  <SStepper :items="items" :default-value="2" />
</template>
