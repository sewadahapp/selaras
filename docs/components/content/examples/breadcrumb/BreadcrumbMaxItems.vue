<script setup lang="ts">
const items = [
  { label: 'Home', to: '/', icon: 'hugeicons:home-01' },
  { label: 'Electronics', to: '/electronics' },
  { label: 'Computers', to: '/electronics/computers' },
  { label: 'Laptops', to: '/electronics/computers/laptops' },
  { label: 'Gaming laptops', to: '/electronics/computers/laptops/gaming' },
  { label: 'Product' },
]
</script>

<template>
  <SBreadcrumb :items="items" :max-items="4" />
</template>
