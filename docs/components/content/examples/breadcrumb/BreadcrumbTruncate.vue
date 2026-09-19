<script setup lang="ts">
const items = [
  { label: 'Home', to: '/' },
  { label: 'Products', to: '/products' },
  { label: 'The Ultimate Ergonomic Wireless Mechanical Keyboard, Limited Edition' },
]
</script>

<template>
  <div class="max-w-sm">
    <SBreadcrumb :items="items" truncate />
  </div>
</template>
