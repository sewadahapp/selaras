<script setup lang="ts">
const active = ref('tab-1')
const items = Array.from({ length: 12 }, (_, index) => ({
  label: `Tab ${index + 1}`,
  value: `tab-${index + 1}`,
}))
</script>

<template>
  <STabs v-model="active" :items="items" scrollable class="w-full max-w-xl">
    <template v-for="item in items" :key="item.value" #[item.value]>
      Showing {{ item.label }}.
    </template>
  </STabs>
</template>
