<script setup lang="ts">
const items = [
  { title: 'One' },
  { title: 'Two' },
  { title: 'Three' },
  { title: 'Four' },
]
</script>

<template>
  <SStepper :items="items" :linear="false" />
</template>
