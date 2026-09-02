<script setup lang="ts">
const items = [
  { title: 'Draft', icon: 'hugeicons:pencil' },
  { title: 'Review', icon: 'hugeicons:search-01' },
  { title: 'Published', icon: 'hugeicons:checkmark-circle-01' },
]
</script>

<template>
  <SStepper :items="items" :default-value="2">
    <template #indicator="{ item }">
      <SIcon :name="item.icon" class="size-4" />
    </template>
    <template #title="{ item, state }">
      {{ item.title }}
      <span v-if="state === 'active'" class="text-[var(--ui-primary)]">· current</span>
    </template>
  </SStepper>
</template>
