<script setup lang="ts">
const selected = ref(1)
const items = [
  { id: 1, name: 'Product design', description: 'Interfaces and user experience', icon: 'hugeicons:paint-brush-01' },
  { id: 2, name: 'Engineering', description: 'Application development', icon: 'hugeicons:code' },
  { id: 3, name: 'Support', description: 'Customer care', icon: 'hugeicons:customer-support' },
]
</script>

<template>
  <SListbox v-model="selected" :items="items" value-key="id" label-key="name" label="Teams" class="w-full max-w-sm" />
</template>
