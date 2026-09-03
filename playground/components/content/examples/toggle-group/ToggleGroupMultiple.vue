<script setup lang="ts">
const items = [
  { label: 'Bold', value: 'bold', icon: 'hugeicons:text-bold' },
  { label: 'Italic', value: 'italic', icon: 'hugeicons:text-italic' },
  { label: 'Underline', value: 'underline', icon: 'hugeicons:text-underline' },
]
</script>

<template>
  <SToggleGroup type="multiple" :items="items" :default-value="['bold']" />
</template>
