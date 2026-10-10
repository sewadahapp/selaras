<script setup lang="ts">
const selected = ref<number[]>([])
const items = Array.from({ length: 5000 }, (_, index) => ({ label: `Item ${index + 1}`, value: index + 1 }))
</script>

<template>
  <SListbox v-model="selected" :items="items" label="Large collection" multiple searchable virtualize class="w-full max-w-sm" />
</template>
