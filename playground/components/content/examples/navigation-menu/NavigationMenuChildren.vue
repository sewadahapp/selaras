<script setup lang="ts">
const items = [
  { label: 'Home', to: '/' },
  { label: 'Products', children: [
    { label: 'Analytics', to: '/products/analytics' },
    { label: 'Automation', to: '/products/automation' },
    { label: 'Integrations', to: '/products/integrations' },
  ] },
  { label: 'Company', children: [
    { label: 'About', to: '/company/about' },
    { label: 'Careers', to: '/company/careers' },
  ] },
]
</script>

<template>
  <SNavigationMenu :items="items" />
</template>
