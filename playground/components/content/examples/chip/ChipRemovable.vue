<script setup lang="ts">
const fruits = ref(['Apple', 'Banana', 'Cherry'])

function remove(fruit: string) {
  fruits.value = fruits.value.filter(f => f !== fruit)
}
</script>

<template>
  <div class="flex flex-wrap items-center gap-2">
    <SChip
      v-for="fruit in fruits"
      :key="fruit"
      :label="fruit"
      color="primary"
      removable
      @remove="remove(fruit)"
    />
    <span v-if="!fruits.length" class="text-sm text-[var(--ui-text-muted)]">All cleared</span>
  </div>
</template>
